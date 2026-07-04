"use client";

import { useEffect, useRef, useState } from "react";

// Compteur de stat réutilisable (extrait de parcours/StatsSection pour être
// partagé avec la home). Anime 0 → target quand `run` passe à true.

export interface StatDef { value: number; label: string; prefix?: string; suffix?: string }

// Chiffres "preuves" partagés entre /parcours (02 // CHIFFRES) et / (04 // PREUVES).
export const PROOF_STATS: StatDef[] = [
  { value: 3, label: "podiums de concours" },
  { value: 4500, suffix: " €", label: "de prix remportés" },
  { value: 14, suffix: " mois", label: "d'alternance à Station F" },
  { value: 19, label: "technologies au compteur" },
];

// Milliers séparés par une espace insécable ("4 500").
const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

// Compteur 0 → target sur 1.2s (ease-out cubic) via requestAnimationFrame.
// Valeur finale immédiate si prefers-reduced-motion.
function useCounter(target: number, run: boolean) {
  const [n, setN] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!run || started.current) return;
    started.current = true;
    let raf = 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      raf = requestAnimationFrame(() => setN(target)); // valeur finale, sans animation
      return () => cancelAnimationFrame(raf);
    }
    const duration = 1200;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target]);

  return n;
}

export default function StatCounter({ stat, run }: { stat: StatDef; run: boolean }) {
  const n = useCounter(stat.value, run);
  return (
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
        {stat.prefix}
        {fmt(n)}
        {stat.suffix && <span style={{ fontSize: "0.5em" }}>{stat.suffix}</span>}
      </div>
      <div
        style={{
          marginTop: "0.75rem",
          fontFamily: "var(--font-mono)",
          fontSize: "0.85rem",
          color: "var(--color-muted)",
        }}
      >
        {stat.label}
      </div>
    </div>
  );
}
