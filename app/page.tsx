"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const SpaceBackground = dynamic(
  () => import("@/components/ui/SpaceBackground"),
  { ssr: false }
);

export default function SplashPage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    if (mobile) {
      const t = setTimeout(() => router.push("/projets"), 1500);
      return () => clearTimeout(t);
    }
  }, [router]);

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      <SpaceBackground />

      <style>{`
        @keyframes vegaDot {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px #67e8f9, 0 0 12px #67e8f9; }
          50%      { opacity: 0.4; box-shadow: 0 0 2px #67e8f9; }
        }
        @keyframes vegaGlitch {
          0%,90%,100% { clip-path: none; transform: none; }
          92%  { clip-path: inset(20% 0 60% 0); transform: translateX(-3px); }
          94%  { clip-path: inset(60% 0 10% 0); transform: translateX(3px); }
          96%  { clip-path: none; transform: none; }
        }
        .vega-cta-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #67e8f9;
          animation: vegaDot 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        .vega-cta {
          border: 1px solid rgba(103,232,249,0.35);
          border-radius: 40px;
          padding: 11px 22px;
          background: rgba(103,232,249,0.05);
          box-shadow: 0 0 18px rgba(103,232,249,0.12);
          transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
        }
        .vega-cta:hover {
          background: rgba(103,232,249,0.12);
          border-color: #67e8f9;
          box-shadow: 0 0 30px rgba(103,232,249,0.35);
          transform: translateY(-2px);
        }
        .vega-cta-text {
          color: rgba(255,255,255,0.78);
          font-weight: 600;
          transition: color 0.3s ease;
        }
        .vega-cta-keyword {
          color: #67e8f9;
          font-weight: 700;
          text-shadow: 0 0 10px rgba(103,232,249,0.6);
          animation: vegaGlitch 5s ease-in-out infinite;
        }
        .vega-cta-arrow {
          color: #67e8f9; opacity: 0;
          transform: translateX(-6px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .vega-cta:hover .vega-cta-text { color: #ffffff; }
        .vega-cta:hover .vega-cta-arrow { opacity: 1; transform: translateX(0); }
      `}</style>

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(249,115,22,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Label */}
        <p className="text-xs font-mono text-orange tracking-[0.2em] uppercase">
          Ingénieur Data &amp; IA
        </p>

        {/* Name */}
        <h1 className="text-6xl md:text-8xl font-bold text-white leading-none tracking-tight">
          Axel
          <br />
          <span className="text-orange">Remillat</span>
        </h1>

        {/* Tagline */}
        <p className="text-muted text-base md:text-lg max-w-sm">
          Pas des screenshots —{" "}
          <span className="text-text">des projets testables en vrai.</span>
        </p>

        {/* Mobile message */}
        {isMobile === true && (
          <p className="text-xs font-mono text-muted mt-2 animate-pulse">
            Version mobile — accès direct aux projets
          </p>
        )}

        {/* Buttons — only rendered once we know screen size */}
        {isMobile !== null && (
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            {!isMobile && (
              <button
                onClick={() => router.push("/game")}
                className="group relative px-8 py-4 rounded-xl bg-orange text-white font-semibold text-sm hover:bg-orange/90 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_32px_rgba(249,115,22,0.4)]"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v8M8 12h8" />
                  </svg>
                  Explorer en 3D
                </span>
              </button>
            )}
            <Link
              href="/projets"
              className="px-8 py-4 rounded-xl border border-border text-muted text-sm font-medium hover:text-white hover:border-white/20 transition-all duration-200"
            >
              Accéder aux projets →
            </Link>
          </div>
        )}

        {/* Hint desktop */}
        {isMobile === false && (
          <p className="text-xs text-muted/50 font-mono mt-2">
            Navigue jusqu'aux portails pour découvrir chaque projet
          </p>
        )}

        {/* CTA VEGA */}
        {isMobile === false && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', marginTop: '24px' }}>
            {/* Séparateur fondu */}
            <div style={{
              width: '120px', height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(103,232,249,0.3), transparent)'
            }} />

            {/* CTA */}
            <Link
              href="/demos"
              className="vega-cta"
              style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
            >
              <span className="vega-cta-dot" />
              <span className="font-mono text-sm tracking-widest vega-cta-text" style={{ letterSpacing: '0.15em' }}>
                Ce site <span className="vega-cta-keyword">pense</span>. Parle-lui.
              </span>
              <span className="vega-cta-arrow" style={{ fontSize: '15px' }}>→</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
