import type { Messages } from "./fr";

/**
 * Interface strings in English. Written for a native reader, not translated
 * word for word: international English, US spelling, same tone and arguments
 * as the French. Vocabulary: messages/GLOSSARY.md.
 *
 * Typed as `Messages`: a missing or extra key is a compile error.
 */
export const en: Messages = {
  meta: {
    siteTitle: "Axel Remillat — Data & AI Engineer",
    siteDescription:
      "Axel Remillat's portfolio and live demo lab. Data & AI projects you can actually try: RAG chatbot, n8n automations, ML pipelines.",
    ogSuffix: "portfolio & live demo lab.",
    tagline: "Automation & AI for small businesses",
  },
  nav: {
    demos: "Live demos",
    offers: "Services",
    projects: "Projects",
    journey: "About",
    contact: "Contact",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  footer: {
    legal: "Legal notice",
  },
  switcher: {
    label: "Site language",
    toFrench: "Version française",
    toEnglish: "English version",
  },
  notFound: {
    metaTitle: "Page not found — Axel Remillat",
    kicker: "404 // Page not found",
    title: "This page doesn't exist (anymore).",
    text: "The link may be out of date. Head back to the homepage, or go straight to the live demos.",
    home: "Back to the homepage",
    demos: "See the live demos",
  },
};
