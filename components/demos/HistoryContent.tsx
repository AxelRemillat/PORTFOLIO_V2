"use client";
import { useState } from "react";
import type { Conversation } from "./useConversationHistory";

// Contenu de l'historique en 2 vues, sans le shell (réutilisé dans le panneau
// droit desktop et le drawer mobile) :
//   liste  → uniquement les questions (titre) + date, cliquables
//   détail → la conversation sélectionnée en grand (transcript plein panneau)
interface Props {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (c: Conversation) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

function relTime(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "à l'instant";
  if (s < 3600) return `il y a ${Math.floor(s / 60)} min`;
  if (s < 86400) return `il y a ${Math.floor(s / 3600)} h`;
  return new Date(ts).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

export default function HistoryContent({ conversations, activeId, onSelect, onNew, onDelete }: Props) {
  // Conversation affichée en grand (null = vue liste)
  const [detailId, setDetailId] = useState<string | null>(null);
  const detail = detailId ? conversations.find((c) => c.id === detailId) : null;

  const openDetail = (c: Conversation) => { onSelect(c); setDetailId(c.id); };

  // ── Vue détail : conversation en grand ────────────────────────────────────
  if (detail) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <button type="button" onClick={() => setDetailId(null)} className="hud-suggestion"
            style={{ color: "rgba(255,170,80,0.9)", border: "1px solid rgba(255,120,0,0.35)", borderRadius: 6, padding: "5px 10px", flexShrink: 0 }}>
            ‹ Historique
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{detail.title}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{relTime(detail.updatedAt)}</div>
          </div>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: "14px" }}>
          {detail.messages.map((m, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.1em", color: m.role === "user" ? "rgba(167,139,250,0.8)" : "rgba(255,140,0,0.8)", marginBottom: 3 }}>
                {m.role === "user" ? "TOI" : "VEGA"}
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.55, color: "rgba(255,255,255,0.78)" }}>{m.content}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Vue liste : questions + dates uniquement ──────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "10px 12px" }}>
        <button type="button" onClick={onNew} className="hud-suggestion"
          style={{ color: "rgba(255,255,255,0.7)", border: "1px dashed rgba(255,255,255,0.15)", borderRadius: 6, width: "100%", padding: "8px 10px", textAlign: "left" }}>
          + Nouvelle conversation
        </button>
      </div>

      <div style={{ overflowY: "auto", flex: 1, padding: "0 10px 8px" }}>
        {conversations.length === 0 && (
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", padding: "8px 6px" }}>Aucune conversation enregistrée.</p>
        )}
        {conversations.map((c) => (
          <div
            key={c.id}
            role="button"
            tabIndex={0}
            onClick={() => openDetail(c)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openDetail(c); } }}
            style={{
              display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
              padding: "8px", borderRadius: 6, marginBottom: 2,
              background: c.id === activeId ? "rgba(255,100,0,0.1)" : "transparent",
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.title}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{relTime(c.updatedAt)}</div>
            </div>
            <button type="button" onClick={(e) => { e.stopPropagation(); onDelete(c.id); }} className="hud-glyph" aria-label={`Supprimer ${c.title}`} style={{ width: 24, height: 24 }}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
