"use client";
import { useEffect, useRef, useState } from "react";
import { useSpeechToText } from "./useSpeechToText";

interface Props {
  disabled: boolean;
  onSubmit: (s: string) => void;
  // Pré-remplissage (clic sur une suggestion) : `key` change à chaque clic pour
  // ré-appliquer même si l'utilisateur reclique la même question.
  prefill?: { text: string; key: number } | null;
}

// Glyphes filaires (outline)
const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
    <path d="M2.5 8h10M8.5 4l4 4-4 4" />
  </svg>
);
const MicIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
    <rect x="6" y="1.5" width="4" height="7.5" rx="2" />
    <path d="M3.5 7.5a4.5 4.5 0 0 0 9 0M8 12.5v2" />
  </svg>
);

export default function HudInput({ disabled, onSubmit, prefill }: Props) {
  const [val, setVal] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  // Redonne le focus à l'input dès le retour en idle (continuité clavier)
  useEffect(() => { if (!disabled) ref.current?.focus(); }, [disabled]);

  // Suggestion cliquée → écrite dans la barre, focus : l'utilisateur n'a plus qu'à valider
  useEffect(() => {
    if (!prefill) return;
    setVal(prefill.text);
    ref.current?.focus();
  }, [prefill]);

  // Dictée vocale : la transcription s'écrit en direct dans la barre (à la suite
  // de ce qui était déjà tapé), l'utilisateur valide lui-même à la fin.
  const dictBase = useRef("");
  const { supported, listening, toggle } = useSpeechToText({
    onText: (t) => setVal(dictBase.current ? `${dictBase.current} ${t}` : t),
    onEnd: () => ref.current?.focus(),
  });
  const onMic = () => { dictBase.current = val.trim(); toggle(); };

  const submit = () => {
    const t = val.trim();
    if (!t || disabled) return;
    onSubmit(t);
    setVal("");
  };

  return (
    <form className="hud-row" onSubmit={(e) => { e.preventDefault(); submit(); }}>
      <span className="hud-prompt">&gt;</span>
      <input
        ref={ref}
        className="hud-field"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Posez votre question…"
        maxLength={500}
        disabled={disabled}
        aria-label="Posez votre question à VEGA"
      />
      {supported && (
        <button
          type="button"
          className={`hud-glyph hud-mic${listening ? " hud-mic-on" : ""}`}
          onClick={onMic}
          disabled={disabled}
          aria-label={listening ? "Arrêter la dictée" : "Dicter la question au micro"}
          aria-pressed={listening}
          title={listening ? "J'écoute… (clic pour arrêter)" : "Commande vocale"}
        >
          <MicIcon />
        </button>
      )}
      <button type="submit" className="hud-glyph" disabled={disabled || !val.trim()} aria-label="Envoyer" title="Envoyer">
        <SendIcon />
      </button>
    </form>
  );
}
