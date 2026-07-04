"use client";

import ScrollReveal from "./ScrollReveal";
import SectionLabel from "./SectionLabel";

// CTA final orienté recruteur : CV en principal (plein), contact en secondaire
// (outline). Le pont VEGA vit désormais en fin de timeline (TimelineSection).
export default function FormationSection() {
  return (
    <section style={{ padding: "10vh 6vw 18vh", maxWidth: "820px", margin: "0 auto" }}>
      <ScrollReveal delay={0.1}>
        <SectionLabel>04 // FORMATION</SectionLabel>

        <div style={{ textAlign: "center", marginTop: "4vh" }}>
          <p
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              fontWeight: 700,
              color: "var(--color-text)",
              marginBottom: "2rem",
            }}
          >
            On travaille ensemble ?
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <a href="/cv-axel-remillat.pdf" download className="parcours-cta">
              Télécharger mon CV (PDF)
            </a>
            <a href="/contact" className="parcours-cta-outline">
              Me contacter →
            </a>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
