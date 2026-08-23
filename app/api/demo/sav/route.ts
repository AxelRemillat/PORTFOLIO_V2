import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/demo-rate-limit";

export const runtime = "nodejs";

// Assistant SAV (RAG) : reçoit une question (JSON), la forward à n8n qui cherche
// dans la base FAQ et répond en citant ses sources (ou refuse si hors base). Le
// webhook et le secret ne fuient jamais. Rien loggué/stocké.
const MAX_LEN = 500;
const err = (status: number, error: string) => NextResponse.json({ ok: false, error }, { status });

export async function POST(req: NextRequest) {
  if (process.env.DEMO_SAV_ENABLED !== "true") return err(503, "demo_disabled");
  const webhook = process.env.N8N_SAV_WEBHOOK_URL;
  const secret = process.env.N8N_DEMO_SECRET ?? "";
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (!(req.headers.get("content-type") ?? "").includes("application/json")) return err(400, "invalid_input");
  let body: { question?: unknown; hp?: unknown };
  try { body = await req.json(); } catch { return err(400, "invalid_input"); }

  if (typeof body.hp === "string" && body.hp.trim() !== "") return err(400, "invalid_input");
  const q = body.question;
  if (typeof q !== "string" || q.trim() === "" || q.length > MAX_LEN) return err(400, "invalid_input");

  if (!(await checkRateLimit(ip, "sav"))) return err(429, "rate_limited");
  if (!webhook) return err(502, "upstream_error");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);
  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-demo-secret": secret },
      body: JSON.stringify({ question: q }),
      signal: controller.signal,
    });
    if (!res.ok) return err(502, "upstream_error");
    return NextResponse.json(await res.json(), { status: 200 }); // contrat n8n tel quel
  } catch {
    return err(502, "upstream_error");
  } finally {
    clearTimeout(timer);
  }
}
