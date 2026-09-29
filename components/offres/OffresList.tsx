"use client";

import type { CSSProperties } from "react";
import ScrollReveal from "@/components/parcours/ScrollReveal";
import { OFFERS } from "./offres-data";

// Les 4 offres en cards détaillées (2 × 2 sur grand écran). Reveal au scroll.
export default function OffresList() {
  return (
    <section style={{ padding: "2vh 6vw 4vh", maxWidth: "1150px", margin: "0 auto" }}>
      <style>{`
        .offres-grid {
          display: grid;
          gap: 1.5rem;
          align-items: stretch;
          grid-template-columns: repeat(2, 1fr);
        }
        /* Mobile : 1 colonne empilée */
        @media (max-width: 640px) { .offres-grid { grid-template-columns: 1fr; } }
      `}</style>
      <div className="offres-grid">
        {OFFERS.map((o, i) => (
          <ScrollReveal key={o.name} delay={i * 0.08}>
            <article
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${o.accent}33`,
                borderTop: `3px solid ${o.accent}`,
                borderRadius: 14,
                padding: "1.75rem",
              } as CSSProperties}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 700, color: o.accent, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {`${o.num} // ${o.kind}`}
              </span>
              <h2 style={{ margin: "0.7rem 0 0.5rem", fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>
                {o.name}
              </h2>
              <p style={{ margin: "0 0 1.25rem", fontSize: "0.9rem", lineHeight: 1.55, color: "rgba(255,255,255,0.66)" }}>
                {o.pitch}
              </p>

              <div style={{ margin: "0 0 1.25rem" }}>
                <span style={{ fontSize: "1.3rem", fontWeight: 800, color: o.accent }}>{o.price}</span>
                <span style={{ marginLeft: 8, fontSize: "0.8rem", color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
                  ({o.priceNote})
                </span>
              </div>

              <p style={{ margin: "0 0 0.6rem", fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-muted)" }}>
                {o.itemsLabel}
              </p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {o.items.map((it) => (
                  <li key={it} style={{ display: "flex", gap: "0.6rem", fontSize: "0.88rem", lineHeight: 1.45, color: "rgba(255,255,255,0.8)" }}>
                    <span style={{ color: o.accent, flexShrink: 0 }} aria-hidden>✓</span>
                    {it}
                  </li>
                ))}
              </ul>

              {o.meta && (
                <p style={{ marginTop: "auto", paddingTop: "1.25rem", fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--color-muted)" }}>
                  {o.meta}
                </p>
              )}
            </article>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
