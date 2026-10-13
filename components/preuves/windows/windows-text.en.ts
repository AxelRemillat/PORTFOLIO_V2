// English copy for the "proof" windows on /en/projets. Function names
// (calculer_devis…) and n8n node names are code: kept as they are.
import type { WindowsText } from "./windows-text";

export const WINDOWS_TEXT_EN: WindowsText = {
  vega: { bar: "VEGA · RAG assistant", online: "● online", question: "What's your background?", writing: "is writing the answer", flow: ["Question", "Embed", "pgvector", "gpt-4o", "Voice"] },
  agent: {
    bar: "agent · function-calling",
    lines: [
      ["think", "Need: 4 sit-stand desks + delivery to Lyon"],
      ["tool", "rechercher_produits( sit-stand )"],
      ["ok", "2 items · in stock"],
      ["tool", "calculer_devis( 4× BUR-ASD-140, Lyon )"],
      ["ok", "€2,379 incl. VAT · 11-day lead time"],
      ["final", "Quote + email + call slot ready"],
    ],
    flow: ["Request", "Reasons", "Tools", "Output"],
  },
  pipeline: {
    bar: "pipeline · data → ml",
    lines: [
      ["in", "303 leads · 11 columns"],
      ["clean", "types normalized · duplicates removed"],
      ["feat", "10 features (one-hot · ratios)"],
      ["model", "logistic regression → probability"],
      ["out", "hot / warm / cold + explainability"],
    ],
    flow: ["Ingest", "Clean", "Features", "Model", "Score"],
  },
  infra: {
    bar: "infra · GPU server",
    services: ["Local LLM: Ollama", "Self-hosted TTS API", "Secure tunnel", "Monitoring & backups"],
    tag: "in progress",
    flow: ["Client", "Tunnel", "Docker", "Monitoring"],
  },
  workflow: { bar: "n8n · workflow editor", flow: ["Webhook", "OpenAI", "Filter", "Send"] },
};
