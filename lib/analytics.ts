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

/** Envoi protégé : sans script (dev, bloqueur, opt-out), l'appel ne fait rien. */
export function track(event: EventName | string, data?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  try {
    (window as unknown as { umami?: Umami }).umami?.track(event, data);
  } catch {
    /* les statistiques ne bloquent jamais une page */
  }
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
