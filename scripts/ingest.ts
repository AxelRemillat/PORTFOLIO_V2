/**
 * Script d'ingestion RAG : lit les fichiers markdown de content/,
 * découpe en chunks, génère les embeddings et insère dans Supabase.
 *
 * Prérequis : fichier .env.local avec SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY
 * Usage : npm run ingest
 */

import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

// Charger les variables d'env depuis .env.local
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
  }
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CHUNK_SIZE = 500;    // caractères par chunk
const CHUNK_OVERLAP = 100; // chevauchement pour ne pas couper le contexte

function chunkText(text: string, source: string): Array<{ content: string; source: string }> {
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 20);
  const chunks: Array<{ content: string; source: string }> = [];
  let current = "";

  for (const para of paragraphs) {
    if ((current + "\n\n" + para).length > CHUNK_SIZE && current.length > 0) {
      chunks.push({ content: current.trim(), source });
      // Conserver le chevauchement : prendre la fin du chunk précédent
      current = current.slice(-CHUNK_OVERLAP) + "\n\n" + para;
    } else {
      current = current ? current + "\n\n" + para : para;
    }
  }
  if (current.trim()) chunks.push({ content: current.trim(), source });

  return chunks;
}

function collectMarkdownFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    // La base de connaissances A.X a son propre script (ingest-ax → ax_documents).
    // On l'exclut ici pour ne pas polluer le RAG portfolio (portfolio_chunks).
    if (entry.name === "ax-knowledge") continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...collectMarkdownFiles(fullPath));
    else if (entry.name.endsWith(".md")) files.push(fullPath);
  }
  return files;
}

async function embedChunks(chunks: string[]): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: chunks,
    dimensions: 1536,
  });
  return response.data.map((d) => d.embedding);
}

async function main() {
  const contentDir = path.join(process.cwd(), "content");
  const files = collectMarkdownFiles(contentDir);
  console.log(`Fichiers trouvés : ${files.length}`);

  // Vider la table avant réingestion
  const { error: deleteError } = await supabase.from("portfolio_chunks").delete().neq("id", 0);
  if (deleteError) throw new Error(`Erreur suppression : ${deleteError.message}`);
  console.log("Table vidée.");

  let totalChunks = 0;

  for (const filePath of files) {
    const source = path.relative(contentDir, filePath);
    const text = fs.readFileSync(filePath, "utf-8");
    const chunks = chunkText(text, source);

    if (chunks.length === 0) continue;

    console.log(`${source} → ${chunks.length} chunk(s)`);

    // Embeddings par batch de 20
    const BATCH = 20;
    for (let i = 0; i < chunks.length; i += BATCH) {
      const batch = chunks.slice(i, i + BATCH);
      const embeddings = await embedChunks(batch.map((c) => c.content));

      const rows = batch.map((chunk, idx) => ({
        content: chunk.content,
        source: chunk.source,
        embedding: embeddings[idx],
        metadata: { file: source },
      }));

      const { error } = await supabase.from("portfolio_chunks").insert(rows);
      if (error) throw new Error(`Erreur insertion : ${error.message}`);
    }

    totalChunks += chunks.length;
  }

  console.log(`\nIngestion terminée : ${totalChunks} chunks insérés.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
