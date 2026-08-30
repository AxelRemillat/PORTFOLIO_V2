import OpenAI from "openai";
import { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/demo-rate-limit";

export const runtime = "nodejs";

const MAX_TTS_CHARS = 600; // borne le coût par requête (ElevenLabs = crédits)
// Cache mémoire des phrases identiques → ne repaie jamais 2× le même texte
// (best-effort, per-instance). Le banter ambiant est déjà servi en statique côté client.
const ttsCache = new Map<string, Buffer>();
const CACHE_MAX = 60;
function cacheSet(key: string, buf: Buffer) {
  if (ttsCache.size >= CACHE_MAX) { const first = ttsCache.keys().next().value; if (first) ttsCache.delete(first); }
  ttsCache.set(key, buf);
}
const jerr = (status: number, error: string) =>
  new Response(JSON.stringify({ error }), { status, headers: { "Content-Type": "application/json" } });

// ── Voix de VEGA — cascade de providers ──────────────────────────────────────
// 1) ElevenLabs (ultra réaliste) si ELEVENLABS_API_KEY est présent
// 2) OpenAI TTS sinon
// 3) sinon 503 → le front bascule sur la voix du navigateur
// Toutes renvoient de l'audio/mpeg, donc le front ne change pas.

// ElevenLabs
const EL_KEY    = process.env.ELEVENLABS_API_KEY;
// Voix féminine par défaut (premade "Charlotte" — chaleureuse, multilingue/FR OK).
// Remplace par l'ID d'une voix FR de ton choix : ELEVENLABS_VOICE_ID=...
const EL_VOICE  = process.env.ELEVENLABS_VOICE_ID || "XB0fDUnXU5powFXDhCwa";
// multilingual_v2 = meilleur réalisme FR. flash_v2_5 = plus rapide/moins cher.
const EL_MODEL  = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";

// OpenAI (repli)
const OAI_VOICE = process.env.OPENAI_TTS_VOICE || "coral";
const OAI_MODEL = process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts";
const OAI_INSTRUCTIONS =
  process.env.OPENAI_TTS_INSTRUCTIONS ||
  "Parle en français avec un accent parisien neutre et naturel (surtout PAS d'accent québécois ni anglophone). " +
    "Voix féminine douce, calme, chaleureuse et bienveillante. Débit lent et posé, ton amical et rassurant.";

function mp3(buf: Uint8Array) {
  return new Response(new Uint8Array(buf), {
    headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
  });
}

async function elevenLabs(text: string): Promise<Buffer> {
  const r = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${EL_VOICE}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": EL_KEY as string,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: EL_MODEL,
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.8,
          style: 0.25,
          use_speaker_boost: true,
        },
      }),
    }
  );
  if (!r.ok) throw new Error(`elevenlabs ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

async function openaiTTS(text: string): Promise<Buffer> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const speech = await openai.audio.speech.create({
    model: OAI_MODEL,
    voice: OAI_VOICE,
    input: text,
    instructions: OAI_INSTRUCTIONS,
  });
  return Buffer.from(await speech.arrayBuffer());
}

export async function POST(req: NextRequest) {
  // Kill-switch (opt-out). En cas de blocage, le front bascule sur la voix navigateur.
  if (process.env.DEMO_TTS_ENABLED === "false") return jerr(503, "demo_disabled");

  const body = await req.json().catch(() => null);
  const text: string | undefined = body?.text;
  if (!text || typeof text !== "string" || !text.trim()) return jerr(400, "invalid_input");
  const input = text.slice(0, MAX_TTS_CHARS);

  // Rate-limit généreux par IP + cap global/jour (ElevenLabs = ressource rare).
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = await checkRateLimit(ip, "tts");
  if (!rl.ok) return jerr(429, rl.scope === "global" ? "demo_busy" : "rate_limited");

  // Cache : phrase déjà synthétisée → on la ressert sans repayer l'API.
  const cached = ttsCache.get(input);
  if (cached) return mp3(cached);

  // 1) ElevenLabs (prioritaire) — repli sur OpenAI si erreur
  if (EL_KEY) {
    try { const buf = await elevenLabs(input); cacheSet(input, buf); return mp3(buf); } catch { /* → OpenAI */ }
  }
  // 2) OpenAI
  if (process.env.OPENAI_API_KEY) {
    try { const buf = await openaiTTS(input); cacheSet(input, buf); return mp3(buf); } catch { /* → 503 */ }
  }
  // 3) Aucun provider dispo → le front bascule sur la voix du navigateur
  return jerr(503, "tts_unavailable");
}
