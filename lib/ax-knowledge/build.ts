// Base de connaissances de VEGA : ce qui est GÉNÉRÉ depuis les données du site,
// et les règles communes à l'ingestion (découpage, empreinte, synchronisation).
// Module pur (aucun accès réseau) : utilisé par scripts/build-ax-knowledge.ts,
// scripts/ingest-ax.ts et les tests. Jamais importé par l'app (AUTOMATIONS tire
// des composants React).

import { createHash } from "crypto";
import { FAQ, OFFERS } from "@/components/offres/offres-data";
import { METIERS } from "@/lib/metiers";
import { AUTOMATIONS } from "@/components/preuves/demo/automations-data";
import { CALENDAR_URL } from "@/lib/site-config";

export const KNOWLEDGE_DIR = "content/ax-knowledge";
export const FALLBACK_FILE = "lib/ax-fallback.generated.ts";
export const GENERATED_MARK = "<!-- GÉNÉRÉ par scripts/build-ax-knowledge.ts — ne pas éditer à la main. -->";

/** Fiche « Offres » : la seule où figurent des montants, tirés de offres-data.ts. */
export function offresMarkdown(): string {
  const offers = OFFERS.map((o) =>
    [
      `## ${o.name} — ${o.price} (${o.priceNote})`,
      "",
      `${o.kind}. ${o.pitch}${o.meta ? ` ${o.meta}.` : ""}`,
      "",
      `${o.itemsLabel} : ${o.items.map((i) => i.charAt(0).toLowerCase() + i.slice(1)).join(" ; ")}.`,
    ].join("\n"),
  );
  const faq = FAQ.map((f) => `**${f.q}** ${f.a}`).join("\n\n");
  return [
    GENERATED_MARK,
    "# Offres et prix de départ",
    "",
    "Les offres d'Axel Remillat, telles qu'affichées sur la page /offres. Les prix sont des prix de départ (« à partir de ») : le prix exact de chaque projet est écrit dans la proposition, après un échange de 15 minutes. Aucun devis n'est fait sans avoir vu le cas.",
    "",
    ...offers.flatMap((o) => [o, ""]),
    "## Questions de la page /offres",
    "",
    faq,
    "",
    `Réserver l'échange de 15 minutes : ${CALENDAR_URL}`,
    "",
  ].join("\n");
}

/** Fiche « Démos » : ce que le site permet de tester, tiré des données des démos. */
export function demosMarkdown(): string {
  const metiers = METIERS.map(
    (m) => `- ${m.label} (entreprise fictive ${m.entreprise}) : ${m.activite} Exemples de demandes : ${m.exemples.map((e) => e.label.toLowerCase()).join(", ")}.`,
  ).join("\n");
  const automations = AUTOMATIONS.map((a) => `- ${a.title} — /automatisations?demo=${a.id} : ${a.subtitle}`).join("\n");
  return [
    GENERATED_MARK,
    "# Les démos du site",
    "",
    "Toutes les démos sont testables en ligne, sans inscription. Elles utilisent des entreprises et des catalogues fictifs ; chez un client, on branche ses propres documents, ses prix et ses outils.",
    "",
    "## Agent devis — /agent",
    "",
    `On choisit un métier, on colle une demande de client, et l'agent prépare le devis chiffré (remises, TVA, livraison), l'email de réponse et un créneau d'appel. Les prix et délais viennent uniquement du catalogue ; ce qui sort du catalogue est signalé. ${METIERS.length} métiers :`,
    "",
    metiers,
    "",
    `## ${AUTOMATIONS.length} automatisations — /automatisations`,
    "",
    automations,
    "",
    "## Classement des contacts entrants — /pipeline",
    "",
    "Chaque contact entrant reçoit une probabilité d'aboutir (chaud, tiède, froid) et on voit ce qui fait monter ou baisser son score.",
    "",
    "## VEGA — /demos",
    "",
    "L'assistante du site, à qui l'on pose ses questions par écrit ou à la voix.",
    "",
  ].join("\n");
}

/** Fichiers générés, par nom de fichier dans content/ax-knowledge/. */
export function generatedFiles(): Record<string, string> {
  return { "offres.md": offresMarkdown(), "demos.md": demosMarkdown() };
}

/**
 * Contexte de secours (base vectorielle indisponible) : TOUTES les fiches, dans
 * l'ordre alphabétique. Construit depuis les mêmes fichiers que l'ingestion.
 */
export function fallbackModule(files: Record<string, string>): string {
  const text = Object.keys(files)
    .sort()
    .map((name) => files[name].replace(GENERATED_MARK, "").trim())
    .join("\n\n");
  return [
    "// ⚠️ GÉNÉRÉ par scripts/build-ax-knowledge.ts depuis content/ax-knowledge/*.md",
    "// — ne pas éditer à la main. Relancer `npm run build-ax` (fait aussi par `npm run ingest-ax`).",
    `export const FALLBACK_CONTEXT = ${JSON.stringify(text)};`,
    "",
  ].join("\n");
}

// ── Ingestion ────────────────────────────────────────────────────────────────

/** Changer ces réglages change l'empreinte : toutes les sources seront réindexées. */
export const EMBEDDING = { model: "text-embedding-3-large", dimensions: 1536 } as const;
const CHUNKER_VERSION = "2";

/** Empreinte d'une source : texte + réglages de découpage et d'embedding. */
export function sourceHash(text: string): string {
  return createHash("sha256").update(`${CHUNKER_VERSION}|${EMBEDDING.model}|${EMBEDDING.dimensions}|${text}`).digest("hex");
}

/**
 * Découpe sur les titres (##) puis sur les paragraphes, jusqu'à ~800 caractères.
 * Chaque passage porte le titre de sa fiche : sorti de son contexte, « Trois
 * tâches typiques » ne dirait pas de quel métier il s'agit.
 */
export function chunkText(text: string): string[] {
  const body = text.replace(GENERATED_MARK, "").trim();
  const title = body.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? "";
  const sections = body.split(/\n##\s+/);
  const chunks: string[] = [];
  for (const [index, section] of sections.entries()) {
    const heading = index === 0 ? "" : section.split("\n")[0].trim();
    const paragraphs = (index === 0 ? section.replace(/^#\s+.+$/m, "") : section.split("\n").slice(1).join("\n")).split(/\n\n+/);
    const prefix = [title, heading].filter(Boolean).join(" — ");
    let current = "";
    const flush = () => {
      if (current.trim().length > 50) chunks.push(`${prefix}\n\n${current.trim()}`);
      current = "";
    };
    for (const p of paragraphs) {
      if (current && (current + p).length > 800) flush();
      current += `\n\n${p}`;
    }
    flush();
  }
  return chunks;
}

export interface SyncPlan {
  /** Sources nouvelles ou modifiées : à (ré)indexer. */
  index: string[];
  /** Sources en base mais plus sur disque : à supprimer. */
  remove: string[];
  /** Sources identiques : rien à faire. */
  unchanged: string[];
}

/**
 * Compare les empreintes locales à celles de la base.
 * `only` limite le plan aux sources nommées (`npm run ingest-ax -- faq-prospect`) :
 * une source nommée mais absente du disque est supprimée de la base.
 */
export function planSync(
  local: Record<string, string>,
  remote: Record<string, string | null>,
  options: { only?: string[]; force?: boolean } = {},
): SyncPlan {
  const scope = options.only?.length ? new Set(options.only) : null;
  const inScope = (source: string) => !scope || scope.has(source);
  const index: string[] = [];
  const unchanged: string[] = [];
  for (const [source, hash] of Object.entries(local)) {
    if (!inScope(source)) continue;
    if (!options.force && remote[source] === hash) unchanged.push(source);
    else index.push(source);
  }
  const remove = Object.keys(remote).filter((source) => inScope(source) && !(source in local));
  return { index: index.sort(), remove: remove.sort(), unchanged: unchanged.sort() };
}
