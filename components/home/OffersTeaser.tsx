"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import ScrollReveal from "@/components/parcours/ScrollReveal";
import SectionLabel from "@/components/parcours/SectionLabel";

// Teaser des 3 offres (détail complet sur /offres). Mini-cards nom + une ligne
// + prix « à partir de ». Reveal au scroll, hover sobre (reduced-motion OK).
const TEASERS = [
  { name: "Pré-Vol", line: "Votre système IA au banc d'essai.", price: "dès 490 €", accent: "#f97316" },
  { name: "Mise en Orbite", line: "Du POC à la production.", price: "1 900 à 4 900 €", accent: "#10b981" },
  { name: "Contrôle de Mission", line: "Votre IA sous surveillance.", price: "dès 690 €/mois", accent: "#a855f7" },
];

export default function OffersTeaser() {
  return (
    <section id="offres" style={{ padding: "8vh 6vw", maxWidth: "1100px", margin: "0 auto" }}>
      <ScrollReveal>
        <SectionLabel>02 // OFFRES</SectionLabel>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--color-text)", margin: "0 0 0.5rem" }}>
          Trois offres, un cap : la production
        </h2>
        <p style={{ fontSize: "0.9rem", color: "#7a7a92", margin: "0 0 2rem", fontFamily: "var(--font-mono)" }}>
          Un périmètre, un prix, un livrable.
        </p>
      </ScrollReveal>

      <div
        style={{
          display: "grid",
          gap: "1.25rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        {TEASERS.map((o, i) => (
          <ScrollReveal key={o.name} delay={i * 0.08}>
            <Link
              href="/offres"
              className="flex flex-col h-full no-underline transition-transform duration-200 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${o.accent}33`,
                borderRadius: 14,
                padding: "1.5rem",
                "--tw-shadow-color": o.accent,
              } as CSSProperties}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 700, color: o.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {`0${i + 1}`}
              </span>
              <h3 style={{ margin: "0.6rem 0 0.4rem", fontSize: "1.15rem", fontWeight: 800, color: "#fff" }}>
                {o.name}
              </h3>
              <p style={{ margin: "0 0 1rem", fontSize: "0.85rem", lineHeight: 1.5, color: "rgba(255,255,255,0.62)" }}>
                {o.line}
              </p>
              <span style={{ marginTop: "auto", fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 700, color: o.accent }}>
                {o.price}
              </span>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
