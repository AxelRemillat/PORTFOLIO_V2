/**
 * Textes d'INTERFACE en français — la référence. `en.ts` doit avoir exactement
 * les mêmes clés : tsc le vérifie (type `Messages`), `npm run i18n:check` aussi.
 *
 * Les contenus longs (offres, projets, données de démo) n'ont rien à faire ici :
 * ils vivent dans un fichier jumeau `xxx-data.en.ts` à côté de `xxx-data.ts`.
 *
 * RÈGLE : ces chaînes reprennent mot pour mot le français existant. Le français
 * ne doit pas bouger d'un caractère avec l'arrivée de l'anglais.
 */
export const fr = {
  meta: {
    siteTitle: "Axel Remillat — Ingénieur Data & IA",
    siteDescription:
      "Portfolio & lab de démos d'Axel Remillat. Projets Data & IA testables en vrai : chatbot RAG, automatisations N8N, pipelines ML.",
    ogSuffix: "portfolio & lab de démos.",
    tagline: "Automatisation & IA pour PME",
  },
  nav: {
    demos: "Démos",
    offers: "Offres",
    projects: "Projets",
    journey: "Parcours",
    contact: "Contact",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
  },
  footer: {
    legal: "Mentions légales",
    offers: "Offres",
    projects: "Projets",
    journey: "Parcours",
    contact: "Contact",
    signature: "Ingénieur IA · Mise en production",
  },
  switcher: {
    label: "Langue du site",
    toFrench: "Version française",
    toEnglish: "English version",
  },
  notFound: {
    metaTitle: "Page introuvable — Axel Remillat",
    kicker: "404 // Page introuvable",
    title: "Cette page n'existe pas (ou plus).",
    text: "Le lien est peut-être ancien. Repartez de l'accueil, ou testez directement mes démos.",
    home: "Retour à l'accueil",
    demos: "Voir les démos",
  },
} as const;

/** Mêmes clés que `fr`, valeurs libres : c'est le contrat de toute autre langue. */
type Widen<T> = { readonly [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };
export type Messages = Widen<typeof fr>;
