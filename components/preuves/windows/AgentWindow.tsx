"use client";

import ArchFlow from "../ArchFlow";

// Fenêtre « Agent commercial » : mini-trace stylisée (raisonnement → appels d'outils
// → livrable) façon terminal d'agent. Accent = var(--pv-accent) du projet (rose).
const LINES: [string, string][] = [
  ["think", "Besoin : 4 bureaux assis-debout + livraison Lyon"],
  ["tool", "rechercher_produits( assis-debout )"],
  ["ok", "2 réfs · stock OK"],
  ["tool", "calculer_devis( 4× BUR-ASD-140, Lyon )"],
  ["ok", "2 379 € TTC · délai 11 j"],
  ["final", "Devis + email + créneau prêts"],
];

export default function AgentWindow() {
  return (
    <div className="pv-win">
      <style>{`
        .paw-body { padding:.6rem .7rem; display:flex; flex-direction:column; gap:5px; }
        .paw-row { display:grid; grid-template-columns:16px 1fr; gap:8px; align-items:start;
          font-family:var(--font-mono); font-size:8.5px; line-height:1.5; color:#f3d9e6; }
        .paw-ico { font-size:9px; text-align:center; }
        .paw-row.k-think .paw-ico { color:#9aa6b8; } .paw-row.k-think span:last-child { color:#c8d0dc; }
        .paw-row.k-tool .paw-ico { color:#7fb4ff; } .paw-row.k-tool span:last-child { color:#dbe7ff; }
        .paw-row.k-ok .paw-ico { color:#5fd39a; } .paw-row.k-ok span:last-child { color:#c9f2dd; }
        .paw-row.k-final .paw-ico { color:var(--pv-accent); } .paw-row.k-final span:last-child { color:#ffd9ec; font-weight:700; }
      `}</style>
      <div className="pv-bar"><span className="pv-bdot" />agent · function-calling</div>
      <div className="paw-body">
        {LINES.map(([kind, text], i) => (
          <div key={i} className={`paw-row k-${kind}`}>
            <span className="paw-ico" aria-hidden>{kind === "think" ? "◇" : kind === "tool" ? "⚙" : kind === "ok" ? "✓" : "▸"}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>
      <ArchFlow steps={["Demande", "Raisonne", "Outils", "Livrable"]} />
    </div>
  );
}
