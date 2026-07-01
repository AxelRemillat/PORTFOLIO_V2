"use client";
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from "react";

// Poignée verticale ancrée au bord (gauche/droite), bien visible : icône +
// libellé mono vertical + chevron + glow orange. Sert de cible clic ET drag, et
// suit l'ouverture/drag du panneau (position via `offset`). Un "champ lumineux"
// (rail) la relie au bord de l'écran.

// ── Constantes réglables ────────────────────────────────────────────────────
export const HANDLE_W = 44;
const HANDLE_H       = 158;
const EDGE_OFFSET    = 96;   // retrait de la poignée depuis le bord AU REPOS (vers le centre).
                             //   Se résorbe à l'ouverture → la poignée colle au panneau.
const BRACE_LEN      = 185;  // largeur de l'accolade (s'étire vers le bord ; pointe derrière le bouton), px
const BRACE_H        = 460;  // hauteur de l'accolade (couvre plus de bord d'écran), px
const BRACE_OVERLAP  = 12;   // le bout de l'accolade passe DERRIÈRE le bouton
const BRACE_STROKE   = 14;   // épaisseur du trait → accolade "pleine" (pas un fin contour)
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  side: "left" | "right";
  label: string;
  icon: ReactNode;
  open: boolean;
  offset: number; // distance (px) depuis le bord = bord visible du panneau
  frac: number;   // 0 = fermé, 1 = ouvert (résorbe le retrait à l'ouverture)
  dragging: boolean;
  reduced?: boolean;
  intro?: boolean; // animation d'amorce au 1er chargement
  transMs: number;
  onPointerDown: (e: ReactPointerEvent) => void;
  onToggleKey: () => void; // ouverture clavier (Enter/Espace)
  ariaLabel: string;
}

export default function SidePanelHandle({
  side, label, icon, open, offset, frac, dragging, reduced, intro, transMs, onPointerDown, onToggleKey, ariaLabel,
}: Props) {
  const isLeft = side === "left";
  // Au repos la poignée est bien en retrait du bord ; ce retrait fond à l'ouverture
  // (× (1-frac)) pour qu'elle vienne coller au bord du panneau.
  const pos = offset + EDGE_OFFSET * (1 - frac);
  const chevron = isLeft ? (open ? "‹" : "›") : (open ? "›" : "‹");
  const edgeTransition = dragging || reduced
    ? "none"
    : `left ${transMs}ms cubic-bezier(0.22,1,0.36,1), right ${transMs}ms cubic-bezier(0.22,1,0.36,1)`;

  // Accolade lumineuse "pleine" (SVG, trait épais) reliant le bord de l'écran à la
  // poignée, son bout (tip) glissé DERRIÈRE le bouton. La <div> conteneur est une
  // cible de clic/drag (même handler que le bouton). Suit la poignée (transition left/right).
  const m = BRACE_STROKE / 2 + 2;
  const sx = m, tx = BRACE_LEN - m, yt = m, yb = BRACE_H - m, ym = BRACE_H / 2;
  const braceD = `M ${sx} ${yt} C ${tx} ${yt} ${sx} ${ym} ${tx} ${ym} C ${sx} ${ym} ${tx} ${yb} ${sx} ${yb}`;
  const braceStyle: CSSProperties = {
    position: "fixed", top: "50%",
    [isLeft ? "left" : "right"]: pos + BRACE_OVERLAP - BRACE_LEN,
    width: BRACE_LEN, height: BRACE_H, zIndex: 15, // derrière le bouton (z47)
    transform: "translateY(-50%)",
    transition: edgeTransition,
    pointerEvents: "auto", cursor: "pointer", touchAction: "none", // draggable comme le bouton
  };

  const style: CSSProperties = {
    position: "fixed",
    top: "50%",
    [isLeft ? "left" : "right"]: pos,
    transform: "translateY(-50%)",
    zIndex: 47,
    width: HANDLE_W,
    height: HANDLE_H,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
    background: "linear-gradient(180deg, rgba(26,15,7,0.96), rgba(10,10,18,0.96))",
    border: "1.5px solid rgba(255,140,20,0.72)",
    borderRadius: isLeft ? "0 13px 13px 0" : "13px 0 0 13px",
    color: "#ffab54",
    cursor: "pointer",
    touchAction: "none", // indispensable pour le drag tactile (pas de scroll natif)
    boxShadow: "0 0 26px rgba(255,120,0,0.6), inset 0 0 14px rgba(255,120,0,0.16)",
    transition: edgeTransition,
  };

  return (
    <>
      <style>{`
        @keyframes axHandlePulse {
          0%, 100% { box-shadow: 0 0 26px rgba(255,120,0,0.6), inset 0 0 14px rgba(255,120,0,0.16); }
          50%      { box-shadow: 0 0 40px rgba(255,150,0,0.95), inset 0 0 18px rgba(255,150,0,0.24); }
        }
        .ax-handle-intro { animation: axHandlePulse 1.6s ease-in-out 3; }
        .ax-handle:hover { color: #ffc588; border-color: rgba(255,160,50,0.95); box-shadow: 0 0 34px rgba(255,140,0,0.8), inset 0 0 16px rgba(255,140,0,0.22); }
      `}</style>

      {/* Accolade lumineuse "pleine", draggable (même handler que le bouton) */}
      <div
        className="ax-brace-hit"
        style={braceStyle}
        onPointerDown={onPointerDown}
        aria-hidden
      >
        <svg
          className={`ax-brace${reduced ? "" : " ax-brace-pulse"}`}
          viewBox={`0 0 ${BRACE_LEN} ${BRACE_H}`}
          preserveAspectRatio="none"
          style={{ width: "100%", height: "100%", display: "block", pointerEvents: "none", transform: isLeft ? undefined : "scaleX(-1)" }}
        >
          <path d={braceD} fill="none" stroke="#ff8a1e" strokeWidth={BRACE_STROKE} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

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
