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
    id: "axel",
    label: "Axel",
    questions: [
      "Quel est ton parcours ?",
      "Tes compétences en data/IA ?",
      "C'est quoi ton alternance chez Andra ?",
      "Pourquoi te faire confiance ?",
      "Qu'est-ce qui différencie Axel d'un autre ingé IA ?",
      "C'est quoi ta stack technique ?",
      "Tu fais du freelance en plus de l'alternance ?",
      "Ses expériences passées ?",
      "Comment le contacter ?",
      "Ses passions en dehors du code ?",
    ],
  },
  {
    id: "offres",
    label: "Les offres",
    questions: [
      "Quelles sont tes offres ?",
      "C'est quoi le Diagnostic ?",
      "C'est quoi la Mise en production ?",
      "C'est quoi le Suivi mensuel ?",
      "Combien ça coûte ?",
      "Comment on démarre ?",
      "T'es dispo combien de jours par semaine ?",
      "C'est quoi cette histoire d'AI Act ?",
      "Pourquoi toi plutôt qu'une agence ?",
      "Tu peux déployer notre chatbot ?",
    ],
  },
  {
    id: "preuves",
    label: "Les preuves",
    questions: [
      "C'est quoi les preuves ?",
      "Comment fonctionne ton pipeline RAG ?",
      "C'est quoi les automatisations N8N ?",
      "C'est quoi l'infra self-hosted ?",
      "Je peux tester quoi concrètement ?",
      "Quelles technos derrière chaque preuve ?",
      "C'est quoi la page Ops ?",
      "Le plus gros défi technique ?",
      "Et RISE, c'était quoi ?",
      "La prochaine preuve en préparation ?",
    ],
  },
  {
    id: "vega",
    label: "VEGA (toi)",
    questions: [
      "Qui es-tu, VEGA ?",
      "Comment tu fonctionnes techniquement ?",
      "C'est quoi le RAG qui t'alimente ?",
      "Quel modèle d'IA tourne derrière toi ?",
      "Comment ta voix est générée ?",
      "Comment ton orbe 3D est animée ?",
      "Tu as une mémoire ?",
      "Combien tu coûtes à faire tourner ?",
      "Pourquoi tu t'appelles VEGA ?",
      "Quelles sont tes limites ?",
    ],
  },
  {
    id: "fun",
    label: "Pour le fun",
    questions: [
      "Raconte-moi une blague d'IA",
      "Que penses-tu des humains ?",
      "Explique le RAG comme si j'avais 5 ans",
      "Fais le pitch d'Axel en 10 secondes",
      "Écris un haïku sur la data",
      "Que penses-tu de ChatGPT ?",
      "C'est quoi le Petit Prince pour toi ?",
      "Si tu étais humaine, tu ferais quoi ?",
      "Vends-moi une mission avec Axel comme un commercial",
      "Un fait surprenant sur l'IA ?",
    ],
  },
];

// Ticker du bas : TOUTES les questions du catalogue (5 × 10 = 50). Le ticker
// les affiche en ordre aléatoire (mélange côté client dans FloatingInput).
export const ALL_QUESTIONS: string[] = QUESTION_CATEGORIES.flatMap((c) => c.questions);
