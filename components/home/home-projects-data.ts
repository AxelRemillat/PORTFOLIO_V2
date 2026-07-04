// Thèmes des cards légères de la bande projets (/). Couleurs, badges et ordre
// = miroir des THEMES / ORDERED_SLUGS de app/projets/page.tsx — non importables
// directement : cette page 'use client' charge les modèles 3D (perf).
// Titres/taglines/liens viennent de lib/projects-data (source unique).

export interface HomeProjectTheme {
  slug: string;
  tag: string;    // badge court (= badge du THEME /projets)
  accent: string; // couleur d'accent du projet
  bg: string;     // gradient de fond de la card
}

export const HOME_PROJECT_THEMES: HomeProjectTheme[] = [
  {
    slug: "n8n-automations",
    tag: "Agents IA",
    accent: "#10b981",
    bg: "linear-gradient(135deg, #010a04 0%, #021508 50%, #033014 100%)",
  },
  {
    slug: "rise",
    tag: "Site en beta",
    accent: "#38bdf8",
    bg: "linear-gradient(120deg, #000814 0%, #001d3d 45%, #003566 100%)",
  },
  {
    slug: "seaco",
    tag: "En production",
    accent: "#a855f7",
    bg: "radial-gradient(ellipse at 60% 40%, #3d0f72 0%, #1c0540 45%, #080118 100%)",
  },
  {
    slug: "music",
    tag: "Jouable",
    accent: "#a78bfa",
    bg: "radial-gradient(ellipse at 28% 65%, #0e0025 0%, #060018 45%, #020008 100%)",
  },
  {
    slug: "rag-chatbot",
    tag: "Démo live",
    accent: "#ff6b35",
    bg: "linear-gradient(120deg, #1a0500 0%, #3d0e00 40%, #5a1500 100%)",
  },
];
