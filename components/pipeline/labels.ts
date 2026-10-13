// Textes de la démo /pipeline, un objet par langue (jumeau anglais : labels.en.ts).
// Les valeurs du jeu de données (TPE, Industrie, chaud…) sont des clés du modèle :
// elles ne changent jamais, seul leur AFFICHAGE passe par ce fichier. Les chaînes
// françaises reprennent mot pour mot le texte d'avant l'anglais.
import type { Locale } from "@/lib/i18n/config";
import type { Bucket } from "./model";
import type { Secteur, Source, Taille } from "./leads-data";
import { PIPELINE_LABELS_EN } from "./labels.en";

export interface PipelineLabels {
  page: { title: string; description: string; back: string; kicker: string; h1: string; lead: string };
  /** Libellé de chaque feature, par clé (model.ts → FEATURES). */
  features: Record<string, string>;
  bucket: Record<Bucket, string>;
  taille: Record<Taille, string>;
  secteur: Record<Secteur, string>;
  source: Record<Source, string>;
  /** Nom des jeux de données, par id (leads-data.ts → DATASETS). */
  datasets: Record<string, string>;
  blank: { id: string; name: string };
  money: (n: number) => string;
  demo: {
    sample: string; run: string; running: string; live: string; starting: string;
    insight: { leads: string; hot: string; top: string }; predictions: string; analysis: string;
  };
  live: { aria: string; computing: string; techShow: string; techHide: string };
  table: { lead: string; size: string; source: string; budget: string; score: string; label: string; footer: (shown: number, total: number) => string };
  charts: { dist: string; distAria: string; importance: string };
  edit: { title: string; size: string; sector: string; source: string; pages: string; emails: string; age: string; budget: string; trial: string; trialOn: string };
  steps: {
    ingest: { title: string; result: (rows: number, cols: number) => string; tech: (cols: string) => string };
    clean: { title: string; result: (dup: number) => string; detail: string };
    features: { title: string; result: (n: number) => string; detail: string };
    model: { title: string; result: (n: number) => string };
    predict: { title: string; result: (hot: number, warm: number, cold: number) => string; detail: (top: string) => string; tech: string };
  };
}

export const PIPELINE_LABELS: PipelineLabels = {
  page: {
    title: "Pipeline Data/ML en production — Axel Remillat",
    description:
      "Démo testable d'un pipeline data → ML → prédiction : scoring de leads (probabilité de conversion). Ingestion, nettoyage, feature engineering, régression logistique et explicabilité, en direct et 100 % client-side.",
    back: "← Retour aux projets",
    kicker: "Pipeline Data/ML // démo testable",
    h1: "Scoring de leads — pipeline en production",
    lead:
      "Un cas PME concret : estimer la probabilité de conversion de chaque lead. Tout le cycle en direct — ingestion → nettoyage → feature engineering → régression logistique → prédictions + explicabilité. Déterministe, gratuit, calculé dans votre navigateur.",
  },
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
  blank: { id: "VOTRE-LEAD", name: "Votre prospect" },
  money: (n) => `${n.toLocaleString("fr-FR")} €`,
  demo: {
    sample: "Dataset d'exemple",
    run: "Lancer le pipeline →",
    running: "Pipeline en cours…",
    live: "Pipeline live",
    starting: "démarrage",
    insight: { leads: "de leads ", hot: "chauds", top: "Lead au plus fort potentiel :" },
    predictions: "Prédictions",
    analysis: "Analyse",
  },
  live: { aria: "Étapes du pipeline", computing: "calcul", techShow: "Voir plus — détail technique", techHide: "Masquer le détail technique" },
  table: {
    lead: "Lead", size: "Taille", source: "Source", budget: "Budget", score: "Score", label: "Label",
    footer: (shown, total) => `${shown} lignes affichées sur ${total} · cliquez un en-tête pour trier`,
  },
  charts: { dist: "Distribution des scores", distAria: "Histogramme des scores de conversion", importance: "Importance des features (|poids|)" },
  edit: {
    title: "Votre lead — score en direct", size: "Taille", sector: "Secteur", source: "Source", pages: "Pages vues",
    emails: "Emails ouverts", age: "Ancienneté (j)", budget: "Budget (€)", trial: "Essai gratuit", trialOn: "activé",
  },
  steps: {
    ingest: {
      title: "Ingestion",
      result: (rows, cols) => `${rows} lignes chargées · ${cols} colonnes détectées`,
      tech: (cols) => `colonnes = [${cols}]\ncible historique = "converti" (0/1)`,
    },
    clean: {
      title: "Nettoyage & validation",
      result: (dup) => `types normalisés · ${dup} doublon(s) retiré(s) · valeurs bornées`,
      detail: "imputation des manquants, clamp des valeurs aberrantes, déduplication par id",
    },
    features: { title: "Feature engineering", result: (n) => `${n} features dérivées`, detail: "one-hot (taille / source), ratios et normalisations" },
    model: { title: "Modèle — régression logistique", result: (n) => `${n} probabilités calculées · poids fixés hors-ligne` },
    predict: {
      title: "Prédictions & explicabilité",
      result: (hot, warm, cold) => `${hot} chauds · ${warm} tièdes · ${cold} froids`,
      detail: (top) => `features les plus décisives : ${top}`,
      tech: `label = proba ≥ 0.66 ? "chaud" : proba ≥ 0.33 ? "tiède" : "froid"\nexplicabilité(ligne) = tri décroissant des (poids × valeur)`,
    },
  },
};

export const pipelineLabels = (locale: Locale): PipelineLabels => (locale === "en" ? PIPELINE_LABELS_EN : PIPELINE_LABELS);
