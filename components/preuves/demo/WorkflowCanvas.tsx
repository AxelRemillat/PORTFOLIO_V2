"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import NodePipeline from "./NodePipeline";
import FileInput from "./FileInput";
import ModeSelector from "./ModeSelector";
import type { InputMode } from "./ModeSelector";
import ExampleButtons from "./ExampleButtons";
import ReboundCard from "./ReboundCard";
import type { Suggestion } from "./ReboundCard";
import { runWorkflow, runWorkflowFile, GENERIC_ERRORS } from "./workflow-types";
import type { WorkflowConfig, WorkflowResponse } from "./workflow-types";

const MIN_MS = 1200; // durée mini d'animation, lisible même si l'API est rapide
type Phase = "idle" | "running" | "done" | "error";

// Moteur réutilisable data-driven : input (textarea | file | dual) + honeypot +
// exemples + appel API, états idle/running/done/error, pipeline animé, rebond.
export default function WorkflowCanvas({
  config, suggestions, onSelect,
}: { config: WorkflowConfig; suggestions?: Suggestion[]; onSelect?: (id: string) => void }) {
  const [mode, setMode] = useState<InputMode>(config.inputType === "file" ? "file" : "text");
  const [value, setValue] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null); // vignette (objectURL)
  const urlRef = useRef<string | null>(null);
  const [hp, setHp] = useState(""); // honeypot : reste vide pour un humain
  const [phase, setPhase] = useState<Phase>("idle");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [response, setResponse] = useState<WorkflowResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timers = useRef<number[]>([]);

  const nodes = config.nodes;
  const isDual = config.inputType === "dual";
  const lastProcess = Math.max(0, nodes.length - 2);
  const errors = { ...GENERIC_ERRORS, ...(config.errorMessages ?? {}) };
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  // Sélection de fichier → maj état + vignette (objectURL), l'ancien URL est révoqué.
  // Dans un handler (pas un effet) → conforme au lint strict react-hooks.
  const selectFile = (f: File | null) => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    const u = f ? URL.createObjectURL(f) : null;
    urlRef.current = u;
    setFile(f);
    setFileUrl(u);
  };
  useEffect(() => () => { if (urlRef.current) URL.revokeObjectURL(urlRef.current); }, []);

  const run = async (ov?: { mode?: InputMode; value?: string; file?: File | null }) => {
    clearTimers();
    const m = ov?.mode ?? mode;
    const v = ov?.value ?? value;
    const f = ov?.file ?? file;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPhase("running"); setResponse(null); setError(null);
    setActiveIndex(reduce ? lastProcess : 0);

    let minDelay: Promise<unknown> = Promise.resolve();
    if (!reduce) {
      const step = Math.max(220, MIN_MS / Math.max(1, lastProcess));
      for (let i = 1; i <= lastProcess; i++) timers.current.push(window.setTimeout(() => setActiveIndex(i), i * step));
      minDelay = new Promise((r) => { timers.current.push(window.setTimeout(r, MIN_MS)); });
    }

    const audioField = config.audioField ?? config.inputField;
    const fetchP = m === "file"
      ? runWorkflowFile(config.endpoint, audioField, f, hp)
      : runWorkflow(config.endpoint, config.inputField, v, hp);
    const [data] = await Promise.all([fetchP, minDelay]);
    clearTimers();

    if (data.ok && data.result != null) {
      setActiveIndex(nodes.length - 1);
      setResponse(data);
      setPhase("done");
    } else {
      setError(errors[data.error ?? "default"] ?? errors.default);
      setPhase("error");
    }
  };

  // Exemple audio : le fichier est déjà chargé → on bascule en mode audio et on lance.
  const onAudioExample = (f: File) => { setMode("file"); selectFile(f); run({ mode: "file", file: f }); };

  const running = phase === "running";
  const hasInput = mode === "file" ? !!file : value.trim().length > 0;
  const canSubmit = hasInput && !running;
  const inId = `wc-in-${config.id}`;
  const accentVars = { "--wc-accent": config.accent, "--wc-accent-weak": `${config.accent}1f` } as CSSProperties;

  return (
    <div className="wc-card" style={accentVars}>
      <h2 className="wc-title">{config.title}</h2>
      <p className="wc-sub">{config.subtitle}</p>

      <div className="wc-form">
        {isDual && (
          <ModeSelector
            options={[{ id: "text", label: "Texte" }, { id: "file", label: config.audioLabel ?? "Audio" }]}
            value={mode} onChange={setMode}
          />
        )}

        {mode === "file" ? (
          <FileInput id={inId} label={config.inputLabel} accept={config.accept} file={file} onChange={selectFile} />
        ) : (
          <>
            <label htmlFor={inId} className="wc-label">{config.inputLabel}</label>
            <textarea
              id={inId} className="wc-ta" value={value} maxLength={config.textMax ?? 4000}
              placeholder={config.placeholder} onChange={(e) => setValue(e.target.value)}
            />
          </>
        )}

        <input
          className="wc-hp" type="text" name="hp" tabIndex={-1} autoComplete="off"
          aria-hidden="true" value={hp} onChange={(e) => setHp(e.target.value)}
        />

        <ExampleButtons
          examples={config.examples} mode={mode} disabled={running}
          onText={setValue} onAudio={onAudioExample}
          exampleText={config.exampleText} exampleLabel={config.exampleLabel}
        />

        <div className="wc-actions">
          <button type="button" className="wc-btn wc-primary" onClick={() => run()} disabled={!canSubmit}>
            {config.submitLabel ?? "Lancer le workflow"}
          </button>
        </div>
      </div>

      <NodePipeline nodes={nodes} activeIndex={activeIndex} phase={phase} />

      {running && <p className="wc-status" aria-live="polite"><span className="wc-spin" aria-hidden />Exécution du workflow…</p>}
      {phase === "error" && error && <p className="wc-error" role="alert">{error}</p>}
      {phase === "done" && response?.result != null && (
        <div className="wc-result">
          {config.renderResult(response.result, response, { fileUrl, fileType: file?.type, fileName: file?.name })}
        </div>
      )}
      {phase === "done" && suggestions && suggestions.length > 0 && (
        <ReboundCard suggestions={suggestions} onSelect={onSelect} />
      )}
    </div>
  );
}
