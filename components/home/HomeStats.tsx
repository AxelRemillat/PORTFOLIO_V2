"use client";

import { useScrollReveal } from "@/components/parcours/ScrollReveal";
import SectionLabel from "@/components/parcours/SectionLabel";
import StatCounter, { type StatDef } from "@/components/ui/StatCounter";

// Chiffres de crédibilité freelance. Les valeurs numériques sont animées
// (StatCounter partagé) ; « 24/7 » s'affiche tel quel, sans compteur.
const STATS: StatDef[] = [
  { value: 3, label: "systèmes IA en production" },
  { value: 19, label: "technologies maîtrisées" },
  { value: 14, suffix: " mois", label: "d'alternance IA à Station F" },
];

export default function HomeStats() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="chiffres" style={{ padding: "10vh 6vw", maxWidth: "1100px", margin: "0 auto" }}>
      <div ref={ref}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <SectionLabel>05 // CHIFFRES</SectionLabel>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "clamp(2rem, 6vw, 5rem)",
          }}
        >
          {STATS.map((s) => (
            <StatCounter key={s.label} stat={s} run={isVisible} />
          ))}

          {/* « 24/7 » : affiché tel quel, sans compteur */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                color: "var(--color-orange)",
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              24/7
            </div>
            <div
              style={{
                marginTop: "0.75rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
                color: "var(--color-muted)",
              }}
            >
              démos accessibles en ligne
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
