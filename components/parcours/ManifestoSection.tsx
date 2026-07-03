"use client";

import { useEffect, useState } from "react";
import { useScrollReveal } from "./ScrollReveal";
import SectionLabel from "./SectionLabel";

// Manifesto découpé en mots : reveal mot par mot (delays incrémentaux ~40 ms)
// au scroll. "slides" garde son strikethrough. Statique si reduced-motion.
const LINES: { text: string; strike?: boolean }[][] = [
  [{ text: "Je" }, { text: "construis" }, { text: "des" }, { text: "systèmes" }, { text: "qui" }, { text: "apprennent," }],
  [{ text: "pas" }, { text: "des" }, { text: "slides", strike: true }, { text: "qui" }, { text: "s'oublient." }],
];

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export default function ManifestoSection() {
  const { ref, isVisible } = useScrollReveal();
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const shown = isVisible || reduce;
  let wordIndex = 0;

  return (
    <section style={{ padding: "15vh 6vw", maxWidth: "1100px", margin: "0 auto" }}>
      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--color-border)",
          opacity: 0.4,
          marginBottom: "8vh",
        }}
      />

      <SectionLabel>01 // MANIFESTO</SectionLabel>

      <div
        ref={ref}
        style={{
          fontWeight: 700,
          lineHeight: 1.1,
          fontSize: "clamp(2rem, 5vw, 4rem)",
          color: "var(--color-text)",
        }}
      >
        {LINES.map((line, li) => (
          <p key={li} style={{ margin: 0 }}>
            {line.map((w, wi) => {
              const delay = wordIndex++ * 0.04;
              return (
                <span
                  key={wi}
                  style={{
                    display: "inline-block",
                    marginRight: "0.28em",
                    opacity: shown ? 1 : 0,
                    transform: shown ? "translateY(0)" : "translateY(0.5em)",
                    transition: reduce
                      ? "none"
                      : `opacity 0.5s ${EASE} ${delay}s, transform 0.5s ${EASE} ${delay}s`,
                    ...(w.strike && {
                      color: "var(--color-muted)",
                      textDecoration: "line-through" as const,
                      textDecorationColor: "rgba(100,116,139,0.5)",
                    }),
                  }}
                >
                  {w.text}
                </span>
              );
            })}
          </p>
        ))}
      </div>
    </section>
  );
}
