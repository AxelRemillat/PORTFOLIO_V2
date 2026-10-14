// Visites de démo venues des mails ORION (Cowork #34) — mesure AGRÉGÉE.
//
// Quand la visite arrive par un lien de mail ORION (paramètre `v=`), le site
// prévient ORION de trois choses : l'arrivée, la démo lancée, la démo aboutie.
// Le navigateur appelle la route du site (/api/visite-demo), qui relaie côté
// serveur avec un secret partagé. Ce qui part : { demo, v, type }, rien d'autre
// — aucun identifiant, aucun cookie, aucun jeton par prospect. ORION n'en garde
// que des compteurs par jour.

export const VISIT_TYPES = ["arrivee", "demo_start", "demo_result"] as const;
export type VisitType = (typeof VISIT_TYPES)[number];

export interface OrionVisit {
  demo: string;
  v: string;
  type: VisitType;
}

/** Le marqueur `v=` de la session (posé à l'arrivée) : sans lui, rien ne part. */
export const V_KEY = "ax.v";

/** Démo d'une page d'arrivée : `?demo=` s'il est là, sinon `agent` sur /agent (FR comme /en/agent). */
export function arrivalDemo(pathname: string, demo: string | undefined): string | null {
  if (demo) return demo;
  return /^\/(en\/|fr\/)?agent\/?$/.test(pathname) ? "agent" : null;
}

/** Corps valide (même règle des deux côtés, ORION revalide), sinon `null`. Tout autre champ est jeté. */
export function parseOrionVisit(body: unknown): OrionVisit | null {
  const raw = (body ?? {}) as Record<string, unknown>;
  const demo = String(raw.demo ?? "").trim().toLowerCase();
  const v = String(raw.v ?? "").trim();
  const type = String(raw.type ?? "") as VisitType;
  if (!/^[a-z][a-z0-9-]{0,31}$/.test(demo) || !/^[0-9]{1,2}$/.test(v) || !VISIT_TYPES.includes(type)) return null;
  return { demo, v, type };
}

function sessionV(): string | null {
  try {
    return window.sessionStorage.getItem(V_KEY);
  } catch {
    return null;
  }
}

/** Retient le `v=` de l'arrivée pour la session (les démos lancées ensuite en héritent). */
export function rememberV(v: string | undefined) {
  if (!v || !/^[0-9]{1,2}$/.test(v)) return;
  try {
    window.sessionStorage.setItem(V_KEY, v);
  } catch {
    /* sans stockage, seule l'arrivée est comptée */
  }
}

/** Navigateur exclu des statistiques (?moi=1) : rien ne part non plus vers ORION. */
function optedOut(): boolean {
  try {
    return window.localStorage.getItem("umami.disabled") === "1";
  } catch {
    return false;
  }
}

/** Signale une visite à ORION, sans jamais gêner la page. Hors session ORION : ne fait rien. */
export function reportOrionVisit(type: VisitType, demo: string | null | undefined) {
  if (typeof window === "undefined" || !demo || optedOut()) return;
  const v = sessionV();
  const visit = v ? parseOrionVisit({ demo, v, type }) : null;
  if (!visit) return;
  try {
    void fetch("/api/visite-demo", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(visit), keepalive: true, credentials: "omit" }).catch(() => undefined);
  } catch {
    /* la mesure ne bloque jamais une page */
  }
}
