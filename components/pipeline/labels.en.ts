// English copy for the /pipeline demo. Dataset values (TPE, Industrie, chaud…) are
// model keys and never change: only how they are shown does.
import type { PipelineLabels } from "./labels";

export const PIPELINE_LABELS_EN: PipelineLabels = {
  page: {
    title: "Data/ML pipeline in production | Axel Remillat",
    description:
      "Live demo of a data → ML → prediction pipeline: lead scoring (probability of conversion). Ingestion, cleaning, feature engineering, logistic regression and explainability, live and 100% client-side.",
    back: "← Back to projects",
    kicker: "Data/ML pipeline // live demo",
    h1: "Lead scoring: a pipeline in production",
    lead:
      "A concrete small-business case: estimate how likely each lead is to convert. The whole cycle, live: ingestion → cleaning → feature engineering → logistic regression → predictions + explainability. Deterministic, free, computed in your browser.",
  },
  features: {
    essai: "Free trial started",
    emails: "Emails opened",
    pages: "Pages viewed",
    budget: "Estimated budget",
    ancien: "Lead age",
    referral: "Source: referral",
    organic: "Source: organic",
    eti: "Size: mid-market",
    pme: "Size: small business",
    engage: "Engagement ratio",
  },
  bucket: { chaud: "hot", "tiède": "warm", froid: "cold" },
  taille: { TPE: "Micro", PME: "Small", ETI: "Mid-market" },
  secteur: { SaaS: "SaaS", Industrie: "Manufacturing", Retail: "Retail", Services: "Services" },
  source: { ads: "ads", organic: "organic", referral: "referral" },
  datasets: { saas: "B2B SaaS leads (Q1)", agc: "Agency & services leads" },
  blank: { id: "YOUR-LEAD", name: "Your prospect" },
  money: (n) => `€${n.toLocaleString("en-US")}`,
  demo: {
    sample: "Sample dataset",
    run: "Run the pipeline →",
    running: "Pipeline running…",
    live: "Live pipeline",
    starting: "starting",
    insight: { leads: "of leads are ", hot: "hot", top: "Highest-potential lead:" },
    predictions: "Predictions",
    analysis: "Analysis",
  },
  live: { aria: "Pipeline steps", computing: "computing", techShow: "Show more: technical details", techHide: "Hide technical details" },
  table: {
    lead: "Lead", size: "Size", source: "Source", budget: "Budget", score: "Score", label: "Label",
    footer: (shown, total) => `Showing ${shown} of ${total} rows · click a header to sort`,
  },
  charts: { dist: "Score distribution", distAria: "Histogram of conversion scores", importance: "Feature importance (|weight|)" },
  edit: {
    title: "Your lead: live score", size: "Size", sector: "Industry", source: "Source", pages: "Pages viewed",
    emails: "Emails opened", age: "Lead age (days)", budget: "Budget (€)", trial: "Free trial", trialOn: "started",
  },
  steps: {
    ingest: {
      title: "Ingestion",
      result: (rows, cols) => `${rows} rows loaded · ${cols} columns detected`,
      tech: (cols) => `columns = [${cols}]\nhistorical target = "converti" (0/1)`,
    },
    clean: {
      title: "Cleaning & validation",
      result: (dup) => `types normalized · ${dup} duplicate(s) removed · values clamped`,
      detail: "missing-value imputation, outlier clamping, dedup by id",
    },
    features: { title: "Feature engineering", result: (n) => `${n} derived features`, detail: "one-hot (size / source), ratios and normalization" },
    model: { title: "Model: logistic regression", result: (n) => `${n} probabilities computed · weights fixed offline` },
    predict: {
      title: "Predictions & explainability",
      result: (hot, warm, cold) => `${hot} hot · ${warm} warm · ${cold} cold`,
      detail: (top) => `most decisive features: ${top}`,
      tech: `label = proba ≥ 0.66 ? "hot" : proba ≥ 0.33 ? "warm" : "cold"\nexplain(row) = sort desc by (weight × value)`,
    },
  },
};
