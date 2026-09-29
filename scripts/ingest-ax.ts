/**
 * Ingestion de la base de connaissances A.X (profil personnel d'Axel).
 * Lit content/ax-knowledge/*.md → chunks → embeddings → table `ax_documents`.
 * Séparé du script RISE/portfolio (ancien script portfolio, retiré).
 *
 * Prérequis : .env.local avec SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY
 * Table à créer au préalable : scripts/setup-ax-table.sql (SQL Editor Supabase)
 * Usage : npm run ingest-ax
 */

import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

// Charger les variables d'env depuis .env.local (tsx tourne hors de Next)
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
  }
}

// ⚠️ Variables réelles du projet (pas NEXT_PUBLIC_* / SUPABASE_SERVICE_KEY)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Découpe sur les titres (##) puis sur les doubles sauts de ligne, en
// regroupant jusqu'à ~800 caractères pour garder des chunks cohérents.
function chunkText(text: string): string[] {
  const sections = text.split(/\n##\s+/);
  const chunks: string[] = [];
  for (const section of sections) {
    const paragraphs = section.split(/\n\n+/);
    let current = "";
    for (const p of paragraphs) {
      if ((current + p).length > 800) {
        if (current.trim()) chunks.push(current.trim());
        current = p;
      } else {
        current += "\n\n" + p;
      }
    }
    if (current.trim()) chunks.push(current.trim());
  }
  return chunks.filter((c) => c.length > 50);
}

async function ingest() {
  // Vider la table avant réingestion
  const { error: delErr } = await supabase.from("ax_documents").delete().neq("id", 0);
  if (delErr) throw new Error(`Erreur suppression : ${delErr.message}`);

  const dir = path.join(process.cwd(), "content/ax-knowledge");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  let total = 0;
  for (const file of files) {
    const text = fs.readFileSync(path.join(dir, file), "utf-8");
    const chunks = chunkText(text);
    console.log(`${file}: ${chunks.length} chunks`);

    for (const chunk of chunks) {
      const embRes = await openai.embeddings.create({
        model: "text-embedding-3-large",
        input: chunk,
        dimensions: 1536, // doit matcher la table ax_documents (vector(1536))
      });

      const { error } = await supabase.from("ax_documents").insert({
        content: chunk,
        embedding: embRes.data[0].embedding,
        source: file.replace(".md", ""),
      });
      if (error) throw new Error(`Erreur insertion (${file}) : ${error.message}`);
      total += 1;
    }
  }

  console.log(`\nIngestion terminée ✓ — ${total} chunks dans ax_documents.`);
}

ingest().catch((err) => {
  console.error(err);
  process.exit(1);
});
