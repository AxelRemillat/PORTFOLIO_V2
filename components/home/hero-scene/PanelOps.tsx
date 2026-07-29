"use client";

import Link from "next/link";

// Panneau OPS (arrière-plan droit) : réplique honnête du dashboard /ops — 4 vraies
// métriques encore en « câblage en cours » (valeur —), + un fait réel en pied.
// Aucune donnée inventée. Cliquable → /ops.
const TILES = [
  "Uptime du site",
  "Latence médiane VEGA",
  "Requêtes aujourd'hui",
  "Coût par réponse",
];

export default function PanelOps() {
  return (
    <>
      <style>{`
        .hso-ico { width:14px; height:14px; border-radius:4px; flex-shrink:0;
          background:linear-gradient(135deg, var(--color-orange), #b3480d); box-shadow:0 0 8px rgba(249,115,22,0.5); }
        .hso-dot { width:6px; height:6px; border-radius:50%; background:var(--color-orange);
          animation:hsoPulse 1.8s ease-in-out infinite; flex-shrink:0; }
        @keyframes hsoPulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.3;transform:scale(.8);} }
        .hso-grid { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:rgba(255,255,255,0.05); }
        .hso-tile { background:linear-gradient(160deg, rgba(22,22,35,0.6), rgba(12,12,20,0.6));
          padding:0.6rem 0.7rem; display:flex; flex-direction:column; gap:0.3rem; }
        .hso-label { font-family:var(--font-mono); font-size:9px; letter-spacing:.08em; text-transform:uppercase; color:#7c86a0; }
        .hso-val { font-family:var(--font-mono); font-size:1.5rem; font-weight:700; line-height:1; color:#3a3a5c; }
        .hso-sub { display:flex; align-items:center; gap:6px; font-family:var(--font-mono); font-size:9px; color:#6b7280; }
        .hso-foot { display:flex; align-items:center; gap:8px; padding:0.6rem 0.8rem;
          border-top:1px solid rgba(255,255,255,0.06); font-family:var(--font-mono); font-size:0.72rem; color:#cbd5e1; }
        @media (prefers-reduced-motion: reduce) { .hso-dot{animation:none;} }
      `}</style>
      <Link href="/ops" className="hs-panel hso" aria-label="Ops — la salle des machines">
        <div className="hs-bar">
          <span className="hso-ico" />
          <span className="hs-title">OPS — salle des machines</span>
          <span className="hso-dot hs-spacer" />
        </div>

        <div className="hso-grid">
          {TILES.map((label) => (
            <div key={label} className="hso-tile">
              <span className="hso-label">{label}</span>
              <span className="hso-val">—</span>
              <span className="hso-sub"><i className="hso-dot" />câblage en cours</span>
            </div>
          ))}
        </div>

        <div className="hso-foot">
          <span className="hso-dot" />3 systèmes en production · 30 chunks RAG indexés
        </div>
      </Link>
    </>
  );
}
