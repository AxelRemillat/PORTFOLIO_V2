"use client";

import { useState } from "react";

// Barre de saisie du chat : Entrée = envoyer, Shift+Entrée = nouvelle ligne.
// Désactivée pendant l'appel. Champ étiqueté via aria-label.
export default function SavInput({ onSend, disabled }: { onSend: (q: string) => void; disabled: boolean }) {
  const [value, setValue] = useState("");

  const submit = () => {
    const q = value.trim();
    if (!q || disabled) return;
    onSend(q);
    setValue("");
  };
  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
  };

  return (
    <div className="wc-chat-input">
      <textarea
        className="wc-chat-field" rows={1} value={value} maxLength={500} disabled={disabled}
        aria-label="Votre message" placeholder="Écrivez votre message…"
        onChange={(e) => setValue(e.target.value)} onKeyDown={onKey}
      />
      <button
        type="button" className="wc-chat-send" onClick={submit}
        disabled={disabled || !value.trim()} aria-label="Envoyer le message"
      >
        Envoyer
      </button>
    </div>
  );
}
