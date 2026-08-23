"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface RevealOptions {
  threshold?: number;    // défaut 0.15 (comportement historique)
  rootMargin?: string;   // défaut "0px 0px -60px 0px"
  respectReducedMotion?: boolean; // si true : affiche sans animation quand l'OS le demande
}

// Révèle un élément quand il entre dans le viewport (une seule fois).
export function useScrollReveal(options: RevealOptions = {}) {
  const {
    threshold = 0.15,
    rootMargin = "0px 0px -60px 0px",
    respectReducedMotion = false,
  } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    // Accessibilité : si l'utilisateur préfère moins d'animation, on révèle
    // immédiatement, sans observer ni transition.
    if (
      respectReducedMotion &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setReduced(true);
      setIsVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMargin, respectReducedMotion]);

  return { ref, isVisible, reduced };
}

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number; // secondes
  direction?: "up" | "left" | "right";
  className?: string;
  threshold?: number;             // seuil d'intersection (défaut 0.15)
  rootMargin?: string;            // marge du viewport (défaut "0px 0px -60px 0px")
  respectReducedMotion?: boolean; // respecte prefers-reduced-motion
}

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export default function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className,
  threshold,
  rootMargin,
  respectReducedMotion,
}: ScrollRevealProps) {
  const { ref, isVisible, reduced } = useScrollReveal({
    threshold,
    rootMargin,
    respectReducedMotion,
  });

  const hidden =
    direction === "left"
      ? "translateX(-48px)"
      : direction === "right"
        ? "translateX(48px)"
        : "translateY(48px)";

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate(0, 0)" : hidden,
        transition: reduced
          ? "none"
          : `opacity 0.85s ${EASE} ${delay}s, transform 0.85s ${EASE} ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
