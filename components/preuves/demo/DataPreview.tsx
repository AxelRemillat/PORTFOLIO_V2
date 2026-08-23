"use client";

import { useRef } from "react";

export interface ApercuRow {
  avant: Record<string, unknown>;
  apres: Record<string, unknown>;
  changed: Record<string, boolean>;
}

const cell = (v: unknown) => String(v ?? "");

// Aperçu construit depuis le MÊME tableau result.apercu → chaque ligne d'AVANT
// correspond exactement à la même d'APRÈS. Les cellules modifiées (changed[col])
// sont surlignées : rouge barré à gauche (donnée « sale »), vert gras à droite
// (« corrigée »). AVANT en monospace = effet brut/illisible. Scroll vertical des
// deux cartes synchronisé par refs (rAF-guardé, sans boucle ni conflit).
export default function DataPreview({ apercu }: { apercu: ApercuRow[] }) {
  const aRef = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLDivElement>(null);
  const lock = useRef(false);

  if (!apercu?.length) return null;
  const cols = Object.keys(apercu[0].avant);
  const total = apercu.length;

  const sync = (fromEl: HTMLDivElement | null, toEl: HTMLDivElement | null) => {
    if (lock.current || !fromEl || !toEl || toEl.scrollTop === fromEl.scrollTop) return;
    lock.current = true;
    toEl.scrollTop = fromEl.scrollTop;
    requestAnimationFrame(() => { lock.current = false; });
  };

  return (
    <div>
      {total > 3 && (
        <p className="wc-dc-hint">3 lignes visibles · faites défiler pour voir les {total}</p>
      )}
      <div className="wc-dc-preview">
        <div className="wc-dc-side wc-dc-before">
          <p className="wc-dc-side-title">AVANT — données brutes</p>
          <div
            ref={aRef} onScroll={() => sync(aRef.current, bRef.current)}
            className="wc-dc-side-tablewrap" tabIndex={0} role="group"
            aria-label={`Avant nettoyage — ${total} lignes, faites défiler`}
          >
            <table className="wc-mr-table wc-dc-raw">
              <thead><tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
              <tbody>
                {apercu.map((r, i) => (
                  <tr key={i}>{cols.map((c) => (
                    <td key={c} className={r.changed?.[c] ? "wc-dc-dirty" : ""} title={cell(r.avant[c])}>
                      {cell(r.avant[c])}
                    </td>
                  ))}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="wc-dc-side wc-dc-after">
          <p className="wc-dc-side-title">APRÈS — nettoyé</p>
          <div
            ref={bRef} onScroll={() => sync(bRef.current, aRef.current)}
            className="wc-dc-side-tablewrap" tabIndex={0} role="group"
            aria-label={`Après nettoyage — ${total} lignes, faites défiler`}
          >
            <table className="wc-mr-table">
              <thead><tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
              <tbody>
                {apercu.map((r, i) => (
                  <tr key={i}>{cols.map((c) => (
                    <td key={c} className={r.changed?.[c] ? "wc-dc-fixed" : ""} title={cell(r.apres[c])}>
                      {cell(r.apres[c])}
                    </td>
                  ))}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
