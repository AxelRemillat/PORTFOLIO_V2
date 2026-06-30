import OpenAI from "openai";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

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
  const body = await req.json().catch(() => null);
  const text: string | undefined = body?.text;

  if (!text || typeof text !== "string" || !text.trim()) {
    return new Response(JSON.stringify({ error: "text requis" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const input = text.slice(0, 1000);

  // 1) ElevenLabs (prioritaire) — repli sur OpenAI si erreur
  if (EL_KEY) {
    try {
      return mp3(await elevenLabs(input));
    } catch {
      /* tombe sur OpenAI ci-dessous */
    }
  }

  // 2) OpenAI
  if (process.env.OPENAI_API_KEY) {
    try {
      return mp3(await openaiTTS(input));
    } catch {
      /* tombe sur 502 → front utilisera la voix navigateur */
    }
  }

  // 3) Aucun provider dispo / tous en échec → le front bascule sur le navigateur
  return new Response(JSON.stringify({ error: "tts indisponible" }), {
    status: 503,
    headers: { "Content-Type": "application/json" },
  });
}
