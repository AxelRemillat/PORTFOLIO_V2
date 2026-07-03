// Cards "Hors écran" (/parcours). Photo optionnelle : public/parcours/photos/<slug>.jpg
// (fallback = gradient si absente — géré dans HorsEcranSection).

export interface HorsEcranItem {
  slug: string;
  emoji: string;
  title: string;
  text: string;
  grad: string; // fallback si pas de photo
}

export const HORS_ECRAN: HorsEcranItem[] = [
  {
    slug: "renard",
    emoji: "🦊",
    title: "Le renard du Petit Prince",
    text: "Enfant, j'ai joué le renard dans une adaptation théâtrale du Petit Prince. L'univers de ce site vient de là.",
    grad: "linear-gradient(135deg, rgba(249,115,22,0.14), rgba(76,29,149,0.18))",
  },
  {
    slug: "tennis",
    emoji: "🎾",
    title: "Tennis",
    text: "Beaucoup de tennis, souvent contre mon père. Il court encore bien.",
    grad: "linear-gradient(135deg, rgba(74,222,128,0.12), rgba(8,47,73,0.25))",
  },
  {
    slug: "cuisine",
    emoji: "🍳",
    title: "Cuisine",
    text: "Formé par ma grand-mère et mon père. La gastronomie est une affaire de famille — et je défends honorablement l'héritage.",
    grad: "linear-gradient(135deg, rgba(251,191,36,0.12), rgba(120,53,15,0.22))",
  },
  {
    slug: "ferme",
    emoji: "🐎",
    title: "La ferme",
    text: "J'ai grandi entouré de chevaux, chiens, chats, poules et moutons. Mon grand-père a un passé de cowboy. Véridique.",
    grad: "linear-gradient(135deg, rgba(163,230,53,0.1), rgba(30,58,20,0.3))",
  },
  {
    slug: "batterie",
    emoji: "🥁",
    title: "Batterie",
    text: "Famille de musiciens — chant et guitare pour eux, batterie pour moi.",
    grad: "linear-gradient(135deg, rgba(167,139,250,0.14), rgba(24,24,50,0.3))",
  },
  {
    slug: "cinema",
    emoji: "🎬",
    title: "Cinéma & littérature",
    text: "Passionné de cinéma, élevé dans une famille d'enseignants de lettres. Ça laisse des traces.",
    grad: "linear-gradient(135deg, rgba(103,232,249,0.1), rgba(15,23,42,0.35))",
  },
];
