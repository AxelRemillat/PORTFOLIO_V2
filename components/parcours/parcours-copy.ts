import type { Locale } from "@/lib/i18n/config";

/**
 * Textes d'interface de /parcours (hors frise : timeline-data, hors graphe :
 * skills-graph-data). Français MOT POUR MOT d'avant le bilingue ; l'anglais a
 * le même type. Station F suit le glossaire : « trained at Station F ».
 */
const FR = {
  meta: {
    title: "Parcours — Axel Remillat",
    description: "Profil, compétences et expériences d'Axel Remillat, ingénieur Data & IA — ESME Paris.",
  },
  hero: {
    hudRight: "PARCOURS // v2026.07",
    build: "Je construis des",
    words: ["systèmes RAG", "agents IA", "pipelines de données", "produits qui tournent"],
    subtitle: "Ingénieur IA & Data · ESME Paris · Alternant en startup EdTech (Station F)",
    proof: "Voir les preuves →",
    vega: "Poser une question à VEGA",
  },
  intro: {
    label: "01 // QUI SUIS-JE",
    text: "Ingénieur Data & IA en formation à l'ESME Paris, profil hybride tech × produit × business. Cofondateur de RISE, startup EdTech primée 3 fois et incubée. Alternant Ingénieur IA Agentic dans une startup EdTech à Station F. Je construis des produits IA complets — de l'idée au déploiement — et tout ce que je fais se teste en vrai sur ce site. Aujourd'hui, j'accompagne aussi PME et startups en freelance : mise en production et fiabilisation de systèmes IA.",
  },
  skills: {
    label: "02 // COMPÉTENCES",
    title: "Compétences",
    hint: "Cliquez sur un outil pour zoomer — ou attrapez-le et tirez.",
    details: (label: string) => `Détails : ${label}`,
    close: "Fermer",
    usedWith: "Souvent utilisé avec",
  },
  timeline: {
    label: "03 // PARCOURS",
    title: "Parcours",
  },
  closing: {
    label: "04 // FORMATION",
    question: "On travaille ensemble ?",
    call: "Réserver un appel →",
    cv: "Télécharger mon CV (PDF)",
  },
};

export type ParcoursCopy = typeof FR;

const EN: ParcoursCopy = {
  meta: {
    title: "About — Axel Remillat",
    description: "Profile, skills and experience of Axel Remillat, Data & AI engineer — ESME Paris.",
  },
  hero: {
    hudRight: "ABOUT // v2026.07",
    build: "I build",
    words: ["RAG systems", "AI agents", "data pipelines", "products that actually run"],
    subtitle: "AI & Data Engineer · ESME Paris · Trained at Station F (EdTech work-study)",
    proof: "See the proof →",
    vega: "Ask VEGA a question",
  },
  intro: {
    label: "01 // WHO I AM",
    text: "Data & AI engineering student at ESME Paris, with a hybrid tech × product × business profile. Co-founder of RISE, an award-winning EdTech startup (3 prizes) that went through an incubator. Work-study Agentic AI engineer at an EdTech startup, trained at Station F. I build complete AI products — from idea to deployment — and everything I make can be tested for real on this site. I also help small businesses and startups as a freelancer: taking AI systems to production and making them reliable.",
  },
  skills: {
    label: "02 // SKILLS",
    title: "Skills",
    hint: "Click a tool to zoom in — or grab it and pull.",
    details: (label: string) => `Details: ${label}`,
    close: "Close",
    usedWith: "Often used with",
  },
  timeline: {
    label: "03 // BACKGROUND",
    title: "Background",
  },
  closing: {
    label: "04 // EDUCATION",
    question: "Shall we work together?",
    call: "Book a call →",
    cv: "Download my résumé (PDF, in French)",
  },
};

export const parcoursCopy = (locale: Locale): ParcoursCopy => (locale === "en" ? EN : FR);
