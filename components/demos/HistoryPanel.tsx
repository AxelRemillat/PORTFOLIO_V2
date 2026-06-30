"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { Conversation } from "./useConversationHistory";

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (c: Conversation) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

const PANEL_W = 320; // largeur desktop (px) — réglable

function relTime(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "à l'instant";
  if (s < 3600) return `il y a ${Math.floor(s / 60)} min`;
  if (s < 86400) return `il y a ${Math.floor(s / 3600)} h`;
  return new Date(ts).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

export default function HistoryPanel({ conversations, activeId, onSelect, onNew, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => { setMobile(mq.matches); setReduced(rm.matches); };
    apply();
    mq.addEventListener("change", apply); rm.addEventListener("change", apply);
    return () => { mq.removeEventListener("change", apply); rm.removeEventListener("change", apply); };
  }, []);

  const active = conversations.find(c => c.id === activeId) ?? null;
  const width = mobile ? "100vw" : `${PANEL_W}px`;

  const panel: CSSProperties = {
    position: "fixed", top: 0, right: 0, bottom: 0, width, zIndex: 45,
    background: "rgba(10, 10, 18, 0.92)", backdropFilter: "blur(14px)",
    borderLeft: "1px solid rgba(255,100,0,0.18)",
    transform: open ? "translateX(0)" : "translateX(100%)",
    opacity: open ? 1 : 0,
    transition: reduced ? "opacity 0.2s ease" : "transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease",
    display: "flex", flexDirection: "column", fontFamily: "var(--font-mono, monospace)",
    pointerEvents: open ? "auto" : "none",
  };

  return (
    <>
      {/* Poignée discrète sur le bord droit (toujours visible) */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Fermer l'historique" : "Ouvrir l'historique des conversations"}
        aria-expanded={open}
        className="hud-glyph"
        style={{
          position: "fixed", top: "50%", right: open && !mobile ? `calc(${width} + 8px)` : "8px",
          transform: "translateY(-50%)", zIndex: 46, width: 34, height: 44,
          border: "1px solid rgba(255,100,0,0.25)", borderRadius: 8,
          background: "rgba(10,10,18,0.6)", color: "rgba(255,140,0,0.8)",
          transition: "right 0.35s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <circle cx="8" cy="8" r="6" /><path d="M8 5v3l2 1.5" />
        </svg>
      </button>

      <aside style={panel} aria-hidden={!open}>
        <div style={{ padding: "18px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, letterSpacing: "0.12em", color: "rgba(255,140,0,0.8)" }}>
              CONVERSATIONS
            </span>
            {mobile && (
              <button type="button" onClick={() => setOpen(false)} className="hud-glyph" aria-label="Fermer" style={{ width: 26, height: 26 }}>
                ✕
              </button>
            )}
          </div>
          <button type="button" onClick={onNew} className="hud-suggestion" style={{ marginTop: 10, color: "rgba(255,255,255,0.7)", border: "1px dashed rgba(255,255,255,0.15)", borderRadius: 6, width: "100%", padding: "8px 10px", textAlign: "left" }}>
            + Nouvelle conversation
          </button>
        </div>

        {/* Liste des conversations */}
        <div style={{ overflowY: "auto", flex: "0 0 auto", maxHeight: "40%", padding: "8px 10px" }}>
          {conversations.length === 0 && (
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", padding: "8px 6px" }}>Aucune conversation enregistrée.</p>
          )}
          {conversations.map(c => (
            <div
              key={c.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(c)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(c); } }}
              style={{
                display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
                padding: "8px 8px", borderRadius: 6, marginBottom: 2,
                background: c.id === activeId ? "rgba(255,100,0,0.1)" : "transparent",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.title}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{relTime(c.updatedAt)}</div>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
                className="hud-glyph" aria-label={`Supprimer ${c.title}`} style={{ width: 24, height: 24 }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Transcript de la conversation active (questions + réponses) */}
        {active && (
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", overflowY: "auto", flex: 1, padding: "12px 14px" }}>
            {active.messages.map((m, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, letterSpacing: "0.1em", color: m.role === "user" ? "rgba(167,139,250,0.8)" : "rgba(255,140,0,0.8)", marginBottom: 3 }}>
                  {m.role === "user" ? "TOI" : "VEGA"}
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.5, color: "rgba(255,255,255,0.78)" }}>{m.content}</div>
              </div>
            ))}
          </div>
        )}
      </aside>
    </>
  );
}
