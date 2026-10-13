import type { TimelineEvent } from "./TimelineItem";

// Timeline for /en/parcours: same entries, dates, amounts and colors as
// timeline-data.ts. Station F follows the glossary: the startup is incubated
// there — never "works at Station F".
export const TIMELINE_EVENTS_EN: TimelineEvent[] = [
  {
    year: "2022",
    type: "Education",
    color: "blue",
    company: "ESME Paris",
    role: "Preparatory classes — Math Sup / Math Spé / Engineering year 1",
    period: "Sept. 2022 → June 2025",
    description: "Broad multidisciplinary engineering program, with integrated Math Sup and Math Spé years.",
    skills: ["Python", "Project management"],
    current: false,
  },
  {
    year: "2023",
    type: "Internship",
    color: "muted",
    company: "INOVALP",
    role: "Engineering intern",
    period: "July 2023 → Aug. 2023 · 2 months",
    description:
      "Maker of high-end pellet stoves. Mechanical optimization and software improvements for the Hoben range.",
    skills: ["Python", "Embedded development"],
    current: false,
  },
  {
    year: "2024",
    type: "Internship",
    color: "muted",
    company: "ROSI Alpes",
    role: "Engineering intern",
    period: "July 2024 → Aug. 2024 · 2 months",
    description:
      "Company specialized in advanced recycling of photovoltaic silicon. Internal software development — inventory management.",
    skills: ["Python", "Software development", "Data management"],
    current: false,
  },
  {
    year: "2024",
    type: "Startup",
    color: "orange",
    company: "RISE",
    role: "Co-founder & Tech Lead",
    period: "Oct. 2024 → June 2026 · Completed",
    description:
      "A platform that helps students choose their study-abroad exchange. Co-founder & Tech Lead — product, development (React, Firebase), pitches to juries. Non-profit status, ESME incubator.",
    achievements: [
      { medal: "🥇", title: "IONIS 2025 competition — 1st prize out of 400+ projects", reward: "€3,000" },
      { medal: "🥇", title: "ESME Advent Calendar 2025 — 1st prize", reward: "€500" },
      { medal: "🥈", title: "Galets du Rhône 2025 (Geneva) — 2nd place", reward: "€1,000" },
    ],
    skills: ["React", "Firebase", "Project management"],
    current: false,
  },
  {
    year: "2025",
    type: "Education",
    color: "blue",
    company: "Mapúa University — Philippines",
    role: "International exchange",
    period: "Aug. 2025 → Dec. 2025 · 5 months",
    description:
      "Academic semester in computer science and information systems, taught 100% in English. A university ranked in the world's top 6% — Times Higher Education World University Rankings 2024, one of only 4 ranked Philippine universities.",
    skills: ["English", "Information systems"],
    current: false,
  },
  {
    year: "2026",
    type: "Education",
    color: "blue",
    company: "ESME Paris",
    role: "Big Data & AI Engineering — year 2 specialization",
    period: "Jan. 2026 → Sept. 2027",
    description: "Specialization in Big Data, AI and Digital Marketing at ESME Paris (Ivry-sur-Seine).",
    skills: ["Big Data", "AI", "Digital Marketing"],
    current: true,
  },
  {
    year: "2026",
    type: "Work-study",
    color: "orange",
    company: "EdTech startup — Station F",
    role: "Agentic AI & Data Management Engineer",
    period: "July 2026 → Sept. 2027 · 14 months",
    description:
      "EdTech startup incubated at Station F. Agentic AI systems and data pipelines.",
    skills: ["Agentic AI", "Data pipelines", "LLM"],
    current: true,
  },
];
