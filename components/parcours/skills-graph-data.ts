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

// Descriptions orientées USAGE RÉEL d'Axel. Les [à confirmer] sont des placeholders
// volontaires à compléter — ne pas inventer.
export const SKILL_DETAILS: Record<string, { level: string; desc: string }> = {
  python:   { level: "Avancé",        desc: "Scripts d'ingestion de données et d'embeddings pour mes systèmes RAG. [usage SEACO/data à confirmer]" },
  sql:      { level: "Avancé",        desc: "Requêtes et structuration des données de mes projets. [à confirmer]" },
  openai:   { level: "Avancé",        desc: "Génération des réponses de VEGA (gpt-4o-mini) et embeddings (text-3-large) pour le RAG." },
  pgvector: { level: "Intermédiaire", desc: "Recherche par similarité des embeddings — moteur de VEGA et du CV interactif RAG." },
  fastapi:  { level: "Avancé",        desc: "Backend des APIs de mes démos IA. [projet précis à confirmer]" },
  supabase: { level: "Avancé",        desc: "Stockage vectoriel (pgvector) des documents du portfolio pour le RAG de VEGA." },
  n8n:      { level: "Avancé",        desc: "Automatisation de mes workflows. [exemples concrets à confirmer]" },
  make:     { level: "Intermédiaire", desc: "Automatisations no-code complémentaires. [à confirmer]" },
  webhooks: { level: "Avancé",        desc: "Déclencheurs temps réel entre services dans mes automatisations." },
  gcloud:   { level: "Intermédiaire", desc: "[usage projet SEACO/data à confirmer]" },
  react:    { level: "Avancé",        desc: "Interfaces du portfolio : orbe VEGA, graphe de compétences, pages projets." },
  nextjs:   { level: "Avancé",        desc: "Framework du site (App Router) : pages, routes API, rendu." },
  ts:       { level: "Avancé",        desc: "Typage de l'ensemble du front Next.js du portfolio." },
  tailwind: { level: "Avancé",        desc: "Styling de l'ensemble du site." },
  vercel:   { level: "Avancé",        desc: "Déploiement et hébergement du portfolio." },
  docker:   { level: "Intermédiaire", desc: "[conteneurisation — usage à confirmer]" },
  bigquery: { level: "Intermédiaire", desc: "[entrepôt data — usage à confirmer]" },
  vertexai: { level: "Intermédiaire", desc: "[usage à confirmer]" },
  cloudrun: { level: "Intermédiaire", desc: "[déploiement conteneurisé — à confirmer]" },
};
