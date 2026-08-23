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
      <div className="hero2-grid" aria-hidden />
      <div className="hero2-vignette" aria-hidden />

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
            J&apos;aide les PME et startups à passer leurs projets IA du prototype
            à la production : agents, RAG, automatisations. Ingénieur IA Agentic &amp;
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
              href="/projets"
              className="px-8 py-4 rounded-xl border border-border text-muted text-sm font-medium hover:text-white hover:border-white/20 transition-all duration-200"
            >
              Tester les preuves →
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
            radial-gradient(62% 60% at 84% 40%, rgba(249,115,22,0.16), transparent 60%),
            radial-gradient(45% 45% at 55% 118%, rgba(249,115,22,0.06), transparent 70%),
            radial-gradient(1.5px 1.5px at 12% 22%, rgba(255,255,255,0.5), transparent),
            radial-gradient(1px 1px at 68% 16%, rgba(255,255,255,0.4), transparent),
            radial-gradient(1px 1px at 88% 70%, rgba(255,255,255,0.42), transparent),
            radial-gradient(1px 1px at 40% 80%, rgba(255,255,255,0.3), transparent),
            radial-gradient(1.5px 1.5px at 26% 56%, rgba(255,255,255,0.26), transparent); }
        .hero2-grid { position:absolute; inset:0; z-index:0; pointer-events:none; opacity:.6;
          background-image:
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size:46px 46px;
          -webkit-mask-image:radial-gradient(58% 60% at 80% 42%, #000 0%, transparent 72%);
          mask-image:radial-gradient(58% 60% at 80% 42%, #000 0%, transparent 72%); }
        .hero2-vignette { position:absolute; inset:0; z-index:0; pointer-events:none;
          background:radial-gradient(130% 100% at 50% -10%, transparent 52%, rgba(0,0,0,0.55) 100%); }
        .hero2 { width:100%; max-width:1200px; margin:0 auto;
          padding: 3rem clamp(1.5rem,5vw,4rem);
          display:flex; flex-direction:column; align-items:center; text-align:center; gap:2.75rem; }
        .hero2-left { display:flex; flex-direction:column; align-items:center; gap:1.5rem; }
        .hero2-right { width:100%; display:flex; justify-content:center; }
        @media (min-width: 900px) {
          .hero2 { flex-direction:row; align-items:center; justify-content:space-between; text-align:left; gap:3rem; }
          .hero2-left { align-items:flex-start; flex:0 1 45%; }
          .hero2-right { flex:0 1 53%; }
        }
      `}</style>
    </section>
  );
}
