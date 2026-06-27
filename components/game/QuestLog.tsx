"use client";

import { useState } from "react";
import { useQuestSystem, type Quest } from "./hooks/useQuestSystem";
import { PORTALS } from "./constants/game";

const HEADER: React.CSSProperties = {
  fontSize: 10, letterSpacing: 2, color: "#8880aa",
  textTransform: "uppercase", margin: "10px 0 6px",
};

function ProgressBanner({ visited, total }: { visited: number; total: number }) {
  const all = visited >= total;
  const plural = visited > 1 ? "s" : "";
  return (
    <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 30, pointerEvents: "none", textAlign: "center" }}>
      <style>{`
        @keyframes titlePulse { 0%,100% { opacity: 1; text-shadow: 0 0 20px #FFD700, 0 0 40px #FF8C00 } 50% { opacity: 0.7; text-shadow: 0 0 8px #FFD700 } }
        @keyframes subtitleFade { 0%,100% { opacity: 0.6 } 50% { opacity: 1 } }
        @keyframes titleShimmer { 0%,100% { opacity: 1; text-shadow: 0 0 24px #FFD700, 0 0 48px #FFAA00 } 50% { opacity: 0.8; text-shadow: 0 0 14px #FFD700, 0 0 28px #FF8C00 } }
      `}</style>

      <div
        style={{
          fontSize: all ? 26 : 22, fontWeight: 800, color: all ? "#FFD700" : "#FFE080",
          textShadow: "0 0 20px #FFD700, 0 0 40px #FF8C00",
          letterSpacing: 3, textTransform: "uppercase", fontFamily: "monospace",
          transform: all ? "scale(1.06)" : undefined,
          animation: all ? "titleShimmer 2s ease-in-out infinite" : "titlePulse 2s ease-in-out infinite",
        }}
      >
        {all ? "🌟 Tous les projets explorés ! 🌟" : <>✦ <span>{visited} projet{plural} visité{plural} sur {total}</span> ✦</>}
      </div>

      {visited === 0 && (
        <p style={{ fontSize: 13, color: "#AA99CC", marginTop: 4, fontFamily: "monospace", animation: "subtitleFade 3s ease-in-out infinite" }}>
          Explore la planète et traverse les portails
        </p>
      )}
    </div>
  );
}

function QuestRow({ q, guided, onToggle }: { q: Quest; guided?: boolean; onToggle?: () => void }) {
  if (q.type === "secret" && !q.discovered) {
    return <div style={{ color: "#554466", fontStyle: "italic", fontSize: 12, padding: "2px 0" }}>??? {q.hint}</div>;
  }
  const done = q.completed;
  const clickable = !!onToggle && !done; // missions principales non complétées

  return (
    <div
      onClick={clickable ? onToggle : undefined}
      className={clickable ? "quest-clickable" : undefined}
      style={{
        display: "flex", alignItems: "center", gap: 8, padding: "2px 0", fontSize: 13,
        color: done ? "#88CC88" : "#EEE",
        textDecoration: done ? "line-through" : "none",
        opacity: done ? 0.7 : 1,
        ...(clickable && {
          cursor: "pointer", transition: "background 0.15s", borderRadius: 6, padding: "3px 6px", margin: "-3px -6px",
          ...(guided && { background: "rgba(255,224,128,0.12)", borderLeft: "2px solid #FFE080" }),
        }),
      }}
    >
      <span>{q.icon}</span>
      <span style={{ flex: 1 }}>{q.label}</span>
      {!clickable ? (
        <span>{done ? "✓" : "○"}</span>
      ) : guided ? (
        <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#FFE080" }}>🧭 <span style={{ fontSize: 10 }}>Guidé</span></span>
      ) : (
        <span style={{ opacity: 0.4 }}>🧭</span>
      )}
    </div>
  );
}

export function QuestLog() {
  const { quests, progress, lastCompleted, guidedPortalId, toggleGuide } = useQuestSystem();
  const [open, setOpen] = useState(false);

  const doneTotal = progress.main + progress.secret;
  const grandTotal = progress.total + progress.secretTotal;
  const main = quests.filter((q) => q.type === "main");
  const secret = quests.filter((q) => q.type === "secret");
  const allMainDone = progress.main >= progress.total; // 5/5 missions principales
  const toast = lastCompleted ? quests.find((q) => q.id === lastCompleted) : null;

  // Mode navigation : une quête est guidée (guidedPortalId = id de quête "visit_*").
  const nav = guidedPortalId !== null;
  const guidedPortal = guidedPortalId ? PORTALS.find((p) => p.id === guidedPortalId.replace("visit_", "")) : undefined;

  return (
    <>
    <ProgressBanner visited={progress.main} total={progress.total} />
    <div style={{ position: "fixed", top: 16, left: 16, zIndex: 20, pointerEvents: "none" }}>
      <style>{`
        @keyframes questToast { 0% { transform: translate(-50%, 20px); opacity: 0 } 12% { transform: translate(-50%, 0); opacity: 1 } 82% { transform: translate(-50%, 0); opacity: 1 } 100% { transform: translate(-50%, -8px); opacity: 0 } }
        .quest-clickable:hover { background: rgba(255,255,255,0.06) !important; }
        @keyframes questGlow { 0%,100% { box-shadow: 0 0 8px rgba(255,200,60,0.4), 0 0 0px rgba(255,200,60,0); border-color: rgba(255,200,60,0.5); color: #FFE080 } 50% { box-shadow: 0 0 18px rgba(255,200,60,0.9), 0 0 35px rgba(255,180,30,0.4); border-color: rgba(255,220,80,0.95); color: #FFFFFF } }
        @keyframes questGlowDone { 0%,100% { box-shadow: 0 0 8px rgba(136,255,136,0.4), 0 0 0px rgba(136,255,136,0); border-color: rgba(136,255,136,0.5); color: #88FF88 } 50% { box-shadow: 0 0 18px rgba(136,255,136,0.9), 0 0 35px rgba(80,220,80,0.4); border-color: rgba(150,255,150,0.95); color: #FFFFFF } }
        @keyframes handPoint { 0%,100% { transform: translateY(-50%) translateX(0px) } 50% { transform: translateY(-50%) translateX(-6px) } }
      `}</style>

      {/* Bouton toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button
          onClick={() => setOpen((v) => !v)}
          style={{
            position: "relative", pointerEvents: "auto", cursor: "pointer",
            background: "rgba(10,8,30,0.85)",
            // Mode navigation : bordure discrète, plus de glow. Sinon mode invitation.
            border: nav ? "1px solid rgba(255,200,60,0.3)" : "1px solid rgba(255,220,100,0.4)",
            color: "#FFE080", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontFamily: "monospace",
            transition: "all 0.3s ease",
            boxShadow: nav ? "none" : undefined,
            // Clignotement attractif tant que le panneau est fermé (vert une fois 5/5).
            animation: nav ? "none" : open ? undefined : `${allMainDone ? "questGlowDone" : "questGlow"} 2.2s ease-in-out infinite`,
          }}
        >
          📜 Quêtes ({doneTotal}/{grandTotal})
          {/* Main pointante : mode invitation, panneau fermé + au moins 1 mission restante */}
          {!nav && !open && !allMainDone && (
            <span style={{ position: "absolute", left: "calc(100% + 10px)", top: "50%", transform: "translateY(-50%)", fontSize: "22px", animation: "handPoint 1.1s ease-in-out infinite", pointerEvents: "none", filter: "drop-shadow(0 0 6px rgba(255,200,60,0.8))" }}>👈</span>
          )}
        </button>
      </div>

      {nav && guidedPortal && (
        <div style={{ marginTop: 8, pointerEvents: "auto", background: "rgba(8,6,25,0.88)", border: "1px solid rgba(255,200,60,0.35)", borderRadius: 8, padding: "7px 12px", fontSize: 12, color: "#CCB8EE", display: "flex", alignItems: "center", gap: 8, minWidth: 180 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: guidedPortal.color, boxShadow: `0 0 6px ${guidedPortal.color}`, flexShrink: 0 }} />
          <span>
            <span style={{ color: "#888", fontSize: 10, display: "block", lineHeight: 1.2 }}>En route vers</span>
            <span style={{ color: "#FFE080", fontWeight: 600 }}>{guidedPortal.label}</span>
          </span>
          <span onClick={() => guidedPortalId && toggleGuide(guidedPortalId)} style={{ marginLeft: "auto", color: "#554466", fontSize: 16, cursor: "pointer", lineHeight: 1, transition: "color 0.15s" }} onMouseEnter={(e) => { e.currentTarget.style.color = "#FF8080"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#554466"; }}>✕</span>
        </div>
      )}

      {/* Panneau */}
      {open && (
        <div
          style={{
            pointerEvents: "auto",
            background: "rgba(8,6,25,0.92)", border: "1px solid rgba(255,220,100,0.25)",
            borderRadius: 12, padding: 16, minWidth: 260, marginTop: 8,
            backdropFilter: "blur(8px)", fontFamily: "monospace", maxHeight: "70vh", overflowY: "auto",
          }}
        >
          <div style={{ fontSize: 13, letterSpacing: 1, color: "#FFE080", fontWeight: 700 }}>📜 JOURNAL DE BORD</div>

          <div style={HEADER}>Missions principales</div>
          {main.map((q) => (
            <QuestRow key={q.id} q={q} guided={guidedPortalId === q.id} onToggle={() => { if (guidedPortalId !== q.id) setOpen(false); toggleGuide(q.id); }} />
          ))}

          <div style={HEADER}>Secrets [{progress.secret} / {progress.secretTotal} trouvés]</div>
          {secret.map((q) => <QuestRow key={q.id} q={q} />)}
        </div>
      )}

      {/* Toast de complétion (bas-centre) */}
      {toast && (
        <div
          key={toast.id}
          style={{
            position: "fixed", bottom: 80, left: "50%", transform: "translate(-50%, 0)", pointerEvents: "none",
            background: "#FFE08022", border: "1px solid #FFE080", color: "#FFE080",
            borderRadius: 10, padding: "10px 18px", fontFamily: "monospace", fontSize: 14, whiteSpace: "nowrap",
            boxShadow: "0 0 24px #FFE08044", backdropFilter: "blur(6px)", animation: "questToast 3s ease forwards",
          }}
        >
          {toast.id === "watch_shooting_star"
            ? `${toast.icon} Vœu enregistré. Traitement prévu sous 3 à 5 milliards d'années.`
            : `${toast.icon} Quête complétée : ${toast.label}`}
        </div>
      )}
    </div>
    </>
  );
}
