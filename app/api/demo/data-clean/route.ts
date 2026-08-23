import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/demo-rate-limit";

export const runtime = "nodejs";

// Nettoyage de CSV : reçoit un fichier (multipart), forward à n8n, renvoie le
// rapport tel quel. Le webhook et le secret ne fuient jamais. Rien stocké/loggué.
const MAX_SIZE = 2 * 1024 * 1024; // 2 Mo
const err = (status: number, error: string) => NextResponse.json({ ok: false, error }, { status });

export async function POST(req: NextRequest) {
  if (process.env.DEMO_DATACLEAN_ENABLED !== "true") return err(503, "demo_disabled");
  const webhook = process.env.N8N_DATACLEAN_WEBHOOK_URL;
  const secret = process.env.N8N_DEMO_SECRET ?? "";
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (!(req.headers.get("content-type") ?? "").includes("multipart/form-data")) return err(400, "invalid_input");
  let form: FormData;
  try { form = await req.formData(); } catch { return err(400, "invalid_input"); }

  const hp = form.get("hp");
  if (typeof hp === "string" && hp.trim() !== "") return err(400, "invalid_input");

  const file = form.get("file");
  const isCsv = file instanceof File && file.size > 0 &&
    (file.name.toLowerCase().endsWith(".csv") || file.type === "text/csv" || file.type === "application/vnd.ms-excel");
  if (!isCsv) return err(400, "invalid_input");
  if (file.size > MAX_SIZE) return err(400, "file_too_large");

  if (!(await checkRateLimit(ip, "dataclean"))) return err(429, "rate_limited");
  if (!webhook) return err(502, "upstream_error");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);
  try {
    // n8n attend désormais le CONTENU texte du CSV en JSON (plus de multipart binaire).
    const text = await file.text();
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-demo-secret": secret },
      body: JSON.stringify({ csv_text: text }),
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
