import type { Cat } from "./skills-graph-data";

// Skills graph in English. Category KEYS stay French (they are ids used by the
// layout and colors); only their displayed labels are translated here.

export const CAT_LABEL_EN: Record<Cat, string> = {
  "Data & IA": "Data & AI",
  Automatisation: "Automation",
  Développement: "Development",
  Infrastructure: "Infrastructure",
};

const ADVANCED = "Advanced";
const INTERMEDIATE = "Intermediate";

// Descriptions based on Axel's REAL use (projects, startups, freelance work).
export const SKILL_DETAILS_EN: Record<string, { level: string; desc: string }> = {
  python:   { level: ADVANCED,     desc: "My main language: ingestion and embedding scripts (RAG), data and machine learning across my projects." },
  sql:      { level: ADVANCED,     desc: "Querying and modeling: the PostgreSQL behind my projects (Supabase) and analytical warehouses (BigQuery)." },
  openai:   { level: ADVANCED,     desc: "VEGA's answers (gpt-4o-mini) and the RAG embeddings (text-3-large)." },
  pgvector: { level: INTERMEDIATE, desc: "Similarity search over embeddings: the engine behind VEGA and the interactive RAG résumé." },
  fastapi:  { level: ADVANCED,     desc: "Python backend for the portfolio's AI demo APIs." },
  supabase: { level: ADVANCED,     desc: "Vector storage (pgvector) for the documents in VEGA's RAG." },
  n8n:      { level: ADVANCED,     desc: "Orchestrating AI agents and automations: the SEACO chatbot, RAG ingestion pipelines, testable business demos on the way." },
  make:     { level: INTERMEDIATE, desc: "No-code automations, alongside n8n, to connect services." },
  webhooks: { level: ADVANCED,     desc: "Real-time triggers between services in my automations." },
  gcloud:   { level: INTERMEDIATE, desc: "Cloud ecosystem for my projects: BigQuery (data), Cloud Run (deployment), Vertex AI (managed AI)." },
  react:    { level: ADVANCED,     desc: "The portfolio's interfaces: the VEGA orb, the skills graph, the project pages." },
  nextjs:   { level: ADVANCED,     desc: "The site's framework (App Router): pages, API routes, rendering." },
  ts:       { level: ADVANCED,     desc: "Types across the portfolio's entire Next.js front end." },
  tailwind: { level: ADVANCED,     desc: "Styling for the whole site." },
  vercel:   { level: ADVANCED,     desc: "Deployment and hosting for the portfolio." },
  docker:   { level: INTERMEDIATE, desc: "Containerizing services for reproducible deployments." },
  bigquery: { level: INTERMEDIATE, desc: "Google Cloud data warehouse: large-scale analytical queries on my data projects." },
  vertexai: { level: INTERMEDIATE, desc: "Google Cloud's ML platform: training and deploying models for my AI projects." },
  cloudrun: { level: INTERMEDIATE, desc: "Serverless container deployment on Google Cloud." },
  ollama:     { level: INTERMEDIATE, desc: "Local LLM inference server (Llama 3.2, Qwen) on my own GPU: self-hosted AI, with no data sent to the cloud." },
  git:        { level: ADVANCED,     desc: "Versioning and collaboration: repos for all my projects, branch/commit workflow, continuous deployment." },
  three:      { level: INTERMEDIATE, desc: "Real-time 3D in the browser (React Three Fiber): the VEGA orb and this skills graph run on it." },
  cloudflare: { level: INTERMEDIATE, desc: "Secure tunnel, DNS and domain: I put my home server online without opening any ports." },
  whisper:    { level: INTERMEDIATE, desc: "Audio-to-text transcription (speech-to-text): the core of my meeting-notes automation." },
};
