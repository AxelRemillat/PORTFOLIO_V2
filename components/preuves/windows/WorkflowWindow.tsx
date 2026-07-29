"use client";

import ArchFlow from "../ArchFlow";

// Fenêtre n8n : mini-éditeur de workflow (canvas pointillé, nœuds n8n réels reliés,
// impulsions qui circulent) + bande de flux. Accent = var(--pv-accent) du projet.
const NODES: [number, number, string][] = [
  [26, 30, "Webhook"], [26, 78, "Cron"], [92, 54, "OpenAI"],
  [160, 30, "Filter"], [160, 78, "Sheets"], [204, 54, "Email"],
];
const LINKS = [[0, 2], [1, 2], [2, 3], [2, 4], [3, 5], [4, 5]] as const;

export default function WorkflowWindow() {
  return (
    <div className="pv-win">
      <style>{`
        .pwf-canvas { padding:.7rem;
          background-image:radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px); background-size:13px 13px; }
        .pwf-link { stroke:var(--pv-accent); stroke-opacity:.3; stroke-width:1.4; }
        .pwf-node rect { fill:#07120e; stroke:var(--pv-accent); stroke-width:1.1; }
        .pwf-node text { fill:#d3f5e6; font-family:var(--font-mono); font-size:7px; letter-spacing:.02em; }
      `}</style>
      <div className="pv-bar"><span className="pv-bdot" />n8n · éditeur de workflow</div>
      <div className="pwf-canvas">
        <svg viewBox="0 0 230 108" width="100%" height="104" fill="none" aria-hidden>
          {LINKS.map(([a, b], i) => (
            <line key={`l${i}`} className="pwf-link" x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} />
          ))}
          {LINKS.map(([a, b], i) => (
            <line key={`f${i}`} className="pv-flow-dash" x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]}
              style={{ animationDelay: `${(i % 3) * 0.5}s` }} />
          ))}
          {NODES.map(([x, y, label], i) => (
            <g key={`n${i}`} className="pwf-node">
              <rect x={x - 21} y={y - 9} width="42" height="18" rx="5" />
              <text x={x} y={y + 2.5} textAnchor="middle">{label}</text>
            </g>
          ))}
        </svg>
      </div>
      <ArchFlow steps={["Webhook", "OpenAI", "Filtre", "Envoi"]} />
    </div>
  );
}
