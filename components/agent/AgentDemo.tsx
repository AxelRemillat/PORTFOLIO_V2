"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import TraceLive, { type TraceItem } from "./TraceLive";
import ResultSections, { type AgentResult } from "./ResultSections";
import { AGENT_CSS } from "./agentCss";

const EXAMPLES = [
  "Bonjour, j'équipe un nouveau bureau : 4 bureaux assis-debout et 4 fauteuils ergonomiques, livraison à Lyon sous 2 semaines si possible. Vous pouvez me faire un devis ?",
  "Il me faudrait 10 chaises de réunion et une grande table de réunion, budget serré. Qu'est-ce que vous proposez ?",
  "Je voudrais 50 casiers de vestiaire livrés à Ajaccio pour la semaine prochaine, c'est jouable ?",
];
const ERRORS: Record<string, string> = {
  rate_limited: "Trop d'essais rapprochés (l'agent est gourmand). Réessaie dans une minute.",
  demo_busy: "Démo très sollicitée aujourd'hui, réessaie plus tard.",
  demo_disabled: "Démo momentanément indisponible.",
  invalid_input: "Demande invalide (vide ou trop longue).",
  upstream_error: "L'agent est injoignable, réessaie plus tard.",
  default: "Une erreur est survenue, réessaie.",
};
type Phase = "idle" | "running" | "done" | "error";

export default function AgentDemo() {
  const [value, setValue] = useState("");
  const [hp, setHp] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [trace, setTrace] = useState<TraceItem[]>([]);
  const [result, setResult] = useState<AgentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [runId, setRunId] = useState(0);
  const outRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll qui SUIT l'agent : à chaque nouvelle étape/section, on garde le bas
  // visible (smooth). Stop dès que l'utilisateur reprend la main (molette, tactile,
  // clavier) ; reprise s'il redescend tout en bas. Aucun setState → lint-safe.
  useEffect(() => {
    const el = outRef.current;
    if (!el) return;
    let following = true;
    const follow = () => { if (following) endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); };
    const obs = new MutationObserver(follow);
    obs.observe(el, { childList: true, subtree: true });
    const stop = () => { following = false; };
    const onScroll = () => {
      if (following) return;
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 60) following = true;
    };
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchmove", stop, { passive: true });
    window.addEventListener("keydown", stop);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      obs.disconnect();
      window.removeEventListener("wheel", stop); window.removeEventListener("touchmove", stop);
      window.removeEventListener("keydown", stop); window.removeEventListener("scroll", onScroll);
    };
  }, [runId]);

  const run = async (demande: string) => {
    if (phase === "running" || !demande.trim()) return;
    setRunId((n) => n + 1); // relance le suivi auto + remonte la trace
    setPhase("running"); setTrace([]); setResult(null); setError(null);
    try {
      const res = await fetch("/api/demo/agent", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ demande, hp }),
      });
      const data = await res.json();
      if (data.ok && data.result) { setTrace(data.trace ?? []); setResult(data.result as AgentResult); setPhase("done"); }
      else { setError(ERRORS[data.error ?? "default"] ?? ERRORS.default); setPhase("error"); }
    } catch { setError(ERRORS.default); setPhase("error"); }
  };

  const accent = { "--wc-accent": "#ec4899", "--wc-accent-weak": "#ec489922" } as CSSProperties;
  const running = phase === "running";

  return (
    <div className="wc-card ag-card" style={accent}>
      <style>{AGENT_CSS}</style>

      <div className="wc-form">
        <label htmlFor="ag-in" className="wc-label">Demande client entrante</label>
        <textarea id="ag-in" className="wc-ta" value={value} maxLength={1500} disabled={running}
          placeholder="Ex : j'équipe 6 postes, livraison à Bordeaux, votre meilleur prix ? (ou une question : garanties, paiement, délais…)"
          onChange={(e) => setValue(e.target.value)} />
        <input className="wc-hp" type="text" name="hp" tabIndex={-1} autoComplete="off" aria-hidden="true"
          value={hp} onChange={(e) => setHp(e.target.value)} />

        <div className="wc-try">
          <p className="wc-try-lbl">Pas d&apos;idée&nbsp;? Testez avec une demande&nbsp;:</p>
          <div className="wc-examples">
            {EXAMPLES.map((ex, i) => (
              <button key={i} type="button" className="wc-ex" disabled={running} onClick={() => { setValue(ex); run(ex); }}
                aria-label={`Exemple ${i + 1}`}>Exemple {i + 1}</button>
            ))}
          </div>
        </div>

        <div className="wc-actions">
          <button type="button" className="wc-btn wc-primary" onClick={() => run(value)} disabled={running || !value.trim()}>
            {running ? "L'agent travaille…" : "Lancer l'agent"}
          </button>
        </div>
      </div>

      <div ref={outRef}>
        {phase === "error" && error && <p className="wc-error" role="alert">{error}</p>}
        {(phase === "running" || phase === "done") && (
          <>
            <p className="ag-seclabel">Trace de l&apos;agent</p>
            {phase === "running"
              ? <div className="ag-think ag-think-solo" aria-live="polite">L&apos;agent démarre<span /><span /><span /></div>
              : <TraceLive key={runId} items={trace} />}
          </>
        )}
        {phase === "done" && result && <div className="ag-result"><ResultSections result={result} /></div>}
        <div ref={endRef} aria-hidden />
      </div>
    </div>
  );
}
