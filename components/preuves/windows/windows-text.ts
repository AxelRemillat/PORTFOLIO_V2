"use client";

import { useLocale } from "@/lib/i18n/client";
import { WINDOWS_TEXT_EN } from "./windows-text.en";

// Textes des fenêtres « preuves » (cartes de /projets), un objet par langue. Les
// chaînes françaises reprennent mot pour mot le texte d'avant l'anglais ; les
// noms de fonctions (calculer_devis…) et de nœuds n8n sont du code : inchangés.
export interface WindowsText {
  vega: { bar: string; online: string; question: string; writing: string; flow: string[] };
  agent: { bar: string; lines: [string, string][]; flow: string[] };
  pipeline: { bar: string; lines: [string, string][]; flow: string[] };
  infra: { bar: string; services: string[]; tag: string; flow: string[] };
  workflow: { bar: string; flow: string[] };
}

export const WINDOWS_TEXT_FR: WindowsText = {
  vega: { bar: "VEGA · assistant RAG", online: "● online", question: "Quel est ton parcours ?", writing: "rédige la réponse", flow: ["Question", "Embed", "pgvector", "gpt-4o", "Voix"] },
  agent: {
    bar: "agent · function-calling",
    lines: [
      ["think", "Besoin : 4 bureaux assis-debout + livraison Lyon"],
      ["tool", "rechercher_produits( assis-debout )"],
      ["ok", "2 réfs · stock OK"],
      ["tool", "calculer_devis( 4× BUR-ASD-140, Lyon )"],
      ["ok", "2 379 € TTC · délai 11 j"],
      ["final", "Devis + email + créneau prêts"],
    ],
    flow: ["Demande", "Raisonne", "Outils", "Livrable"],
  },
  pipeline: {
    bar: "pipeline · data → ml",
    lines: [
      ["in", "303 leads · 11 colonnes"],
      ["clean", "types normalisés · doublons retirés"],
      ["feat", "10 features (one-hot · ratios)"],
      ["model", "régression logistique → proba"],
      ["out", "chaud / tiède / froid + explicabilité"],
    ],
    flow: ["Ingest", "Clean", "Features", "Modèle", "Score"],
  },
  infra: {
    bar: "infra · serveur GPU",
    services: ["LLM local — Ollama", "API TTS self-hosted", "Tunnel sécurisé", "Monitoring & backups"],
    tag: "en cours",
    flow: ["Client", "Tunnel", "Docker", "Monitoring"],
  },
  workflow: { bar: "n8n · éditeur de workflow", flow: ["Webhook", "OpenAI", "Filtre", "Envoi"] },
};

/** Textes des fenêtres dans la langue de la page. */
export const useWindowsText = (): WindowsText => (useLocale() === "en" ? WINDOWS_TEXT_EN : WINDOWS_TEXT_FR);
