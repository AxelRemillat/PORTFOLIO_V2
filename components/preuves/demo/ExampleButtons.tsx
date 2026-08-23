"use client";

import type { WorkflowExamples } from "./workflow-types";
import type { InputMode } from "./ModeSelector";

type Kind = "text" | "audio" | "file";
const PATHS: Record<Kind, React.ReactNode> = {
  text: <path d="M4 7h16M4 12h16M4 17h10" />,
  audio: <path d="M8 5v14l11-7z" />,
  file: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></>,
};
function ExIcon({ kind }: { kind: Kind }) {
  return (
    <svg viewBox="0 0 24 24" fill={kind === "audio" ? "currentColor" : "none"} stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{PATHS[kind]}</svg>
  );
}

// Bloc « ou testez un exemple » (générique, tous onglets). Boutons évidents : icône
// par type + libellé + aria-label. Texte remplit la zone ; audio/fichier = fetch →
// File → soumission. Rien si aucun exemple.
export default function ExampleButtons({
  examples, mode, disabled, onText, onAudio, exampleText, exampleLabel,
}: {
  examples?: WorkflowExamples; mode: InputMode; disabled: boolean;
  onText: (v: string) => void; onAudio: (f: File) => void;
  exampleText?: string; exampleLabel?: string;
}) {
  const loadFile = async (src: string) => {
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      onAudio(new File([blob], src.split("/").pop() ?? "fichier", { type: blob.type || "application/octet-stream" }));
    } catch { /* réseau : réessayer */ }
  };

  const items: { key: string; label: string; kind: Kind; on: () => void }[] = [];
  if (mode === "file") {
    const list = examples?.file ?? examples?.audio;
    const kind: Kind = examples?.file ? "file" : "audio";
    (list ?? []).forEach((ex) => items.push({ key: ex.label, label: ex.label, kind, on: () => loadFile(ex.src) }));
  } else if (examples?.text?.length) {
    examples.text.forEach((ex) => items.push({ key: ex.label, label: ex.label, kind: "text", on: () => onText(ex.value) }));
  } else if (exampleText) {
    items.push({ key: "ex", label: exampleLabel ?? "Essayer avec cet exemple", kind: "text", on: () => onText(exampleText) });
  }
  if (!items.length) return null;

  return (
    <div className="wc-try">
      <p className="wc-try-lbl">Pas d&apos;idée&nbsp;? Testez avec un exemple&nbsp;:</p>
      <div className="wc-examples">
        {items.map((it) => (
          <button key={it.key} type="button" className="wc-ex" disabled={disabled}
            onClick={it.on} aria-label={`Exemple : ${it.label}`}>
            <span className="wc-ex-ico"><ExIcon kind={it.kind} /></span>
            {it.label}
          </button>
        ))}
      </div>
    </div>
  );
}
