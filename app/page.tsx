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
              <Link
                href="/game"
                className="group relative px-8 py-4 rounded-xl bg-orange text-white font-semibold text-sm hover:bg-orange/90 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_32px_rgba(249,115,22,0.4)]"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v8M8 12h8" />
                  </svg>
                  Explorer en 3D
                </span>
              </Link>
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
      </div>
    </div>
  );
}
