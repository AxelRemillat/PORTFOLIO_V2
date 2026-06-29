// Enriched per-project data used by the click-to-open detail modal on /projets.
// Keyed by the same slugs as `projects-data.ts`.

export interface ProjectModalDetail {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  color: string; // accent — matches the card theme accent
  metrics: { label: string; value: string }[];
  stack: string[];
  ctaLabel: string;
  ctaUrl: string;
  ctaExternal?: boolean;
}

export const PROJECT_MODALS: Record<string, ProjectModalDetail> = {
  "rag-chatbot": {
    slug: "rag-chatbot",
    title: "CV Interactif RAG",
    tagline: "Pose-moi n'importe quelle question — l'IA répond à ma place.",
    description:
      "Un chatbot connecté à ma base de données personnelle via RAG (Retrieval-Augmented Generation). Il connaît mes projets, mon parcours et mes compétences, et répond en temps réel avec ses sources.",
    color: "#ff6b35",
    metrics: [
      { label: "Modèle", value: "GPT-4o mini" },
      { label: "Latence moy.", value: "< 2s" },
      { label: "Base vectorielle", value: "pgvector" },
      { label: "Démo", value: "Live ✓" },
    ],
    stack: ["Next.js", "Supabase", "pgvector", "OpenAI", "Vercel"],
    ctaLabel: "🚀 Essayer la démo live",
    ctaUrl: "/demos",
  },
  rise: {
    slug: "rise",
    title: "RISE",
    tagline: "Simplifier la mobilité internationale pour les étudiants.",
    description:
      "Plateforme EdTech qui accompagne les étudiants dans leur mobilité internationale : recherche de programmes, témoignages, infos sur les universités partenaires et suivi administratif.",
    color: "#38bdf8",
    metrics: [
      { label: "Concours gagnés", value: "3" },
      { label: "Auth", value: "Firebase" },
      { label: "Statut", value: "Béta" },
      { label: "Incubateur", value: "ESME" },
    ],
    stack: ["React", "Firebase", "TypeScript", "Figma"],
    ctaLabel: "🌐 Ouvrir le site RISE",
    ctaUrl: "/projets/rise",
  },
  seaco: {
    slug: "seaco",
    title: "SEACO — Pipeline RAG",
    tagline: "Chercher dans des milliers de documents en langage naturel.",
    description:
      "Pipeline RAG complet pour l'analyse documentaire sur corpus métier : ingestion, vectorisation, recherche sémantique et génération de réponses sourcées via FastAPI.",
    color: "#a855f7",
    metrics: [
      { label: "Backend", value: "FastAPI" },
      { label: "Vectorisation", value: "pgvector" },
      { label: "Pipeline", value: "Complet" },
      { label: "Langage", value: "Python" },
    ],
    stack: ["Python", "FastAPI", "Supabase", "pgvector", "OpenAI"],
    ctaLabel: "📂 Voir le projet en détail",
    ctaUrl: "/projets/seaco",
  },
  "n8n-automations": {
    slug: "n8n-automations",
    title: "Automatisations N8N",
    tagline: "Des agents IA qui travaillent pendant que tu dors.",
    description:
      "Workflows d'automatisation intelligents pour PME : qualification de leads, réponses automatiques, extraction de données et agents IA connectés à des APIs externes.",
    color: "#10b981",
    metrics: [
      { label: "Outil", value: "N8N" },
      { label: "Intégrations", value: "10+" },
      { label: "IA", value: "OpenAI" },
      { label: "Webhooks", value: "✓" },
    ],
    stack: ["N8N", "OpenAI", "Webhooks", "Python", "Make"],
    ctaLabel: "📂 Voir le projet en détail",
    ctaUrl: "/projets/n8n-automations",
  },
  music: {
    slug: "music",
    title: "La Planète qui Chante",
    tagline: "Compose ta musique en plantant des instruments sur une planète.",
    description:
      "Mini-jeu musical 3D interactif. Chaque objet posé sur la planète déclenche un instrument — baobab, rose, renard… — et génère une musique procédurale unique.",
    color: "#a78bfa",
    metrics: [
      { label: "Instruments", value: "6" },
      { label: "Rendu", value: "WebGL" },
      { label: "Audio", value: "Web Audio" },
      { label: "Démo", value: "Live ✓" },
    ],
    stack: ["Three.js", "React Three Fiber", "Web Audio API", "Next.js"],
    ctaLabel: "🎵 Jouer maintenant",
    ctaUrl: "/projets/music",
  },
};
