"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  disabled: boolean;
  onSubmit: (s: string) => void;
  // Pré-remplissage (clic sur une suggestion) : `key` change à chaque clic pour
  // ré-appliquer même si l'utilisateur reclique la même question.
  prefill?: { text: string; key: number } | null;
}

// Glyphe filaire (outline)
const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
    <path d="M2.5 8h10M8.5 4l4 4-4 4" />
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
      <button type="submit" className="hud-glyph" disabled={disabled || !val.trim()} aria-label="Envoyer" title="Envoyer">
        <SendIcon />
      </button>
    </form>
  );
}
