// Événements et attribution de canal (Umami, sans cookie).
//
// Le site savait compter des pages vues, pas des intentions, et ne savait pas
// d'où venaient les gens. Ce module fait les deux : des noms d'événements
// stables (docs/tracking.md), et un canal retenu pour la session qu'on recolle
// à chaque action qui compte — c'est ce qui permet de lire « tel canal → tant
// de contacts », au lieu de « tant de visites ».
//
// Aucune donnée personnelle n'entre ici : jamais d'e-mail, de nom, de
// téléphone ni le texte d'un formulaire. Seules des étiquettes courtes.

import { arrivalDemo, rememberV, reportOrionVisit } from "./orion-visits";

type Umami = { track: (event: string, data?: Record<string, string | number>) => void };

/** Les événements du site. Minuscules, stables : on ne les renomme pas sans migrer Umami. */
export type EventName =
  | "arrivee"
  | "cta_rdv"
  | "contact_submit"
  | "contact_error"
  | "demo_start"
  | "demo_result"
  | "offre_click"
  | "sortie";

/**
 * Langue de la page, lue sur `<html lang>` (posé par le layout `[lang]`).
 * Tous les événements la portent : on compare ainsi visiteurs FR et EN sans
 * toucher un seul appel `track()` dans les composants.
 */
export function pageLang(): string {
  if (typeof document === "undefined") return "fr";
  return document.documentElement.lang === "en" ? "en" : "fr";
}

/**
 * FILE D'ATTENTE (Cowork #36). Le script d'Umami se charge APRÈS l'hydratation
 * (next/script, afterInteractive) : `arrivee`, envoyé au montage, partait
 * avant lui et se perdait en silence — aucun `arrivee` en prod depuis le 09/10.
 * Un événement émis trop tôt attend donc ici, et part dès que `window.umami`
 * existe (onLoad du script, ou au plus tard 10 s de vérification). Sans script
 * du tout (dev, bloqueur), la file est jetée : rien ne s'accumule.
 */
type Pending = [string, Record<string, string | number>];
const queue: Pending[] = [];
const QUEUE_MAX = 20;
const WAIT_STEP_MS = 200;
const WAIT_TRIES = 50;
let waiting = false;

const umamiOf = () => (window as unknown as { umami?: Umami }).umami;

function send(umami: Umami, event: string, data: Record<string, string | number>) {
  try {
    umami.track(event, data);
  } catch {
    /* les statistiques ne bloquent jamais une page */
  }
}

/** Rejoue les événements en attente. Appelé par le onLoad du script (components/Analytics.tsx). */
export function flushQueue() {
  if (typeof window === "undefined") return;
  const umami = umamiOf();
  if (!umami) return;
  for (const [event, data] of queue.splice(0)) send(umami, event, data);
}

function waitForUmami() {
  if (waiting) return;
  waiting = true;
  let tries = 0;
  const timer = setInterval(() => {
    tries += 1;
    if (umamiOf() || tries >= WAIT_TRIES) {
      clearInterval(timer);
      waiting = false;
      if (umamiOf()) flushQueue();
      else queue.length = 0;
    }
  }, WAIT_STEP_MS);
}

/** Événements en attente (tests). */
export const pendingEvents = (): readonly Pending[] => queue;

/** Envoi protégé : script pas encore chargé → mis en attente ; jamais d'erreur visible. */
export function track(event: EventName | string, data?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  const payload = { ...data, lang: pageLang() };
  const umami = umamiOf();
  if (umami) return send(umami, event, payload);
  if (queue.length < QUEUE_MAX) queue.push([event, payload]);
  waitForUmami();
}

/** Canaux reconnus. « autre » est le fourre-tout d'un ?ref= inconnu. */
export const CHANNELS = [
  "linkedin",
  "codeur",
  "malt",
  "upwork",
  "comeup",
  "signature",
  "cv",
  "orion",
  "autre",
] as const;
export type Channel = (typeof CHANNELS)[number] | "direct";

const KEY = "ax.canal";

/** sessionStorage peut jeter (navigation privée, stockage bloqué) : jamais sans filet. */
function readStore(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStore(key: string, value: string) {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    /* sans stockage, le canal vaut pour la page et c'est tout */
  }
}

/** Referrer réduit à un canal connu, ou `null` s'il n'est pas clair. */
function fromReferrer(referrer: string): Channel | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (host === window.location.hostname) return null;
    if (host.includes("linkedin")) return "linkedin";
    if (host.includes("codeur")) return "codeur";
    if (host.includes("malt")) return "malt";
    if (host.includes("upwork")) return "upwork";
    if (host.includes("comeup")) return "comeup";
    return "autre";
  } catch {
    return null;
  }
}

export interface Arrival {
  canal: Channel;
  demo?: string;
  v?: string;
}

/**
 * D'où vient cette visite, à partir de l'URL et du referrer.
 *
 * Ordre volontaire : `?ref=` d'abord, parce qu'il est posé à la main et fait
 * foi ; puis les marqueurs que les mails ORION mettent déjà dans leurs liens
 * (`?demo=`, `?v=`), qui valent « orion » sans rien changer aux liens
 * existants ; puis le referrer ; sinon « direct ».
 */
export function resolveArrival(search: string, referrer: string): Arrival {
  const params = new URLSearchParams(search);
  const demo = params.get("demo") ?? undefined;
  const v = params.get("v") ?? undefined;
  const ref = params.get("ref")?.trim().toLowerCase();

  if (ref) {
    const known = (CHANNELS as readonly string[]).includes(ref);
    return { canal: (known ? ref : "autre") as Channel, demo, v };
  }
  // Un lien de mail ORION porte toujours `v=` ; `demo=` seul se trouve aussi
  // dans la navigation interne du site, donc il ne suffit pas à lui seul.
  if (v) return { canal: "orion", demo, v };
  return { canal: fromReferrer(referrer) ?? "direct", demo, v };
}

/** Le canal de la session, déjà retenu ou résolu maintenant. */
export function sessionChannel(): Channel {
  if (typeof window === "undefined") return "direct";
  const kept = readStore(KEY);
  if (kept) return kept as Channel;
  const arrival = resolveArrival(window.location.search, document.referrer);
  writeStore(KEY, arrival.canal);
  return arrival.canal;
}

/** `track`, avec le canal de la session recollé — pour les actions qui comptent. */
export function trackWithChannel(event: EventName, data: Record<string, string | number> = {}) {
  track(event, { ...data, canal: sessionChannel() });
  // Session venue d'un mail ORION : compteur agrégé côté ORION (lib/orion-visits.ts).
  if (event === "demo_start" || event === "demo_result") reportOrionVisit(event, data.demo ? String(data.demo) : null);
}

/** `arrivee` une seule fois par session. Rend `true` si l'événement est parti. */
export function trackArrival(): boolean {
  if (typeof window === "undefined") return false;
  if (readStore(KEY)) return false;
  const arrival = resolveArrival(window.location.search, document.referrer);
  writeStore(KEY, arrival.canal);
  const data: Record<string, string> = { canal: arrival.canal };
  if (arrival.demo) data.demo = arrival.demo;
  if (arrival.v) data.v = arrival.v;
  track("arrivee", data);
  if (arrival.canal === "orion") {
    rememberV(arrival.v);
    reportOrionVisit("arrivee", arrivalDemo(window.location.pathname, arrival.demo));
  }
  return true;
}

/**
 * Exclusion d'un navigateur (Axel, sa famille) : `umami.disabled` est la clé
 * que le script d'Umami lit lui-même. Rend l'état demandé, ou `null` si l'URL
 * ne demandait rien.
 */
export function readOptOut(search: string): boolean | null {
  const moi = new URLSearchParams(search).get("moi");
  if (moi === "1") return true;
  if (moi === "0") return false;
  return null;
}

export function applyOptOut(disabled: boolean) {
  try {
    if (disabled) window.localStorage.setItem("umami.disabled", "1");
    else window.localStorage.removeItem("umami.disabled");
  } catch {
    /* sans stockage, on ne peut rien exclure : tant pis, on ne casse rien */
  }
}
