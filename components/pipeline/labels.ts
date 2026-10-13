// Libellés AFFICHÉS de la démo /pipeline. Les valeurs du jeu de données (TPE,
// Industrie, chaud…) sont des clés du modèle : elles ne changent jamais, seul
// leur affichage passe par ce fichier. Jumeau anglais : labels.en.ts.
import type { Bucket } from "./model";
import type { Secteur, Source, Taille } from "./leads-data";

export interface PipelineLabels {
  /** Libellé de chaque feature, par clé (model.ts → FEATURES). */
  features: Record<string, string>;
  bucket: Record<Bucket, string>;
  taille: Record<Taille, string>;
  secteur: Record<Secteur, string>;
  source: Record<Source, string>;
  /** Nom des jeux de données, par id (leads-data.ts → DATASETS). */
  datasets: Record<string, string>;
}

export const PIPELINE_LABELS: PipelineLabels = {
  features: {
    essai: "Essai gratuit activé",
    emails: "Emails ouverts",
    pages: "Pages vues",
    budget: "Budget estimé",
    ancien: "Ancienneté du lead",
    referral: "Source : referral",
    organic: "Source : organic",
    eti: "Taille : ETI",
    pme: "Taille : PME",
    engage: "Ratio d'engagement",
  },
  bucket: { chaud: "chaud", "tiède": "tiède", froid: "froid" },
  taille: { TPE: "TPE", PME: "PME", ETI: "ETI" },
  secteur: { SaaS: "SaaS", Industrie: "Industrie", Retail: "Retail", Services: "Services" },
  source: { ads: "ads", organic: "organic", referral: "referral" },
  datasets: { saas: "Leads SaaS B2B (Q1)", agc: "Leads Agence & Services" },
};
