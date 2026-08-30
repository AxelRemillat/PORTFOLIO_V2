"use client";

import { useState } from "react";
import DevisTable, { type AgentDevis } from "./DevisTable";
import CalendarView, { type Creneau } from "./CalendarView";

export interface AgentResult {
  faisable: boolean;
  devis: AgentDevis | null;
  email: string;
  reponse: string;
  creneaux: Creneau[];
  note: string;
}

// Livrable en sections EMPILÉES, toutes visibles d'office (pas d'onglets) :
// Devis (si applicable) → Email client (toujours) → Rendez-vous.
export default function ResultSections({ result }: { result: AgentResult }) {
  const [copied, setCopied] = useState(false);
  const hasDevis = !!result.devis && result.devis.lignes?.length > 0;
  const emailText = result.email || result.reponse || "";

  const copy = () => {
    if (!navigator.clipboard || !emailText) return;
    navigator.clipboard.writeText(emailText).then(() => {
      setCopied(true); window.setTimeout(() => setCopied(false), 1800);
    }, () => {});
  };

  return (
    <>
      {(!result.faisable || result.note) && result.note && (
        <div className="ag-alt" role="status">
          <span aria-hidden>⚠</span>
          <span><b>{result.faisable ? "À noter" : "Demande non satisfaite en l'état"} :</b> {result.note}</span>
        </div>
      )}

      {hasDevis && (
        <section className="ag-section">
          <p className="ag-seclabel">Devis</p>
          <DevisTable devis={result.devis!} />
        </section>
      )}

      <section className="ag-section">
        <p className="ag-seclabel">Email client</p>
        <div className="wc-res-reply">
          {emailText && <button type="button" className="wc-res-copy" onClick={copy}>{copied ? "Copié ✓" : "Copier"}</button>}
          {emailText || "—"}
        </div>
      </section>

      {result.creneaux?.length > 0 && (
        <section className="ag-section">
          <p className="ag-seclabel">Rendez-vous</p>
          <CalendarView creneaux={result.creneaux} />
        </section>
      )}
    </>
  );
}
