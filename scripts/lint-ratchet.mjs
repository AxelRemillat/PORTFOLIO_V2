/**
 * Cliquet ESLint : aucune NOUVELLE erreur, sans bloquer sur l'existant.
 *
 *   npm run lint:ratchet    # CI : échoue si un fichier a plus d'erreurs que la référence
 *   npm run lint:baseline   # réécrit la référence (après avoir corrigé des erreurs)
 *
 * Pourquoi : master compte des erreurs react-hooks (règles strictes façon React
 * Compiler) antérieures à la CI. Un `npm run lint` bloquant serait rouge sur
 * TOUTES les PR ; un lint non bloquant laisserait passer les nouvelles. Le
 * cliquet compte les erreurs PAR FICHIER : une erreur ajoutée dans un fichier
 * n'est pas masquée par une erreur corrigée dans un autre. Les avertissements
 * ne comptent pas.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { ESLint } from "eslint";

const BASELINE = "eslint-baseline.json";
const update = process.argv.includes("--update");

const eslint = new ESLint();
const results = await eslint.lintFiles(["."]);
const current = {};
for (const result of results) {
  if (result.errorCount > 0) current[path.relative(process.cwd(), result.filePath).split(path.sep).join("/")] = result.errorCount;
}
const total = Object.values(current).reduce((sum, n) => sum + n, 0);

if (update) {
  const sorted = Object.fromEntries(Object.entries(current).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(BASELINE, `${JSON.stringify(sorted, null, 2)}\n`);
  console.log(`Référence écrite : ${total} erreur(s) dans ${Object.keys(sorted).length} fichier(s) → ${BASELINE}`);
  process.exit(0);
}

const baseline = JSON.parse(readFileSync(BASELINE, "utf8"));
const worse = Object.entries(current).filter(([file, n]) => n > (baseline[file] ?? 0));
const better = Object.entries(baseline).filter(([file, n]) => (current[file] ?? 0) < n);

if (worse.length) {
  const formatter = await eslint.loadFormatter("stylish");
  const culprits = new Set(worse.map(([file]) => file));
  const shown = results.filter((r) => culprits.has(path.relative(process.cwd(), r.filePath).split(path.sep).join("/")));
  console.error(await formatter.format(shown));
  console.error("Nouvelles erreurs ESLint (fichier : actuel / référence) :");
  for (const [file, n] of worse) console.error(`  ${file} : ${n} / ${baseline[file] ?? 0}`);
  process.exit(1);
}

console.log(`Lint : aucune nouvelle erreur (${total} erreur(s) existante(s), toutes dans la référence).`);
if (better.length) {
  console.log(`${better.length} fichier(s) en mieux : lancer \`npm run lint:baseline\` pour abaisser la référence.`);
}
