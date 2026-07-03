/**
 * Pré-génère en MP3 les répliques d'inactivité de VEGA (BANTER_LINES) via
 * ElevenLabs → public/banter/*.mp3 + components/demos/banterAudio.ts (map
 * texte → fichier). Le front joue ces fichiers en local : ZÉRO crédit consommé
 * sur le banter, l'API ne sert plus que pour les vraies réponses.
 *
 * Usage : npm run banter-audio   (≈ 700 crédits en flash_v2_5, une seule fois —
 * à relancer uniquement si BANTER_LINES ou la voix changent)
 */

import fs from "fs";
import path from "path";
import { BANTER_LINES } from "../components/demos/useIdleBanter";

// Charger .env.local (tsx tourne hors de Next)
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
  }
}

const EL_KEY   = process.env.ELEVENLABS_API_KEY;
const EL_VOICE = process.env.ELEVENLABS_VOICE_ID;
const EL_MODEL = process.env.ELEVENLABS_MODEL_ID || "eleven_flash_v2_5";

if (!EL_KEY || !EL_VOICE) {
  console.error("ELEVENLABS_API_KEY / ELEVENLABS_VOICE_ID manquants dans .env.local");
  process.exit(1);
}

// Même nettoyage que ttsEnqueue (useAXChat) → les clés de la map matchent.
const cleanText = (t: string) => t.replace(/\*\*/g, "").replace(/\*/g, "").trim();

async function tts(text: string): Promise<Buffer> {
  const r = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${EL_VOICE}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": EL_KEY!, "Content-Type": "application/json", Accept: "audio/mpeg" },
      body: JSON.stringify({
        text,
        model_id: EL_MODEL,
        // Mêmes réglages que app/api/tts/route.ts → voix identique aux réponses live
        voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.25, use_speaker_boost: true },
      }),
    }
  );
  if (!r.ok) throw new Error(`ElevenLabs ${r.status} : ${await r.text()}`);
  return Buffer.from(await r.arrayBuffer());
}

async function main() {
  const outDir = path.join(process.cwd(), "public/banter");
  fs.mkdirSync(outDir, { recursive: true });

  const map: Record<string, string> = {};
  for (let i = 0; i < BANTER_LINES.length; i++) {
    const line = cleanText(BANTER_LINES[i]);
    const file = `banter-${String(i + 1).padStart(2, "0")}.mp3`;
    process.stdout.write(`[${i + 1}/${BANTER_LINES.length}] ${file} … `);
    fs.writeFileSync(path.join(outDir, file), await tts(line));
    map[line] = `/banter/${file}`;
    console.log("ok");
  }

  // Map générée, importée par useAXChat pour court-circuiter /api/tts.
  const mapFile = path.join(process.cwd(), "components/demos/banterAudio.ts");
  fs.writeFileSync(
    mapFile,
    `// ⚠️ GÉNÉRÉ par scripts/generate-banter-audio.ts — ne pas éditer à la main.\n` +
      `// Relancer \`npm run banter-audio\` si BANTER_LINES ou la voix changent.\n` +
      `export const BANTER_AUDIO: Record<string, string> = ${JSON.stringify(map, null, 2)};\n`
  );
  console.log(`\nTerminé ✓ — ${BANTER_LINES.length} MP3 dans public/banter/ + banterAudio.ts régénéré.`);
}

main().catch((err) => { console.error(err); process.exit(1); });
