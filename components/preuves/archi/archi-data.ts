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
  agent: {
    flow: [
      { title: "Demande client", tech: "texte libre entrant" },
      { title: "Agent · gpt-4o-mini", tech: "boucle function-calling (max 6 tours)", items: ["Raisonnement", "Choix des outils", "Décision faisable / non"] },
      { title: "Outils métier", tech: "fonctions déterministes", items: ["rechercher_produits", "verifier_stock", "verifier_livraison", "calculer_devis"] },
      { title: "Livrable", tech: "devis (remises · TVA) + email + créneau" },
    ],
    guards: ["Prix/stock/délai = outils uniquement", "Rate-limit 3/min · 10/j", "Kill-switch · honeypot · timeout 40s"],
  },
  pipeline: {
    flow: [
      { title: "Ingestion", tech: "dataset Leads SaaS · ~300 lignes · 11 colonnes" },
      { title: "Nettoyage & validation", tech: "imputation · clamp des aberrants · déduplication par id" },
      {
        title: "Feature engineering",
        tech: "one-hot (taille · source) · ratios · normalisations",
        items: ["10 features dérivées"],
      },
      { title: "Régression logistique", tech: "poids fixés hors-ligne → proba = 1 / (1 + e^−z)" },
      { title: "Prédictions & explicabilité", tech: "chaud / tiède / froid + features décisives" },
    ],
    guards: ["100 % client-side — pas d'API, pas de secret", "Déterministe · gratuit · instantané"],
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
