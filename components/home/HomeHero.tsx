"use client";

import Link from "next/link";
import HeroScene from "./hero-scene/HeroScene";

// Hero deux colonnes (style Better Stack / Railway) : à GAUCHE le discours (copy
// inchangé, aligné à gauche en desktop), à DROITE une scène HUD montrant les
// VRAIS systèmes du site (VEGA / OPS / N8N). Plus de vidéo : HeroMedia n'est plus
// monté ici (fichier conservé dans components/home). Fond sombre + glow orange.
export default function HomeHero() {
  return (
    <section className="hero2-section relative flex items-center overflow-hidden min-h-[calc(100vh-64px)]">
      <div className="hero2-bg" aria-hidden />

      <div className="hero2 relative z-10">
        <div className="hero2-left">
          <p
            className="parcours-fade text-xs font-mono text-orange tracking-[0.2em] uppercase"
            style={{ animationDelay: "0.15s" }}
          >
            Ingénieur IA — Mise en production
          </p>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-none tracking-tight">
            <span className="block overflow-hidden">
              <span className="parcours-line" style={{ animationDelay: "0.25s" }}>Axel</span>
            </span>
            <span className="block overflow-hidden">
              <span className="parcours-line text-orange" style={{ animationDelay: "0.4s" }}>Remillat</span>
            </span>
          </h1>

          <p
            className="parcours-fade text-white text-xl md:text-2xl font-semibold max-w-xl"
            style={{ animationDelay: "0.6s" }}
          >
            Votre IA en production. Fiable, monitorée, conforme.
          </p>

          <p
            className="parcours-fade text-muted text-sm md:text-base max-w-xl leading-relaxed"
            style={{ animationDelay: "0.72s" }}
          >
            J&apos;aide les PME et startups à passer leurs projets IA du POC à la
            production : agents, RAG, automatisations. Ingénieur IA Agentic &amp;
            Full Stack en alternance chez Andra Learning (EdTech — Station F).
          </p>

          <div className="parcours-fade flex flex-col sm:flex-row gap-4 mt-4" style={{ animationDelay: "0.85s" }}>
            <Link
              href="/offres"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-orange text-white font-semibold text-sm hover:bg-orange/90 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_32px_rgba(249,115,22,0.4)]"
            >
              Découvrir les offres
            </Link>
            <Link
              href="/preuves"
              className="px-8 py-4 rounded-xl border border-border text-muted text-sm font-medium hover:text-white hover:border-white/20 transition-all duration-200"
            >
              Tester les preuves →
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

        <div className="hero2-right">
          <HeroScene />
        </div>
      </div>

      <style>{`
        .hero2-section { background: var(--color-bg); }
        .hero2-bg { position:absolute; inset:0; z-index:0; pointer-events:none;
          background:
            radial-gradient(58% 55% at 82% 42%, rgba(249,115,22,0.13), transparent 62%),
            radial-gradient(1.5px 1.5px at 12% 22%, rgba(255,255,255,0.5), transparent),
            radial-gradient(1px 1px at 68% 16%, rgba(255,255,255,0.4), transparent),
            radial-gradient(1px 1px at 88% 70%, rgba(255,255,255,0.42), transparent),
            radial-gradient(1px 1px at 40% 80%, rgba(255,255,255,0.3), transparent),
            radial-gradient(1.5px 1.5px at 26% 56%, rgba(255,255,255,0.26), transparent); }
        .hero2 { width:100%; max-width:1200px; margin:0 auto;
          padding: 3rem clamp(1.5rem,5vw,4rem);
          display:flex; flex-direction:column; align-items:center; text-align:center; gap:2.75rem; }
        .hero2-left { display:flex; flex-direction:column; align-items:center; gap:1.5rem; }
        .hero2-right { width:100%; display:flex; justify-content:center; }
        @media (min-width: 900px) {
          .hero2 { flex-direction:row; align-items:center; justify-content:space-between; text-align:left; gap:3rem; }
          .hero2-left { align-items:flex-start; flex:0 1 50%; }
          .hero2-right { flex:0 1 46%; }
        }
      `}</style>
    </section>
  );
}
