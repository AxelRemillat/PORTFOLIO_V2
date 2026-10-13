"use client";

import { useLocale } from "@/lib/i18n/client";
import type { Locale } from "@/lib/i18n/config";
import { QUESTION_CATEGORIES as QUESTIONS_FR, type QuestionCategory } from "./questionsData";
import { QUESTION_CATEGORIES as QUESTIONS_EN } from "./questionsData.en";
import { VEGA_UI_EN } from "./vega-ui.en";

// Textes d'interface de la démo VEGA (/demos) : un objet par langue, même type.
// Les chaînes françaises reprennent MOT POUR MOT le texte d'avant l'anglais.
export interface VegaUi {
  /** Bandeau du HUD, au-dessus de l'orbe. */
  hudTitle: string;
  greeting: string;
  unavailable: string;
  error: string;
  thinking: string;
  /** Reconnaissance vocale (Web Speech API) et voix de repli du navigateur. */
  speechLang: string;
  input: { placeholder: string; aria: string; micStop: string; micStart: string; micListening: string; micTitle: string; send: string };
  history: {
    justNow: string;
    minutesAgo: (n: number) => string;
    hoursAgo: (n: number) => string;
    dateLocale: string;
    empty: string;
    newConversation: string;
    back: string;
    you: string;
    deleteAria: (title: string) => string;
  };
  drawer: { menuAria: string; questions: string; history: string; close: string };
  controls: { resume: string; pause: string; pauseTitle: string; deleteAria: string; deleteTitle: string; speedAria: (speed: number) => string; speedTitle: string };
  sound: { onAria: string; offAria: string; muteTitle: string; unmuteTitle: string };
  panels: { questions: string; history: string; open: string; close: string; openQuestions: string; openHistory: string };
  chezVous: { aria: string; title: string; book: string; describe: string; subject: string };
}

export const VEGA_UI_FR: VegaUi = {
  hudTitle: "VEGA — IA DE PRÉSENTATION // AXEL REMILLAT",
  greeting:
    "Bonjour, je suis VEGA, l'assistante d'Axel Remillat. Dites-moi votre métier : je vous explique ce qui peut être automatisé chez vous, comment ça se passe, et à partir de combien.",
  unavailable: "VEGA est momentanément indisponible. Réessaie.",
  error: "Erreur — VEGA est momentanément indisponible. Réessaie.",
  thinking: "recherche dans la base vectorielle",
  speechLang: "fr-FR",
  input: {
    placeholder: "Posez votre question…",
    aria: "Posez votre question à VEGA",
    micStop: "Arrêter la dictée",
    micStart: "Dicter la question au micro",
    micListening: "J'écoute… (clic pour arrêter)",
    micTitle: "Commande vocale",
    send: "Envoyer",
  },
  history: {
    justNow: "à l'instant",
    minutesAgo: (n) => `il y a ${n} min`,
    hoursAgo: (n) => `il y a ${n} h`,
    dateLocale: "fr-FR",
    empty: "Aucune conversation enregistrée.",
    newConversation: "+ Nouvelle conversation",
    back: "‹ Historique",
    you: "TOI",
    deleteAria: (title) => `Supprimer ${title}`,
  },
  drawer: { menuAria: "Menu VEGA", questions: "Questions", history: "Historique", close: "Fermer" },
  controls: {
    resume: "Reprendre",
    pause: "Mettre en pause",
    pauseTitle: "Pause",
    deleteAria: "Supprimer la conversation en cours",
    deleteTitle: "Supprimer",
    speedAria: (speed) => `Vitesse de lecture : ${speed}×. Cliquer pour changer.`,
    speedTitle: "Vitesse de lecture",
  },
  sound: {
    onAria: "Son activé — couper le son de VEGA",
    offAria: "Son coupé — activer le son de VEGA",
    muteTitle: "Couper le son",
    unmuteTitle: "Activer le son",
  },
  panels: { questions: "QUESTIONS", history: "HISTORIQUE", open: "Ouvrir", close: "Fermer", openQuestions: "Ouvrir les questions", openHistory: "Ouvrir l'historique" },
  chezVous: {
    aria: "Et chez vous ?",
    title: "Et chez vous ?",
    book: "Réserver 15 min",
    describe: "Me décrire votre besoin",
    subject: "Démo VEGA : un assistant comme celui-ci pour mon entreprise",
  },
};

export const vegaUi = (locale: Locale): VegaUi => (locale === "en" ? VEGA_UI_EN : VEGA_UI_FR);
export const vegaQuestions = (locale: Locale): QuestionCategory[] => (locale === "en" ? QUESTIONS_EN : QUESTIONS_FR);

/** Textes de la démo dans la langue de la page. */
export const useVegaUi = (): VegaUi => vegaUi(useLocale());
