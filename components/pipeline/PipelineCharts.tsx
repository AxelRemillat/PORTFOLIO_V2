"use client";

import { importance } from "./model";
import type { Scored } from "./pipeline-steps";

// Deux graphes SVG légers (inline, zéro dépendance) : distribution des scores
// (histogramme 10 classes) + importance globale des features (barres).
export default function PipelineCharts({ rows }: { rows: Scored[] }) {
  const bins = new Array(10).fill(0);
  for (const r of rows) bins[Math.min(9, Math.floor(r.proba * 10))]++;
  const maxBin = Math.max(...bins, 1);
  const W = 264, H = 118, pad = 6;
  const bw = (W - pad * 2) / 10;
  const imp = importance();

  return (
    <div className="pl-charts">
      <div className="pl-chart">
        <p className="pl-chart-t">Distribution des scores</p>
        <svg viewBox={`0 0 ${W} ${H + 20}`} width="100%" role="img" aria-label="Histogramme des scores de conversion">
          {bins.map((c, i) => {
            const h = (c / maxBin) * H;
            return (
              <g key={i}>
                <rect x={pad + i * bw + 1} y={H - h} width={bw - 2} height={h} rx={2}
                  fill="var(--pl)" opacity={0.35 + 0.65 * (i / 9)} />
                {i % 2 === 0 && (
                  <text x={pad + i * bw + bw / 2} y={H + 14} textAnchor="middle" fontSize="8"
                    fill="var(--wc-muted)" fontFamily="var(--font-mono)">{i * 10}</text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="pl-chart">
        <p className="pl-chart-t">Importance des features (|poids|)</p>
        {imp.map((f) => (
          <div className="pl-imp-row" key={f.label}>
            <div>
              <p className="pl-imp-lbl">{f.label}</p>
              <div className="pl-imp-track"><div className="pl-imp-bar" style={{ width: `${Math.round(f.v * 100)}%` }} /></div>
            </div>
            <span className="pl-imp-val">{Math.round(f.v * 100)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
