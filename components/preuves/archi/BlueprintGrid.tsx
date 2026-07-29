"use client";

import { useEffect, useRef } from "react";

// Fond « blueprint » interactif : grille dessinée sur canvas (plus visible que la
// grille CSS) qui se déforme (bombé/lentille) autour du curseur + halo d'accent.
// Fixe au viewport, performant (rAF uniquement tant que ça bouge). Grille statique
// si prefers-reduced-motion. Couleur = accent du projet.
export default function BlueprintGrid({ accent }: { accent: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const GAP = 40, R = 210, PUSH = 32;
    const hex = accent.replace("#", "");
    const cr = parseInt(hex.slice(0, 2), 16);
    const cg = parseInt(hex.slice(2, 4), 16);
    const cb = parseInt(hex.slice(4, 6), 16);
    const rgba = (a: number) => `rgba(${cr},${cg},${cb},${a})`;

    let W = 0, H = 0;
    const resize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let tx = -1e5, ty = -1e5, cx = -1e5, cy = -1e5, str = 0, tStr = 0, raf = 0;

    const warp = (gx: number, gy: number): [number, number] => {
      const dx = gx - cx, dy = gy - cy;
      const d = Math.hypot(dx, dy);
      if (str > 0.002 && d < R) {
        const f = (1 - d / R) ** 2 * str * PUSH;
        const nd = d || 1;
        return [gx + (dx / nd) * f, gy + (dy / nd) * f];
      }
      return [gx, gy];
    };

    const stroke = (horizontal: boolean) => {
      const outer = horizontal ? H : W;
      const inner = horizontal ? W : H;
      for (let a = 0; a <= outer + GAP; a += GAP) {
        ctx.beginPath();
        for (let b = 0; b <= inner + GAP; b += GAP) {
          const [px, py] = horizontal ? warp(b, a) : warp(a, b);
          if (b === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
    };

    const draw = () => {
      raf = 0;
      cx += (tx - cx) * 0.16; cy += (ty - cy) * 0.16; str += (tStr - str) * 0.09;
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      ctx.strokeStyle = rgba(0.17);
      stroke(true);
      stroke(false);
      if (str > 0.01) {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
        g.addColorStop(0, rgba(0.12 * str));
        g.addColorStop(1, rgba(0));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }
      const moving = Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5 || Math.abs(tStr - str) > 0.004;
      if (moving) raf = requestAnimationFrame(draw);
    };

    const kick = () => { if (!raf && !reduce) raf = requestAnimationFrame(draw); };
    const onMove = (e: PointerEvent) => { tx = e.clientX; ty = e.clientY; tStr = 1; kick(); };
    const onLeave = () => { tStr = 0; kick(); };

    draw(); // rendu initial (grille statique)
    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("mouseleave", onLeave);
      window.addEventListener("resize", resize);
    }
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [accent]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        WebkitMaskImage: "radial-gradient(125% 92% at 50% 26%, #000 58%, transparent 100%)",
        maskImage: "radial-gradient(125% 92% at 50% 26%, #000 58%, transparent 100%)",
      }}
    />
  );
}
