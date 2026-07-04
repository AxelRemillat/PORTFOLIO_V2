"use client";

import Link from "next/link";
import HeroMedia from "./HeroMedia";

// Hero plein écran : fond vidéo-ready (HeroMedia), label mono, nom massif en
// clip-reveal, tagline, 2 CTA et la pill VEGA. Le CTA /game (monde 3D) est
// masqué en mobile.
export default function HomeHero() {
  return (
    <section className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      <HeroMedia />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <p
          className="parcours-fade text-xs font-mono text-orange tracking-[0.2em] uppercase"
          style={{ animationDelay: "0.15s" }}
        >
          Ingénieur Data &amp; IA
        </p>

        <h1 className="text-6xl md:text-8xl font-bold text-white leading-none tracking-tight">
          <span className="block overflow-hidden">
            <span className="parcours-line" style={{ animationDelay: "0.25s" }}>Axel</span>
          </span>
          <span className="block overflow-hidden">
            <span className="parcours-line text-orange" style={{ animationDelay: "0.4s" }}>Remillat</span>
          </span>
        </h1>

        <p className="parcours-fade text-muted text-base md:text-lg max-w-sm" style={{ animationDelay: "0.7s" }}>
          Pas des screenshots —{" "}
          <span className="text-text">des projets testables en vrai.</span>
        </p>

        <div className="parcours-fade flex flex-col sm:flex-row gap-4 mt-4" style={{ animationDelay: "0.85s" }}>
          <Link
            href="/game"
            className="hidden md:inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-orange text-white font-semibold text-sm hover:bg-orange/90 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_32px_rgba(249,115,22,0.4)]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
            Explorer en 3D
          </Link>
          <Link
            href="/projets"
            className="px-8 py-4 rounded-xl border border-border text-muted text-sm font-medium hover:text-white hover:border-white/20 transition-all duration-200"
          >
            Accéder aux projets →
          </Link>
        </div>

        {/* Pill VEGA (styles .vega-cta dans globals.css) */}
        <div className="parcours-fade flex flex-col items-center gap-3 mt-6" style={{ animationDelay: "1s" }}>
          <div
            style={{
              width: 120, height: 1,
              background: "linear-gradient(90deg, transparent, rgba(103,232,249,0.3), transparent)",
            }}
          />
          <Link href="/demos" className="vega-cta flex items-center gap-2.5 no-underline">
            <span className="vega-cta-dot" />
            <span className="vega-cta-text font-mono text-[11px] sm:text-sm" style={{ letterSpacing: "0.15em" }}>
              Ce site <span className="vega-cta-keyword">pense</span>. Parle-lui.
            </span>
            <span className="vega-cta-arrow" style={{ fontSize: 15 }}>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
