import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { checkRateLimit } from "@/lib/demo-rate-limit";
import { getMetier } from "@/lib/metiers";
import { runAgent, type Llm } from "@/lib/agent/run";

export const runtime = "nodejs";

// Agent devis : la boucle vit dans lib/agent/run.ts (testée sans OpenAI) ; la
// route valide l'entrée, applique le rate-limit et fournit le client LLM.
const MAX_LEN = 1500;
const err = (status: number, error: string) => NextResponse.json({ ok: false, error }, { status });

export async function POST(req: NextRequest) {
  if (process.env.DEMO_AGENT_ENABLED !== "true") return err(503, "demo_disabled");
  if (!process.env.OPENAI_API_KEY) return err(502, "upstream_error");
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (!(req.headers.get("content-type") ?? "").includes("application/json")) return err(400, "invalid_input");
  let body: { demande?: unknown; metier?: unknown; hp?: unknown };
  try { body = await req.json(); } catch { return err(400, "invalid_input"); }
  if (typeof body.hp === "string" && body.hp.trim() !== "") return err(400, "invalid_input");
  const demande = body.demande;
  if (typeof demande !== "string" || demande.trim() === "" || demande.length > MAX_LEN) return err(400, "invalid_input");
  const metier = getMetier(body.metier ?? "menuiserie");
  if (!metier) return err(400, "invalid_input");
  { const rl = await checkRateLimit(ip, "agent"); if (!rl.ok) return err(429, rl.scope === "global" ? "demo_busy" : "rate_limited"); }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 40_000);
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const llm: Llm = async (messages, tools, force) => {
    const completion = await openai.chat.completions.create({
      model, temperature: 0.3, max_tokens: 900, messages,
      tools: tools as OpenAI.Chat.ChatCompletionTool[],
      tool_choice: force ? { type: "function", function: { name: force } } : "auto",
    }, { signal: controller.signal });
    return completion.choices[0]?.message;
  };

  try {
    const { trace, result } = await runAgent(metier, demande, llm);
    return NextResponse.json({ ok: true, metier: metier.id, trace, result });
  } catch {
    return err(502, "upstream_error");
  } finally {
    clearTimeout(timer);
  }
}
