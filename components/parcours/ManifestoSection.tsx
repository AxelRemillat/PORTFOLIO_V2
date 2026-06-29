"use client";

import ScrollReveal from "./ScrollReveal";

// Deux lignes typographiques massives qui se révèlent au scroll (delays décalés).
export default function ManifestoSection() {
  return (
    <section
      style={{ padding: "15vh 6vw", maxWidth: "1100px", margin: "0 auto" }}
    >
      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--color-border)",
          opacity: 0.4,
          marginBottom: "8vh",
        }}
      />

      <div
        style={{
          fontWeight: 700,
          lineHeight: 1.1,
          fontSize: "clamp(2rem, 5vw, 4rem)",
          color: "var(--color-text)",
        }}
      >
        <ScrollReveal direction="up" delay={0}>
          <p style={{ margin: 0 }}>Je construis des systèmes qui apprennent,</p>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.15}>
          <p style={{ margin: 0 }}>
            pas des{" "}
            <span
              style={{
                color: "var(--color-muted)",
                textDecoration: "line-through",
                textDecorationColor: "rgba(100,116,139,0.5)",
              }}
            >
              slides
            </span>{" "}
            qui s&apos;oublient.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
