import type { Retrieved } from "@/lib/ax-rag";
import type { RateResult } from "@/lib/demo-rate-limit";
import { buildSystemPrompt, parseVegaLocale, type VegaLocale } from "@/lib/vega-prompt";

// Logique de /api/chat, séparée de la route pour être testée sans réseau :
// recherche, limite de débit et modèle sont injectés (app/api/chat/route.ts
// branche les vrais). La route accepte `locale: 'fr' | 'en'` (défaut 'fr').

const MAX_MSGS = 24; // garde-fou volume (le front en envoie ≤ 12)
const MAX_TOTAL = 8000; // caractères cumulés max sur le contexte envoyé
const MAX_LAST = 2000; // caractères max de la question courante

export type ChatMessage = { role: "user" | "assistant"; content: string };
export type LlmMessage = { role: "system" | "user" | "assistant"; content: string };

export interface ChatDeps {
  retrieve: (query: string) => Promise<Retrieved>;
  rateLimit: (ip: string) => Promise<RateResult>;
  /** Flux de texte du modèle ; une erreur levée ici = service indisponible. */
  complete: (messages: LlmMessage[]) => Promise<AsyncIterable<string>>;
  disabled?: boolean;
}

// Messages d'erreur affichés tels quels par le front VEGA, dans la langue de la page.
const ERRORS: Record<VegaLocale, Record<"disabled" | "invalid" | "long" | "busy" | "rate" | "llm", string>> = {
  fr: {
    disabled: "VEGA fait une courte pause. Revenez un peu plus tard.",
    invalid: "Message invalide.",
    long: "Votre question est un peu longue : pouvez-vous la raccourcir ?",
    busy: "VEGA reçoit beaucoup de visiteurs aujourd'hui. Réessayez un peu plus tard.",
    rate: "Vous allez un peu vite : laissez-moi une minute et reposez votre question.",
    llm: "Le service est momentanément indisponible. Réessayez dans un instant.",
  },
  en: {
    disabled: "VEGA is taking a short break. Please come back a little later.",
    invalid: "Invalid message.",
    long: "Your question is a bit long. Could you shorten it?",
    busy: "VEGA has a lot of visitors today. Please try again a little later.",
    rate: "You're going a bit fast. Give me a minute, then ask again.",
    llm: "The service is temporarily unavailable. Please try again in a moment.",
  },
};

const jerr = (status: number, error: string, message: string) =>
  new Response(JSON.stringify({ error, message }), { status, headers: { "Content-Type": "application/json" } });

/**
 * Seuls les rôles user/assistant passent. Un message « system » envoyé par le
 * navigateur aurait la même autorité que le vrai prompt : c'était une porte
 * d'injection. Contenus non textuels écartés.
 */
export function sanitize(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw)) return null;
  const kept = raw.filter(
    (m): m is ChatMessage =>
      !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim() !== "",
  );
  return kept.map((m) => ({ role: m.role, content: m.content }));
}

export async function handleChat(req: Request, deps: ChatDeps): Promise<Response> {
  const body = await req.json().catch(() => null);
  const locale = parseVegaLocale(body?.locale);
  const errors = ERRORS[locale];
  // Kill-switch (opt-out : actif par défaut, coupé si DEMO_VEGA_ENABLED=false).
  if (deps.disabled) return jerr(503, "demo_disabled", errors.disabled);
  const messages = sanitize(body?.messages);

  if (!messages || messages.length === 0 || messages.length > MAX_MSGS || messages[messages.length - 1].role !== "user") {
    return jerr(400, "invalid_input", errors.invalid);
  }
  const total = messages.reduce((n, m) => n + m.content.length, 0);
  const last = messages[messages.length - 1].content;
  if (total > MAX_TOTAL || last.length > MAX_LAST) return jerr(400, "invalid_input", errors.long);

  // Rate-limit généreux par IP + cap global/jour (anti-flood/abus, pas les vrais users).
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = await deps.rateLimit(ip);
  if (!rl.ok) return rl.scope === "global" ? jerr(429, "demo_busy", errors.busy) : jerr(429, "rate_limited", errors.rate);

  // RAG : pour les questions de suivi (« et pour la boulangerie ? »), la dernière
  // question seule rate la recherche. Requête = les 3 dernières questions de
  // l'utilisateur, sans appel LLM : l'embedding porte le contexte du fil. La base
  // reste en français : les embeddings sont multilingues, une question anglaise
  // retrouve les mêmes fiches (aucune réindexation).
  const retrievalQuery = messages.filter((m) => m.role === "user").map((m) => m.content).slice(-3).join("\n");
  const { context, sources } = await deps.retrieve(retrievalQuery);

  let stream: AsyncIterable<string>;
  try {
    stream = await deps.complete([{ role: "system", content: buildSystemPrompt(context, locale) }, ...messages]);
  } catch {
    return jerr(502, "llm_unavailable", errors.llm);
  }

  // Flux de texte brut (token par token)
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const text of stream) if (text) controller.enqueue(encoder.encode(text));
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
      "Content-Language": locale,
    },
  });
}
