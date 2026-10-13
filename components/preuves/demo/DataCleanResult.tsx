"use client";

import DataPreview, { type ApercuRow } from "./DataPreview";
import { DATACLEAN_CSS } from "./dataCleanCss";
import { useDemoUi } from "./DemoUiContext";

// Rendu dédié « nettoyage CSV » (thème clair, accent violet). Ordre : AVANT/APRÈS
// dominant + download, puis « Détail de l'analyse » (stats, anomalies, normalisations,
// qualité colonnes). Styles injectés via <style> (voir dataCleanCss.ts).
export interface DataStats {
  rows_in: number; rows_out: number; duplicates_removed: number;
  colonnes: number; issues_total: number; delimiteur: string;
}
export interface DataAnomaly { type: string; count: number; examples: string[] }
export interface ColQuality { colonne: string; type: string; rempli_pct: number }
export interface DataCleanData {
  stats: DataStats;
  anomalies: DataAnomaly[];
  normalisations: string[];
  qualite_colonnes: ColQuality[];
  apercu: ApercuRow[];
  apercu_doublons?: Record<string, unknown>[];
  // Conservés pour compat ascendante (le rendu utilise désormais `apercu`).
  apercu_avant?: Record<string, unknown>[];
  apercu_apres?: Record<string, unknown>[];
  csv_nettoye: string;
}

export default function DataCleanResult({ result }: { result: DataCleanData }) {
  const t = useDemoUi().clean;
  const s = result.stats;

  const download = () => {
    const blob = new Blob([result.csv_nettoye], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = t.fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <style>{DATACLEAN_CSS}</style>
      <DataPreview apercu={result.apercu} />
      {result.apercu_doublons?.length ? (
        <p className="wc-dc-dupes">+ <b>{s.duplicates_removed}</b> {t.dupesRemoved}</p>
      ) : null}
      <button type="button" className="wc-btn wc-primary wc-dc-dl" onClick={download}>
        {t.download}
      </button>

      <p className="wc-dc-detail-lbl">{t.detail}</p>

      <div className="wc-dc-stats">
        <span>{t.rows} <b>{s.rows_in}</b> → <b>{s.rows_out}</b></span>
        <span><b>{s.duplicates_removed}</b> {t.dupes}</span>
        <span><b>{s.issues_total}</b> {t.issues}</span>
        <span>{t.delimiter} <code>{s.delimiteur}</code></span>
      </div>

      {result.anomalies?.length > 0 && (
        <>
          <p className="wc-res-lbl">{t.anomalies}</p>
          <ul className="wc-dc-anos">
            {result.anomalies.map((a, i) => (
              <li key={`${a.type}${i}`}>
                <span className="wc-dc-ano-badge">{a.count}</span>
                <span className="wc-dc-ano-type">{a.type}</span>
                {a.examples?.length > 0 && <span className="wc-dc-ano-ex">{a.examples.slice(0, 2).join(" · ")}</span>}
              </li>
            ))}
          </ul>
        </>
      )}

      {result.normalisations?.length > 0 && (
        <>
          <p className="wc-res-lbl">{t.normalizations}</p>
          <ul className="wc-dc-norms">{result.normalisations.map((n, i) => <li key={`${i}n`}>✓ {n}</li>)}</ul>
        </>
      )}

      {result.qualite_colonnes?.length > 0 && (
        <>
          <p className="wc-res-lbl">{t.quality}</p>
          <div className="wc-dc-quality">
            {result.qualite_colonnes.map((c) => (
              <div key={c.colonne}>
                <div className="wc-dc-col-head">
                  <span>{c.colonne}</span>
                  <span className="wc-dc-col-type">{c.type} · {c.rempli_pct}%</span>
                </div>
                <div className="wc-dc-bar" role="img" aria-label={t.filled(c.colonne, c.rempli_pct)}>
                  <div className="wc-dc-bar-fill" style={{ width: `${Math.max(0, Math.min(100, c.rempli_pct))}%` }} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
