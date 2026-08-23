"use client";

export type InputMode = "text" | "file";
export interface ModeOption { id: InputMode; label: string }

// Sélecteur de mode d'entrée (Texte / Audio) pour les démos "dual". Radiogroup
// accessible : flèches ←/→ (focus suivi), aria-checked, tabindex roving.
export default function ModeSelector({
  options, value, onChange,
}: { options: ModeOption[]; value: InputMode; onChange: (m: InputMode) => void }) {
  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const idx = options.findIndex((o) => o.id === value);
    const next = (idx + dir + options.length) % options.length;
    onChange(options[next].id);
    e.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]')[next]?.focus();
  };

  return (
    <div className="wc-modes" role="radiogroup" aria-label="Mode d'entrée" onKeyDown={onKey}>
      {options.map((o) => (
        <button
          key={o.id} type="button" role="radio" aria-checked={o.id === value}
          tabIndex={o.id === value ? 0 : -1}
          className={`wc-mode ${o.id === value ? "is-on" : ""}`} onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
