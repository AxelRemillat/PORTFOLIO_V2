"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import FloatingText from "@/components/demos/FloatingText";
import FloatingInput from "@/components/demos/FloatingInput";
import SidePanel from "@/components/demos/SidePanel";
import QuestionList from "@/components/demos/QuestionList";
import HistoryContent from "@/components/demos/HistoryContent";
import MobileDrawer from "@/components/demos/MobileDrawer";
import { useAXChat } from "@/components/demos/useAXChat";
import { useConversationHistory } from "@/components/demos/useConversationHistory";
import { useSpeechControls } from "@/components/demos/useSpeechControls";
import type { Conversation } from "@/components/demos/useConversationHistory";

// L'orbe R3F est chargé côté client uniquement (WebGL — pas de SSR).
const OrbScene = dynamic(() => import("@/components/demos/OrbScene"), { ssr: false });

// Icônes des poignées (gauche = questions / droite = horloge)
const QIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M3 4h10M3 8h10M3 12h6" /></svg>
);
const HIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="8" cy="8" r="6" /><path d="M8 5v3l2 1.5" /></svg>
);

export default function DemosPage() {
  const ax = useAXChat();
  const hist = useConversationHistory();
  const ctrl = useSpeechControls();

  // Suppression de la conversation en cours : retire de l'historique + reset chat (idle).
  const deleteConv = () => { if (hist.activeId) hist.remove(hist.activeId); ax.newConversation(); };

  // Responsive + accessibilité
  const [isMobile, setIsMobile] = useState(false);
  const [reduced, setReduced] = useState(false);
  // Desktop : un seul panneau ouvert à la fois (ouvrir l'un ferme l'autre).
  const [openSide, setOpenSide] = useState<"none" | "left" | "right">("none");

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const rq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => { setIsMobile(mq.matches); setReduced(rq.matches); };
    apply();
    mq.addEventListener("change", apply); rq.addEventListener("change", apply);
    return () => { mq.removeEventListener("change", apply); rq.removeEventListener("change", apply); };
  }, []);

  // Persiste la conversation courante dès qu'un tour se termine.
  useEffect(() => {
    if (ax.conversation.length) hist.recordActive(ax.conversation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ax.conversation]);

  // Clic sur une question → envoi (logique existante) + on referme le menu.
  const ask = (q: string) => { ax.submit(q); setOpenSide("none"); };

  const selectConv = (c: Conversation) => {
    hist.setActiveId(c.id); ax.loadConversation(c.messages);
  };
  const newConv = () => { hist.newConversation(); ax.newConversation(); };

  return (
    <>
      {/* Fond sombre fixe */}
      <div style={{ position: "fixed", inset: 0, background: "#080810", zIndex: -1 }} />

      {/* Orbe 3D plein écran en arrière-plan */}
      <OrbScene state={ax.orbState} />

      {/* Titre discret en haut (sous la navbar) */}
      <div style={{ position: "fixed", top: 76, width: "100%", textAlign: "center", zIndex: 20, pointerEvents: "none" }}>
        <p style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,100,0,0.5)", letterSpacing: "0.2em" }}>
          VEGA — IA DE PRÉSENTATION // AXEL REMILLAT
        </p>
      </div>

      {/* Texte IA flottant (taille auto-ajustée, bornée → ne déborde jamais sur l'orbe) */}
      <FloatingText text={ax.displayText} fullText={ax.fullText} isStreaming={ax.isStreaming} isVisible={ax.showText} />

      {/* HUD piloté par l'état de l'orbe (idle / thinking / speaking) */}
      <FloatingInput
        state={ax.orbState}
        onSubmit={ax.submit}
        isVoiceOn={ax.isVoiceOn}
        onToggleVoice={ax.toggleVoice}
        paused={ctrl.paused}
        speed={ctrl.speed}
        onTogglePause={ctrl.togglePause}
        onCycleSpeed={ctrl.cycleSpeed}
        onDeleteConversation={deleteConv}
      />

      {/* Desktop : 2 panneaux latéraux en miroir (un ouvert ferme l'autre) */}
      {!isMobile && (
        <>
          <SidePanel
            side="left" title="QUESTIONS" label="QUESTIONS" icon={QIcon} reduced={reduced} intro
            open={openSide === "left"}
            onOpenChange={(v) => setOpenSide(v ? "left" : "none")}
          >
            <QuestionList onPick={ask} />
          </SidePanel>

          <SidePanel
            side="right" title="HISTORIQUE" label="HISTORIQUE" icon={HIcon} reduced={reduced} intro
            open={openSide === "right"}
            onOpenChange={(v) => setOpenSide(v ? "right" : "none")}
          >
            <HistoryContent
              conversations={hist.conversations}
              activeId={hist.activeId}
              onSelect={selectConv}
              onNew={newConv}
              onDelete={hist.remove}
            />
          </SidePanel>
        </>
      )}

      {/* Mobile : 2 poignées → 1 tiroir plein écran à onglets (drag dispo) */}
      {isMobile && (
        <MobileDrawer
          onPick={ask}
          conversations={hist.conversations}
          activeId={hist.activeId}
          onSelect={selectConv}
          onNew={newConv}
          onDelete={hist.remove}
          reduced={reduced}
          intro
        />
      )}
    </>
  );
}
