"use client";

import type { Metier, MetierId } from "@/lib/metiers";

// Sélecteur de métier (agent devis + SAV) : un groupe de boutons radio, style
// des pages démo (thème clair wc-*). L'accent suit --wc-accent du conteneur.
const CSS = `
.mp { margin:0 0 1.25rem; }
.mp-lbl { font-family:var(--font-mono); font-size:.72rem; letter-spacing:.1em; text-transform:uppercase; color:var(--wc-muted); margin:0 0 .6rem; }
.mp-row { display:flex; flex-wrap:wrap; gap:.5rem; }
.mp-btn { font:inherit; font-size:.88rem; font-weight:600; padding:.55rem .95rem; border-radius:999px; cursor:pointer;
  border:1.5px solid var(--wc-border-strong); background:#fff; color:var(--wc-text); transition:border-color .15s, background .15s; }
.mp-btn:hover { border-color:var(--wc-accent); }
.mp-btn[aria-checked="true"] { border-color:var(--wc-accent); background:var(--wc-accent-weak); color:var(--wc-text); box-shadow:inset 0 0 0 1px var(--wc-accent); }
.mp-btn:disabled { opacity:.55; cursor:not-allowed; }
`;

export default function MetierPicker({
  metiers, value, onChange, disabled, label = "Choisissez votre métier",
}: { metiers: Metier[]; value: MetierId; onChange: (id: MetierId) => void; disabled?: boolean; label?: string }) {
  return (
    <div className="mp">
      <style>{CSS}</style>
      <p className="mp-lbl" id="mp-lbl">{label}</p>
      <div className="mp-row" role="radiogroup" aria-labelledby="mp-lbl">
        {metiers.map((m) => (
          <button
            key={m.id} type="button" role="radio" aria-checked={m.id === value} disabled={disabled}
            className="mp-btn" onClick={() => onChange(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
