"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import NodePipeline from "./NodePipeline";
import FileInput from "./FileInput";
import ReboundCard from "./ReboundCard";
import type { Suggestion } from "./ReboundCard";
import { runWorkflow, runWorkflowFile, GENERIC_ERRORS } from "./workflow-types";
import type { WorkflowConfig } from "./workflow-types";

const MIN_MS = 1200; // durée mini d'animation, lisible même si l'API est rapide
type Phase = "idle" | "running" | "done" | "error";

// Moteur réutilisable data-driven : input (textarea|file) + honeypot + exemple +
// appel API, états idle/running/done/error, mise en scène pipeline, carte de rebond.
export default function WorkflowCanvas({
  config, suggestions, onSelect,
}: { config: WorkflowConfig; suggestions?: Suggestion[]; onSelect?: (id: string) => void }) {
  const [value, setValue] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [hp, setHp] = useState(""); // honeypot : reste vide pour un humain
  const [phase, setPhase] = useState<Phase>("idle");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const timers = useRef<number[]>([]);

  const nodes = config.nodes;
  const isFile = config.inputType === "file";
  const lastProcess = Math.max(0, nodes.length - 2);
  const errors = { ...GENERIC_ERRORS, ...(config.errorMessages ?? {}) };
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const run = async () => {
    clearTimers();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPhase("running"); setResult(null); setError(null);
    setActiveIndex(reduce ? lastProcess : 0);

    let minDelay: Promise<unknown> = Promise.resolve();
    if (!reduce) {
      const step = Math.max(220, MIN_MS / Math.max(1, lastProcess));
      for (let i = 1; i <= lastProcess; i++) timers.current.push(window.setTimeout(() => setActiveIndex(i), i * step));
      minDelay = new Promise((r) => { timers.current.push(window.setTimeout(r, MIN_MS)); });
    }

    const fetchP = isFile
      ? runWorkflowFile(config.endpoint, config.inputField, file, hp)
      : runWorkflow(config.endpoint, config.inputField, value, hp);
    const [data] = await Promise.all([fetchP, minDelay]);
    clearTimers();

    if (data.ok && data.result != null) {
      setActiveIndex(nodes.length - 1);
      setResult(data.result);
      setPhase("done");
    } else {
      setError(errors[data.error ?? "default"] ?? errors.default);
      setPhase("error");
    }
  };

  const hasInput = isFile ? !!file : value.trim().length > 0;
  const canSubmit = hasInput && phase !== "running";
  const inId = `wc-in-${config.id}`;
  // Accent d'identité propagé à tout le sous-arbre (les règles lisent var(--wc-accent)).
  const accentVars = { "--wc-accent": config.accent, "--wc-accent-weak": `${config.accent}1f` } as CSSProperties;

  return (
    <div className="wc-card" style={accentVars}>
      <h2 className="wc-title">{config.title}</h2>
      <p className="wc-sub">{config.subtitle}</p>

      <div className="wc-form">
        {isFile ? (
          <FileInput id={inId} label={config.inputLabel} accept={config.accept} file={file} onChange={setFile} />
        ) : (
          <>
            <label htmlFor={inId} className="wc-label">{config.inputLabel}</label>
            <textarea
              id={inId} className="wc-ta" value={value} maxLength={4000}
              placeholder={config.placeholder} onChange={(e) => setValue(e.target.value)}
            />
          </>
        )}
        <input
          className="wc-hp" type="text" name="hp" tabIndex={-1} autoComplete="off"
          aria-hidden="true" value={hp} onChange={(e) => setHp(e.target.value)}
        />
        <div className="wc-actions">
          <button type="button" className="wc-btn wc-primary" onClick={run} disabled={!canSubmit}>
            {config.submitLabel ?? "Lancer le workflow"}
          </button>
          {!isFile && config.exampleText && (
            <button
              type="button" className="wc-btn wc-ghost" disabled={phase === "running"}
              onClick={() => setValue(config.exampleText as string)}
            >
              {config.exampleLabel ?? "Essayer avec cet exemple"}
            </button>
          )}
        </div>
      </div>

      <NodePipeline nodes={nodes} activeIndex={activeIndex} phase={phase} />

      {phase === "running" && (
        <p className="wc-status" aria-live="polite"><span className="wc-spin" aria-hidden />Exécution du workflow…</p>
      )}
      {phase === "error" && error && <p className="wc-error" role="alert">{error}</p>}
      {phase === "done" && result != null && <div className="wc-result">{config.renderResult(result)}</div>}
      {phase === "done" && suggestions && suggestions.length > 0 && (
        <ReboundCard suggestions={suggestions} onSelect={onSelect} />
      )}
    </div>
  );
}
