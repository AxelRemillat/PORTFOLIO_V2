"use client";

import ArchFlow from "../ArchFlow";
import { useWindowsText } from "./windows-text";

// Fenêtre Infra : panneau « serveur GPU » listant les services réels du socle
// self-hosted, statut honnête « en construction » + bande de flux. Aucune valeur
// inventée : les services existent (cible), le statut dit la vérité.
// Services listés : windows-text.ts (une version par langue).

export default function InfraWindow() {
  const t = useWindowsText().infra;
  return (
    <div className="pv-win">
      <style>{`
        .pfi-body { padding:.7rem .8rem; display:flex; flex-direction:column; gap:.5rem; }
        .pfi-row { display:flex; align-items:center; gap:9px; font-family:var(--font-mono); font-size:.74rem; color:#cbd5e1; }
        .pfi-row .pfi-dot { width:6px; height:6px; border-radius:50%; background:var(--pv-accent); opacity:.85; flex-shrink:0; }
        .pfi-tag { margin-left:auto; font-size:.64rem; letter-spacing:.04em; text-transform:uppercase;
          color:#8b93a7; border:1px solid rgba(255,255,255,0.1); border-radius:999px; padding:1px 8px; }
      `}</style>
      <div className="pv-bar"><span className="pv-bdot" />{t.bar}</div>
      <div className="pfi-body">
        {t.services.map((s) => (
          <div key={s} className="pfi-row">
            <span className="pfi-dot" />
            {s}
            <span className="pfi-tag">{t.tag}</span>
          </div>
        ))}
      </div>
      <ArchFlow steps={t.flow} />
    </div>
  );
}
