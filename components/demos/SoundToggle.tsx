"use client";
import { useEffect, useRef } from "react";

// ── Constantes réglables ──────────────────────────────────────────────────
// Juste sous la navbar (h=64px), aligné à droite sur le bord du contenu de la
// navbar (max-width 72rem centrée) → sous les liens (…/ Contact).
const POS        = { top: "74px", right: "max(24px, calc((100vw - 1152px) / 2 + 24px))" };
const BTN_SIZE   = 60;    // diamètre du bouton (px) — bien visible
const WAVE_AMP   = 7;     // amplitude de l'onde (px) quand le son est ON
const WAVE_CYCLES = 2.2;  // nb d'oscillations sur la largeur
const WAVE_SPEED = 0.15;  // vitesse de défilement (phase/frame)
const MORPH_LERP = 0.12;  // douceur de la transition plat ↔ ondulé
const N          = 32;    // nb de segments de la polyline
// ──────────────────────────────────────────────────────────────────────────

const MIDY = 20, X0 = 6, X1 = 34, TWO_PI = Math.PI * 2;

interface Props { isOn: boolean; onToggle: () => void; speaking: boolean; }

// Construit les points de la sinusoïde pour une amplitude + phase données.
function buildPoints(amp: number, phase: number): string {
  let pts = "";
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = X0 + t * (X1 - X0);
    const y = MIDY + amp * Math.sin(phase + t * TWO_PI * WAVE_CYCLES);
    pts += `${x.toFixed(1)},${y.toFixed(1)} `;
  }
  return pts.trim();
}

export default function SoundToggle({ isOn, onToggle, speaking }: Props) {
  const lineRef  = useRef<SVGPolylineElement>(null);
  const ampRef   = useRef(isOn ? WAVE_AMP : 0); // amplitude courante (persiste entre renders)
  const phaseRef = useRef(0);
  const rafRef   = useRef(0);

  useEffect(() => {
    // Mouvement réduit : onde statique (pleine = son on, plate = mute), sans rAF.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ampRef.current = isOn ? WAVE_AMP : 0;
      lineRef.current?.setAttribute("points", buildPoints(ampRef.current, 0));
      return;
    }
    // Animation continue : la phase défile ; l'amplitude tend (lerp) vers sa cible
    // → morph doux entre ligne plate (mute) et onde qui ondule (son actif).
    const tick = () => {
      const target = isOn ? WAVE_AMP : 0;
      ampRef.current += (target - ampRef.current) * MORPH_LERP;
      phaseRef.current += WAVE_SPEED;
      lineRef.current?.setAttribute("points", buildPoints(ampRef.current, phaseRef.current));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isOn]);

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`vega-sound${isOn ? "" : " muted"}${speaking && isOn ? " speaking" : ""}`}
      aria-label={isOn ? "Son activé — couper le son de VEGA" : "Son coupé — activer le son de VEGA"}
      aria-pressed={isOn}
      title={isOn ? "Couper le son" : "Activer le son"}
      style={{
        position: "fixed", top: POS.top, right: POS.right, zIndex: 40,
        width: BTN_SIZE, height: BTN_SIZE,
        color: isOn ? "#ff9a2e" : "rgba(255, 255, 255, 0.45)",
      }}
    >
      <svg width={BTN_SIZE - 18} height={BTN_SIZE - 18} viewBox="0 0 40 40" style={{ display: "block" }} aria-hidden="true">
        <polyline
          ref={lineRef}
          points={buildPoints(ampRef.current, 0)}
          fill="none" stroke="currentColor" strokeWidth={2.6}
          strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
