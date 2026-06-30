"use client";
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from "react";

// Poignée verticale ancrée au bord (gauche/droite), bien visible : icône +
// libellé mono vertical + chevron + glow orange. Sert de cible clic ET drag, et
// reste collée au bord du panneau (sa position `offset` suit l'ouverture/drag).
export const HANDLE_W = 42;
const HANDLE_H = 154;

interface Props {
  side: "left" | "right";
  label: string;
  icon: ReactNode;
  open: boolean;
  offset: number; // distance (px) depuis le bord = bord visible du panneau
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
  // chevron : indique le sens d'ouverture (vers le centre) au repos
  const chevron = isLeft ? (open ? "‹" : "›") : (open ? "›" : "‹");

  const style: CSSProperties = {
    position: "fixed",
    top: "50%",
    [isLeft ? "left" : "right"]: offset,
    transform: "translateY(-50%)",
    zIndex: 47,
    width: HANDLE_W,
    height: HANDLE_H,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    background: "linear-gradient(180deg, rgba(20,12,6,0.95), rgba(10,10,18,0.95))",
    border: "1px solid rgba(255,120,0,0.55)",
    borderRadius: isLeft ? "0 12px 12px 0" : "12px 0 0 12px",
    color: "#ff9a3c",
    cursor: "pointer",
    touchAction: "none", // indispensable pour le drag tactile (pas de scroll natif)
    boxShadow: "0 0 18px rgba(255,120,0,0.45), inset 0 0 12px rgba(255,120,0,0.12)",
    transition: dragging || reduced ? "none" : `left ${transMs}ms cubic-bezier(0.22,1,0.36,1), right ${transMs}ms cubic-bezier(0.22,1,0.36,1)`,
  };

  return (
    <>
      <style>{`
        @keyframes axHandlePulse {
          0%, 100% { box-shadow: 0 0 18px rgba(255,120,0,0.45), inset 0 0 12px rgba(255,120,0,0.12); }
          50%      { box-shadow: 0 0 34px rgba(255,140,0,0.85), inset 0 0 16px rgba(255,140,0,0.2); }
        }
        .ax-handle-intro { animation: axHandlePulse 1.6s ease-in-out 3; }
        .ax-handle:hover { color: #ffb066; border-color: rgba(255,150,40,0.9); }
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
            color: "rgba(255,180,120,0.95)",
          }}
        >
          {label}
        </span>
      </button>
    </>
  );
}
