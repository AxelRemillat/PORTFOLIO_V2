"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import ScrollReveal from "@/components/parcours/ScrollReveal";
import SectionLabel from "@/components/parcours/SectionLabel";

// Teaser des 3 preuves (page /preuves créée séparément). Cards colorées
// (orange / vert émeraude / violet), reveal au scroll, hover sobre.
const PROOFS = [
  {
    tag: "RAG",
    accent: "#f97316",
    bg: "linear-gradient(120deg, #1a0500 0%, #3d0e00 40%, #5a1500 100%)",
    title: "VEGA — Assistant RAG en production",
    line: "L'IA de ce site répond sur mon parcours — sourcée, monitorée, en ligne.",
  },
  {
    tag: "Automatisation",
    accent: "#10b981",
    bg: "linear-gradient(135deg, #010a04 0%, #021508 50%, #033014 100%)",
    title: "Automatisations N8N testables",
    line: "Des workflows réels que vous déclenchez vous-même, en direct.",
  },
  {
    tag: "Infra",
    accent: "#a855f7",
    bg: "radial-gradient(ellipse at 60% 40%, #3d0f72 0%, #1c0540 45%, #080118 100%)",
    title: "Infrastructure IA self-hosted",
    line: "Modèles hébergés, conteneurisés et supervisés — sans dépendance forcée au cloud.",
  },
];

export default function ProjectsStrip() {
  return (
    <section id="preuves" style={{ padding: "8vh 6vw", maxWidth: "1100px", margin: "0 auto" }}>
      <ScrollReveal>
        <SectionLabel>03 // PREUVES</SectionLabel>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--color-text)", margin: "0 0 0.5rem" }}>
          Des preuves, pas des promesses
        </h2>
        <p style={{ fontSize: "0.9rem", color: "#7a7a92", margin: "0 0 2rem", fontFamily: "var(--font-mono)" }}>
          Trois systèmes que vous pouvez tester en vrai.
        </p>
      </ScrollReveal>

      <div
        style={{
          display: "grid",
          gap: "1.25rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        {PROOFS.map((p, i) => (
          <ScrollReveal key={p.title} delay={i * 0.08}>
            <Link
              href="/preuves"
              className="flex flex-col h-full no-underline transition-transform duration-200 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              style={{
                background: p.bg,
                border: `1px solid ${p.accent}44`,
                borderRadius: 14,
                padding: "1.5rem",
              } as CSSProperties}
            >
              <span
                style={{
                  alignSelf: "flex-start",
                  fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 700,
                  color: p.accent, border: `1px solid ${p.accent}55`,
                  background: `${p.accent}18`, borderRadius: 999, padding: "0.25rem 0.7rem",
                }}
              >
                {p.tag}
              </span>
              <h3 style={{ margin: "1.1rem 0 0.4rem", fontSize: "1.2rem", fontWeight: 800, color: "#fff" }}>
                {p.title}
              </h3>
              <p style={{ margin: 0, fontSize: "0.85rem", lineHeight: 1.55, color: "rgba(255,255,255,0.62)" }}>
                {p.line}
              </p>
              <span style={{ marginTop: "auto", alignSelf: "flex-end", color: p.accent, fontSize: "1.2rem", paddingTop: "1rem" }}>
                →
              </span>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
