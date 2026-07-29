// Schéma d'architecture structuré par preuve (remplace l'ASCII). Étapes RÉELLES
// du pipeline — concis, pas de valeur inventée. Consommé par ArchiDiagram.
export interface ArchiStage {
  title: string;
  tech?: string;
  items?: string[];
}
export interface Archi {
  flow: ArchiStage[];
  guards?: string[];
}

export const ARCHI: Record<string, Archi> = {
  vega: {
    flow: [
      { title: "Document (CV · Markdown)", tech: "ingestion + découpe en chunks" },
      { title: "Embeddings", tech: "OpenAI text-embedding-3-large → 1536 d" },
      { title: "pgvector · Supabase", tech: "recherche cosinus · top-k" },
      { title: "gpt-4o-mini", tech: "génération de la réponse sourcée" },
      { title: "Synthèse vocale", tech: "TTS → voix" },
    ],
    guards: ["Garde-fou tokens / jour", "Rate-limit par IP"],
  },
  n8n: {
    flow: [
      { title: "Déclencheur", tech: "webhook · email · cron" },
      {
        title: "n8n · orchestration",
        tech: "routage + règles métier",
        items: ["Agent IA (OpenAI)", "Rate limit + retries", "Monitoring / logs"],
      },
      { title: "Action", tech: "facture · email · compte rendu · SAV" },
    ],
  },
  infra: {
    flow: [
      { title: "Internet", tech: "tunnel sécurisé (HTTPS)" },
      {
        title: "Reverse proxy",
        items: ["API TTS self-hosted", "Ollama — LLM local", "Services Docker"],
      },
      { title: "Supervision", tech: "monitoring + alertes · backups planifiés" },
      { title: "Serveur GPU (RTX)", tech: "production" },
    ],
  },
};
