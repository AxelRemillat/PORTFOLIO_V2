"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { usePendingPortal } from "@/components/game/hooks/usePortalDetection";
import { PortalConfirmation } from "@/components/game/PortalConfirmation";
import { QuestLog } from "@/components/game/QuestLog";
import { resetQuests } from "@/components/game/hooks/useQuestSystem";
import { resetVisited } from "@/components/game/hooks/useVisitedPortals";
import { useGameAudio } from "@/components/game/audio/useGameAudio";
import { IntroSequence } from "@/components/game/IntroSequence";
import { GameLoader } from "@/components/game/GameLoader";
import { setIntroMode } from "@/components/game/introState";

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
  "/demos/rag":       "CV Interactif RAG",
  "/projets/seaco":   "SEACO Pipeline",
  "/projets/n8n":     "Automatisations N8N",
  "/projets/rise/site": "RISE",
  "/projets/music":   "Planète qui Chante",
};

// Ligne de contrôle (panneau bas-gauche)
const CTRL_ROW: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 8,
  margin: "5px 0", fontSize: 13, color: "#CCB8EE", fontFamily: "monospace",
};

type GamePhase = "loading" | "warp" | "zoom" | "playing";

export default function GamePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<GamePhase>("loading");
  const [entering, setEntering] = useState<string | null>(null);
  const { pendingPortal, confirmPortal, cancelPortal } = usePendingPortal();
  useGameAudio(); // init audio au 1er geste + ambiance spatiale

  // Phase 'zoom' : la caméra part de loin et glisse (ease-out-cubic) via introState.
  // La fin du glissé (notifyIntroComplete → callback) fait passer en 'playing'.
  useEffect(() => {
    if (phase !== "zoom") return;
    setIntroMode(true, () => setPhase("playing"));
    const safety = setTimeout(() => setPhase("playing"), 4000); // secours
    return () => clearTimeout(safety);
  }, [phase]);

  useEffect(() => () => setIntroMode(false), []); // sécurité à la sortie du jeu

  const playing = phase === "playing";

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
      {/* 3D Canvas — toujours monté (précharge en arrière-plan). Visible dès 'zoom'. */}
      <div
        style={{
          position: "absolute", inset: 0,
          opacity: phase === "loading" || phase === "warp" ? 0 : 1,
          transition: "opacity 0.5s ease",
          pointerEvents: playing ? "auto" : "none",
        }}
      >
        <GameCanvas onPortalEnter={handlePortalEnter} />
      </div>

      {/* Phase 1 — écran de chargement */}
      {phase === "loading" && <GameLoader onReady={() => setPhase("warp")} />}

      {/* Phase 2 — warp (étoiles + B-612) */}
      {phase === "warp" && <IntroSequence onComplete={() => setPhase("zoom")} />}

      {/* HUD — visible uniquement en 'playing' (fade in) */}
      <div style={{ opacity: playing ? 1 : 0, transition: "opacity 0.5s ease", pointerEvents: playing ? "auto" : "none" }}>

      {/* Top-right : Quitter + Réinitialiser les quêtes */}
      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 10, display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
        <Link href="/" className="game-quit">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
          Quitter
        </Link>
        <button
          onClick={() => { resetQuests(); resetVisited(); }}
          title="Remettre toutes les quêtes à zéro"
          style={{
            background: "rgba(8,6,25,0.80)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 8, padding: "7px 14px", color: "#887799", fontSize: 11,
            cursor: "pointer", letterSpacing: 0.5, backdropFilter: "blur(8px)", transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#FF8080"; e.currentTarget.style.borderColor = "rgba(255,80,80,0.4)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#887799"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
        >
          ↺ Réinitialiser les quêtes
        </button>
      </div>

      {/* Controls overlay */}
      <div
        style={{
          position: "fixed", bottom: 24, left: 24, zIndex: 10, pointerEvents: "none",
          background: "rgba(8, 6, 25, 0.80)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: 14, padding: "14px 18px",
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
          minWidth: 220,
        }}
      >
        <div
          style={{
            fontSize: 10, letterSpacing: 3, color: "#FFE080",
            textTransform: "uppercase", marginBottom: 10,
            borderBottom: "1px solid rgba(255,224,128,0.2)", paddingBottom: 6,
            fontFamily: "monospace",
          }}
        >
          Contrôles
        </div>

        {/* Movement row */}
        <div style={CTRL_ROW}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <kbd className="game-kbd">Z</kbd>
            <div style={{ display: "flex", gap: 3 }}>
              <kbd className="game-kbd">Q</kbd>
              <kbd className="game-kbd">S</kbd>
              <kbd className="game-kbd">D</kbd>
            </div>
          </div>
          <span style={{ opacity: 0.5 }}>ou</span>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <kbd className="game-kbd">↑</kbd>
            <div style={{ display: "flex", gap: 3 }}>
              <kbd className="game-kbd">←</kbd>
              <kbd className="game-kbd">↓</kbd>
              <kbd className="game-kbd">→</kbd>
            </div>
          </div>
          <span>Déplacer</span>
        </div>

        {/* Other actions */}
        <div style={CTRL_ROW}>
          <kbd className="game-kbd">Espace</kbd>
          <span>Sauter</span>
        </div>
        <div style={CTRL_ROW}>
          <span>Clic sur un objet → interagir</span>
        </div>
        <div style={CTRL_ROW}>
          <span>Clic sol → déplacement auto</span>
        </div>
        <div style={CTRL_ROW}>
          <span>Portail → visite le projet</span>
        </div>
      </div>

      {/* Journal de quêtes (remplace l'ancienne légende des portails) */}
      <QuestLog />

      </div>{/* fin HUD */}

      {/* Portal confirmation dialog */}
      {pendingPortal && (
        <PortalConfirmation
          portal={pendingPortal}
          onConfirm={confirmPortal}
          onCancel={cancelPortal}
        />
      )}

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

        .game-quit {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(8, 6, 25, 0.80);
          border: 1px solid rgba(255, 80, 80, 0.35);
          border-radius: 10px; padding: 10px 20px;
          color: #FF8080; font-size: 14px; font-weight: 600;
          font-family: monospace; cursor: pointer;
          backdrop-filter: blur(12px); letter-spacing: 1px;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .game-quit:hover {
          background: rgba(180, 40, 40, 0.35);
          border-color: rgba(255, 80, 80, 0.7);
          color: #FFAAAA;
        }

        .game-kbd {
          display: inline-block;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 5px; padding: 2px 7px;
          font-size: 12px; color: #FFFFFF; font-weight: 600;
          font-family: monospace;
          box-shadow: 0 2px 0 rgba(0,0,0,0.4);
          min-width: 22px; text-align: center;
        }
      `}</style>
    </div>
  );
}
