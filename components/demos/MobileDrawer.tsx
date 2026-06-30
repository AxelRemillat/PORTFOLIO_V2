"use client";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import SidePanelHandle from "./SidePanelHandle";
import { usePanelDrag } from "./usePanelDrag";
import QuestionList from "./QuestionList";
import HistoryContent from "./HistoryContent";
import type { Conversation } from "./useConversationHistory";

// Mobile : les deux poignées (gauche=Questions, droite=Historique) restent
// visibles ; clic OU drag vers le centre ouvre un tiroir plein écran à 2 onglets.
const QIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M3 4h10M3 8h10M3 12h6" /></svg>
);
const HIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="8" cy="8" r="6" /><path d="M8 5v3l2 1.5" /></svg>
);

interface Props {
  onPick: (q: string) => void;
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (c: Conversation) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  reduced?: boolean;
  intro?: boolean;
}

const tabBtn = (active: boolean): CSSProperties => ({
  flex: 1, padding: "14px 0", background: active ? "rgba(255,100,0,0.1)" : "transparent",
  border: "none", borderBottom: active ? "2px solid #ff6600" : "2px solid transparent",
  color: active ? "#ff8a3c" : "rgba(255,255,255,0.5)", cursor: "pointer",
  fontFamily: "monospace", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase",
});

export default function MobileDrawer(props: Props) {
  const { onPick, reduced, intro } = props;
  const [tab, setTab] = useState<"q" | "h" | null>(null);

  const leftDrag = usePanelDrag({ side: "left", width: 220, open: false, setOpen: (v) => v && setTab("q") });
  const rightDrag = usePanelDrag({ side: "right", width: 220, open: false, setOpen: (v) => v && setTab("h") });

  useEffect(() => {
    if (!tab) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setTab(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tab]);

  const pick = (q: string) => { onPick(q); setTab(null); };

  return (
    <>
      <SidePanelHandle side="left" label="QUESTIONS" icon={QIcon} open={tab === "q"} offset={6}
        dragging={leftDrag.dragFrac !== null} reduced={reduced} intro={intro} transMs={350}
        onPointerDown={leftDrag.onPointerDown} onToggleKey={() => setTab("q")} ariaLabel="Ouvrir les questions" />
      <SidePanelHandle side="right" label="HISTORIQUE" icon={HIcon} open={tab === "h"} offset={6}
        dragging={rightDrag.dragFrac !== null} reduced={reduced} intro={intro} transMs={350}
        onPointerDown={rightDrag.onPointerDown} onToggleKey={() => setTab("h")} ariaLabel="Ouvrir l'historique" />

      <div
        role="dialog" aria-label="Menu VEGA" aria-hidden={!tab}
        style={{
          position: "fixed", inset: 0, zIndex: 60, display: "flex", flexDirection: "column",
          background: "rgba(8,8,16,0.97)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
          opacity: tab ? 1 : 0, pointerEvents: tab ? "auto" : "none",
          transition: reduced ? "none" : "opacity 260ms ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid rgba(255,100,0,0.2)", paddingTop: 56 }}>
          <button type="button" style={tabBtn(tab === "q")} onClick={() => setTab("q")} aria-pressed={tab === "q"}>Questions</button>
          <button type="button" style={tabBtn(tab === "h")} onClick={() => setTab("h")} aria-pressed={tab === "h"}>Historique</button>
          <button type="button" onClick={() => setTab(null)} aria-label="Fermer" style={{ width: 48, padding: 14, background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 18 }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {tab === "h" ? (
            <HistoryContent {...props} />
          ) : (
            <QuestionList onPick={pick} />
          )}
        </div>
      </div>
    </>
  );
}
