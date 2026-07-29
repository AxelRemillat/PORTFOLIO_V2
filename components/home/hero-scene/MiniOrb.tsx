"use client";

import { useEffect, useRef } from "react";

// Mini-orbe VEGA : ~210 particules sur une sphère (Fibonacci) qui tourne et
// « respire », avec un halo radial doux derrière. Un seul canvas 2D, boucle rAF
// propre. Figée (un rendu, sans rAF) si `reduce`.
const N = 210;

function fibSphere(n: number): [number, number, number][] {
  const pts: [number, number, number][] = [];
  const inc = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * inc;
    pts.push([Math.cos(phi) * r, y, Math.sin(phi) * r]);
  }
  return pts;
}

export default function MiniOrb({ reduce, size = 132 }: { reduce: boolean; size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const pts = fibSphere(N);
    const cx = size / 2;
    const cy = size / 2;
    let raf = 0;
    let t = reduce ? 0.35 : 0;

    const draw = () => {
      t += 0.006;
      ctx.clearRect(0, 0, size, size);
      const R = size * 0.36 * (1 + Math.sin(t * 1.6) * 0.05);
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.4);
      glow.addColorStop(0, "rgba(249,115,22,0.22)");
      glow.addColorStop(0.6, "rgba(249,115,22,0.06)");
      glow.addColorStop(1, "rgba(249,115,22,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, size, size);
      const ca = Math.cos(t);
      const sa = Math.sin(t);
      for (const [x, y, z] of pts) {
        const depth = (x * sa + z * ca + 1) / 2; // 0 (arrière) → 1 (avant)
        ctx.beginPath();
        ctx.fillStyle = `rgba(249,${Math.round(130 + depth * 45)},50,${(0.1 + depth * 0.75).toFixed(3)})`;
        ctx.arc(cx + (x * ca - z * sa) * R, cy + y * R, 0.5 + depth * 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce, size]);

  return (
    <canvas
      ref={ref}
      width={size}
      height={size}
      style={{ width: size, height: size, display: "block" }}
      aria-hidden
    />
  );
}
