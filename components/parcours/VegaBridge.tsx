"use client";

import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

// Bandeau pont vers /demos : incite à interroger VEGA sur le parcours.
// Point orange pulsant = indicateur "online" (statique si reduced-motion).
export default function VegaBridge() {
  return (
    <ScrollReveal>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.25rem",
          flexWrap: "wrap",
          marginTop: "10vh",
          padding: "1.5rem 2rem",
          border: "1px solid rgba(249,115,22,0.25)",
          borderRadius: 12,
          background: "rgba(249,115,22,0.03)",
        }}
      >
        <p style={{ margin: 0, fontSize: "1rem", color: "var(--color-text)", lineHeight: 1.6 }}>
          Ce parcours en version interactive ?{" "}
          <span style={{ whiteSpace: "nowrap" }}>
            <span className="vega-online-dot" aria-hidden />
            <strong>VEGA</strong>
          </span>{" "}
          connaît tout — posez-lui vos questions.
        </p>
        <Link href="/demos" className="parcours-cta-outline">
          Parler à VEGA →
        </Link>
      </div>
    </ScrollReveal>
  );
}
