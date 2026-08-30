import ArchFlow from "../ArchFlow";

// Fenêtre « Pipeline Data/ML » de la card projet : aperçu des étapes du pipeline
// façon console + bande de flux. Accent = var(--pv-accent) du projet (cyan).
const LINES: [string, string][] = [
  ["in", "303 leads · 11 colonnes"],
  ["clean", "types normalisés · doublons retirés"],
  ["feat", "10 features (one-hot · ratios)"],
  ["model", "régression logistique → proba"],
  ["out", "chaud / tiède / froid + explicabilité"],
];

export default function PipelineWindow() {
  return (
    <div className="pv-win">
      <style>{`
        .plw-body { padding:.6rem .7rem; display:flex; flex-direction:column; gap:5px; }
        .plw-row { display:grid; grid-template-columns:16px 1fr; gap:8px; align-items:start;
          font-family:var(--font-mono); font-size:8.5px; line-height:1.5; color:#cdeef5; }
        .plw-ico { font-size:9px; text-align:center; color:var(--pv-accent); }
        .plw-row.k-out .plw-ico, .plw-row.k-out span:last-child { color:#a9f0ff; font-weight:700; }
      `}</style>
      <div className="pv-bar"><span className="pv-bdot" />pipeline · data → ml</div>
      <div className="plw-body">
        {LINES.map(([kind, text], i) => (
          <div key={i} className={`plw-row k-${kind}`}>
            <span className="plw-ico" aria-hidden>{kind === "in" ? "▤" : kind === "clean" ? "✎" : kind === "feat" ? "⑂" : kind === "model" ? "∿" : "◈"}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>
      <ArchFlow steps={["Ingest", "Clean", "Features", "Modèle", "Score"]} />
    </div>
  );
}
