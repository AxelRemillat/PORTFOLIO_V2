"use client";

import type { CSSProperties } from "react";
import type { PendingPortal } from "./hooks/usePortalDetection";

// #RRGGBB + alpha → rgba()
function hexA(hex: string, a: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// Étoiles décoratives dispersées autour de la carte
const STARS: Array<CSSProperties & { char: string }> = [
  { char: "✦", top: "-18px",    left: "10%",   fontSize: 12 },
  { char: "★", top: "14%",      left: "-22px", fontSize: 10 },
  { char: "✦", top: "-12px",    right: "16%",  fontSize: 14 },
  { char: "★", bottom: "20%",   right: "-20px", fontSize: 9 },
  { char: "✦", bottom: "-16px", left: "24%",   fontSize: 11 },
  { char: "✦", top: "42%",      left: "-28px", fontSize: 8 },
];

export function PortalConfirmation({
  portal,
  onConfirm,
  onCancel,
}: {
  portal: PendingPortal;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { name, color, description } = portal;

  return (
    <div style={overlayStyle} onClick={onCancel}>
      <div
        style={{
          ...cardStyle,
          borderColor: hexA(color, 0.6),
          boxShadow: `0 0 40px ${hexA(color, 0.25)}, 0 0 80px ${hexA(color, 0.1)}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {STARS.map(({ char, ...pos }, i) => (
          <span
            key={i}
            style={{ position: "absolute", color, opacity: 0.3, pointerEvents: "none", ...pos }}
          >
            {char}
          </span>
        ))}

        <div style={{ ...titleStyle, color }}>✦ {name}</div>

        <div style={{ borderTop: `1px solid ${hexA(color, 0.3)}`, width: "65%", margin: "0 auto 22px" }} />

        <p style={descStyle}>{description}</p>

        <p style={questionStyle}>Veux-tu traverser ce portail&nbsp;?</p>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button className="pc-yes" style={{ ...yesBtn, background: color }} onClick={onConfirm}>
            OUI
          </button>
          <button className="pc-no" style={noBtn} onClick={onCancel}>
            NON
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pcFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes pcSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95) }
          to   { opacity: 1; transform: translateY(0) scale(1) }
        }
        .pc-yes { transition: transform 0.15s, opacity 0.15s }
        .pc-yes:hover { transform: scale(1.05) }
        .pc-no { transition: border-color 0.15s, color 0.15s }
        .pc-no:hover { border-color: rgba(255, 255, 255, 0.4); color: #fff }
      `}</style>
    </div>
  );
}

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 70,
  background:
    "radial-gradient(ellipse at center, rgba(10,8,30,0.85) 0%, rgba(0,0,10,0.95) 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  animation: "pcFadeIn 0.3s ease",
};

const cardStyle: CSSProperties = {
  position: "relative",
  background: "rgba(15, 12, 40, 0.92)",
  border: "1px solid",
  borderRadius: 16,
  padding: "40px 48px",
  maxWidth: 420,
  textAlign: "center",
  animation: "pcSlideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
};

const titleStyle: CSSProperties = {
  fontSize: 22,
  fontWeight: 600,
  letterSpacing: "2px",
  textTransform: "uppercase",
  marginBottom: 8,
};

const descStyle: CSSProperties = {
  fontSize: 13,
  color: "#8880aa",
  marginBottom: 24,
  lineHeight: 1.6,
};

const questionStyle: CSSProperties = {
  fontSize: 17,
  color: "#e0d8f0",
  fontStyle: "italic",
  margin: "16px 0 28px",
};

const yesBtn: CSSProperties = {
  color: "#000",
  border: "none",
  padding: "12px 32px",
  borderRadius: 8,
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  marginRight: 12,
};

const noBtn: CSSProperties = {
  background: "transparent",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  color: "#8880aa",
  padding: "12px 24px",
  borderRadius: 8,
  fontSize: 15,
  cursor: "pointer",
};
