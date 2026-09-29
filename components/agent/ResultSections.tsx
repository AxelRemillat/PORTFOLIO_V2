"use client";

import { useState } from "react";
import DevisTable, { type AgentDevis } from "./DevisTable";
import CalendarView, { type Creneau } from "./CalendarView";

export interface AgentResult {
  complet: boolean;
  devis: AgentDevis | null;
  email: string;
  reponse: string;
  questions: string[];
  creneaux: Creneau[];
  note: string;
}

// Livrable en sections empilées : Devis → Questions au client → Email → Rendez-vous.
// Un devis partiel est annoncé comme tel, jamais comme un refus.
export default function ResultSections({ result }: { result: AgentResult }) {
  const [copied, setCopied] = useState(false);
  const hasDevis = !!result.devis;
  const emailText = result.email || result.reponse || "";
  const questions = result.questions ?? [];

  const copy = () => {
    if (!navigator.clipboard || !emailText) return;
    navigator.clipboard.writeText(emailText).then(() => {
      setCopied(true); window.setTimeout(() => setCopied(false), 1800);
    }, () => {});
  };

  return (
    <>
      {hasDevis && !result.complet && (
        <div className="ag-alt" role="status">
          <span aria-hidden>✎</span>
          <span><b>Devis partiel :</b> tout ce qui est au catalogue est chiffré ; le reste attend les réponses du client.{result.note ? ` ${result.note}` : ""}</span>
        </div>
      )}

      {hasDevis && (
        <section className="ag-section">
          <p className="ag-seclabel">Devis</p>
          <DevisTable devis={result.devis!} />
        </section>
      )}

      {questions.length > 0 && (
        <section className="ag-section">
          <p className="ag-seclabel">Questions à poser au client</p>
          <ul className="ag-qs">{questions.map((q) => <li key={q}>{q}</li>)}</ul>
        </section>
      )}

      <section className="ag-section">
        <p className="ag-seclabel">Email de réponse</p>
        <div className="wc-res-reply">
          {emailText && <button type="button" className="wc-res-copy" onClick={copy}>{copied ? "Copié ✓" : "Copier"}</button>}
          {emailText || "—"}
        </div>
      </section>

      {result.creneaux?.length > 0 && (
        <section className="ag-section">
          <p className="ag-seclabel">Rendez-vous proposés</p>
          <CalendarView creneaux={result.creneaux} />
        </section>
      )}
    </>
  );
}
