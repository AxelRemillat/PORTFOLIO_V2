"use client";
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from "react";

// Poignée verticale collée au bord (gauche/droite) : icône + libellé mono
// vertical + chevron + glow orange. Cible clic ET drag, suit l'ouverture/drag
// du panneau (position via `offset`). Compacte : aucune décoration qui empiète
// sur la scène (l'ancienne accolade géante a été retirée).

// ── Constantes réglables ────────────────────────────────────────────────────
export const HANDLE_W = 40;
const HANDLE_H = 148;
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  side: "left" | "right";
  label: string;
  icon: ReactNode;
  open: boolean;
  offset: number; // distance (px) depuis le bord = bord visible du panneau
  frac: number;   // 0 = fermé, 1 = ouvert
  dragging: boolean;
  reduced?: boolean;
  intro?: boolean; // animation d'amorce au 1er chargement
  transMs: number;
  onPointerDown: (e: ReactPointerEvent) => void;
  onToggleKey: () => void; // ouverture clavier (Enter/Espace)
  ariaLabel: string;
}

export default function SidePanelHandle({
  side, label, icon, open, offset, dragging, reduced, intro, transMs, onPointerDown, onToggleKey, ariaLabel,
}: Props) {
  const isLeft = side === "left";
  const chevron = isLeft ? (open ? "‹" : "›") : (open ? "›" : "‹");
  const edgeTransition = dragging || reduced
    ? "none"
    : `left ${transMs}ms cubic-bezier(0.22,1,0.36,1), right ${transMs}ms cubic-bezier(0.22,1,0.36,1)`;

  const style: CSSProperties = {
    position: "fixed",
    top: "50%",
    [isLeft ? "left" : "right"]: offset,
    transform: "translateY(-50%)",
    zIndex: 47,
    width: HANDLE_W,
    height: HANDLE_H,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
    background: "linear-gradient(180deg, rgba(26,15,7,0.96), rgba(10,10,18,0.96))",
    border: "1.5px solid rgba(255,140,20,0.72)",
    [isLeft ? "borderLeft" : "borderRight"]: "none", // fondue dans le bord de l'écran
    borderRadius: isLeft ? "0 13px 13px 0" : "13px 0 0 13px",
    color: "#ffab54",
    cursor: "pointer",
    touchAction: "none", // indispensable pour le drag tactile (pas de scroll natif)
    boxShadow: "0 0 22px rgba(255,120,0,0.5), inset 0 0 14px rgba(255,120,0,0.16)",
    transition: edgeTransition,
  };

  return (
    <>
      <style>{`
        @keyframes axHandlePulse {
          0%, 100% { box-shadow: 0 0 22px rgba(255,120,0,0.5), inset 0 0 14px rgba(255,120,0,0.16); }
          50%      { box-shadow: 0 0 38px rgba(255,150,0,0.95), inset 0 0 18px rgba(255,150,0,0.24); }
        }
        .ax-handle-intro { animation: axHandlePulse 1.6s ease-in-out 3; }
        .ax-handle:hover { color: #ffc588; border-color: rgba(255,160,50,0.95); box-shadow: 0 0 32px rgba(255,140,0,0.8), inset 0 0 16px rgba(255,140,0,0.22); }
      `}</style>

      <button
        type="button"
        className={`ax-handle${intro && !reduced ? " ax-handle-intro" : ""}`}
        style={style}
        aria-label={ariaLabel}
        aria-expanded={open}
        onPointerDown={onPointerDown}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggleKey(); }
        }}
      >
        <span aria-hidden style={{ fontSize: 13, lineHeight: 1 }}>{chevron}</span>
        {icon}
        <span
          aria-hidden
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            fontFamily: "var(--font-mono, monospace)",
            fontSize: 11,
            letterSpacing: "0.22em",
            color: "rgba(255,190,130,0.98)",
          }}
        >
          {label}
        </span>
      </button>
    </>
  );
}
