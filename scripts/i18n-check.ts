/**
 * `npm run i18n:check` — AUCUN RESTE DE FRANÇAIS SUR UNE PAGE /en.
 *
 * Deux contrôles :
 *   1. clés : `messages/en.ts` a exactement les clés de `messages/fr.ts`
 *      (tsc le vérifie déjà ; ici on le dit en clair) ;
 *   2. pages : dans le HTML PRÉRENDU des pages /en (`.next/server/app/en/…`,
 *      produit par `npm run build`), on cherche des mots français courants.
 *      Le texte visible seulement : balises, scripts, styles et attributs
 *      techniques sont retirés avant la recherche.
 *
 * Il faut donc un build à jour : `npm run build && npm run i18n:check`.
 * Code de sortie 1 au moindre problème. `--page agent` ne contrôle qu'une page
 * (`--page accueil` pour /en). Sans barre oblique : Git Bash réécrit « /agent »
 * en chemin Windows avant même que le script ne le lise.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fr } from "../messages/fr";
import { en } from "../messages/en";

// Mots français fréquents, sans équivalent anglais identique. Liste volontairement
// courte : chaque mot doit être un signal sûr, pas une source de faux positifs.
const FRENCH_WORDS = [
  "le", "les", "des", "du", "une", "et", "est", "pour", "avec", "sans", "dans", "sur", "vous", "votre", "vos",
  "nous", "notre", "être", "fait", "faire", "très", "aussi", "mais", "ou", "où", "qui", "que", "quoi", "pas",
  "tout", "tous", "cette", "ces", "aux", "devis", "démo", "démos", "offres", "projets", "parcours",
  "mentions", "légales", "accueil", "envoyer", "voir", "découvrir", "réserver", "rendez-vous", "entreprise",
];
// « a », « en », « de », « la » existent aussi en anglais ou dans des noms propres : exclus.
// Le tiret bas compte comme une lettre : `calculer_devis` est un nom de fonction, pas du texte.
const FRENCH = new RegExp(`(?<![\\p{L}\\-_])(${FRENCH_WORDS.join("|")})(?![\\p{L}\\-_])`, "giu");
/**
 * Mots accentués typiquement français (é, è, à, ç…). Frontières Unicode : `\b`
 * de JavaScript ignore les lettres accentuées et couperait « résumé » en « résum ».
 */
const ACCENTED = /(?<![\p{L}_])\p{L}*[éèêàùçôîû]\p{L}*(?![\p{L}_])/giu;
const ALLOWED_ACCENTED = new Set(["remillat", "café", "résumé", "français", "française", "mapúa"]);
/**
 * Noms propres et adresses qui restent en français dans la version anglaise :
 * retirés du texte avant la recherche. À compléter quand un nom légitime ressort.
 */
const PROPER_NOUNS = [
  "Galets du Rhône",
  "chemin de Pré Longe",
  "Oris-en-Rattier",
  "Version française",
  "micro-entreprise",
  "Math Sup",
  "Math Spé",
];

const keys = (value: unknown, prefix = ""): string[] =>
  Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    typeof child === "object" && child !== null ? keys(child, `${prefix}${key}.`) : [`${prefix}${key}`],
  );

function visibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    // Le sélecteur « Version française » est voulu sur /en : on l'écarte.
    .replace(/<a[^>]*hreflang="fr"[^>]*>[\s\S]*?<\/a>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;|&#\d+;/gi, " ")
    .replace(/\s+/g, " ")
    .replace(new RegExp(PROPER_NOUNS.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "gi"), " ");
}

function htmlFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? htmlFiles(full) : full.endsWith(".html") ? [full] : [];
  });
}

function main(): void {
  let problems = 0;
  const raw = process.argv.includes("--page") ? process.argv[process.argv.indexOf("--page") + 1] ?? "" : null;
  // « agent », « /agent », « projets/vega » ; « accueil » ou « / » pour la page d'accueil.
  const only = raw === null ? null : raw === "accueil" || raw === "/" ? "/" : `/${raw.replace(/^\/+/, "")}`;

  // 1. Clés.
  const frKeys = new Set(keys(fr));
  const enKeys = new Set(keys(en));
  const missing = [...frKeys].filter((key) => !enKeys.has(key));
  const extra = [...enKeys].filter((key) => !frKeys.has(key));
  for (const key of missing) console.log(`  CLÉ MANQUANTE en : ${key}`);
  for (const key of extra) console.log(`  CLÉ EN TROP en : ${key}`);
  problems += missing.length + extra.length;
  console.log(`Clés : ${frKeys.size} en français, ${missing.length + extra.length} écart(s).`);

  // 2. Pages /en prérendues.
  const root = join(".next", "server", "app");
  const pages = [join(root, "en.html"), ...htmlFiles(join(root, "en"))].filter((file) => existsSync(file));
  if (!pages.length) {
    console.log("Aucune page /en prérendue : lancez d'abord `npm run build`.");
    process.exit(1);
  }
  let checked = 0;
  for (const file of pages) {
    const route = "/" + relative(root, file).replace(/\\/g, "/").replace(/\.html$/, "");
    if (only && route !== `/en${only === "/" ? "" : only}`) continue;
    checked += 1;
    const text = visibleText(readFileSync(file, "utf8"));
    const words = [...text.matchAll(FRENCH)].map((match) => match[1].toLowerCase());
    const accented = [...text.matchAll(ACCENTED)].map((match) => match[0].toLowerCase()).filter((word) => !ALLOWED_ACCENTED.has(word));
    const found = [...new Set([...words, ...accented])];
    if (found.length) {
      problems += 1;
      console.log(`  ${route} : ${found.length} mot(s) français — ${found.slice(0, 12).join(", ")}${found.length > 12 ? "…" : ""}`);
    } else {
      console.log(`  ${route} : ok`);
    }
  }

  if (only && !checked) {
    console.log(`  Aucune page /en ne correspond à « ${raw} ».`);
    problems += 1;
  }
  console.log(problems ? `\n${problems} problème(s).` : "\nAucun reste de français sur les pages /en.");
  process.exit(problems ? 1 : 0);
}

main();
