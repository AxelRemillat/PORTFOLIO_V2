// English twin of archi-data.ts: same stages, same real values, labels written in
// English. Function names (calculer_devis…) are code identifiers: kept as they are.
import type { Archi } from "./archi-data";

export const ARCHI: Record<string, Archi> = {
  vega: {
    flow: [
      { title: "Documents (CV · Markdown)", tech: "ingestion + chunking" },
      { title: "Embeddings", tech: "OpenAI text-embedding-3-large → 1536 d" },
      { title: "pgvector · Supabase", tech: "cosine search · top-k" },
      { title: "gpt-4o-mini", tech: "sourced answer generation" },
      { title: "Text-to-speech", tech: "TTS → voice" },
    ],
    guards: ["Daily token cap", "Per-IP rate limit"],
  },
  n8n: {
    flow: [
      { title: "Trigger", tech: "webhook · email · cron" },
      {
        title: "n8n · orchestration",
        tech: "routing + business rules",
        items: ["AI agent (OpenAI)", "Rate limit + retries", "Monitoring / logs"],
      },
      { title: "Action", tech: "invoice · email · meeting notes · support" },
    ],
  },
  agent: {
    flow: [
      { title: "Customer request", tech: "free-text input" },
      { title: "Agent · gpt-4o-mini", tech: "function-calling loop (max 6 turns)", items: ["Reasoning", "Tool choice", "Feasible / not feasible"] },
      { title: "Business tools", tech: "deterministic functions", items: ["rechercher_produits", "verifier_stock", "verifier_livraison", "calculer_devis"] },
      { title: "Output", tech: "quote (discounts · VAT) + email + call slot" },
    ],
    guards: ["Price/stock/lead time = tools only", "Rate limit 3/min · 10/day", "Kill switch · honeypot · 40 s timeout"],
  },
  pipeline: {
    flow: [
      { title: "Ingestion", tech: "SaaS leads dataset · ~300 rows · 11 columns" },
      { title: "Cleaning & validation", tech: "imputation · outlier clamping · dedup by id" },
      {
        title: "Feature engineering",
        tech: "one-hot (size · source) · ratios · normalization",
        items: ["10 derived features"],
      },
      { title: "Logistic regression", tech: "weights fixed offline → p = 1 / (1 + e^−z)" },
      { title: "Predictions & explainability", tech: "hot / warm / cold + key features" },
    ],
    guards: ["100% client-side: no API, no secret", "Deterministic · free · instant"],
  },
  infra: {
    flow: [
      { title: "Internet", tech: "secure tunnel (HTTPS)" },
      {
        title: "Reverse proxy",
        items: ["Self-hosted TTS API", "Ollama: local LLM", "Docker services"],
      },
      { title: "Supervision", tech: "monitoring + alerts · scheduled backups" },
      { title: "GPU server (RTX)", tech: "production" },
    ],
  },
};
