"use client";

import { useRef } from "react";

interface Props {
  id: string;
  label: string;
  accept?: string;
  file: File | null;
  onChange: (f: File | null) => void;
}

// Champ fichier stylé (pour inputType "file"). L'input natif est visuellement caché
// mais accessible (label associé) ; le bouton visible déclenche la boîte de dialogue.
export default function FileInput({ id, label, accept, file, onChange }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="wc-file">
      <label htmlFor={id} className="wc-label">{label}</label>
      <div className="wc-file-drop">
        <button type="button" className="wc-file-btn" onClick={() => ref.current?.click()}>
          Choisir un fichier
        </button>
        <span className="wc-file-name">{file ? file.name : "Aucun fichier sélectionné"}</span>
      </div>
      <input
        ref={ref} id={id} className="wc-file-input" type="file" accept={accept}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
