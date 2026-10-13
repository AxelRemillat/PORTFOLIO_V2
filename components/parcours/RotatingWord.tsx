"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/client";
import { parcoursCopy } from "./parcours-copy";
const INTERVAL_MS = 2500;

// Mot rotatif du hero : fade/slide vertical CSS (keyframe heroWordIn) à chaque
// changement. Figé sur le premier mot si prefers-reduced-motion.
export default function RotatingWord() {
  const WORDS = parcoursCopy(useLocale()).hero.words;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % WORDS.length), INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      style={{
        display: "inline-block",
        overflow: "hidden",
        verticalAlign: "bottom",
        color: "var(--color-orange)",
        fontWeight: 600,
      }}
    >
      {/* key={index} force le remontage → l'animation d'entrée rejoue */}
      <span key={index} className="hero-word" style={{ display: "inline-block" }}>
        {WORDS[index]}
      </span>
    </span>
  );
}
