// Offres freelance + FAQ. SOURCE UNIQUE : consommée par components/offres/*, la
// home (OffersTeaser) et les prompts de VEGA (app/api/chat, lib/ax-rag) via
// offersForPrompt(). Textes en clair (pas de JSX) pour éviter l'échappement.

import { CALENDAR_URL } from "@/lib/site-config";

export interface Offer {
  num: string;        // "01"
  name: string;       // "Audit automatisation"
  kind: string;       // sur-titre court
  pitch: string;      // une phrase, langage « patron »
  price: string;      // "À partir de 290 €"
  priceNote: string;  // "forfait", "par mois"…
  meta?: string;      // délai / engagement
  itemsLabel: string; // "Ce que vous obtenez" | "Inclus"
  items: string[];
  accent: string;
}

export const OFFERS: Offer[] = [
  {
    num: "01",
    name: "Audit automatisation",
    kind: "Pour commencer",
    pitch: "Une demi-journée pour repérer et chiffrer les 3 tâches à automatiser en premier.",
    price: "À partir de 290 €",
    priceNote: "forfait",
    meta: "Durée : ½ journée, sur place ou en visio",
    itemsLabel: "Ce que vous obtenez",
    items: [
      "Le tour de vos tâches répétitives, avec vous et votre équipe",
      "Le temps perdu chaque semaine, tâche par tâche",
      "Les 3 tâches à automatiser en premier, avec leur prix",
      "Un plan clair, sans engagement pour la suite",
    ],
    accent: "#f97316",
  },
  {
    num: "02",
    name: "Automatisation clé en main",
    kind: "Le plus demandé",
    pitch: "Un flux livré et testé en 2 à 3 semaines, branché sur vos outils.",
    price: "À partir de 1 200 €",
    priceNote: "par flux",
    meta: "Délai : 2 à 3 semaines",
    itemsLabel: "Ce que vous obtenez",
    items: [
      "Un essai sur vos vrais exemples avant de tout mettre en place",
      "Branché sur vos outils : messagerie, tableur, logiciel de devis ou de facturation",
      "Testé avec vous sur des cas réels avant la mise en route",
      "Une notice simple et une prise en main avec votre équipe",
    ],
    accent: "#10b981",
  },
  {
    num: "03",
    name: "Suivi & évolutions",
    kind: "Après la livraison",
    pitch: "Je surveille, je corrige et je fais évoluer vos automatisations.",
    price: "À partir de 190 €/mois",
    priceNote: "par mois",
    meta: "Sans engagement, arrêt possible chaque mois",
    itemsLabel: "Inclus",
    items: [
      "Je vérifie chaque jour que tout tourne",
      "Les corrections en cas de souci",
      "De petites évolutions : un nouveau cas, un nouveau modèle de document",
      "Un point de 15 minutes chaque mois",
    ],
    accent: "#a855f7",
  },
  {
    num: "04",
    name: "Mise en production IA",
    kind: "Vous avez déjà un prototype",
    pitch: "Pour les équipes qui ont déjà un prototype IA et veulent l'utiliser tous les jours, sans mauvaise surprise.",
    price: "À partir de 1 900 €",
    priceNote: "selon le projet",
    meta: "Délai : 2 à 4 semaines",
    itemsLabel: "Ce que vous obtenez",
    items: [
      "Votre prototype rendu fiable et stable au quotidien",
      "Une alerte dès que quelque chose se passe mal",
      "L'historique de ce que fait l'IA, pour vérifier et corriger",
      "La documentation et la passation à votre équipe",
    ],
    accent: "#06b6d4",
  },
];

/** Lignes de prix pour les prompts de VEGA : une seule vérité, celle de /offres. */
export function offersForPrompt(): string {
  return OFFERS.map((o) => `    • ${o.name} : ${o.price.toLowerCase()} (${o.priceNote}) — ${o.pitch}`).join("\n");
}

/** Noms des offres, pour les phrases du type « les offres X, Y et Z ». */
export const OFFER_NAMES = OFFERS.map((o) => o.name).join(", ");

export interface Faq {
  q: string;
  a: string;
  link?: { label: string; href: string };
}

export const FAQ: Faq[] = [
  {
    q: "Combien ça coûte ?",
    a: "L'audit démarre à 290 €, une automatisation clé en main à 1 200 €, le suivi à 190 € par mois. Le prix exact est écrit noir sur blanc avant de commencer : pas de dépassement surprise.",
  },
  {
    q: "En combien de temps c'est en place ?",
    a: "Comptez 2 à 3 semaines pour une automatisation : quelques jours pour un essai sur vos exemples, puis la mise en place et les tests avec vous.",
  },
  {
    q: "Est-ce que ça marche avec mes outils ?",
    a: "Dans la plupart des cas, oui : votre messagerie (Gmail, Outlook), vos tableurs (Excel, Google Sheets), votre logiciel de devis ou de facturation s'il permet un export ou une connexion. On le vérifie ensemble pendant l'échange de 15 minutes.",
  },
  {
    q: "Et mes données, elles vont où ?",
    a: "Elles restent les vôtres. Je n'utilise que ce qui sert à l'automatisation, rien n'est revendu ni réutilisé ailleurs, et je peux signer un accord de confidentialité avant de commencer. Pour les tâches sensibles, l'IA propose et c'est vous qui validez avant tout envoi.",
  },
  {
    q: "Et après la livraison ?",
    a: "L'automatisation est à vous, avec une notice simple. Vous pouvez continuer seul, ou prendre le suivi mensuel, sans engagement, pour les corrections et les petites évolutions.",
  },
  {
    q: "Comment on démarre ?",
    a: "Un échange de 15 minutes, gratuit : vous me décrivez la tâche qui vous fait perdre du temps. Je reviens avec une proposition écrite (ce qui est fait, le prix, le délai). Vous validez, on lance.",
    link: { label: "Réserver 15 min →", href: CALENDAR_URL },
  },
];
