"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

// Révèle un élément quand il entre dans le viewport (une seule fois).
export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, isVisible };
}

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number; // secondes
  direction?: "up" | "left" | "right";
  className?: string;
}

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export default function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal();

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
        transition: `opacity 0.85s ${EASE} ${delay}s, transform 0.85s ${EASE} ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
