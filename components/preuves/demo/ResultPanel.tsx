"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { CATEGORY_COLORS, PRIORITY_COLORS } from "./email-triage-lib";
import type { TriageResult } from "./email-triage-lib";

// Affichage du résultat de tri : badges catégorie/priorité (couleur sémantique),
// points clés, réponse suggérée avec « Copier », langue détectée.
const badge = (c: string): CSSProperties => ({ color: c, background: `${c}22`, border: `1px solid ${c}66` });

export default function ResultPanel({ result }: { result: TriageResult }) {
  const [copied, setCopied] = useState(false);
  const catColor = CATEGORY_COLORS[result.categorie] ?? CATEGORY_COLORS.autre;
  const priColor = PRIORITY_COLORS[result.priorite] ?? "#94a3b8";

  const copy = () => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(result.reponse_suggeree).then(
      () => { setCopied(true); window.setTimeout(() => setCopied(false), 1800); },
      () => {},
    );
  };

  return (
    <div className="etd-result" aria-live="polite">
      <div className="etd-badges">
        <span className="etd-badge" style={badge(catColor)}>{result.categorie}</span>
        <span className="etd-badge" style={badge(priColor)}>priorité {result.priorite}</span>
        <span className="etd-lang">langue : {result.langue}</span>
      </div>

      {result.justification_priorite && <p className="etd-just">{result.justification_priorite}</p>}

      {result.points_cles?.length > 0 && (
        <div>
          <p className="etd-lbl">Points clés</p>
          <ul className="etd-keys">
            {result.points_cles.map((k) => <li key={k}>{k}</li>)}
          </ul>
        </div>
      )}

      <div>
        <p className="etd-lbl">Réponse suggérée</p>
        <div className="etd-reply">
          <button type="button" className="etd-copy" onClick={copy}>
            {copied ? "Copié ✓" : "Copier"}
          </button>
          {result.reponse_suggeree}
        </div>
      </div>
    </div>
  );
}
