"use client";

import { useRef } from "react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { projects } from "@/lib/projects-data";
import ScrollReveal from "@/components/parcours/ScrollReveal";
import SectionLabel from "@/components/parcours/SectionLabel";
import { HOME_PROJECT_THEMES } from "./home-projects-data";

// Bande projets en scroll horizontal avec snap. Cards légères SANS canvas 3D :
// gradient + glow de la couleur du projet. Indicateur de progression mis à
// jour impérativement (pas de re-render au scroll).
export default function ProjectsStrip() {
  const fill = useRef<HTMLDivElement>(null);

  const cards = HOME_PROJECT_THEMES.flatMap((t) => {
    const p = projects.find((pr) => pr.slug === t.slug);
    return p ? [{ t, p }] : [];
  });

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? el.scrollLeft / max : 0;
    if (fill.current) fill.current.style.width = `${(8 + p * 92).toFixed(1)}%`;
  };

  return (
    <section id="projets" style={{ padding: "8vh 0" }}>
      <ScrollReveal>
        {/* même retrait latéral que la bande (6vw) pour aligner titre et cards */}
        <div style={{ padding: "0 6vw" }}>
          <SectionLabel>02 // PROJETS</SectionLabel>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--color-text)", margin: "0 0 0.5rem" }}>
            Ce que j&apos;ai construit
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#7a7a92", margin: "0 0 2rem", fontFamily: "var(--font-mono)" }}>
            Faites défiler — chaque card mène au projet.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="home-strip" onScroll={onScroll}>
          {cards.map(({ t, p }) => (
            <Link
              key={t.slug}
              href={p.directUrl ?? `/projets/${p.slug}`}
              className="home-strip-card"
              style={{
                background: t.bg,
                border: `1px solid ${t.accent}44`,
                "--hp-accent": t.accent,
                "--hp-glow": `${t.accent}55`,
              } as CSSProperties}
            >
              <span
                style={{
                  alignSelf: "flex-start",
                  fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 700,
                  color: t.accent, border: `1px solid ${t.accent}55`,
                  background: `${t.accent}18`, borderRadius: 999, padding: "0.25rem 0.7rem",
                }}
              >
                {t.tag}
              </span>
              <h3 style={{ margin: "1.1rem 0 0.4rem", fontSize: "1.25rem", fontWeight: 800, color: "#fff" }}>
                {p.title}
              </h3>
              <p style={{ margin: 0, fontSize: "0.85rem", lineHeight: 1.55, color: "rgba(255,255,255,0.62)" }}>
                {p.tagline}
              </p>
              <span
                className="hsc-arrow"
                style={{ marginTop: "auto", alignSelf: "flex-end", color: t.accent, fontSize: "1.2rem", paddingTop: "1rem" }}
              >
                →
              </span>
            </Link>
          ))}
        </div>
        {/* Indicateur de progression discret */}
        <div className="home-strip-track" aria-hidden>
          <div ref={fill} className="home-strip-fill" />
        </div>
      </ScrollReveal>
    </section>
  );
}
