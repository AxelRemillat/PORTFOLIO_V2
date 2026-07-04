"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ScrollReveal from "@/components/parcours/ScrollReveal";
import SectionLabel from "@/components/parcours/SectionLabel";
import { ALL_QUESTIONS } from "@/components/demos/questionsData";

// Teaser VEGA : 3 questions piochées dans le catalogue. Rendu SSR déterministe
// (3 premières) puis mélange post-montage — évite tout mismatch d'hydratation.
export default function VegaTeaser() {
  const [questions, setQuestions] = useState(() => ALL_QUESTIONS.slice(0, 3));

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5);
      setQuestions(shuffled.slice(0, 3));
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="vega" style={{ padding: "10vh 6vw", maxWidth: "820px", margin: "0 auto" }}>
      <ScrollReveal>
        <SectionLabel>03 // VEGA</SectionLabel>
        <div
          style={{
            border: "1px solid rgba(249,115,22,0.25)",
            borderRadius: 12,
            background: "rgba(249,115,22,0.03)",
            padding: "2rem",
          }}
        >
          <p style={{ margin: "0 0 1.25rem", fontWeight: 700, fontSize: "1.15rem", color: "var(--color-text)" }}>
            <span className="vega-online-dot" aria-hidden />
            VEGA — l&apos;IA de ce site
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1.5rem" }}>
            {questions.map((q) => (
              <Link
                key={q}
                href="/demos"
                className="vega-teaser-q"
                style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.875rem",
                  color: "#94a3b8", textDecoration: "none", padding: "0.45rem 0.6rem",
                  borderRadius: 8,
                }}
              >
                <span style={{ color: "var(--color-orange)", marginRight: 8 }}>›</span>
                {q}
              </Link>
            ))}
          </div>

          <Link href="/demos" className="parcours-cta-outline">
            Parler à VEGA →
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
