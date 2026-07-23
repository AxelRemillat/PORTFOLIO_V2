import type { TimelineEvent } from "./TimelineItem";

// Données de la frise (/parcours). Extrait de TimelineSection pour garder
// chaque fichier sous 150 lignes.
export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: "2022",
    type: "Formation",
    color: "blue",
    company: "ESME Paris",
    role: "Classe Préparatoire — Math Sup / Math Spé / Ingé 1",
    period: "Sept. 2022 → Juin 2025",
    description: "Formation pluridisciplinaire généraliste. Maths Sup puis Maths Spé intégrées.",
    skills: ["Python", "Gestion de projet"],
    current: false,
  },
  {
    year: "2023",
    type: "Stage",
    color: "muted",
    company: "INOVALP",
    role: "Ingénieur stagiaire",
    period: "Juil. 2023 → Août 2023 · 2 mois",
    description:
      "Fabricant de poêles à granulés haut de gamme. Optimisation mécanique et amélioration logicielle de la gamme Hoben.",
    skills: ["Python", "Développement embarqué"],
    current: false,
  },
  {
    year: "2024",
    type: "Stage",
    color: "muted",
    company: "ROSI Alpes",
    role: "Ingénieur stagiaire",
    period: "Juil. 2024 → Août 2024 · 2 mois",
    description:
      "Entreprise spécialisée dans le recyclage avancé de silicium photovoltaïque. Développement logiciel interne — gestion des stocks.",
    skills: ["Python", "Gestion des stocks"],
    current: false,
  },
  {
    year: "2024",
    type: "Startup",
    color: "orange",
    company: "RISE",
    role: "Co-fondateur & Lead Tech",
    period: "Oct. 2024 → Juin 2026 · Terminé",
    description:
      "Plateforme d'aide au choix de mobilité internationale étudiante. Cofondateur & Lead Tech — produit, développement (React, Firebase), pitchs jurys. Statut d'association, incubateur ESME.",
    achievements: [
      "🥇 Concours IONIS 2025 — 1er prix sur 400+ projets (3 000 €)",
      "🥇 Concours ESME Calendrier de l'Avent 2025 — 1er prix (500 €)",
      "🥈 Galets du Rhône 2025 (Genève) — 2e place (1 000 €)",
    ],
    skills: ["React", "Firebase", "Gestion de projet"],
    current: false,
  },
  {
    year: "2025",
    type: "Formation",
    color: "blue",
    company: "Mapúa University — Philippines",
    role: "Échange international",
    period: "Août 2025 → Déc. 2025 · 5 mois",
    description:
      "Semestre académique en informatique et systèmes d'information, 100 % en anglais. Université classée top 6 % mondial — Times Higher Education World University Rankings 2024, l'une des 4 universités philippines classées.",
    skills: ["Anglais", "Systèmes d'information"],
    current: false,
  },
  // L'entrée "N8N — Indépendant" a été retirée : l'activité freelance est
  // désormais documentée sur /preuves (doublon évité).
  {
    year: "2026",
    type: "Formation",
    color: "blue",
    company: "ESME Paris",
    role: "Ingénieur Big Data & IA — Spécialisation Ingé2",
    period: "Janv. 2026 → Sept. 2027",
    description: "Spécialisation Big Data, IA et Marketing Digital à l'ESME Paris (Ivry-sur-Seine).",
    skills: ["Big Data", "IA", "Marketing Digital"],
    current: true,
  },
  {
    year: "2026",
    type: "Alternance",
    color: "orange",
    company: "Andra Learning — Station F",
    role: "Ingénieur IA Agentic & Gestion de données",
    period: "Juil. 2026 → Sept. 2027 · 14 mois",
    description:
      "EdTech incubée à Station F. Systèmes IA agentiques et pipelines de données. Maître d'apprentissage : Ouriel Bettach (CTO).",
    skills: ["IA Agentic", "Data pipelines", "LLM"],
    current: true,
  },
];
