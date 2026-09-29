import OpenAI from "openai";
import { NextRequest } from "next/server";
import { retrieveContext } from "@/lib/ax-rag";
import { checkRateLimit } from "@/lib/demo-rate-limit";
import { buildSystemPrompt } from "@/lib/vega-prompt";

export const runtime = "nodejs";

const MAX_MSGS = 24;      // garde-fou volume (le front en envoie ≤ 12)
const MAX_TOTAL = 8000;   // caractères cumulés max sur le contexte envoyé
const MAX_LAST = 2000;    // caractères max de la question courante
// Réponse JSON gracieuse (le front VEGA affiche `message` tel quel).
const jerr = (status: number, error: string, message: string) =>
  new Response(JSON.stringify({ error, message }), { status, headers: { "Content-Type": "application/json" } });

type ChatMessage = { role: "user" | "assistant"; content: string };

/**
 * Seuls les rôles user/assistant passent. Un message « system » envoyé par le
 * navigateur aurait la même autorité que le vrai prompt : c'était une porte
 * d'injection. Contenus non textuels écartés.
 */
function sanitize(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw)) return null;
  const kept = raw.filter(
    (m): m is ChatMessage =>
      !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim() !== "",
  );
  return kept.map((m) => ({ role: m.role, content: m.content }));
}

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

export async function POST(req: NextRequest) {
  // Kill-switch (opt-out : actif par défaut, coupé si DEMO_VEGA_ENABLED=false).
  if (process.env.DEMO_VEGA_ENABLED === "false") {
    return jerr(503, "demo_disabled", "VEGA fait une courte pause. Revenez un peu plus tard.");
  }
  const body = await req.json().catch(() => null);
  const messages = sanitize(body?.messages);

  if (!messages || messages.length === 0 || messages.length > MAX_MSGS || messages[messages.length - 1].role !== "user") {
    return jerr(400, "invalid_input", "Message invalide.");
  }
  const total = messages.reduce((n, m) => n + m.content.length, 0);
  const last = messages[messages.length - 1].content;
  if (total > MAX_TOTAL || last.length > MAX_LAST) {
    return jerr(400, "invalid_input", "Votre question est un peu longue : pouvez-vous la raccourcir ?");
  }

  // Rate-limit généreux par IP + cap global/jour (anti-flood/abus, pas les vrais users).
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = await checkRateLimit(ip, "vega");
  if (!rl.ok) {
    return rl.scope === "global"
      ? jerr(429, "demo_busy", "VEGA reçoit beaucoup de visiteurs aujourd'hui. Réessayez un peu plus tard.")
      : jerr(429, "rate_limited", "Vous allez un peu vite : laissez-moi une minute et reposez votre question.");
  }

  // RAG : pour les questions de suivi (« et pour la boulangerie ? »), la dernière
  // question seule rate la recherche. Requête = les 3 dernières questions de
  // l'utilisateur, sans appel LLM : l'embedding porte le contexte du fil.
  const retrievalQuery = messages.filter((m) => m.role === "user").map((m) => m.content).slice(-3).join("\n");
  const { context, sources } = await retrieveContext(retrievalQuery);

  const openai = getLLMClient();

  let stream;
  try {
    stream = await openai.chat.completions.create({
      model: getModel(),
      messages: [{ role: "system", content: buildSystemPrompt(context) }, ...messages],
      stream: true,
      max_tokens: 400, // 2 à 4 phrases, bornées (coût par appel)
      temperature: 0.4, // factuel : on ne veut pas de variations inventives sur les prix ou les délais
    });
  } catch {
    return jerr(502, "llm_unavailable", "Le service est momentanément indisponible. Réessayez dans un instant.");
  }

  // Flux de texte brut (token par token)
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || "";
          if (text) controller.enqueue(encoder.encode(text));
        }
      } catch {
        // coupure réseau en cours de stream : on ferme proprement
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      // Fiches utilisées pour la réponse (noms de fichiers, rien de sensible) : diagnostic et évaluation.
      "X-Vega-Sources": sources.join(","),
    },
  });
}
