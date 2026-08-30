// Rate-limit des démos IA. Upstash Redis REST via fetch (aucun SDK) ; si les env
// Upstash sont absentes → fallback EN MÉMOIRE (best-effort, per-instance). Objectif :
// GÉNÉREUX pour un vrai visiteur, strict seulement contre le flood/abus scripté.
//
// 3 compteurs par requête (1 pipeline Upstash = 6 commandes) :
//   - par IP / minute  (anti-flood rapide)
//   - par IP / jour    (anti-volume extrême — se réinitialise après 24 h)
//   - GLOBAL / jour PAR ENDPOINT (kill-switch budget, même contre un abus distribué)

interface Limit { key: string; limit: number; window: number; scope: "ip" | "global" }
export type RateResult = { ok: true } | { ok: false; scope: "ip" | "global" };

// Seuils par préfixe (généreux). Un visiteur légitime passe largement ; seul un
// flood scripté ou un volume anormal est coupé.
const LIMITS: Record<string, { perMin: number; perDay: number; globalDay: number }> = {
  vega: { perMin: 30, perDay: 250, globalDay: 4000 },      // chat VEGA
  vegarag: { perMin: 30, perDay: 250, globalDay: 4000 },   // ancien RAG portfolio
  tts: { perMin: 20, perDay: 120, globalDay: 1500 },       // voix (ElevenLabs = rare)
  email: { perMin: 15, perDay: 80, globalDay: 2000 },
  meeting: { perMin: 15, perDay: 80, globalDay: 2000 },
  dataclean: { perMin: 15, perDay: 80, globalDay: 2000 },
  invoice: { perMin: 15, perDay: 80, globalDay: 2000 },
  sav: { perMin: 15, perDay: 80, globalDay: 2000 },
  agent: { perMin: 10, perDay: 40, globalDay: 1000 },      // consomme plus de tokens/run
};
const DEFAULT = { perMin: 15, perDay: 80, globalDay: 2000 };

function limitsFor(ip: string, prefix: string): Limit[] {
  const c = LIMITS[prefix] ?? DEFAULT;
  return [
    { key: `rl:${prefix}:min:${ip}`, limit: c.perMin, window: 60, scope: "ip" },
    { key: `rl:${prefix}:day:${ip}`, limit: c.perDay, window: 86400, scope: "ip" },
    { key: `rl:${prefix}:global`, limit: c.globalDay, window: 86400, scope: "global" },
  ];
}

// ── Fallback mémoire (fenêtre fixe, se réinitialise à l'expiration) ───────────
const mem = new Map<string, { count: number; resetAt: number }>();
function memHit(l: Limit, now: number): boolean {
  const e = mem.get(l.key);
  if (!e || now >= e.resetAt) { mem.set(l.key, { count: 1, resetAt: now + l.window * 1000 }); return true; }
  e.count += 1;
  return e.count <= l.limit;
}

// ── Upstash Redis REST : pipeline INCR + EXPIRE NX (1 seul aller-retour HTTP) ──
async function upstashHits(limits: Limit[], url: string, token: string): Promise<boolean[]> {
  const cmds = limits.flatMap((l) => [["INCR", l.key], ["EXPIRE", l.key, String(l.window), "NX"]]);
  const res = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmds),
  });
  if (!res.ok) throw new Error("upstash");
  const data = (await res.json()) as { result: number }[];
  return limits.map((l, i) => (data[i * 2]?.result ?? 0) <= l.limit); // INCR aux indices pairs
}

/** Autorise la requête sauf flood/volume. `prefix` isole les compteurs par démo.
 *  Retourne le scope dépassé ("ip" = ralentir, "global" = démo saturée) pour un
 *  message gracieux côté route. Ne bloque JAMAIS si le limiteur lui-même échoue. */
export async function checkRateLimit(ip: string, prefix: string): Promise<RateResult> {
  const limits = limitsFor(ip, prefix);
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  let results: boolean[] | null = null;
  if (url && token) {
    try { results = await upstashHits(limits, url, token); } catch { results = null; }
  }
  if (!results) { const now = Date.now(); results = limits.map((l) => memHit(l, now)); }

  const i = results.findIndex((r) => !r);
  return i === -1 ? { ok: true } : { ok: false, scope: limits[i].scope };
}
