import OpenAI from "openai";
import { NextRequest } from "next/server";
import { retrieveContext } from "@/lib/ax-rag";
import { checkRateLimit } from "@/lib/demo-rate-limit";
import { handleChat, type LlmMessage } from "@/lib/vega-chat";

export const runtime = "nodejs";

// Client LLM. Par défaut OpenAI. Pour basculer sur Ollama (API compatible
// OpenAI) plus tard : définir LLM_PROVIDER=ollama dans .env.local — il suffit
// de changer la baseURL, le reste du code ne bouge pas.
//   ex : new OpenAI({ baseURL: 'http://localhost:11434/v1', apiKey: 'ollama' })
function getLLMClient() {
  if (process.env.LLM_PROVIDER === "ollama") {
    return new OpenAI({
      baseURL: `${process.env.OLLAMA_BASE_URL || "http://localhost:11434"}/v1`,
      apiKey: "ollama",
    });
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function getModel() {
  if (process.env.LLM_PROVIDER === "ollama") {
    return process.env.OLLAMA_MODEL || "llama3.1";
  }
  return process.env.OPENAI_MODEL || "gpt-4o-mini";
}

async function complete(messages: LlmMessage[]): Promise<AsyncIterable<string>> {
  const stream = await getLLMClient().chat.completions.create({
    model: getModel(),
    messages,
    stream: true,
    max_tokens: 400, // 2 à 4 phrases, bornées (coût par appel)
    temperature: 0.4, // factuel : on ne veut pas de variations inventives sur les prix ou les délais
  });
  return (async function* () {
    for await (const chunk of stream) yield chunk.choices[0]?.delta?.content || "";
  })();
}

// Logique (validation, langue, RAG, flux) : lib/vega-chat.ts.
export async function POST(req: NextRequest) {
  return handleChat(req, {
    disabled: process.env.DEMO_VEGA_ENABLED === "false",
    retrieve: retrieveContext,
    rateLimit: (ip) => checkRateLimit(ip, "vega"),
    complete,
  });
}
