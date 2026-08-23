import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/demo-rate-limit";

export const runtime = "nodejs";

// Seul point exposé au navigateur : le webhook n8n et le secret ne fuient JAMAIS
// côté client. On ne stocke rien et on ne loggue jamais email_text.
const MAX_LEN = 4000;
const err = (status: number, error: string) =>
  NextResponse.json({ ok: false, error }, { status });

export async function POST(req: NextRequest) {
  // a. kill-switch
  if (process.env.DEMO_EMAIL_TRIAGE_ENABLED !== "true") return err(503, "demo_disabled");

  // b. parse + honeypot (hp rempli = bot → on n'appelle pas n8n)
  let body: { email_text?: unknown; hp?: unknown };
  try {
    body = await req.json();
  } catch {
    return err(400, "invalid_input");
  }
  if (typeof body.hp === "string" && body.hp.trim() !== "") return err(400, "invalid_input");

  // c. validation de l'entrée
  const email_text = body.email_text;
  if (typeof email_text !== "string" || email_text.trim() === "" || email_text.length > MAX_LEN) {
    return err(400, "invalid_input");
  }

  // d. rate-limit par IP + plafond global
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!(await checkRateLimit(ip, "email"))) return err(429, "rate_limited");

  // e. appel n8n (timeout 20 s)
  const webhook = process.env.N8N_EMAIL_TRIAGE_WEBHOOK_URL;
  if (!webhook) return err(502, "upstream_error");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-demo-secret": process.env.N8N_DEMO_SECRET ?? "" },
      body: JSON.stringify({ email_text }),
      signal: controller.signal,
    });
    if (!res.ok) return err(502, "upstream_error");
    // f. renvoie le contrat n8n tel quel
    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return err(502, "upstream_error");
  } finally {
    clearTimeout(timer);
  }
}
