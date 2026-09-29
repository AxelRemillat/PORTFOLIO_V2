/**
 * Régénère ce qui, dans la base de connaissances de VEGA, vient des données du site :
 *   - content/ax-knowledge/offres.md  ← components/offres/offres-data.ts
 *   - content/ax-knowledge/demos.md   ← lib/metiers + automations-data
 *   - lib/ax-fallback.generated.ts    ← toutes les fiches (contexte de secours)
 *
 * Usage : npm run build-ax   (lancé aussi en tête de `npm run ingest-ax`)
 * Aucun réseau, aucune clé : n'écrit que des fichiers du dépôt.
 */

import fs from "fs";
import path from "path";
import { FALLBACK_FILE, KNOWLEDGE_DIR, fallbackModule, generatedFiles } from "@/lib/ax-knowledge/build";

/** Toutes les fiches, par nom de fichier, après régénération. */
export function writeKnowledge(root = process.cwd()): Record<string, string> {
  const dir = path.join(root, KNOWLEDGE_DIR);
  for (const [name, text] of Object.entries(generatedFiles())) fs.writeFileSync(path.join(dir, name), text);

  const files = Object.fromEntries(
    fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => [f, fs.readFileSync(path.join(dir, f), "utf-8").replace(/\r\n/g, "\n")]),
  );
  fs.writeFileSync(path.join(root, FALLBACK_FILE), fallbackModule(files));
  return files;
}

if (process.argv[1] && /build-ax-knowledge/.test(process.argv[1])) {
  const files = writeKnowledge();
  console.log(`Base de connaissances : ${Object.keys(files).length} fiches, contexte de secours régénéré.`);
}
