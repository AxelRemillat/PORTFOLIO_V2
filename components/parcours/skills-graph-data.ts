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

// Positions initiales (homes) regroupées par quadrant → territoires séparés.
// La cohésion de catégorie (graph-physics) renforce le regroupement à l'usage.
export const NODES: GNode[] = [
  // Data & IA — quadrant HAUT-GAUCHE
  { id:"python",   label:"Python",      cat:"Data & IA",      x:0.18, y:0.10 },
  { id:"fastapi",  label:"FastAPI",     cat:"Data & IA",      x:0.30, y:0.15 },
  { id:"openai",   label:"OpenAI API",  cat:"Data & IA",      x:0.10, y:0.20 },
  { id:"supabase", label:"Supabase",    cat:"Data & IA",      x:0.23, y:0.26 },
  { id:"sql",      label:"SQL",         cat:"Data & IA",      x:0.06, y:0.31 },
  { id:"pgvector", label:"pgvector",    cat:"Data & IA",      x:0.31, y:0.33 },
  { id:"whisper",  label:"Whisper",     cat:"Data & IA",      x:0.16, y:0.38 },
  // Automatisation — quadrant HAUT-DROITE
  { id:"n8n",      label:"N8N",         cat:"Automatisation", x:0.72, y:0.12 },
  { id:"gcloud",   label:"Google Cloud",cat:"Automatisation", x:0.88, y:0.15 },
  { id:"make",     label:"Make",        cat:"Automatisation", x:0.82, y:0.26 },
  { id:"webhooks", label:"Webhooks",    cat:"Automatisation", x:0.70, y:0.33 },
  // Développement — quadrant BAS-GAUCHE
  { id:"three",    label:"Three.js / R3F", cat:"Développement", x:0.15, y:0.62 },
  { id:"react",    label:"React",       cat:"Développement",  x:0.26, y:0.66 },
  { id:"nextjs",   label:"Next.js",     cat:"Développement",  x:0.31, y:0.78 },
  { id:"ts",       label:"TypeScript",  cat:"Développement",  x:0.10, y:0.78 },
  { id:"git",      label:"Git / GitHub",cat:"Développement",  x:0.22, y:0.84 },
  { id:"tailwind", label:"Tailwind",    cat:"Développement",  x:0.16, y:0.92 },
  // Infrastructure — quadrant BAS-DROITE
  { id:"vertexai", label:"Vertex AI",   cat:"Infrastructure", x:0.70, y:0.58 },
  { id:"bigquery", label:"BigQuery",    cat:"Infrastructure", x:0.84, y:0.60 },
  { id:"vercel",   label:"Vercel",      cat:"Infrastructure", x:0.66, y:0.70 },
  { id:"docker",   label:"Docker",      cat:"Infrastructure", x:0.80, y:0.72 },
  { id:"cloudrun", label:"Cloud Run",   cat:"Infrastructure", x:0.92, y:0.72 },
  { id:"ollama",   label:"Ollama",      cat:"Infrastructure", x:0.86, y:0.84 },
  { id:"cloudflare",label:"Cloudflare", cat:"Infrastructure", x:0.72, y:0.86 },
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
  // Nouveaux nœuds (liens "related")
  {from:"ollama",     to:"docker"}, {from:"ollama",     to:"python"},
  {from:"git",        to:"vercel"}, {from:"git",        to:"nextjs"},
  {from:"three",      to:"react"},  {from:"three",      to:"nextjs"},
  {from:"cloudflare", to:"docker"}, {from:"cloudflare", to:"ollama"},
  {from:"whisper",    to:"openai"}, {from:"whisper",    to:"n8n"},
];

// Descriptions orientées USAGE RÉEL d'Axel (projets, startups, missions freelance).
// TODO Axel : enrichir (stages INOVALP/ROSI, usages pro)
export const SKILL_DETAILS: Record<string, { level: string; desc: string }> = {
  python:   { level: "Avancé",        desc: "Mon langage principal : scripts d'ingestion et d'embeddings (RAG), data et machine learning sur mes projets." },
  sql:      { level: "Avancé",        desc: "Requêtage et modélisation : PostgreSQL des projets (Supabase) et entrepôts analytiques (BigQuery)." },
  openai:   { level: "Avancé",        desc: "Réponses de VEGA (gpt-4o-mini) et embeddings (text-3-large) du RAG." },
  pgvector: { level: "Intermédiaire", desc: "Recherche par similarité des embeddings : moteur de VEGA et du CV interactif RAG." },
  fastapi:  { level: "Avancé",        desc: "Backend Python des APIs de démos IA du portfolio." },
  supabase: { level: "Avancé",        desc: "Stockage vectoriel (pgvector) des documents du RAG de VEGA." },
  n8n:      { level: "Avancé",        desc: "Orchestration d'agents IA et d'automatisations : chatbot SEACO, pipelines d'ingestion RAG, démos métiers testables à venir." },
  make:     { level: "Intermédiaire", desc: "Automatisations no-code, en complément de n8n, pour connecter des services." },
  webhooks: { level: "Avancé",        desc: "Déclencheurs temps réel entre services dans mes automatisations." },
  gcloud:   { level: "Intermédiaire", desc: "Écosystème cloud pour mes projets : BigQuery (data), Cloud Run (déploiement), Vertex AI (IA managée)." },
  react:    { level: "Avancé",        desc: "Interfaces du portfolio : orbe VEGA, graphe de compétences, pages projets." },
  nextjs:   { level: "Avancé",        desc: "Framework du site (App Router) : pages, routes API, rendu." },
  ts:       { level: "Avancé",        desc: "Typage de tout le front Next.js du portfolio." },
  tailwind: { level: "Avancé",        desc: "Styling de l'ensemble du site." },
  vercel:   { level: "Avancé",        desc: "Déploiement et hébergement du portfolio." },
  docker:   { level: "Intermédiaire", desc: "Conteneurisation de services pour des déploiements reproductibles." },
  bigquery: { level: "Intermédiaire", desc: "Entrepôt de données Google Cloud : requêtage analytique à grande échelle sur mes projets data." },
  vertexai: { level: "Intermédiaire", desc: "Plateforme ML de Google Cloud : entraînement et déploiement de modèles pour mes projets IA." },
  cloudrun: { level: "Intermédiaire", desc: "Déploiement serverless de conteneurs sur Google Cloud." },
  ollama:     { level: "Intermédiaire", desc: "Serveur d'inférence LLM local (Llama 3.2, Qwen) sur mon propre GPU : de l'IA hébergée chez soi, sans données envoyées au cloud." },
  git:        { level: "Avancé",        desc: "Versioning et collaboration : dépôts de tous mes projets, workflow branches/commits, déploiement continu." },
  three:      { level: "Intermédiaire", desc: "3D temps réel dans le navigateur (React Three Fiber) : l'orbe VEGA et ce graphe de compétences tournent avec." },
  cloudflare: { level: "Intermédiaire", desc: "Tunnel sécurisé, DNS et domaine : j'expose mon serveur maison en ligne sans ouvrir de ports." },
  whisper:    { level: "Intermédiaire", desc: "Transcription audio vers texte (speech-to-text) : le cœur de mon automatisation de comptes rendus de réunion." },
};
