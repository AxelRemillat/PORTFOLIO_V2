import type { Locale } from "@/lib/i18n/config";
import { DEMO_PAGES_EN } from "./demo-pages.en";

// Textes des pages de démo (/agent, /automatisations) et des blocs communs
// (bascule entre démos, « Et chez vous ? ») : un fichier par langue, même type.
export interface DemoPagesText {
  switchAria: string;
  switchAgent: string;
  switchAuto: string;
  agent: { title: string; description: string; kicker: string; h1: string; lead: string; ctaSubject: string };
  auto: { title: string; description: string; kicker: string; h1: string; lead: string };
  cta: { aria: string; title: string; text: string; book: string; describe: string };
}

export const DEMO_PAGES_FR: DemoPagesText = {
  switchAria: "Démos",
  switchAgent: "Agent devis",
  switchAuto: "Automatisations (tri, factures, SAV…)",
  agent: {
    title: "Agent devis — testez sur votre métier | Axel Remillat",
    description:
      "Choisissez votre métier (menuiserie, BTP, négoce, boulangerie-traiteur, services), envoyez une demande client : l'agent prépare le devis HT/TVA/TTC, les questions à poser et l'email de réponse.",
    kicker: "Démo testable // agent devis",
    h1: "Une demande client, un devis prêt à envoyer",
    lead: "Choisissez votre métier et lancez une demande type. L'agent cherche dans le catalogue, chiffre, liste ce qu'il faut demander au client et rédige la réponse.",
    ctaSubject: "Démo agent devis : je voudrais la même chose avec mon catalogue",
  },
  auto: {
    title: "Démos d'automatisation pour PME — Axel Remillat",
    description:
      "Testez en direct des automatisations pour PME : tri des emails, comptes rendus, fichier clients et doublons, factures, service client adapté à votre métier.",
    kicker: "Démos testables // automatisations",
    h1: "Testez les automatisations",
    lead: "Des tâches répétitives de PME, traitées en quelques secondes. Choisissez une démo, lancez un exemple ou essayez avec le vôtre.",
  },
  cta: {
    aria: "Et chez vous ?",
    title: "Et chez vous ?",
    text: "La même chose, avec vos documents, vos prix et vos outils. On regarde votre cas en 15 minutes, sans engagement.",
    book: "Réserver 15 min",
    describe: "Me décrire votre besoin",
  },
};

export const demoPages = (locale: Locale): DemoPagesText => (locale === "en" ? DEMO_PAGES_EN : DEMO_PAGES_FR);
