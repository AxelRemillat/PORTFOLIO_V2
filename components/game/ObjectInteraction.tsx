"use client";

import { createPortal } from "react-dom";
import type { CSSProperties } from "react";

export interface ActiveObject {
  type: string; // "rose" | "baobab" | "fox" | "sheep" …
  name: string;
  emoji: string;
  quote: string;
}

// Bulle HTML minimaliste affichée en bas-centre, hors du Canvas (portal React → body).
export function ObjectInteraction({
  object,
  onClose,
}: {
  object: ActiveObject;
  onClose: () => void;
}) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div style={bubbleStyle}>
      <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 8 }}>{object.emoji}</div>
      <div style={nameStyle}>{object.name}</div>
      <p style={quoteStyle}>« {object.quote} »</p>
      <button className="oi-close" style={closeStyle} onClick={onClose}>
        Fermer ✕
      </button>

      <style>{`
        @keyframes oiSlideUp {
          from { opacity: 0; transform: translate(-50%, 12px) }
          to   { opacity: 1; transform: translate(-50%, 0) }
        }
        .oi-close { transition: background 0.15s, border-color 0.15s, color 0.15s }
        .oi-close:hover {
          background: rgba(255, 200, 100, 0.15);
          border-color: rgba(255, 200, 100, 0.6);
          color: #fff;
        }
      `}</style>
    </div>,
    document.body,
  );
}

const bubbleStyle: CSSProperties = {
  position: "fixed",
  bottom: 120,
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 80,
  background: "rgba(10, 8, 30, 0.88)",
  border: "1px solid rgba(255, 200, 100, 0.4)",
  borderRadius: 12,
  padding: "20px 28px",
  maxWidth: 380,
  textAlign: "center",
  color: "#e8e2f5",
  backdropFilter: "blur(6px)",
  animation: "oiSlideUp 0.3s ease",
};

const nameStyle: CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  letterSpacing: "1px",
  textTransform: "uppercase",
  color: "#FFC864",
  marginBottom: 10,
};

const quoteStyle: CSSProperties = {
  fontSize: 14,
  fontStyle: "italic",
  color: "#cfc7e6",
  lineHeight: 1.55,
  margin: "0 0 18px",
};

const closeStyle: CSSProperties = {
  background: "transparent",
  border: "1px solid rgba(255, 200, 100, 0.35)",
  color: "#FFC864",
  borderRadius: 8,
  padding: "7px 18px",
  fontSize: 13,
  cursor: "pointer",
};
