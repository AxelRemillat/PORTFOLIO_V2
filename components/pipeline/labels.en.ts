// English display labels for the /pipeline demo. Dataset values (TPE, Industrie,
// chaud…) are model keys and never change: only how they are shown does.
import type { PipelineLabels } from "./labels";

export const PIPELINE_LABELS: PipelineLabels = {
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
};
