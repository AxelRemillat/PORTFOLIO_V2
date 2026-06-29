"use client";

import { useEffect, useState } from "react";

interface Props {
  containerRef: React.RefObject<HTMLDivElement>;
}

// Tube décoratif qui serpente sur toute la hauteur — points d'oscillation G/D.
function buildSnakePath(w: number, h: number): string {
  const pts = [
    { x: w * 0.75, y: 0 }, // entrée haut-droite
    { x: w * 0.15, y: h * 0.18 }, // virage gauche
    { x: w * 0.82, y: h * 0.35 }, // virage droite
    { x: w * 0.12, y: h * 0.52 }, // virage gauche
    { x: w * 0.78, y: h * 0.68 }, // virage droite
    { x: w * 0.2, y: h * 0.84 }, // virage gauche
    { x: w * 0.65, y: h * 1.0 }, // sortie bas
  ];

  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const midY = (prev.y + curr.y) / 2;
    d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
  }
  return d;
}

export default function ParcoursSnake({ containerRef }: Props) {
  const [dims, setDims] = useState({ w: 800, h: 2000 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setDims({ w: el.offsetWidth, h: el.offsetHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  const path = buildSnakePath(dims.w, dims.h);
  const isMobile = dims.w < 640;
  const haloW = isMobile ? 50 : 90;
  const bodyW = isMobile ? 32 : 56;
  const bodyO = isMobile ? 0.4 : 0.55;
  const reflW = isMobile ? 10 : 18;

  return (
    <svg
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "visible",
        zIndex: 0,
      }}
      viewBox={`0 0 ${dims.w} ${dims.h}`}
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="snake-glow">
          <feGaussianBlur stdDeviation="18" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Halo externe — très flou, large */}
      <path d={path} fill="none" stroke="#5b21b6" strokeWidth={haloW} strokeLinecap="round" strokeLinejoin="round" opacity="0.07" />

      {/* Corps principal du serpent */}
      <path d={path} fill="none" stroke="#6d28d9" strokeWidth={bodyW} strokeLinecap="round" strokeLinejoin="round" opacity={bodyO} filter="url(#snake-glow)" />

      {/* Reflet central — illusion de volume 3D */}
      <path d={path} fill="none" stroke="#a78bfa" strokeWidth={reflW} strokeLinecap="round" strokeLinejoin="round" opacity="0.25" />
    </svg>
  );
}
