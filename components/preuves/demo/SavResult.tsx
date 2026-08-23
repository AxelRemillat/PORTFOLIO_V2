"use client";

import { useState } from "react";
import { SAV_CSS } from "./savCss";

export interface SavSource { id?: string | number; question?: string | null }
export interface SavExtrait { id?: string | number; question?: string | null; score?: number | string | null }
export interface SavData {
  question?: string | null;
  reponse?: string | null;
  confiance?: number | null;   // 0-100
  hors_sujet?: boolean;
  sources?: SavSource[];
  extraits?: SavExtrait[];
  trouve?: boolean;            // ancien contrat, conservé pour compat
}

// renderResult de la démo SAV (RAG). Point fort en haut : bandeau « réponse sourcée »
// (trouve) vs « transfert conseiller » (anti-hallucination). Puis la réponse + Copier,
// les sources citées (preuve d'ancrage) et les extraits consultés (repliable).
export default function SavResult({ result }: { result: SavData }) {
  const [copied, setCopied] = useState(false);
  const ok = result.trouve === true;
  const reponse = result.reponse ?? "";
  const sources = result.sources ?? [];
  const extraits = result.extraits ?? [];

  const copy = () => {
    if (!navigator.clipboard || !reponse) return;
    navigator.clipboard.writeText(reponse).then(
      () => { setCopied(true); window.setTimeout(() => setCopied(false), 1800); },
      () => {},
    );
  };

  return (
    <>
      <style>{SAV_CSS}</style>

      <div className={`wc-sav-banner ${ok ? "is-ok" : "is-warn"}`} role="status">
        <span className="wc-sav-banner-ico" aria-hidden>{ok ? "✓" : "⚠"}</span>
        <span>{ok
          ? "Réponse issue de la base de connaissance"
          : "Non couvert par la base — transfert à un conseiller"}</span>
      </div>

      <p className="wc-res-lbl">Réponse</p>
      <div className="wc-res-reply">
        {reponse && (
          <button type="button" className="wc-res-copy" onClick={copy}>{copied ? "Copié ✓" : "Copier"}</button>
        )}
        {reponse || "—"}
      </div>

      {sources.length > 0 && (
        <>
          <p className="wc-res-lbl">Sources citées</p>
          <div className="wc-sav-sources">
            {sources.map((s, i) => (
              <span key={`${s.id ?? i}`} className="wc-sav-chip">
                <code>{String(s.id ?? "?")}</code>{s.question ?? ""}
              </span>
            ))}
          </div>
        </>
      )}

      {extraits.length > 0 && (
        <details className="wc-sav-extraits">
          <summary>Extraits consultés ({extraits.length})</summary>
          <ul>
            {extraits.map((e, i) => (
              <li key={`${e.id ?? i}`}>
                <span className="wc-sav-ex-id">{String(e.id ?? "?")}</span>
                <span>{e.question ?? ""}</span>
                {e.score != null && e.score !== "" && <span className="wc-sav-ex-score">score {String(e.score)}</span>}
              </li>
            ))}
          </ul>
        </details>
      )}
    </>
  );
}
