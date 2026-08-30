import type { Metadata } from "next";
import { projects } from "@/lib/projects-data";
import PreuveCard from "@/components/preuves/PreuveCard";
import { PREUVES_CSS } from "@/components/preuves/preuvesCss";

// Server component : SEO + fond propre (plus de SpaceBackground). Les cards sont
// des mini-interfaces produit + flux d'architecture (client, animées).
export const metadata: Metadata = {
  title: "Projets — Axel Remillat | Systèmes IA testables",
  description:
    "Des systèmes IA testables en vrai : l'assistant RAG VEGA, les automatisations n8n, un agent commercial autonome, un pipeline Data/ML de scoring et l'infrastructure self-hosted. Pas de screenshots — des preuves.",
};

export default function ProjetsPage() {
  return (
    <main className="pvp-main">
      <style>{PREUVES_CSS}</style>
      <style>{`
        .pvp-main { position:relative; min-height:100vh; background:var(--color-bg); overflow:hidden;
          padding:10vh clamp(1.25rem,5vw,3rem) 14vh; }
        .pvp-bg { position:absolute; inset:0; z-index:0; pointer-events:none;
          background:
            radial-gradient(60% 55% at 82% 12%, rgba(249,115,22,0.12), transparent 62%),
            radial-gradient(45% 45% at 15% 90%, rgba(168,85,247,0.08), transparent 70%); }
        .pvp-grid { position:absolute; inset:0; z-index:0; pointer-events:none; opacity:.5;
          background-image:linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size:48px 48px;
          -webkit-mask-image:radial-gradient(80% 60% at 70% 10%, #000, transparent 75%);
          mask-image:radial-gradient(80% 60% at 70% 10%, #000, transparent 75%); }
        .pvp-vignette { position:absolute; inset:0; z-index:0; pointer-events:none;
          background:radial-gradient(120% 90% at 50% -10%, transparent 55%, rgba(0,0,0,0.5) 100%); }
        .pvp-wrap { position:relative; z-index:1; max-width:1040px; margin:0 auto; }
        .pvp-label { font-family:var(--font-mono); font-size:0.75rem; color:var(--color-orange);
          letter-spacing:.14em; text-transform:uppercase; margin:0 0 0.9rem; }
        .pvp-h1 { font-size:clamp(2.3rem,5vw,3.4rem); font-weight:900; color:#fff; line-height:1.05; margin:0 0 1rem; }
        .pvp-sub { color:rgba(255,255,255,0.55); max-width:600px; line-height:1.6; margin:0 0 3.5rem; }
        .pvp-list { display:flex; flex-direction:column; gap:2rem; }
        @keyframes pvpIn { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:none;} }
        .pvp-head { animation:pvpIn .6s cubic-bezier(.16,1,.3,1) both; }
        @media (prefers-reduced-motion: reduce) { .pvp-head { animation:none; } }
      `}</style>

      <div className="pvp-bg" aria-hidden />
      <div className="pvp-grid" aria-hidden />
      <div className="pvp-vignette" aria-hidden />

      <div className="pvp-wrap">
        <header>
          <p className="pvp-label pvp-head">PROJETS // EN PRODUCTION</p>
          <h1 className="pvp-h1 pvp-head" style={{ animationDelay: "0.08s" }}>
            Ne me croyez pas sur parole. Testez.
          </h1>
          <p className="pvp-sub pvp-head" style={{ animationDelay: "0.16s" }}>
            Chaque système ci-dessous tourne en vrai. Cliquez, essayez, cassez-les si vous pouvez.
          </p>
        </header>

        <div className="pvp-list">
          {projects.map((project, i) => (
            <PreuveCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
