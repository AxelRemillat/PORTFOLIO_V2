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
      "Où en est ton alternance ?",
      "Tes objectifs pro ?",
      "Pourquoi l'IA et la data ?",
      "C'est quoi ta stack technique ?",
      "Qu'est-ce qui différencie Axel d'un autre ingé IA ?",
      "Ses expériences passées ?",
      "Comment le contacter ?",
      "Ses passions en dehors du code ?",
    ],
  },
  {
    id: "projets",
    label: "Les projets",
    questions: [
      "Présente-moi les projets du portfolio",
      "C'est quoi RISE ?",
      "C'est quoi SEACO ?",
      "C'est quoi les automatisations N8N ?",
      "Comment fonctionne le CV interactif RAG ?",
      "Quel projet est le plus abouti ?",
      "Quelles technos derrière chaque projet ?",
      "Le plus gros défi technique rencontré ?",
      "Je peux tester les projets moi-même ?",
      "C'est quoi le prochain projet ?",
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
    id: "site",
    label: "Le site",
    questions: [
      "Comment ce site a été construit ?",
      "Quelle est la stack du site ?",
      "Pourquoi le thème espace / Petit Prince ?",
      "C'est quoi le mini-jeu 3D ?",
      "Comment les modèles 3D sont intégrés ?",
      "Quel rôle l'IA a joué dans le dev ?",
      "Combien coûte l'infra ?",
      "Le site est-il open source ?",
      "Les prochaines évolutions ?",
      "Quelle page je devrais visiter en premier ?",
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
      "Vends-moi ce portfolio comme un commercial",
      "Un fait surprenant sur l'IA ?",
    ],
  },
];

// Ticker du bas : TOUTES les questions du catalogue (5 × 10 = 50). Le ticker
// les affiche en ordre aléatoire (mélange côté client dans FloatingInput).
export const ALL_QUESTIONS: string[] = QUESTION_CATEGORIES.flatMap((c) => c.questions);
