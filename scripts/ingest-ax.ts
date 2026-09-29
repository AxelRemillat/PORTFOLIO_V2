/**
 * Ingestion INCRÉMENTALE de la base de connaissances de VEGA.
 * content/ax-knowledge/*.md → passages → embeddings → table `ax_documents`.
 *
 *   npm run ingest-ax                       # toutes les fiches modifiées
 *   npm run ingest-ax -- faq-prospect offres  # seulement ces sources
 *   npm run ingest-ax -- --dry-run          # affiche le plan, n'écrit rien
 *   npm run ingest-ax -- --force            # réindexe même si rien n'a changé
 *
 * Chaque source porte l'empreinte de son fichier (`source_hash`) : seules les
 * fiches modifiées sont réindexées, les fiches disparues sont supprimées. La
 * table n'est plus vidée : une source en cours de réindexation garde ses anciens
 * passages jusqu'à l'insertion des nouveaux.
 *
 * PÉRIMÈTRE : `ax_documents` uniquement (base partagée avec ORION).
 * Prérequis : .env.local (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY)
 * et la migration scripts/migrations/2026-09-29-ax-documents-incremental.sql.
 */

import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { EMBEDDING, chunkText, planSync, sourceHash } from "@/lib/ax-knowledge/build";
import { writeKnowledge } from "./build-ax-knowledge";

const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split(/\r?\n/)) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length && !process.env[key.trim()]) process.env[key.trim()] = rest.join("=").trim();
  }
}

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const force = args.includes("--force");
const only = args.filter((a) => !a.startsWith("--")).map((a) => a.replace(/\.md$/, ""));

async function ingest() {
  const files = writeKnowledge();
  const texts = Object.fromEntries(Object.entries(files).map(([name, text]) => [name.replace(/\.md$/, ""), text]));
  const local = Object.fromEntries(Object.entries(texts).map(([source, text]) => [source, sourceHash(text)]));

  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: rows, error: readErr } = await supabase.from("ax_documents").select("id, source, source_hash");
  if (readErr) throw new Error(`Lecture de ax_documents : ${readErr.message}`);
  const remote: Record<string, string | null> = {};
  for (const row of rows ?? []) {
    // Une source dont les passages n'ont pas tous la même empreinte est réindexée.
    const known = remote[row.source];
    remote[row.source] = known === undefined || known === row.source_hash ? row.source_hash : null;
  }

  const plan = planSync(local, remote, { only, force });
  console.log(`À indexer : ${plan.index.join(", ") || "—"}`);
  console.log(`À supprimer : ${plan.remove.join(", ") || "—"}`);
  console.log(`Inchangées : ${plan.unchanged.length}`);
  if (dryRun) return console.log("\n--dry-run : rien n'a été écrit.");

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  let inserted = 0;
  for (const source of plan.index) {
    const chunks = chunkText(texts[source]);
    if (!chunks.length) {
      console.log(`  ${source} : aucun passage exploitable, ignorée`);
      continue;
    }
    // Embeddings d'abord : en cas d'erreur, l'ancienne version reste en place.
    const emb = await openai.embeddings.create({ model: EMBEDDING.model, input: chunks, dimensions: EMBEDDING.dimensions });
    const { data: added, error } = await supabase
      .from("ax_documents")
      .insert(chunks.map((content, i) => ({ content, embedding: emb.data[i].embedding, source, source_hash: local[source] })))
      .select("id");
    if (error) throw new Error(`Insertion (${source}) : ${error.message}`);
    const keep = (added ?? []).map((r) => r.id);
    const { error: delErr } = await supabase.from("ax_documents").delete().eq("source", source).not("id", "in", `(${keep.join(",")})`);
    if (delErr) throw new Error(`Suppression de l'ancienne version (${source}) : ${delErr.message}`);
    inserted += chunks.length;
    console.log(`  ${source} : ${chunks.length} passage(s)`);
  }
  for (const source of plan.remove) {
    const { error } = await supabase.from("ax_documents").delete().eq("source", source);
    if (error) throw new Error(`Suppression (${source}) : ${error.message}`);
    console.log(`  ${source} : supprimée`);
  }
  console.log(`\nIngestion terminée ✓ — ${inserted} passage(s) indexé(s), ${plan.remove.length} source(s) supprimée(s).`);
}

ingest().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
