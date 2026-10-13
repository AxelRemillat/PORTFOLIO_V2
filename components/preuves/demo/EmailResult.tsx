"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { CATEGORY_COLORS, PRIORITY_COLORS } from "./email-triage-lib";
import type { TriageResult } from "./email-triage-lib";
import { useDemoUi } from "./DemoUiContext";

// renderResult de la démo tri d'email : badges catégorie/priorité/langue, points
// clés, réponse suggérée + « Copier ». Utilise les classes .wc-res-* (thème clair).
const badge = (c: string): CSSProperties => ({ color: c, background: `${c}1f`, border: `1px solid ${c}55` });

export default function EmailResult({ result }: { result: TriageResult }) {
  const ui = useDemoUi();
  const e = ui.email;
  const [copied, setCopied] = useState(false);
  const cat = CATEGORY_COLORS[result.categorie] ?? CATEGORY_COLORS.autre;
  const pri = PRIORITY_COLORS[result.priorite] ?? "#6b7280";

  const copy = () => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(result.reponse_suggeree).then(
      () => { setCopied(true); window.setTimeout(() => setCopied(false), 1800); },
      () => {},
    );
  };

  return (
    <>
      <div className="wc-res-badges">
        <span className="wc-res-badge" style={badge(cat)}>{e.categories[result.categorie] ?? result.categorie}</span>
        <span className="wc-res-badge" style={badge(pri)}>{e.priority(e.priorities[result.priorite] ?? result.priorite)}</span>
        <span className="wc-res-lang">{e.lang(result.langue)}</span>
      </div>
      {result.justification_priorite && (
        <p style={{ fontSize: ".82rem", color: "var(--wc-muted)", margin: "0 0 1rem" }}>
          {result.justification_priorite}
        </p>
      )}

      {result.points_cles?.length > 0 && (
        <>
          <p className="wc-res-lbl">{e.keyPoints}</p>
          <ul className="wc-res-keys">{result.points_cles.map((k) => <li key={k}>{k}</li>)}</ul>
        </>
      )}

      <p className="wc-res-lbl">{e.reply}</p>
      <div className="wc-res-reply">
        <button type="button" className="wc-res-copy" onClick={copy}>{copied ? ui.copied : ui.copy}</button>
        {result.reponse_suggeree}
      </div>
    </>
  );
}
