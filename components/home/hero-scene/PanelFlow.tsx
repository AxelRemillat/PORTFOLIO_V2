"use client";

import Link from "next/link";

// Panneau N8N (arrière-plan gauche) : mini-graphe de nœuds reliés (style circuit)
// avec des impulsions vertes qui parcourent les liens en boucle. → /preuves.
// Vert émeraude cohérent avec la card preuve N8N (projects-data).
const EMERALD = "#10b981";

// Coordonnées en viewBox 200×110.
const NODES = [
  [18, 34], [18, 78], [80, 20], [80, 56], [80, 92], [150, 40], [150, 74], [186, 56],
] as const;
const LINKS = [
  [0, 2], [0, 3], [1, 3], [1, 4], [2, 5], [3, 5], [3, 6], [4, 6], [5, 7], [6, 7],
] as const;

export default function PanelFlow() {
  return (
    <>
      <style>{`
        .hsf-link { stroke:${EMERALD}; stroke-opacity:.28; stroke-width:1.2; }
        .hsf-flow { stroke:${EMERALD}; stroke-width:1.6; stroke-linecap:round;
          stroke-dasharray:6 60; animation: hsfFlow 2.4s linear infinite;
          filter: drop-shadow(0 0 3px ${EMERALD}); }
        @keyframes hsfFlow { to { stroke-dashoffset:-66; } }
        .hsf-node { fill:#03170f; stroke:${EMERALD}; stroke-width:1.3; }
        @media (prefers-reduced-motion: reduce) { .hsf-flow{animation:none;stroke-dasharray:none;stroke-opacity:.5;} }
      `}</style>
      <Link href="/preuves" className="hs-panel hsf-panel" aria-label="Automatisations N8N — les preuves">
        <div className="hs-head" style={{ color: EMERALD }}>N8N // AUTOMATISATIONS</div>

        <svg viewBox="0 0 200 110" width="100%" height="92" fill="none" aria-hidden style={{ marginTop: "0.25rem" }}>
          {LINKS.map(([a, b], i) => (
            <line key={`l${i}`} className="hsf-link" x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} />
          ))}
          {LINKS.map(([a, b], i) => (
            <line
              key={`f${i}`}
              className="hsf-flow"
              x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]}
              style={{ animationDelay: `${(i % 5) * 0.36}s` }}
            />
          ))}
          {NODES.map(([x, y], i) => (
            <circle key={`n${i}`} className="hsf-node" cx={x} cy={y} r="4.5" />
          ))}
        </svg>
      </Link>
    </>
  );
}
