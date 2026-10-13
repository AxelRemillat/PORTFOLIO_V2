import type { Locale } from "@/lib/i18n/config";

/**
 * Textes des pages /projets et /projets/[slug] (hors fiches : lib/projects-data).
 * Français MOT POUR MOT d'avant le bilingue ; l'anglais a le même type.
 */
const FR = {
  meta: {
    title: "Projets — Axel Remillat | Systèmes IA testables",
    description:
      "Des systèmes IA testables en vrai : l'assistant RAG VEGA, les automatisations n8n, un agent commercial autonome, un pipeline Data/ML de scoring et l'infrastructure self-hosted. Pas de screenshots — des preuves.",
  },
  list: {
    label: "PROJETS // EN PRODUCTION",
    title: "Ne me croyez pas sur parole. Testez.",
    lead: "Chaque système ci-dessous tourne en vrai. Cliquez, essayez, cassez-les si vous pouvez.",
  },
  detail: {
    back: "← Retour aux projets",
    architecture: "Architecture",
    pipeline: "Pipeline // flux de données",
    context: "Contexte",
    challenge: "Le défi",
    result: "Résultat / état",
    specs: "Spécifications",
    status: "Statut",
    tryLive: "Tester en live →",
    metaTitle: (title: string) => `${title} — Architecture`,
  },
};

export type ProjetsCopy = typeof FR;

const EN: ProjetsCopy = {
  meta: {
    title: "Projects — Axel Remillat | AI systems you can test",
    description:
      "AI systems you can actually try: the VEGA RAG assistant, n8n automations, an autonomous sales agent, a Data/ML lead-scoring pipeline and self-hosted infrastructure. No screenshots — proof.",
  },
  list: {
    label: "PROJECTS // IN PRODUCTION",
    title: "Don't take my word for it. Test it.",
    lead: "Every system below is running for real. Click, try it, break it if you can.",
  },
  detail: {
    back: "← Back to projects",
    architecture: "Architecture",
    pipeline: "Pipeline // data flow",
    context: "Context",
    challenge: "The challenge",
    result: "Result / status",
    specs: "Specs",
    status: "Status",
    tryLive: "Try it live →",
    metaTitle: (title: string) => `${title} — Architecture`,
  },
};

export const projetsCopy = (locale: Locale): ProjetsCopy => (locale === "en" ? EN : FR);
