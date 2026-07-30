// Rate-limit de la démo email-triage. Upstash Redis REST via fetch (aucun SDK) ;
// si les env Upstash sont absentes → fallback EN MÉMOIRE, best-effort et NON fiable
// en serverless (chaque instance a sa propre Map) → configurer Upstash en prod.

interface Limit {
  key: string;
  limit: number;
  window: number; // secondes
}

function limitsFor(ip: string): Limit[] {
  return [
    { key: `rl:et:min:${ip}`, limit: 5, window: 60 },
    { key: `rl:et:day:${ip}`, limit: 20, window: 86400 },
    { key: "rl:et:global:day", limit: 300, window: 86400 },
  ];
}

// ── Fallback mémoire (fenêtre fixe) ──────────────────────────────────────────
const mem = new Map<string, { count: number; resetAt: number }>();
function memHit(l: Limit, now: number): boolean {
  const e = mem.get(l.key);
  if (!e || now >= e.resetAt) {
    mem.set(l.key, { count: 1, resetAt: now + l.window * 1000 });
    return true;
  }
  e.count += 1;
  return e.count <= l.limit;
}

// ── Upstash Redis REST : pipeline INCR + EXPIRE NX (fenêtre fixe) ─────────────
async function upstashHits(limits: Limit[], url: string, token: string): Promise<boolean[]> {
  const cmds = limits.flatMap((l) => [
    ["INCR", l.key],
    ["EXPIRE", l.key, String(l.window), "NX"],
  ]);
  const res = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmds),
  });
  if (!res.ok) throw new Error("upstash");
  const data = (await res.json()) as { result: number }[];
  // les INCR sont aux indices pairs (0, 2, 4)
  return limits.map((l, i) => (data[i * 2]?.result ?? 0) <= l.limit);
}

/** true = requête autorisée ; false = au moins une limite dépassée. */
export async function checkRateLimit(ip: string): Promise<boolean> {
  const limits = limitsFor(ip);
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    try {
      return (await upstashHits(limits, url, token)).every(Boolean);
    } catch {
      // Upstash indisponible → on retombe sur le fallback mémoire ci-dessous
    }
  }
  const now = Date.now();
  return limits.map((l) => memHit(l, now)).every(Boolean);
}
