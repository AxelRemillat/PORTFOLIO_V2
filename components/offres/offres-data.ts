// Données des offres freelance « mise en production IA » + mini-FAQ.
// Source unique consommée par components/offres/*. Textes en clair (pas de JSX)
// pour éviter l'échappement des apostrophes.

export interface Offer {
  num: string;        // "01"
  name: string;       // "Pré-Vol"
  kind: string;       // "Audit express"
  pitch: string;
  price: string;
  priceNote: string;  // "forfait", "selon périmètre", "2 jours"
  meta?: string;      // délai / engagement
  itemsLabel: string; // "Livrables" | "Inclus"
  items: string[];
  accent: string;
}

export const OFFERS: Offer[] = [
  {
    num: "01",
    name: "Pré-Vol",
    kind: "Audit express",
    pitch: "Votre système IA au banc d'essai avant le décollage.",
    price: "À partir de 490 €",
    priceNote: "forfait",
    meta: "Délai : 1 semaine",
    itemsLabel: "Livrables",
    items: [
      "Revue d'architecture, de code et d'infra",
      "Tests de robustesse",
      "Rapport priorisé de quick wins",
      "Restitution d'1h",
    ],
    accent: "#f97316",
  },
  {
    num: "02",
    name: "Mise en Orbite",
    kind: "Déploiement production",
    pitch: "Votre RAG, agent ou automatisation déployé proprement — et qui le reste.",
    price: "1 900 à 4 900 €",
    priceNote: "selon périmètre",
    itemsLabel: "Livrables",
    items: [
      "Conteneurisation (Docker)",
      "Pipeline de déploiement (CI/CD)",
      "Monitoring et alerting",
      "Journalisation traçable",
      "Documentation et passation",
    ],
    accent: "#10b981",
  },
  {
    num: "03",
    name: "Contrôle de Mission",
    kind: "Run mensuel",
    pitch: "Je veille sur votre IA pendant que vous dirigez votre entreprise.",
    price: "À partir de 690 €/mois",
    priceNote: "2 jours",
    meta: "Sans engagement au-delà du mois en cours",
    itemsLabel: "Inclus",
    items: [
      "Surveillance continue",
      "Maintenance",
      "Évaluations qualité",
      "Mises à jour de modèles",
      "Rapport mensuel",
    ],
    accent: "#a855f7",
  },
];

export interface Faq {
  q: string;
  a: string;
}

export const FAQ: Faq[] = [
  {
    q: "Pourquoi un alternant ?",
    a: "Parce que les preuves sont testables directement sur ce site, que les tarifs de lancement sont imbattables, et que ma disponibilité (1 à 2 jours par semaine) est cadrée à l'avance. Vous jugez sur pièces, pas sur un CV.",
  },
  {
    q: "Comment on démarre ?",
    a: "Un appel de 30 minutes gratuit pour cadrer le besoin, puis une proposition écrite (périmètre, prix, livrable). Vous validez, on lance.",
  },
  {
    q: "Quels outils ?",
    a: "Docker, N8N, OpenAI/Ollama, Supabase, GCP et des outils de monitoring. Le détail technique complet est sur la page Parcours.",
  },
];
