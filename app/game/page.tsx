"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const GameCanvas = dynamic(
  () => import("@/components/game/GameCanvas").then((m) => m.GameCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-orange/30 border-t-orange rounded-full animate-spin" />
        <p className="text-xs font-mono text-muted">Chargement du monde 3D…</p>
      </div>
    ),
  }
);

const PORTAL_LABELS: Record<string, string> = {
  "/demos/rag": "CV Interactif RAG",
  "/projets/seaco": "SEACO Pipeline",
  "/projets/n8n": "Automatisations N8N",
  "/projets/rise": "RISE",
};

export default function GamePage() {
  const router = useRouter();
  const [entering, setEntering] = useState<string | null>(null);

  const handlePortalEnter = useCallback(
    (href: string) => {
      setEntering(href);
      setTimeout(() => router.push(href), 600);
    },
    [router]
  );

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 60, background: "#080810" }}
    >
      {/* 3D Canvas */}
      <div style={{ width: "100%", height: "100%" }}>
        <GameCanvas onPortalEnter={handlePortalEnter} />
      </div>

      {/* Quit button */}
      <div className="absolute top-4 right-4 z-10">
        <Link
          href="/projets"
          className="flex items-center gap-2 px-3 py-2 text-xs font-mono text-muted hover:text-white border border-border hover:border-white/20 rounded-lg bg-bg/70 backdrop-blur transition-colors"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
          Quitter
        </Link>
      </div>

      {/* Controls overlay */}
      <div className="absolute bottom-5 left-5 z-10 pointer-events-none">
        <div className="flex flex-col gap-1.5 px-3 py-2.5 rounded-lg bg-bg/60 border border-border/40 backdrop-blur">
          <p className="text-[10px] font-mono text-muted/70 uppercase tracking-widest mb-0.5">
            Contrôles
          </p>

          {/* Movement row */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-0.5">
              <kbd className="px-2 py-0.5 text-[9px] font-mono bg-surface border border-border rounded text-muted">Z</kbd>
              <div className="flex gap-0.5">
                <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-surface border border-border rounded text-muted">Q</kbd>
                <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-surface border border-border rounded text-muted">S</kbd>
                <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-surface border border-border rounded text-muted">D</kbd>
              </div>
            </div>
            <span className="text-muted/40 text-[10px]">ou</span>
            <div className="flex flex-col items-center gap-0.5">
              <kbd className="px-2 py-0.5 text-[9px] font-mono bg-surface border border-border rounded text-muted">↑</kbd>
              <div className="flex gap-0.5">
                <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-surface border border-border rounded text-muted">←</kbd>
                <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-surface border border-border rounded text-muted">↓</kbd>
                <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-surface border border-border rounded text-muted">→</kbd>
              </div>
            </div>
            <span className="text-[10px] font-mono text-muted/60">Déplacer</span>
          </div>

          {/* Other actions */}
          <div className="flex flex-col gap-0.5 mt-0.5">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-0.5 text-[9px] font-mono bg-surface border border-border rounded text-muted">Espace</kbd>
              <span className="text-[10px] font-mono text-muted/60">Sauter</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-0.5 text-[9px] font-mono bg-surface border border-border rounded text-muted">R</kbd>
              <span className="text-[10px] font-mono text-muted/60">Interagir (ou clic objet)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-muted/50">Clic sol → déplacement auto</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-muted/50">Portail → visite le projet</span>
            </div>
          </div>
        </div>
      </div>

      {/* Portal legend */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="flex flex-col gap-1.5 px-3 py-2.5 rounded-lg bg-bg/60 border border-border/40 backdrop-blur">
          <p className="text-[10px] font-mono text-muted/70 uppercase tracking-widest mb-0.5">
            Portails
          </p>
          {[
            { color: "#f97316", label: "CV RAG",  dir: "N-E" },
            { color: "#e2e8f0", label: "RISE",    dir: "N-O" },
            { color: "#60a5fa", label: "SEACO",   dir: "S-E" },
            { color: "#a855f7", label: "N8N",     dir: "S-O" },
          ].map(({ color, label, dir }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
              <span className="text-[10px] font-mono text-muted">{dir} — {label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Portal enter transition */}
      {entering && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center"
          style={{
            background: "rgba(8, 8, 16, 0.85)",
            backdropFilter: "blur(4px)",
            animation: "fadeIn 0.4s ease forwards",
          }}
        >
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-orange/30 border-t-orange rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-mono text-white">
              → {PORTAL_LABELS[entering] ?? entering}
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </div>
  );
}
