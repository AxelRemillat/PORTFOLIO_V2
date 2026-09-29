// ── Catalogue centralisé des questions guidées (facile à éditer) ────────────
// Édite ici : ajoute/retire des catégories ou des questions. Tout le menu
// (panneau gauche + drawer mobile) et le ticker du bas lisent cet objet.

export interface QuestionCategory {
  id: string;
  label: string;
  questions: string[];
}

export const QUESTION_CATEGORIES: QuestionCategory[] = [
  {
    id: "metier",
    label: "Votre métier",
    questions: [
      "Je suis menuisier, vous pouvez faire quoi pour moi ?",
      "Je suis dans le BTP, qu'est-ce qui s'automatise ?",
      "Je suis boulanger avec plusieurs boutiques",
      "Je dirige un négoce de matériaux",
      "Et pour une agence immobilière ?",
      "Et dans le transport ?",
      "Je vends des services aux entreprises",
      "Quelles tâches peut-on automatiser en premier ?",
      "Vous pouvez préparer mes devis ?",
      "Vous pouvez trier mes emails ?",
    ],
  },
  {
    id: "prix",
    label: "Prix et délais",
    questions: [
      "Combien ça coûte ?",
      "C'est long à mettre en place ?",
      "Comment se passe une mission ?",
      "C'est quoi l'audit ?",
      "Qu'est-ce que le suivi mensuel ?",
      "Et après la livraison ?",
      "Et si ça ne marche pas ?",
      "Comment on démarre ?",
      "Il faut s'engager sur la durée ?",
      "Faites-moi un devis pour 3 fenêtres",
    ],
  },
  {
    id: "donnees",
    label: "Données et outils",
    questions: [
      "Mes données sont en sécurité ?",
      "Ça marche avec mon logiciel de devis ?",
      "Ça marche avec Excel ou Google Sheets ?",
      "Ça marche avec Gmail ou Outlook ?",
      "Et avec mon CRM ?",
      "Qui valide avant l'envoi au client ?",
      "Vous signez un accord de confidentialité ?",
      "Où vont mes données ?",
      "Il faut changer d'outils ?",
      "Mon équipe devra être formée ?",
    ],
  },
  {
    id: "demos",
    label: "Démos",
    questions: [
      "Qu'est-ce que je peux tester sur le site ?",
      "Montrez-moi la démo pour mon métier",
      "C'est quoi l'agent devis ?",
      "Quelles sont les 5 automatisations ?",
      "Vous avez déjà fait ça pour qui ?",
      "Comment fonctionne la lecture de factures ?",
      "Comment marche le compte rendu de réunion ?",
      "C'est quoi le classement des contacts ?",
      "Qu'est-ce que l'assistant service client ?",
      "Les démos utilisent de vraies données ?",
    ],
  },
  {
    id: "axel",
    label: "Axel et VEGA",
    questions: [
      "Qui est Axel ?",
      "Pourquoi travailler avec un indépendant ?",
      "Comment contacter Axel ?",
      "Comment réserver 15 minutes ?",
      "Quels projets a-t-il menés ?",
      "C'était quoi RISE ?",
      "Qui êtes-vous, VEGA ?",
      "Comment fonctionnez-vous ?",
      "Vous pouvez vous tromper ?",
      "Pourquoi le nom VEGA ?",
    ],
  },
];

// Ticker du bas : TOUTES les questions du catalogue (5 × 10 = 50). Le ticker
// les affiche en ordre aléatoire (mélange côté client dans FloatingInput).
export const ALL_QUESTIONS: string[] = QUESTION_CATEGORIES.flatMap((c) => c.questions);
