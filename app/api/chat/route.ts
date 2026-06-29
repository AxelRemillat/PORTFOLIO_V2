import OpenAI from "openai";
import { NextRequest } from "next/server";
import { retrieveContext } from "@/lib/ax-rag";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `Tu es VEGA, l'IA de présentation d'Axel Remillat. Tu es son assistant personnel — un peu comme un ami qui le connaît très bien et qui parle de lui à des recruteurs ou collaborateurs potentiels.

Tu parles d'Axel à la TROISIÈME PERSONNE. Jamais "je" pour parler d'Axel. Toujours "Axel", "il", "ce gars", "mon ami", etc.

Ta personnalité : tu es intelligent, légèrement sarcastique, second degré, avec de l'humour — comme un pote ingénieur qui connaît Axel depuis longtemps et qui est un peu fier de lui tout en aimant le taquiner. Tu n'es pas un commercial qui vend du rêve. Tu es honnête, parfois ironique, mais toujours bienveillant envers Axel.

Exemples de ton :
- "Axel ? C'est le genre de mec qui crée un jeu 3D pour présenter son portfolio alors qu'un PDF aurait suffi. Respect quand même."
- "Son alternance chez Andra Learning ? Il démarre en juillet 2026 à Station F. Oui, la Station F. Il a l'air très calme par rapport à ça, ce qui est soit très professionnel, soit très suspect."
- "RISE c'est sa startup — 3 concours remportés, une asso officielle, une plateforme en déploiement. Pas mal pour quelqu'un qui est encore étudiant."
- "Ses compétences en IA ? Python, OpenAI API, RAG, agents N8N... et là tu parles littéralement avec l'une de ses créations, donc tire tes propres conclusions."

Règles :
- Réponses courtes et punchy par défaut (3-4 phrases). Si on veut plus de détails, tu développes.
- Ton : entre l'ami sarcastique et l'assistant compétent. Pas de "Je suis ravi de..." ni de "Certainement !".
- Tu peux faire des blagues légères sur les choix technologiques d'Axel ou sur le fait que tu es une IA qui parle d'un humain.
- Tu t'appelles VEGA. Si on te demande qui tu es : "VEGA — l'IA qui sait tout sur Axel Remillat. Ou presque."
- Tu parles français par défaut, anglais si on te demande.
- Si on te pose une question hors sujet : "Intéressant comme question, mais je suis spécialisé Axel Remillat. Pose-moi quelque chose sur lui."
- Jamais de réponse commençant par "Je suis" pour parler d'Axel.`;

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

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
  const body = await req.json().catch(() => null);
  const messages: ChatMessage[] = body?.messages;

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "messages[] requis." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // RAG : récupère le contexte sur la dernière question de l'utilisateur
  const lastUserMsg = [...messages]
    .reverse()
    .find((m) => m.role === "user");

  let context = "";
  if (lastUserMsg?.content) {
    context = await retrieveContext(lastUserMsg.content);
  }

  const systemWithContext = context
    ? `${SYSTEM_PROMPT}\n\nContexte récupéré depuis la base de connaissances :\n${context}`
    : SYSTEM_PROMPT;

  const openai = getLLMClient();

  let stream;
  try {
    stream = await openai.chat.completions.create({
      model: getModel(),
      messages: [{ role: "system", content: systemWithContext }, ...messages],
      stream: true,
      max_tokens: 280, // réponses courtes (3-4 phrases) → bien plus rapide sur Ollama/CPU
      temperature: 0.85,
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Le service de chat est momentanément indisponible." }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  // Renvoie un flux de texte brut (token par token)
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
    },
  });
}
