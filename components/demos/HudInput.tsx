"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  disabled: boolean;
  isVoiceOn: boolean;
  onToggleVoice: () => void;
  onSubmit: (s: string) => void;
}

// Glyphes filaires (outline) — remplacent les ronds pleins orange
const SpeakerOn = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
    <path d="M3 6v4h2.5L9 13V3L5.5 6H3z" /><path d="M11.5 5.5a3.4 3.4 0 0 1 0 5" />
  </svg>
);
const SpeakerOff = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
    <path d="M3 6v4h2.5L9 13V3L5.5 6H3z" /><path d="M11.5 6l3 4M14.5 6l-3 4" />
  </svg>
);
const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
    <path d="M2.5 8h10M8.5 4l4 4-4 4" />
  </svg>
);

export default function HudInput({ disabled, isVoiceOn, onToggleVoice, onSubmit }: Props) {
  const [val, setVal] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  // Redonne le focus à l'input dès le retour en idle (continuité clavier)
  useEffect(() => { if (!disabled) ref.current?.focus(); }, [disabled]);

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
        placeholder="interroge VEGA…"
        maxLength={500}
        disabled={disabled}
        aria-label="Pose ta question à VEGA"
      />
      <button
        type="button"
        onClick={onToggleVoice}
        className={`hud-glyph${isVoiceOn ? " on" : ""}`}
        aria-label={isVoiceOn ? "Couper le son" : "Activer le son"}
        title="Voix"
      >
        {isVoiceOn ? <SpeakerOn /> : <SpeakerOff />}
      </button>
      <button type="submit" className="hud-glyph" disabled={disabled || !val.trim()} aria-label="Envoyer" title="Envoyer">
        <SendIcon />
      </button>
    </form>
  );
}
