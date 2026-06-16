export interface Project {
  slug: string;
  title: string;
  tagline: string;
  problem: string;
  solution: string;
  result: string;
  stack: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    slug: "rise",
    title: "RISE",
    tagline: "Plateforme de mobilité internationale étudiante",
    problem:
      "Les étudiants manquent d'informations fiables et personnalisées sur leurs destinations de semestre à l'international. Les données des bureaux des relations internationales (BRI) sont fragmentées et inaccessibles.",
    solution:
      "Application web donnant accès à des témoignages d'étudiants, infos détaillées sur les universités partenaires, hôtels et services locaux. Accès restreint aux étudiants des universités partenaires via un abonnement B2B.",
    result:
      "3 concours remportés : 1er ESME (500 €), 1er IONIS sur 400+ projets (3 000 €), 2e Galets du Rhône (1 000 €). Statut d'association officielle, brevet d'idée déposé, béta en cours de déploiement. Intégration à l'incubateur ESME.",
    stack: ["React", "Firebase", "Figma", "TypeScript", "GitHub"],
    featured: true,
  },
  {
    slug: "seaco",
    title: "SEACO — Pipeline RAG",
    tagline: "Moteur de recherche documentaire IA sur corpus métier",
    problem:
      "[À compléter — description du problème SEACO]",
    solution:
      "Pipeline RAG hybride complet : ingestion de documents, découpe en chunks, génération d'embeddings text-embedding-3-large (1536 dim), stockage pgvector Supabase, retrieval par similarité cosinus, génération de réponses contextuelles avec GPT-4o-mini.",
    result:
      "Pipeline fonctionnel en production. Architecture réutilisée comme base technique de la démo RAG de ce portfolio.",
    stack: ["Python", "Supabase", "pgvector", "OpenAI", "FastAPI"],
    featured: true,
  },
  {
    slug: "n8n-automations",
    title: "Automatisations N8N",
    tagline: "Agents IA et workflows automatisés pour PME",
    problem:
      "[À compléter — cas d'usage client]",
    solution:
      "Workflows N8N intégrant des agents IA (OpenAI) pour automatiser des processus métier répétitifs : traitement d'emails, extraction de données, notifications conditionnelles.",
    result:
      "[À compléter — gains mesurés]",
    stack: ["N8N", "OpenAI", "Webhooks", "Python", "Make"],
    featured: false,
  },
  {
    slug: "rag-chatbot",
    title: "CV Interactif RAG",
    tagline: "Chatbot qui répond sur mon profil et mes projets en temps réel",
    problem:
      "Un CV PDF reste passif — un recruteur ou un prospect ne peut pas explorer activement un profil, poser des questions précises ou vérifier une compétence en quelques secondes.",
    solution:
      "Chatbot RAG live intégré au portfolio : question → embedding (text-embedding-3-large) → retrieval dans Supabase pgvector → réponse GPT-4o-mini contextuelle. Rate-limité pour contrôler les coûts.",
    result:
      "Démo live sur ce site. Stack RAG complète déployée sur Vercel + Supabase, avec garde-fou tokens/jour et rate-limit par IP.",
    stack: ["Next.js", "Supabase", "pgvector", "OpenAI", "Vercel"],
    demoUrl: "/demos",
    featured: true,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
