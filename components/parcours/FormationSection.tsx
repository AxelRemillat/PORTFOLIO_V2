"use client";

import ScrollReveal from "./ScrollReveal";
import VegaBridge from "./VegaBridge";

// Pont vers VEGA + bloc CTA final. (La carte formation a été retirée :
// l'info est déjà dans la timeline au-dessus.)
export default function FormationSection() {
  return (
    <section style={{ padding: "4vh 6vw 18vh", maxWidth: "820px", margin: "0 auto" }}>
      <VegaBridge />

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
