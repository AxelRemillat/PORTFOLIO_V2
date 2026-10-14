import { NextRequest, NextResponse } from "next/server";
import { parseOrionVisit } from "@/lib/orion-visits";

// Relais des visites de démo venues des mails ORION (Cowork #34).
//
// Le navigateur envoie { demo, v, type } ; cette route le relaie à ORION côté
// serveur, avec le secret partagé DEMO_VISITS_SECRET (variable Vercel, même nom
// dans les deux projets). Rien n'est stocké ni journalisé ici : ni IP, ni
// user-agent, ni cookie. Secret absent, appel d'un autre site, corps invalide
// ou ORION injoignable : la route ne fait rien et répond 204 — jamais
// d'erreur visible.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ORION_URL = "https://orion.axelremillat.com/api/demo-visits";
const TIMEOUT_MS = 3000;
const done = () => new NextResponse(null, { status: 204 });

/** Seul le site lui-même appelle cette route (en-tête Origin du navigateur). */
function sameSite(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === request.nextUrl.host;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const secret = process.env.DEMO_VISITS_SECRET?.trim();
  if (!secret || !sameSite(request)) return done();
  const visit = parseOrionVisit(await request.json().catch(() => null));
  if (!visit) return done();
  try {
    await fetch(process.env.ORION_DEMO_VISITS_URL?.trim() || ORION_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "x-demo-visits-secret": secret },
      body: JSON.stringify(visit),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    /* ORION indisponible : la visite n'est pas comptée, la page n'en sait rien */
  }
  return done();
}
