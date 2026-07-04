"use client";

import { useEffect, useState } from "react";
import { useScrollReveal } from "@/components/parcours/ScrollReveal";
import SectionLabel from "@/components/parcours/SectionLabel";

// Manifesto de la home : même mécanique que parcours/ManifestoSection (reveal
// mot par mot, ~40 ms de délai incrémental), texte différent. Statique si
// prefers-reduced-motion.
const LINES: { text: string; accent?: boolean }[][] = [
  [{ text: "Un" }, { text: "CV" }, { text: "raconte." }],
  [{ text: "Ici," }, { text: "tout", accent: true }, { text: "se" }, { text: "teste." }],
];

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export default function HomeManifesto() {
  const { ref, isVisible } = useScrollReveal();
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() =>
      setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches),
    );
    return () => cancelAnimationFrame(raf);
  }, []);

  const shown = isVisible || reduce;
  let wordIndex = 0;

  return (
    <section id="manifesto" style={{ padding: "15vh 6vw", maxWidth: "1100px", margin: "0 auto" }}>
      <SectionLabel>01 // MANIFESTO</SectionLabel>

      <div
        ref={ref}
        style={{
          fontWeight: 700,
          lineHeight: 1.1,
          fontSize: "clamp(2.25rem, 6vw, 4.5rem)",
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
                    ...(w.accent && { color: "var(--color-orange)" }),
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
