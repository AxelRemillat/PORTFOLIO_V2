"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import TraceLive, { type TraceItem } from "./TraceLive";
import ResultSections, { type AgentResult } from "./ResultSections";
import IdentityHeader from "./IdentityHeader";
import CatalogueDetails from "./CatalogueDetails";
import MetierPicker from "@/components/demo-kit/MetierPicker";
import { trackWithChannel } from "@/lib/analytics";
import { useFollowScroll } from "./useFollowScroll";
import { AGENT_CSS } from "./agentCss";
import { METIERS, getMetier, type MetierId } from "@/lib/metiers";

const ERRORS: Record<string, string> = {
  rate_limited: "Trop d'essais rapprochés. Réessayez dans une minute.",
  demo_busy: "Démo très sollicitée aujourd'hui, réessayez plus tard.",
  demo_disabled: "Démo momentanément indisponible.",
  invalid_input: "Demande invalide (vide ou trop longue).",
  upstream_error: "L'agent est injoignable, réessayez plus tard.",
  default: "Une erreur est survenue, réessayez.",
};
type Phase = "idle" | "running" | "done" | "error";

// Démo agent devis : choix du métier → demande (libre ou exemple) → trace de
// l'agent → devis, questions, email, créneaux.
export default function AgentDemo({ initialMetier = "menuiserie" }: { initialMetier?: MetierId }) {
  const [metierId, setMetierId] = useState<MetierId>(initialMetier);
  const [value, setValue] = useState("");
  const [hp, setHp] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [trace, setTrace] = useState<TraceItem[]>([]);
  const [result, setResult] = useState<AgentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [runId, setRunId] = useState(0);
  const outRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  useFollowScroll(outRef, endRef, runId);

  const metier = getMetier(metierId) ?? METIERS[0];
  const running = phase === "running";

  const pick = (id: MetierId) => {
    setMetierId(id); setValue(""); setPhase("idle"); setResult(null); setTrace([]); setError(null);
  };

  const run = async (demande: string) => {
    if (running || !demande.trim()) return;
    // Nom stable (docs/tracking.md) et canal de la session recolle.
    trackWithChannel("demo_start", { demo: `agent-${metier.id}` });
    setRunId((n) => n + 1);
    setPhase("running"); setTrace([]); setResult(null); setError(null);
    try {
      const res = await fetch("/api/demo/agent", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demande, metier: metier.id, hp }),
      });
      const data = await res.json();
      if (data.ok && data.result) { setTrace(data.trace ?? []); setResult(data.result as AgentResult); setPhase("done"); trackWithChannel("demo_result", { demo: `agent-${metier.id}` }); }
      else { setError(ERRORS[data.error ?? "default"] ?? ERRORS.default); setPhase("error"); }
    } catch { setError(ERRORS.default); setPhase("error"); }
  };

  const accent = { "--wc-accent": "#ec4899", "--wc-accent-weak": "#ec489922" } as CSSProperties;

  return (
    <div style={accent}>
      <style>{AGENT_CSS}</style>
      <MetierPicker metiers={METIERS} value={metier.id} onChange={pick} disabled={running} />
      <IdentityHeader metier={metier} />

      <div className="wc-card ag-card">
        <div className="wc-form">
          <div className="wc-try">
            <p className="wc-try-lbl">Testez avec une demande type&nbsp;:</p>
            <div className="wc-examples">
              {metier.exemples.map((ex) => (
                <button key={ex.label} type="button" className="wc-ex" disabled={running}
                  onClick={() => { setValue(ex.texte); run(ex.texte); }}>{ex.label}</button>
              ))}
            </div>
          </div>

          <label htmlFor="ag-in" className="wc-label">…ou écrivez la demande d&apos;un client</label>
          <textarea id="ag-in" className="wc-ta" value={value} maxLength={1500} disabled={running}
            placeholder={metier.exemples[0].texte}
            onChange={(e) => setValue(e.target.value)} />
          <input className="wc-hp" type="text" name="hp" tabIndex={-1} autoComplete="off" aria-hidden="true"
            value={hp} onChange={(e) => setHp(e.target.value)} />

          <div className="wc-actions">
            <button type="button" className="wc-btn wc-primary" onClick={() => run(value)} disabled={running || !value.trim()}>
              {running ? "L'agent prépare le devis…" : "Lancer l'agent"}
            </button>
          </div>
          <CatalogueDetails metier={metier} />
        </div>

        <div ref={outRef}>
          {phase === "error" && error && <p className="wc-error" role="alert">{error}</p>}
          {(phase === "running" || phase === "done") && (
            <>
              <p className="ag-seclabel">Ce que fait l&apos;agent</p>
              {phase === "running"
                ? <div className="ag-think ag-think-solo" aria-live="polite">L&apos;agent démarre<span /><span /><span /></div>
                : <TraceLive key={runId} items={trace} />}
            </>
          )}
          {phase === "done" && result && <div className="ag-result"><ResultSections result={result} /></div>}
          <div ref={endRef} aria-hidden />
        </div>
      </div>
    </div>
  );
}
