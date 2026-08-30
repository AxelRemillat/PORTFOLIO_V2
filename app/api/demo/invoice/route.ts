import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/demo-rate-limit";

export const runtime = "nodejs";

// Extraction de facture : reçoit une IMAGE ou un PDF (multipart) du navigateur, le
// convertit en data URI base64 et forward à n8n (Vision) en JSON. Le webhook et le
// secret ne fuient jamais. Rien loggué/stocké.
const MAX_SIZE = 8 * 1024 * 1024; // 8 Mo
const TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const err = (status: number, error: string) => NextResponse.json({ ok: false, error }, { status });

export async function POST(req: NextRequest) {
  if (process.env.DEMO_INVOICE_ENABLED !== "true") return err(503, "demo_disabled");
  const webhook = process.env.N8N_INVOICE_WEBHOOK_URL;
  const secret = process.env.N8N_DEMO_SECRET ?? "";
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (!(req.headers.get("content-type") ?? "").includes("multipart/form-data")) return err(400, "invalid_input");
  let form: FormData;
  try { form = await req.formData(); } catch { return err(400, "invalid_input"); }

  const hp = form.get("hp");
  if (typeof hp === "string" && hp.trim() !== "") return err(400, "invalid_input");

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0 || !TYPES.includes(file.type)) return err(400, "invalid_input");
  if (file.size > MAX_SIZE) return err(400, "file_too_large");

  { const rl = await checkRateLimit(ip, "invoice"); if (!rl.ok) return err(429, rl.scope === "global" ? "demo_busy" : "rate_limited"); }
  if (!webhook) return err(502, "upstream_error");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45_000); // Vision plus lent
  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type};base64,${buf.toString("base64")}`;
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-demo-secret": secret },
      body: JSON.stringify({ file_data: dataUri }),
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
