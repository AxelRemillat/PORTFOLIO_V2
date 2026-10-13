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
import { getMetier, metiersFor, type MetierId } from "@/lib/metiers";
import { useLocale } from "@/lib/i18n/client";
import { AgentUiProvider, agentUi } from "./AgentUiContext";

type Phase = "idle" | "running" | "done" | "error";

// Démo agent devis : choix du métier → demande (libre ou exemple) → trace de
// l'agent → devis, questions, email, créneaux.
export default function AgentDemo({ initialMetier = "menuiserie" }: { initialMetier?: MetierId }) {
  const locale = useLocale();
  const t = agentUi(locale);
  const metiers = metiersFor(locale);
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

  const metier = getMetier(metierId, locale) ?? metiers[0];
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
        body: JSON.stringify({ demande, metier: metier.id, hp, locale }),
      });
      const data = await res.json();
      if (data.ok && data.result) { setTrace(data.trace ?? []); setResult(data.result as AgentResult); setPhase("done"); trackWithChannel("demo_result", { demo: `agent-${metier.id}` }); }
      else { setError(t.errors[data.error ?? "default"] ?? t.errors.default); setPhase("error"); }
    } catch { setError(t.errors.default); setPhase("error"); }
  };

  const accent = { "--wc-accent": "#ec4899", "--wc-accent-weak": "#ec489922" } as CSSProperties;

  return (
    <AgentUiProvider value={t}>
    <div style={accent}>
      <style>{AGENT_CSS}</style>
      <MetierPicker metiers={metiers} value={metier.id} onChange={pick} disabled={running} label={t.pickLabel} />
      <IdentityHeader metier={metier} />

      <div className="wc-card ag-card">
        <div className="wc-form">
          <div className="wc-try">
            <p className="wc-try-lbl">{t.tryLabel}</p>
            <div className="wc-examples">
              {metier.exemples.map((ex) => (
                <button key={ex.label} type="button" className="wc-ex" disabled={running}
                  onClick={() => { setValue(ex.texte); run(ex.texte); }}>{ex.label}</button>
              ))}
            </div>
          </div>

          <label htmlFor="ag-in" className="wc-label">{t.freeLabel}</label>
          <textarea id="ag-in" className="wc-ta" value={value} maxLength={1500} disabled={running}
            placeholder={metier.exemples[0].texte}
            onChange={(e) => setValue(e.target.value)} />
          <input className="wc-hp" type="text" name="hp" tabIndex={-1} autoComplete="off" aria-hidden="true"
            value={hp} onChange={(e) => setHp(e.target.value)} />

          <div className="wc-actions">
            <button type="button" className="wc-btn wc-primary" onClick={() => run(value)} disabled={running || !value.trim()}>
              {running ? t.running : t.run}
            </button>
          </div>
          <CatalogueDetails metier={metier} />
        </div>

        <div ref={outRef}>
          {phase === "error" && error && <p className="wc-error" role="alert">{error}</p>}
          {(phase === "running" || phase === "done") && (
            <>
              <p className="ag-seclabel">{t.stepsLabel}</p>
              {phase === "running"
                ? <div className="ag-think ag-think-solo" aria-live="polite">{t.starting}<span /><span /><span /></div>
                : <TraceLive key={runId} items={trace} />}
            </>
          )}
          {phase === "done" && result && <div className="ag-result"><ResultSections result={result} /></div>}
          <div ref={endRef} aria-hidden />
        </div>
      </div>
    </div>
    </AgentUiProvider>
  );
}
