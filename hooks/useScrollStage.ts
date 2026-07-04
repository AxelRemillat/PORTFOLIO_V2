"use client";

import { useCallback, useEffect, useRef } from "react";

// ── Couche scroll de /projets : reveal + parallaxe + pause hors écran ────────
// Un seul IntersectionObserver et un seul rAF partagés par toutes les cards.
// Reveal : classe .pjt-in (transition CSS), stagger réservé à la fournée
// visible au chargement. Parallaxe : translateY imposé aux couches
// .pjt-parallax-fg (colonne média) et .pjt-parallax-bg (décorateurs, sens
// inverse). Pause : classe .pjt-paused hors viewport (animation-play-state).
// prefers-reduced-motion : le hook ne fait rien — le CSS rend tout visible.

// ── Réglages ─────────────────────────────────────────────────────────────────
export const FG_AMPLITUDE = 14; // px max (±) — colonne média, sens du scroll
export const BG_AMPLITUDE = 7;  // px max (±) — décorateurs, sens inverse
const STAGGER_MS = 100;         // délai entre cards visibles au premier écran
const STAGGER_WINDOW_MS = 1000; // au-delà : reveal sans délai (cards sous le fold)
const IO_THRESHOLD = 0.15;
const MOBILE_BP = 640;          // en-dessous : amplitudes divisées par 2

interface CardEntry {
  el: HTMLElement;
  fg: HTMLElement | null;
  bg: HTMLElement | null;
  visible: boolean;
}

export default function useScrollStage() {
  const cards = useRef(new Map<HTMLElement, CardEntry>());
  const io = useRef<IntersectionObserver | null>(null);
  const raf = useRef(0);
  const t0 = useRef(0);
  const staggerCount = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    t0.current = performance.now();

    const update = () => {
      raf.current = 0;
      const vh = window.innerHeight;
      const scale = window.innerWidth < MOBILE_BP ? 0.5 : 1;
      cards.current.forEach((c) => {
        if (!c.visible) return;
        const r = c.el.getBoundingClientRect();
        // position de la card dans le viewport : -0.5 (haut) → 0.5 (bas)
        const t = Math.max(-0.5, Math.min(0.5, (r.top + r.height / 2 - vh / 2) / vh));
        if (c.fg) c.fg.style.transform = `translateY(${(t * 2 * FG_AMPLITUDE * scale).toFixed(1)}px)`;
        if (c.bg) c.bg.style.transform = `translateY(${(-t * 2 * BG_AMPLITUDE * scale).toFixed(1)}px)`;
      });
    };
    const schedule = () => {
      if (!raf.current) raf.current = requestAnimationFrame(update);
    };

    io.current = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const c = cards.current.get(e.target as HTMLElement);
          if (!c) continue;
          c.visible = e.isIntersecting;
          if (e.isIntersecting) {
            if (!c.el.classList.contains("pjt-in")) {
              // stagger uniquement pendant la fenêtre de chargement initiale
              const early = performance.now() - t0.current < STAGGER_WINDOW_MS;
              c.el.style.transitionDelay = early ? `${staggerCount.current++ * STAGGER_MS}ms` : "0ms";
              c.el.classList.add("pjt-in");
            }
            c.el.classList.remove("pjt-paused"); // reprise de l'ambiance
          } else {
            c.el.classList.add("pjt-paused");    // ambiance en pause hors écran
          }
        }
        schedule();
      },
      { threshold: IO_THRESHOLD },
    );
    cards.current.forEach((c) => io.current!.observe(c.el));

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    schedule();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      io.current?.disconnect();
      io.current = null;
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  // Ref callback à poser sur chaque .project-card. Les couches parallaxe sont
  // résolues ici une seule fois (les refs React sont appelées enfants montés).
  const registerCard = useCallback((el: HTMLElement | null) => {
    if (!el || cards.current.has(el)) return;
    cards.current.set(el, {
      el,
      fg: el.querySelector<HTMLElement>(".pjt-parallax-fg"),
      bg: el.querySelector<HTMLElement>(".pjt-parallax-bg"),
      visible: false,
    });
    io.current?.observe(el);
  }, []);

  return registerCard;
}
