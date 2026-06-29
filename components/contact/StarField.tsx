"use client";

import { useEffect, useState } from "react";

interface Star {
  top: string;
  left: string;
  size: number;
  opacity: number;
}

// Génère 70 étoiles statiques en positions aléatoires (rendu côté client pour
// éviter tout mismatch d'hydratation).
export default function StarField() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const next = Array.from({ length: 70 }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() > 0.8 ? 2 : 1,
      opacity: 0.05 + Math.random() * 0.35,
    }));
    setStars(next);
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: s.top,
            left: s.left,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            background: "#ffffff",
            borderRadius: "50%",
          }}
        />
      ))}
    </div>
  );
}
