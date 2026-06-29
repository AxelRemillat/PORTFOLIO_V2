"use client";

import dynamic from "next/dynamic";
import FloatingText from "@/components/demos/FloatingText";
import FloatingInput from "@/components/demos/FloatingInput";
import { useAXChat } from "@/components/demos/useAXChat";

// L'orbe R3F est chargé côté client uniquement (WebGL — pas de SSR).
const OrbScene = dynamic(() => import("@/components/demos/OrbScene"), { ssr: false });

export default function DemosPage() {
  const ax = useAXChat();

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

      {/* Texte IA flottant */}
      <FloatingText text={ax.displayText} isStreaming={ax.isStreaming} isVisible={ax.showText} />

      {/* Input + suggestions */}
      <FloatingInput
        onSubmit={ax.submit}
        isVoiceOn={ax.isVoiceOn}
        onToggleVoice={ax.toggleVoice}
        showSuggestions={!ax.started}
        disabled={ax.orbState !== "idle"}
      />
    </>
  );
}
