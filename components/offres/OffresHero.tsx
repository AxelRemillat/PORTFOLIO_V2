"use client";

import ScrollReveal from "@/components/parcours/ScrollReveal";
import SectionLabel from "@/components/parcours/SectionLabel";

// Hero court de /offres : label HUD, titre, sous-ligne. Reveal au scroll.
export default function OffresHero() {
  return (
    <section style={{ padding: "10vh 6vw 6vh", maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
      <ScrollReveal>
        <SectionLabel>01 // OFFRES</SectionLabel>
        <h1
          style={{
            fontSize: "clamp(2.25rem, 6vw, 4rem)",
            fontWeight: 800,
            color: "var(--color-text)",
            lineHeight: 1.05,
            margin: "0 0 1.25rem",
          }}
        >
          Des offres claires, des résultats mesurables.
        </h1>
        <p
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
            color: "var(--color-muted)",
            maxWidth: 620,
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Pas de jargon, pas de surprise : un périmètre, un prix, un livrable.
        </p>
      </ScrollReveal>
    </section>
  );
}
