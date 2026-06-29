"use client";

import { useRef } from "react";
import ScrollReveal, { useScrollReveal } from "./ScrollReveal";
import TimelineItem from "./TimelineItem";
import ParcoursSnake from "./ParcoursSnake";
import type { TimelineEvent } from "./TimelineItem";

const events: TimelineEvent[] = [
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
    period: "Oct. 2024 → Aujourd'hui · 1 an 9 mois",
    description: "Plateforme de mobilité internationale étudiante. Conception et développement (React, Firebase).",
    achievements: [
      "🥈 Concours IONIS 2025 — 2ème prix (3 000€)",
      "🥇 Galets du Rhône 2025 + Concours ESME — 1er prix (1 500€)",
    ],
    skills: ["React", "Firebase", "Gestion de projet"],
    current: true,
  },
  {
    year: "2025",
    type: "Formation",
    color: "blue",
    company: "Mapúa University — Philippines",
    role: "Échange international",
    period: "Août 2025 → Déc. 2025 · 5 mois",
    description:
      "Semestre académique en Informatique et systèmes d'information. Université classée dans le top 6% mondial (THE).",
    skills: ["Anglais", "Systèmes d'information"],
    current: false,
  },
  {
    year: "2025",
    type: "Projet",
    color: "muted",
    company: "N8N — Indépendant",
    role: "Ingénieur IA & Automatisation",
    period: "Sept. 2025 → Aujourd'hui · 10 mois",
    description: "Conception d'agents IA pour automatisation de tâches métiers. Intégration API OpenAI / LLM.",
    skills: ["N8N", "OpenAI API", "Automatisation"],
    current: true,
  },
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
    period: "Juil. 2026 → Aujourd'hui",
    description:
      "EdTech incubée à Station F. Systèmes IA agentiques et pipelines de données. Maître d'apprentissage : Ouriel Bettach (CTO).",
    skills: ["IA Agentic", "Data pipelines", "LLM"],
    current: true,
  },
];

function groupByYear(list: TimelineEvent[]) {
  const groups: { year: string; events: TimelineEvent[] }[] = [];
  for (const ev of list) {
    const g = groups.find((x) => x.year === ev.year);
    if (g) g.events.push(ev);
    else groups.push({ year: ev.year, events: [ev] });
  }
  return groups;
}

type RevealProps = { event: TimelineEvent; side: "left" | "right"; delay: number };

// Wrapper : un observer par item, transmet isVisible à la card.
function Reveal({ event, side, delay }: RevealProps) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref}>
      <TimelineItem event={event} side={side} isVisible={isVisible} delay={delay} />
    </div>
  );
}

export default function TimelineSection() {
  const groups = groupByYear(events);
  const containerRef = useRef<HTMLDivElement>(null);
  let sideIndex = 0;

  return (
    <section style={{ padding: "4rem clamp(1rem, 4vw, 3rem)", maxWidth: 900, margin: "0 auto" }}>
      <ScrollReveal>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#f97316", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.5rem" }}>
          EXPÉRIENCES + FORMATION
        </p>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--color-text)", margin: "0 0 2.5rem" }}>
          Parcours
        </h2>
      </ScrollReveal>

      <div ref={containerRef} className="timeline-track" style={{ overflow: "visible" }}>
        <ParcoursSnake containerRef={containerRef} />
        {groups.map((group, gi) => (
          <div
            key={`${group.year}-${gi}`}
            className="timeline-group"
            style={{ position: "relative", zIndex: 1, marginTop: gi === 0 ? 0 : "3rem", paddingTop: "3.5rem" }}
          >
            <div
              className="timeline-year-label"
              style={{ position: "relative", zIndex: 1, fontFamily: "var(--font-mono)", fontSize: 11, color: "#3a3a5c", textAlign: "center" }}
            >
              {group.year}
            </div>
            <div
              className="timeline-watermark"
              aria-hidden
              style={{
                position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                fontSize: "clamp(4rem, 10vw, 7rem)", fontWeight: 800, lineHeight: 1,
                color: "rgba(255,255,255,0.03)", letterSpacing: "-0.05em",
                pointerEvents: "none", userSelect: "none",
              }}
            >
              {group.year}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 2, position: "relative" }}>
              {group.events.map((ev, ei) => {
                const side: "left" | "right" = sideIndex % 2 === 0 ? "right" : "left";
                sideIndex++;
                return <Reveal key={`${ev.company}-${ev.period}`} event={ev} side={side} delay={ei * 0.08} />;
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
