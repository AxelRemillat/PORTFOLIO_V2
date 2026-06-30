"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useFitText } from "./useFitText";

interface Props {
  text: string;       // texte révélé progressivement (sync voix)
  fullText: string;   // texte complet de la réponse (sert au calcul de la taille)
  isStreaming: boolean;
  isVisible: boolean;
}

// ── Zone d'affichage : toujours SOUS l'orbe, jamais dessus ─────────────────
// L'orbe est rendu (OrbScene) dans un canvas entre top:64px et bottom:110px,
// caméra z=7 / fov=42°, nuage de particules de rayon ~2.05×GLOBAL_SCALE(0.72).
// On recalcule le bas de l'orbe à l'écran pour ancrer le texte juste en dessous
// — ça s'adapte à toutes les hauteurs d'écran (≠ valeur vh fixe).
const CANVAS_TOP_PX    = 64;
const CANVAS_BOTTOM_PX = 110;
const ORB_RADIUS_FRAC  = 0.56; // rayon nuage / demi-hauteur visible (~0.55) + petite marge
const GAP_PX           = 14;   // marge entre le bas de l'orbe et le texte
const BOTTOM_VH        = 6;     // bord bas de la zone (le HUD est masqué pendant "speaking")
const FONT_MAX_PX      = 26;    // réponses courtes/moyennes
const FONT_MIN_PX      = 12;    // plancher lisible (absorbe les longues réponses)
const BOX_MAX_WIDTH    = 760;
const BOX_WIDTH_VW     = 90;
const LINE_HEIGHT      = 1.5;
// ──────────────────────────────────────────────────────────────────────────

// Position (px depuis le haut) du bas visible de l'orbe pour une hauteur d'écran.
function orbBottomPx(h: number): number {
  const canvasH = Math.max(0, h - CANVAS_TOP_PX - CANVAS_BOTTOM_PX);
  const center = CANVAS_TOP_PX + canvasH / 2;
  return center + (canvasH / 2) * ORB_RADIUS_FRAC;
}

export default function FloatingText({ text, fullText, isStreaming, isVisible }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLParagraphElement>(null);
  const [topPx, setTopPx] = useState(0);
  const [maxHeightPx, setMaxHeightPx] = useState(0);

  // Recalcule l'ancrage (sous l'orbe) + la hauteur dispo à chaque resize.
  useEffect(() => {
    const calc = () => {
      setTopPx(orbBottomPx(window.innerHeight) + GAP_PX);
      setMaxHeightPx(boxRef.current?.clientHeight ?? 0);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  // 2e passe : une fois topPx appliqué, mesure la hauteur réelle de la box.
  useEffect(() => { setMaxHeightPx(boxRef.current?.clientHeight ?? 0); }, [topPx]);

  // Taille déterminée sur le texte COMPLET → stable pendant la révélation.
  const fontPx = useFitText(measureRef, fullText, FONT_MAX_PX, FONT_MIN_PX, maxHeightPx);

  const pStyle: CSSProperties = {
    margin: 0,
    color: "rgba(255, 255, 255, 0.92)",
    lineHeight: LINE_HEIGHT,
    fontWeight: 400,
    textShadow: "0 0 40px rgba(255, 100, 0, 0.4), 0 2px 20px rgba(0,0,0,0.8)",
  };

  return (
    <div
      ref={boxRef}
      style={{
        position: "fixed",
        left: "50%",
        top: `${topPx}px`,
        bottom: `${BOTTOM_VH}vh`,
        transform: `translateX(-50%) translateY(${isVisible ? 0 : 12}px)`,
        zIndex: 20,
        width: `min(${BOX_MAX_WIDTH}px, ${BOX_WIDTH_VW}vw)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden", // pas de scrollbar ; clip éventuel SOUS l'orbe, jamais dessus
        textAlign: "center",
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${isVisible ? 0.5 : 0.3}s ease, transform ${isVisible ? 0.5 : 0.3}s ease`,
        pointerEvents: "none",
      }}
    >
      <p style={{ ...pStyle, fontSize: fontPx }}>
        {text}
        {isStreaming && <span className="ax-cursor" style={{ color: "#ff8800" }}>|</span>}
      </p>

      {/* Mesureur caché : même largeur, texte complet → sert au calcul de fontPx */}
      <p
        ref={measureRef}
        aria-hidden
        style={{
          ...pStyle,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          visibility: "hidden",
          pointerEvents: "none",
          whiteSpace: "normal",
        }}
      >
        {fullText}
      </p>
    </div>
  );
}
