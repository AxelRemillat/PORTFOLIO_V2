"use client";

interface Props {
  paused: boolean;
  speed: number;
  onTogglePause: () => void;
  onCycleSpeed: () => void;
  onDelete: () => void;
}

const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M6 4l11 6-11 6V4z" /></svg>
);
const PauseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><rect x="5" y="4" width="3.5" height="12" rx="1" /><rect x="11.5" y="4" width="3.5" height="12" rx="1" /></svg>
);
const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6h12M8 6V4h4v2M6 6l1 10h6l1-10" />
  </svg>
);

// Cluster affiché UNIQUEMENT pendant "speaking" (monté/démonté par FloatingInput).
export default function SpeakingControls({ paused, speed, onTogglePause, onCycleSpeed, onDelete }: Props) {
  return (
    <div style={{ display: "flex", gap: 18, alignItems: "center", justifyContent: "center" }}>
      {/* Pause / Reprise — rond orange, icône blanche */}
      <button
        type="button"
        onClick={onTogglePause}
        className="vega-ctrl vega-ctrl-play"
        aria-label={paused ? "Reprendre" : "Mettre en pause"}
        aria-pressed={paused}
        title={paused ? "Reprendre" : "Pause"}
      >
        {paused ? <PlayIcon /> : <PauseIcon />}
      </button>

      {/* Supprimer — carré destructif */}
      <button
        type="button"
        onClick={onDelete}
        className="vega-ctrl vega-ctrl-del"
        aria-label="Supprimer la conversation en cours"
        title="Supprimer"
      >
        <TrashIcon />
      </button>

      {/* Vitesse — cycle, multiplicateur affiché */}
      <button
        type="button"
        onClick={onCycleSpeed}
        className="vega-ctrl vega-ctrl-speed"
        aria-label={`Vitesse de lecture : ${speed}×. Cliquer pour changer.`}
        title="Vitesse de lecture"
      >
        {speed}×
      </button>
    </div>
  );
}
