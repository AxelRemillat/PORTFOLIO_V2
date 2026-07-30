"use client";

import type { CSSProperties } from "react";
import { Icon } from "./nodeIcons";
import type { NodeIcon } from "./workflow-types";

export interface TabItem { id: string; label: string; icon: NodeIcon; accent: string }

// Contraste WCAG. Le texte (blanc/sombre) suit le meilleur ratio. Si le texte est
// blanc mais < 4.5:1, on assombrit LÉGÈREMENT le remplissage actif (--tab-fill)
// jusqu'à AA — sans toucher l'identité (--tab-accent reste la teinte d'origine).
const DARK = "#111827";
const chan = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lumRGB = (r: number, g: number, b: number) => 0.2126 * chan(r / 255) + 0.7152 * chan(g / 255) + 0.0722 * chan(b / 255);
const relLum = (hex: string) => lumRGB(parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16));
const contrast = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const h2 = (n: number) => Math.round(n).toString(16).padStart(2, "0");

// Remplissage garantissant ≥ 4.5:1 avec du texte blanc (assombrit par pas de 2%).
function fillForWhite(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  for (let f = 1; f >= 0.5; f -= 0.02) {
    if (1.05 / (lumRGB(r * f, g * f, b * f) + 0.05) >= 4.5) return `#${h2(r * f)}${h2(g * f)}${h2(b * f)}`;
  }
  return hex;
}

function tabVars(accent: string): CSSProperties {
  const white = contrast(relLum(accent), 1) >= contrast(relLum(accent), relLum(DARK));
  return {
    "--tab-accent": accent,
    "--tab-fill": white ? fillForWhite(accent) : accent,
    "--tab-fg": white ? "#ffffff" : DARK,
    "--tab-weak": `${accent}16`,
  } as CSSProperties;
}

// Barre d'onglets numérotée (01…05), un accent d'identité par onglet. Activation
// automatique aux flèches ←/→ (focus suivi), aria-selected, tabindex roving,
// scroll horizontal sur mobile.
export default function TabBar({
  tabs, active, onSelect,
}: { tabs: TabItem[]; active: number; onSelect: (i: number) => void }) {
  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + tabs.length) % tabs.length;
    onSelect(next);
    e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
  };

  return (
    <div className="wc-tabs" role="tablist" aria-label="Automatisations" onKeyDown={onKey}>
      {tabs.map((t, i) => (
        <button
          key={t.id} type="button" role="tab" id={`tab-${t.id}`} aria-controls={`panel-${t.id}`}
          aria-selected={i === active} tabIndex={i === active ? 0 : -1}
          className={`wc-tab ${i === active ? "is-active" : ""}`}
          style={tabVars(t.accent)}
          onClick={() => onSelect(i)}
        >
          <span className="wc-tab-num">{String(i + 1).padStart(2, "0")}</span>
          <span className="wc-tab-ico"><Icon name={t.icon} /></span>
          {t.label}
        </button>
      ))}
    </div>
  );
}
