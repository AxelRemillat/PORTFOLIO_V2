"use client";

import Link from "next/link";

// Panneau n8n (arrière-plan gauche) : mini-éditeur de workflow (canvas pointillé,
// nœuds n8n réels reliés, impulsions vertes qui parcourent les liens). Vert
// émeraude cohérent avec la card preuve N8N. Cliquable → /preuves.
const EMERALD = "#10b981";

// Nœuds étiquetés (viewBox 220×120) — briques n8n réelles.
const NODES: [number, number, string][] = [
  [26, 34, "Webhook"], [26, 86, "Cron"], [92, 60, "OpenAI"],
  [158, 34, "Filter"], [158, 86, "Sheets"], [200, 60, "Email"],
];
const LINKS = [[0, 2], [1, 2], [2, 3], [2, 4], [3, 5], [4, 5]] as const;

export default function PanelFlow() {
  return (
    <>
      <style>{`
        .hsf-ico { width:14px; height:14px; border-radius:4px; flex-shrink:0;
          background:linear-gradient(135deg, ${EMERALD}, #065f46); box-shadow:0 0 8px rgba(16,185,129,0.5); }
        .hsf-canvas { position:relative; padding:0.6rem;
          background-image:radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px); background-size:13px 13px; }
        .hsf-link { stroke:${EMERALD}; stroke-opacity:.3; stroke-width:1.4; }
        .hsf-flow { stroke:${EMERALD}; stroke-width:1.8; stroke-linecap:round; stroke-dasharray:5 62;
          animation:hsfFlow 2.4s linear infinite; filter:drop-shadow(0 0 3px ${EMERALD}); }
        @keyframes hsfFlow { to { stroke-dashoffset:-67; } }
        .hsf-node rect { fill:#07130f; stroke:${EMERALD}; stroke-width:1.2; }
        .hsf-node text { fill:#a7f3d0; font-family:var(--font-mono); font-size:7px; letter-spacing:.02em; }
        .hsf-foot { display:flex; align-items:center; gap:8px; padding:0.55rem 0.8rem;
          border-top:1px solid rgba(255,255,255,0.06); font-family:var(--font-mono); font-size:0.7rem; color:#cbd5e1; }
        .hsf-foot i { width:6px; height:6px; border-radius:50%; background:${EMERALD}; }
        @media (prefers-reduced-motion: reduce) { .hsf-flow{animation:none;stroke-dasharray:none;stroke-opacity:.55;} }
      `}</style>
      <Link href="/projets" className="hs-panel hsf" aria-label="Automatisations n8n — les preuves">
        <div className="hs-bar">
          <span className="hsf-ico" />
          <span className="hs-title">n8n — automatisations</span>
        </div>

        <div className="hsf-canvas">
          <svg viewBox="0 0 220 120" width="100%" height="108" fill="none" aria-hidden>
            {LINKS.map(([a, b], i) => (
              <line key={`l${i}`} className="hsf-link" x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} />
            ))}
            {LINKS.map(([a, b], i) => (
              <line key={`f${i}`} className="hsf-flow" x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]}
                style={{ animationDelay: `${(i % 3) * 0.5}s` }} />
            ))}
            {NODES.map(([x, y, label], i) => (
              <g key={`n${i}`} className="hsf-node">
                <rect x={x - 20} y={y - 9} width="40" height="18" rx="5" />
                <text x={x} y={y + 2.5} textAnchor="middle">{label}</text>
              </g>
            ))}
          </svg>
        </div>

        <div className="hsf-foot"><i />12 workflows conçus · 5 en déploiement</div>
      </Link>
    </>
  );
}
