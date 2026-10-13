import type { Locale } from "@/lib/i18n/config";

/**
 * Textes de la page /offres (hors offres et FAQ, qui vivent dans offres-data).
 * Français MOT POUR MOT d'avant le bilingue ; l'anglais a le même type.
 * Module pur : utilisable par les composants client de la page.
 */
const FR = {
  meta: {
    title: "Offres et tarifs — Axel Remillat | Automatisation pour PME",
    description:
      "Audit dès 290 €, automatisation clé en main dès 1 200 €, suivi dès 190 €/mois, mise en production IA dès 1 900 €. Prix fixés avant de commencer.",
  },
  hero: {
    label: "01 // OFFRES",
    title: "Des offres claires, des résultats mesurables.",
    lead: "Pas de jargon, pas de surprise : un périmètre, un prix, un livrable.",
  },
  aiAct: {
    badge: "✓ Conformité AI Act — by design",
    text: "Chaque automatisation respecte le règlement européen sur l'IA : le niveau de risque est évalué, le fonctionnement documenté, et ce que fait l'IA reste traçable. Vous l'utilisez en règle, sans mauvaise surprise.",
    note: "Intégré « by design » — accompagnement technique aligné sur le règlement, pas une certification légale ni un conseil juridique.",
  },
  faq: { label: "02 // FAQ" },
  cta: {
    question: "Une tâche à automatiser ?",
    lead: "Un échange de 15 minutes, gratuit, pour regarder votre cas.",
    call: "Réserver 15 min",
    write: "Me décrire votre besoin",
    /** Sujet prérempli du formulaire de contact (paramètre `sujet`). */
    subject: "Offres : je voudrais un devis",
  },
};

export type OffresCopy = typeof FR;

const EN: OffresCopy = {
  meta: {
    title: "Services & pricing — Axel Remillat | Automation for small businesses",
    description:
      "Audit from €290, turnkey automation from €1,200, support from €190/month, AI to production from €1,900. Prices set before we start.",
  },
  hero: {
    label: "01 // SERVICES",
    title: "Clear services, measurable results.",
    lead: "No jargon, no surprises: one scope, one price, one deliverable.",
  },
  aiAct: {
    badge: "✓ EU AI Act compliance — by design",
    text: "Every automation follows the EU AI Act: the risk level is assessed, the way it works is documented, and what the AI does stays traceable. You use it by the book, with no nasty surprises.",
    note: "Built in “by design” — technical work aligned with the regulation, not a legal certification or legal advice.",
  },
  faq: { label: "02 // FAQ" },
  cta: {
    question: "Got a task to automate?",
    lead: "A free 15-minute call to look at your case.",
    call: "Book a 15-min call",
    write: "Describe what you need",
    subject: "Services: I'd like a quote",
  },
};

export const offresCopy = (locale: Locale): OffresCopy => (locale === "en" ? EN : FR);
