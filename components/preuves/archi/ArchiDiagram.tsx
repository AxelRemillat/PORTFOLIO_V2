import { ARCHI } from "./archi-data";

// Schéma de pipeline vertical animé : nœuds numérotés reliés par des connecteurs
// où une impulsion « descend » (le flux de données). CSS pur → server component,
// zéro JS. Impulsion figée si prefers-reduced-motion.
export default function ArchiDiagram({ slug }: { slug: string }) {
  const archi = ARCHI[slug];
  if (!archi) return null;
  const last = archi.flow.length - 1;

  return (
    <div className="ad-flow">
      <style>{`
        .ad-flow { position:relative; z-index:1; margin:1.2rem 0 0; }
        .ad-stage { display:grid; grid-template-columns:34px 1fr; gap:16px; }
        .ad-rail { display:flex; flex-direction:column; align-items:center; }
        .ad-node { width:30px; height:30px; border-radius:50%; flex-shrink:0; display:flex; align-items:center;
          justify-content:center; font-family:var(--font-mono); font-size:12px; font-weight:700; color:var(--ac);
          border:1px solid var(--ac-line); background:var(--ac-weak); box-shadow:0 0 0 4px rgba(255,255,255,0.015); }
        .ad-conn { position:relative; flex:1; width:2px; min-height:22px; margin:4px 0; border-radius:2px;
          background:var(--ac-line); opacity:.5; overflow:hidden; }
        .ad-conn i { position:absolute; left:0; top:0; width:100%; height:46%; border-radius:2px;
          background:linear-gradient(var(--ac), transparent); box-shadow:0 0 8px var(--ac);
          animation:adFlow 1.7s linear infinite; }
        @keyframes adFlow { from{transform:translateY(-115%);} to{transform:translateY(240%);} }
        .ad-card { padding-bottom:1.4rem; }
        .ad-title { font-size:1.02rem; font-weight:700; color:#fff; line-height:1.3; }
        .ad-tech { font-family:var(--font-mono); font-size:.78rem; color:#93a0b6; margin-top:3px; }
        .ad-items { display:flex; flex-wrap:wrap; gap:7px; margin-top:10px; }
        .ad-chip { font-family:var(--font-mono); font-size:.72rem; color:#dbe2ee; border:1px solid var(--ac-line);
          background:var(--ac-weak); border-radius:6px; padding:3px 10px; }
        .ad-guards { display:flex; flex-wrap:wrap; gap:9px; margin:.3rem 0 .5rem 50px; }
        .ad-guard { font-family:var(--font-mono); font-size:.72rem; color:var(--ac);
          border:1px dashed var(--ac-line); border-radius:999px; padding:3px 12px; }
        @media (prefers-reduced-motion: reduce) { .ad-conn i { animation:none; } }
      `}</style>

      {archi.flow.map((s, i) => (
        <div className="ad-stage" key={s.title}>
          <div className="ad-rail">
            <span className="ad-node">{i + 1}</span>
            {i < last && <span className="ad-conn"><i /></span>}
          </div>
          <div className="ad-card">
            <div className="ad-title">{s.title}</div>
            {s.tech && <div className="ad-tech">{s.tech}</div>}
            {s.items && (
              <div className="ad-items">
                {s.items.map((it) => <span key={it} className="ad-chip">{it}</span>)}
              </div>
            )}
          </div>
        </div>
      ))}

      {archi.guards && (
        <div className="ad-guards">
          {archi.guards.map((g) => <span key={g} className="ad-guard">{g}</span>)}
        </div>
      )}
    </div>
  );
}
