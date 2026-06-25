"use client";

import { useState } from "react";
import { useQuestSystem, type Quest } from "./hooks/useQuestSystem";

const HEADER: React.CSSProperties = {
  fontSize: 10, letterSpacing: 2, color: "#8880aa",
  textTransform: "uppercase", margin: "10px 0 6px",
};

function ProgressBanner({ visited, total }: { visited: number; total: number }) {
  const all = visited >= total;
  const plural = visited > 1 ? "s" : "";
  return (
    <div
      style={{
        position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
        zIndex: 30, pointerEvents: "none", textAlign: "center",
      }}
    >
      <style>{`
        @keyframes titlePulse { 0%,100% { opacity: 1; text-shadow: 0 0 20px #FFD700, 0 0 40px #FF8C00 } 50% { opacity: 0.7; text-shadow: 0 0 8px #FFD700 } }
        @keyframes subtitleFade { 0%,100% { opacity: 0.6 } 50% { opacity: 1 } }
        @keyframes titleShimmer { 0%,100% { opacity: 1; text-shadow: 0 0 24px #FFD700, 0 0 48px #FFAA00 } 50% { opacity: 0.8; text-shadow: 0 0 14px #FFD700, 0 0 28px #FF8C00 } }
      `}</style>

      <div
        style={{
          fontSize: all ? 26 : 22, fontWeight: 800,
          color: all ? "#FFD700" : "#FFE080",
          textShadow: "0 0 20px #FFD700, 0 0 40px #FF8C00",
          letterSpacing: 3, textTransform: "uppercase", fontFamily: "monospace",
          transform: all ? "scale(1.06)" : undefined,
          animation: all ? "titleShimmer 2s ease-in-out infinite" : "titlePulse 2s ease-in-out infinite",
        }}
      >
        {all ? (
          "🌟 Tous les projets explorés ! 🌟"
        ) : (
          <>✦ <span>{visited} projet{plural} visité{plural} sur {total}</span> ✦</>
        )}
      </div>

      {visited === 0 && (
        <p
          style={{
            fontSize: 13, color: "#AA99CC", marginTop: 4, fontFamily: "monospace",
            animation: "subtitleFade 3s ease-in-out infinite",
          }}
        >
          Explore la planète et traverse les portails
        </p>
      )}
    </div>
  );
}

function QuestRow({ q }: { q: Quest }) {
  const hidden = q.type === "secret" && !q.discovered;
  if (hidden) {
    return (
      <div style={{ color: "#554466", fontStyle: "italic", fontSize: 12, padding: "2px 0" }}>
        ??? {q.hint}
      </div>
    );
  }
  const done = q.completed;
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 8, padding: "2px 0",
        fontSize: 13,
        color: done ? "#88CC88" : "#EEE",
        textDecoration: done ? "line-through" : "none",
        opacity: done ? 0.7 : 1,
      }}
    >
      <span>{q.icon}</span>
      <span style={{ flex: 1 }}>{q.label}</span>
      <span>{done ? "✓" : "○"}</span>
    </div>
  );
}

export function QuestLog() {
  const { quests, progress, lastCompleted } = useQuestSystem();
  const [open, setOpen] = useState(false);

  const doneTotal = progress.main + progress.secret;
  const grandTotal = progress.total + progress.secretTotal;
  const main = quests.filter((q) => q.type === "main");
  const secret = quests.filter((q) => q.type === "secret");
  const toast = lastCompleted ? quests.find((q) => q.id === lastCompleted) : null;

  return (
    <>
    <ProgressBanner visited={progress.main} total={progress.total} />
    <div style={{ position: "fixed", top: 16, left: 16, zIndex: 20, pointerEvents: "none" }}>
      <style>{`
        @keyframes questToast { 0% { transform: translate(-50%, 20px); opacity: 0 }
          12% { transform: translate(-50%, 0); opacity: 1 }
          82% { transform: translate(-50%, 0); opacity: 1 }
          100% { transform: translate(-50%, -8px); opacity: 0 } }
      `}</style>

      {/* Bouton toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          pointerEvents: "auto", cursor: "pointer",
          background: "rgba(10,8,30,0.85)", border: "1px solid rgba(255,220,100,0.4)",
          color: "#FFE080", borderRadius: 8, padding: "8px 14px",
          fontSize: 13, fontFamily: "monospace",
        }}
      >
        📜 Quêtes ({doneTotal}/{grandTotal})
      </button>

      {/* Panneau */}
      {open && (
        <div
          style={{
            pointerEvents: "auto",
            background: "rgba(8,6,25,0.92)", border: "1px solid rgba(255,220,100,0.25)",
            borderRadius: 12, padding: 16, minWidth: 260, marginTop: 8,
            backdropFilter: "blur(8px)", fontFamily: "monospace",
            maxHeight: "70vh", overflowY: "auto",
          }}
        >
          <div style={{ fontSize: 13, letterSpacing: 1, color: "#FFE080", fontWeight: 700 }}>
            📜 JOURNAL DE BORD
          </div>

          <div style={HEADER}>Missions principales</div>
          {main.map((q) => <QuestRow key={q.id} q={q} />)}

          <div style={HEADER}>
            Secrets [{progress.secret} / {progress.secretTotal} trouvés]
          </div>
          {secret.map((q) => <QuestRow key={q.id} q={q} />)}
        </div>
      )}

      {/* Toast de complétion (bas-centre) */}
      {toast && (
        <div
          key={toast.id}
          style={{
            position: "fixed", bottom: 80, left: "50%", transform: "translate(-50%, 0)",
            pointerEvents: "none",
            background: "#FFE08022", border: "1px solid #FFE080",
            color: "#FFE080", borderRadius: 10, padding: "10px 18px",
            fontFamily: "monospace", fontSize: 14, whiteSpace: "nowrap",
            boxShadow: "0 0 24px #FFE08044", backdropFilter: "blur(6px)",
            animation: "questToast 3s ease forwards",
          }}
        >
          {toast.icon} Quête complétée : {toast.label}
        </div>
      )}
    </div>
    </>
  );
}
