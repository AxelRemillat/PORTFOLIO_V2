"use client";
import { useRotatingSuggestions } from "./useRotatingSuggestions";

interface Props {
  items: string[];
  onPick: (s: string) => void;
  reduced: boolean; // prefers-reduced-motion → liste statique (pas de typewriter)
}

// Type partagé avec HudInput (pré-remplissage de la barre de saisie)
export type Prefill = { text: string; key: number } | null;

export default function SuggestionTicker({ items, onPick, reduced }: Props) {
  // Rythme ralenti (holdMs) : laisse le temps de lire ET de cliquer la question
  const { text, current } = useRotatingSuggestions(items, { enabled: !reduced, holdMs: 4800, typeMs: 55 });

  // Fallback statique (mouvement réduit) : liste basse opacité, cliquable.
  // Bornée à 3 : le catalogue complet (50) vit dans le panneau QUESTIONS.
  if (reduced) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 16, alignItems: "center" }}>
        {items.slice(0, 3).map((s) => (
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
