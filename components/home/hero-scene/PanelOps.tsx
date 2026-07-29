"use client";

import Link from "next/link";

// Panneau OPS (arrière-plan droit) : 3 faits RÉELS du site + une sparkline
// purement décorative (aucune valeur chiffrée, c'est une texture animée).
// Cliquable → /ops. Point pulsant identique à celui de la page /ops.
const FACTS = [
  "3 systèmes en production",
  "30 chunks RAG indexés",
  "Monitoring public — bientôt branché",
];

export default function PanelOps() {
  return (
    <>
      <style>{`
        .hso-dot { width:6px; height:6px; border-radius:50%; background:var(--color-orange);
          animation: hsoPulse 1.8s ease-in-out infinite; flex-shrink:0; }
        @keyframes hsoPulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.3;transform:scale(.8);} }
        .hso-spark { stroke-dasharray:240; stroke-dashoffset:240; animation: hsoDraw 3.6s ease-in-out infinite; }
        @keyframes hsoDraw { 0%{stroke-dashoffset:240;opacity:.7;} 55%{stroke-dashoffset:0;opacity:.7;} 100%{stroke-dashoffset:0;opacity:0;} }
        @media (prefers-reduced-motion: reduce) { .hso-dot{animation:none;} .hso-spark{animation:none;stroke-dashoffset:0;} }
      `}</style>
      <Link href="/ops" className="hs-panel hso-panel" aria-label="Ops — la salle des machines">
        <div className="hs-head">OPS // SALLE DES MACHINES</div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", margin: "0.15rem 0 0.85rem" }}>
          {FACTS.map((f) => (
            <div
              key={f}
              style={{
                display: "flex", alignItems: "center", gap: 9,
                fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#cbd5e1",
              }}
            >
              <span className="hso-dot" />
              {f}
            </div>
          ))}
        </div>

        <svg viewBox="0 0 200 40" width="100%" height="32" fill="none" aria-hidden>
          <polyline
            className="hso-spark"
            points="0,28 25,22 45,30 70,12 95,20 120,8 150,24 175,14 200,20"
            stroke="var(--color-orange)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </Link>
    </>
  );
}
