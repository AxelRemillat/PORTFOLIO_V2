// Données du graphe de compétences (/parcours). Extrait de SkillsSection pour
// garder chaque fichier sous 200 lignes.

export const CAT_COLOR = {
  "Data & IA":      "#f97316",
  "Automatisation": "#4ade80",
  "Développement":  "#a78bfa",
  "Infrastructure": "#67e8f9",
} as const;
export type Cat = keyof typeof CAT_COLOR;

export interface GNode { id: string; label: string; cat: Cat; x: number; y: number }
export interface GEdge { from: string; to: string }

// Dimensions du viewBox. x, y des nœuds = fractions 0–1.
export const W = 900, H = 440;

export const NODES: GNode[] = [
  // Data & IA — cluster gauche
  { id:"python",   label:"Python",      cat:"Data & IA",      x:0.17, y:0.25 },
  { id:"sql",      label:"SQL",         cat:"Data & IA",      x:0.09, y:0.50 },
  { id:"openai",   label:"OpenAI API",  cat:"Data & IA",      x:0.23, y:0.52 },
  { id:"pgvector", label:"pgvector",    cat:"Data & IA",      x:0.28, y:0.74 },
  { id:"fastapi",  label:"FastAPI",     cat:"Data & IA",      x:0.36, y:0.35 },
  { id:"supabase", label:"Supabase",    cat:"Data & IA",      x:0.34, y:0.60 },
  // Automatisation — cluster haut-droite
  { id:"n8n",      label:"N8N",         cat:"Automatisation", x:0.60, y:0.16 },
  { id:"make",     label:"Make",        cat:"Automatisation", x:0.72, y:0.26 },
  { id:"webhooks", label:"Webhooks",    cat:"Automatisation", x:0.65, y:0.40 },
  { id:"gcloud",   label:"Google Cloud",cat:"Automatisation", x:0.80, y:0.20 },
  // Développement — cluster bas-centre
  { id:"react",    label:"React",       cat:"Développement",  x:0.40, y:0.78 },
  { id:"nextjs",   label:"Next.js",     cat:"Développement",  x:0.50, y:0.90 },
  { id:"ts",       label:"TypeScript",  cat:"Développement",  x:0.30, y:0.90 },
  { id:"tailwind", label:"Tailwind",    cat:"Développement",  x:0.44, y:0.98 },
  // Infrastructure — cluster bas-droite
  { id:"vercel",   label:"Vercel",      cat:"Infrastructure", x:0.68, y:0.72 },
  { id:"docker",   label:"Docker",      cat:"Infrastructure", x:0.78, y:0.84 },
  { id:"bigquery", label:"BigQuery",    cat:"Infrastructure", x:0.82, y:0.60 },
  { id:"cloudrun", label:"Cloud Run",   cat:"Infrastructure", x:0.89, y:0.76 },
  { id:"vertexai", label:"Vertex AI",   cat:"Infrastructure", x:0.86, y:0.48 },
];

export const EDGES: GEdge[] = [
  // Data & IA internal
  {from:"python",  to:"openai"},  {from:"python",  to:"fastapi"},
  {from:"python",  to:"sql"},     {from:"openai",  to:"pgvector"},
  {from:"fastapi", to:"supabase"},{from:"supabase",to:"pgvector"},
  // Automatisation internal
  {from:"n8n",    to:"webhooks"}, {from:"n8n",    to:"make"},
  {from:"make",   to:"webhooks"}, {from:"gcloud", to:"n8n"},
  // Développement internal
  {from:"ts",    to:"react"},     {from:"react",  to:"nextjs"},
  {from:"nextjs",to:"tailwind"},
  // Infrastructure internal
  {from:"docker",  to:"cloudrun"},{from:"bigquery",to:"vertexai"},
  {from:"gcloud",  to:"vertexai"},
  // Cross-cluster — chaînes d'écosystème
  {from:"openai", to:"n8n"},      {from:"fastapi",to:"react"},
  {from:"nextjs", to:"vercel"},   {from:"sql",    to:"bigquery"},
  {from:"supabase",to:"vercel"},  {from:"gcloud", to:"bigquery"},
];

// Descriptions orientées USAGE RÉEL d'Axel (cursus ESME + projets du portfolio).
// TODO Axel : enrichir (stages INOVALP/ROSI, usages pro)
export const SKILL_DETAILS: Record<string, { level: string; desc: string }> = {
  python:   { level: "Avancé",        desc: "Langage principal : scripts d'ingestion et d'embeddings des systèmes RAG du portfolio, data mining et machine learning dans le cadre de la majeure Big Data ESME." },
  sql:      { level: "Avancé",        desc: "Requêtage et modélisation de données — bases PostgreSQL des projets (Supabase) et entrepôts analytiques (BigQuery)." },
  openai:   { level: "Avancé",        desc: "Génération des réponses de VEGA (gpt-4o-mini) et embeddings (text-3-large) pour le RAG." },
  pgvector: { level: "Intermédiaire", desc: "Recherche par similarité des embeddings — moteur de VEGA et du CV interactif RAG." },
  fastapi:  { level: "Avancé",        desc: "Backend Python des APIs de démos IA du portfolio." },
  supabase: { level: "Avancé",        desc: "Stockage vectoriel (pgvector) des documents du portfolio pour le RAG de VEGA." },
  n8n:      { level: "Avancé",        desc: "Orchestration d'agents IA et d'automatisations : chatbot SEACO (webhook, mémoire conversationnelle, actions), pipelines d'ingestion RAG, démos métiers testables à venir sur le portfolio." },
  make:     { level: "Intermédiaire", desc: "Automatisations no-code complémentaires à N8N pour connecter des services entre eux." },
  webhooks: { level: "Avancé",        desc: "Déclencheurs temps réel entre services dans mes automatisations." },
  gcloud:   { level: "Intermédiaire", desc: "Écosystème cloud de la spécialisation Big Data ESME (architecture et services cloud) : BigQuery, Cloud Run, Vertex AI." },
  react:    { level: "Avancé",        desc: "Interfaces du portfolio : orbe VEGA, graphe de compétences, pages projets." },
  nextjs:   { level: "Avancé",        desc: "Framework du site (App Router) : pages, routes API, rendu." },
  ts:       { level: "Avancé",        desc: "Typage de l'ensemble du front Next.js du portfolio." },
  tailwind: { level: "Avancé",        desc: "Styling de l'ensemble du site." },
  vercel:   { level: "Avancé",        desc: "Déploiement et hébergement du portfolio." },
  docker:   { level: "Intermédiaire", desc: "Conteneurisation de services pour des déploiements reproductibles." },
  bigquery: { level: "Intermédiaire", desc: "Entrepôt de données Google Cloud — requêtage analytique à grande échelle, étudié et pratiqué dans le cursus Big Data." },
  vertexai: { level: "Intermédiaire", desc: "Plateforme ML de Google Cloud — entraînement et déploiement de modèles, pratiquée dans le cursus ESME." },
  cloudrun: { level: "Intermédiaire", desc: "Déploiement serverless de conteneurs sur Google Cloud." },
};
