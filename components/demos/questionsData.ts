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
    ],
  },
  {
    id: "projets",
    label: "Les projets",
    questions: [
      "Parle-moi de RISE",
      "C'est quoi SEACO ?",
      "Tes automatisations N8N",
      "Explique ton CV interactif RAG",
    ],
  },
  {
    id: "vega",
    label: "VEGA (toi)",
    questions: [
      "Qui es-tu ?",
      "Comment as-tu été construite ?",
      "Tu tournes sur quel modèle ?",
    ],
  },
  {
    id: "site",
    label: "Le site",
    questions: ["Comment naviguer ici ?", "Pourquoi ce design spatial ?"],
  },
  {
    id: "fun",
    label: "Pour le fun",
    questions: ["Teste tes limites", "T'as de l'humour ?", "Ton truc préféré chez Axel ?"],
  },
];

// Ticker du bas = simple amorce : 3 questions max, piochées dans le catalogue
// ci-dessus (pas de doublon de contenu en dur).
const byId = (id: string) => QUESTION_CATEGORIES.find((c) => c.id === id)!;
export const TICKER_QUESTIONS: string[] = [
  byId("vega").questions[0], // "Qui es-tu ?"
  byId("projets").questions[0], // "Parle-moi de RISE"
  byId("fun").questions[0], // "Teste tes limites"
];
