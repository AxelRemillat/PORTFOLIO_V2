"use client";

import { useScrollReveal } from "@/components/parcours/ScrollReveal";
import SectionLabel from "@/components/parcours/SectionLabel";
import StatCounter, { PROOF_STATS } from "@/components/ui/StatCounter";

// Preuves : mêmes compteurs animés que /parcours (logique et valeurs partagées
// dans components/ui/StatCounter.tsx).
export default function HomeStats() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="preuves" style={{ padding: "10vh 6vw", maxWidth: "1100px", margin: "0 auto" }}>
      <div ref={ref}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <SectionLabel>04 // PREUVES</SectionLabel>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "clamp(2rem, 6vw, 5rem)",
          }}
        >
          {PROOF_STATS.map((s) => (
            <StatCounter key={s.label} stat={s} run={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}
