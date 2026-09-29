import type { CSSProperties } from "react";

// Styles partagés des sections de la home et de /pme (thème sombre du site).
export const section = (maxWidth = 1100): CSSProperties => ({ padding: "8vh 6vw", maxWidth, margin: "0 auto" });
export const h2: CSSProperties = { fontSize: "clamp(1.6rem, 4vw, 2.1rem)", fontWeight: 800, color: "var(--color-text)", margin: "0 0 0.5rem", lineHeight: 1.15 };
export const lead: CSSProperties = { fontSize: "1rem", color: "#9a9ab0", margin: "0 0 2rem", lineHeight: 1.55, maxWidth: "62ch" };
export const card: CSSProperties = { background: "rgba(255,255,255,0.025)", border: "1px solid var(--color-border)", borderRadius: 14, padding: "1.4rem" };
export const grid = (min: number): CSSProperties => ({ display: "grid", gap: "1.1rem", gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${min}px), 1fr))` });

// Boutons : l'orange plein porte du texte blanc à 4,5:1 (orange-700) ; le
// secondaire est un contour clair. Classes globales de globals.css non requises.
export const btnMain: CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 48, padding: "0.85rem 1.6rem",
  borderRadius: 12, background: "#c2410c", color: "#fff", fontWeight: 700, fontSize: "1rem", textDecoration: "none",
};
export const btnAlt: CSSProperties = {
  ...btnMain, background: "transparent", color: "var(--color-text)", border: "1.5px solid rgba(255,255,255,0.35)",
};
