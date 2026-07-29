// Bande fine de flux d'architecture (réutilisable) : les étapes RÉELLES du
// pipeline, reliées, avec une impulsion qui circule le long du tracé. Couleur =
// var(--pv-accent) du projet. Statique si prefers-reduced-motion (via CSS).
export default function ArchFlow({ steps }: { steps: string[] }) {
  const n = steps.length;
  const W = 250;
  const y = 11;
  const pad = 18;
  const gap = (W - pad * 2) / (n - 1);
  const xs = steps.map((_, i) => pad + i * gap);

  return (
    <div className="pv-flow-wrap">
      <svg viewBox={`0 0 ${W} 38`} width="100%" height="42" fill="none" aria-hidden>
        <line x1={xs[0]} y1={y} x2={xs[n - 1]} y2={y} stroke="var(--pv-accent)" strokeOpacity="0.28" strokeWidth="1.2" />
        <line className="pv-flow-dash" x1={xs[0]} y1={y} x2={xs[n - 1]} y2={y} />
        {xs.map((x, i) => (
          <circle key={`c${i}`} className="pv-fnode" cx={x} cy={y} r="3.2" />
        ))}
        {steps.map((s, i) => (
          <text
            key={`t${i}`}
            className="pv-flabel"
            x={xs[i]}
            y={30}
            textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}
          >
            {s}
          </text>
        ))}
      </svg>
    </div>
  );
}
