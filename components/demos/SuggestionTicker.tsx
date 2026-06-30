"use client";
import { useRotatingSuggestions } from "./useRotatingSuggestions";

interface Props {
  items: string[];
  onPick: (s: string) => void;
  reduced: boolean; // prefers-reduced-motion → liste statique (pas de typewriter)
}

export default function SuggestionTicker({ items, onPick, reduced }: Props) {
  const { text, current } = useRotatingSuggestions(items, { enabled: !reduced });

  // Fallback statique (mouvement réduit) : liste basse opacité, cliquable
  if (reduced) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 16, alignItems: "center" }}>
        {items.map((s) => (
          <button key={s} type="button" className="hud-suggestion" onClick={() => onPick(s)}>
            / {s}
          </button>
        ))}
      </div>
    );
  }

  // Cycle typewriter : une seule ligne qui tourne, clic → envoie la suggestion entière
  return (
    <div style={{ height: 22, marginBottom: 16, textAlign: "center" }}>
      <button type="button" className="hud-suggestion" onClick={() => current && onPick(current)}>
        / {text}
        <span className="ax-cursor" style={{ color: "#ff8800" }}>▌</span>
      </button>
    </div>
  );
}
