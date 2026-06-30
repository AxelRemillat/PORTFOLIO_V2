"use client";

interface Props {
  text: string;
  reduced: boolean; // mouvement réduit → pas de scan ni de points animés
}

// État "thinking" : l'input cède la place à un indicateur d'activité diégétique.
export default function ThinkingIndicator({ text, reduced }: Props) {
  return (
    <div style={{ textAlign: "center", fontFamily: "var(--font-mono, monospace)" }}>
      <div className="hud-thinking">
        // {text}
        <span className="hud-dots" />
      </div>
      {!reduced && <div className="hud-scan-bar" />}
    </div>
  );
}
