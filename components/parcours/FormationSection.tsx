"use client";

import ScrollReveal from "./ScrollReveal";

// Carte formation + bloc CTA final.
export default function FormationSection() {
  return (
    <section style={{ padding: "12vh 6vw 18vh", maxWidth: "820px", margin: "0 auto" }}>
      <ScrollReveal>
        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "0.75rem",
            padding: "2rem",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--color-orange)",
              margin: "0 0 0.75rem",
            }}
          >
            FORMATION
          </p>
          <p style={{ margin: "0 0 0.25rem", fontWeight: 700, fontSize: "1.25rem", color: "var(--color-text)" }}>
            ESME Paris — Diplôme d&apos;ingénieur
          </p>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--color-muted)" }}>
            Spécialité Big Data / IA / Marketing · 2022 → 2027
          </p>
          <p style={{ margin: "1.25rem 0 0", fontSize: "0.8rem", fontStyle: "italic", color: "#475569" }}>
            Certifications à venir
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div style={{ textAlign: "center", marginTop: "10vh" }}>
          <p
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              fontWeight: 700,
              color: "var(--color-text)",
              marginBottom: "2rem",
            }}
          >
            Une question ? Un projet ?
          </p>
          <a href="/contact" className="parcours-cta">
            Me contacter →
          </a>
        </div>
      </ScrollReveal>
    </section>
  );
}
