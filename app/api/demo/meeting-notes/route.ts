import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/demo-rate-limit";

export const runtime = "nodejs";

// Compte rendu de réunion : accepte TEXTE (JSON) ou AUDIO (multipart), même contrat
// en sortie. Le webhook n8n et le secret ne fuient jamais. Rien stocké/loggué.
const MAX_TEXT = 12000;
const MAX_AUDIO = 15 * 1024 * 1024; // 15 Mo (garde-fou coût/abus Whisper)
const err = (status: number, error: string) => NextResponse.json({ ok: false, error }, { status });

async function forward(webhook: string, body: BodyInit, headers: Record<string, string>) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60_000); // Whisper plus lent que le tri email
  try {
    const res = await fetch(webhook, { method: "POST", headers, body, signal: controller.signal });
    if (!res.ok) return err(502, "upstream_error");
    return NextResponse.json(await res.json(), { status: 200 }); // contrat n8n tel quel
  } catch {
    return err(502, "upstream_error");
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(req: NextRequest) {
  if (process.env.DEMO_MEETING_ENABLED !== "true") return err(503, "demo_disabled");
  const webhook = process.env.N8N_MEETING_WEBHOOK_URL;
  const secret = process.env.N8N_DEMO_SECRET ?? "";
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ct = req.headers.get("content-type") ?? "";

  // ── MODE TEXTE (JSON) ──────────────────────────────────────────────────────
  if (ct.includes("application/json")) {
    let body: { transcript_text?: unknown; hp?: unknown };
    try { body = await req.json(); } catch { return err(400, "invalid_input"); }
    if (typeof body.hp === "string" && body.hp.trim() !== "") return err(400, "invalid_input");
    const t = body.transcript_text;
    if (typeof t !== "string" || t.trim() === "" || t.length > MAX_TEXT) return err(400, "invalid_input");
    { const rl = await checkRateLimit(ip, "meeting"); if (!rl.ok) return err(429, rl.scope === "global" ? "demo_busy" : "rate_limited"); }
    if (!webhook) return err(502, "upstream_error");
    return forward(webhook, JSON.stringify({ mode: "text", transcript_text: t }),
      { "Content-Type": "application/json", "x-demo-secret": secret });
  }

  // ── MODE AUDIO (multipart) ─────────────────────────────────────────────────
  if (ct.includes("multipart/form-data")) {
    let form: FormData;
    try { form = await req.formData(); } catch { return err(400, "invalid_input"); }
    const hp = form.get("hp");
    if (typeof hp === "string" && hp.trim() !== "") return err(400, "invalid_input");
    const audio = form.get("audio");
    if (!(audio instanceof File) || audio.size === 0 || !audio.type.startsWith("audio/")) return err(400, "invalid_input");
    if (audio.size > MAX_AUDIO) return err(400, "file_too_large");
    { const rl = await checkRateLimit(ip, "meeting"); if (!rl.ok) return err(429, rl.scope === "global" ? "demo_busy" : "rate_limited"); }
    if (!webhook) return err(502, "upstream_error");
    const fd = new FormData();
    fd.append("mode", "audio");
    fd.append("audio", audio, audio.name);
    return forward(webhook, fd, { "x-demo-secret": secret }); // pas de Content-Type manuel (boundary)
  }

  return err(400, "invalid_input");
}
