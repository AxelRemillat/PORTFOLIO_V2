"use client";

import { Canvas } from "@react-three/fiber";
import type { CSSProperties } from "react";
import AIOrb from "./AIOrb";

type OrbState = "idle" | "thinking" | "speaking";

const hud: CSSProperties = {
  position: "fixed",
  zIndex: 10,
  fontFamily: "monospace",
  fontSize: 11,
  color: "rgba(255,100,0,0.35)",
  letterSpacing: "0.15em",
  pointerEvents: "none",
};

export default function OrbScene({ state }: { state: OrbState }) {
  const label = state === "idle" ? "ONLINE" : state === "thinking" ? "PROCESSING" : "SPEAKING";

  return (
    <>
      {/* Canvas contrainte entre la navbar (64px) et la zone de saisie (110px) */}
      <div style={{ position: "fixed", top: "64px", left: 0, right: 0, bottom: "110px", zIndex: 0 }}>
        <Canvas camera={{ position: [0, 0, 7], fov: 42 }} dpr={[1, 1.5]} style={{ background: "transparent" }} gl={{ alpha: true }}>
          <AIOrb state={state} />
        </Canvas>
      </div>

      <div style={{ ...hud, top: "12vh", left: "4vw" }}>
        VEGA // v1.0
        <br />
        <span style={{ color: state === "idle" ? "#16a34a" : "#ff6600", animation: "axBlink 1.6s ease-in-out infinite" }}>
          ● {label}
        </span>
      </div>

      <div style={{ ...hud, top: "12vh", right: "4vw", textAlign: "right" }}>
        RAG // ACTIVE
        <br />
        SUPABASE PGVECTOR
      </div>

      <div style={{ ...hud, bottom: "16vh", left: "4vw" }}>
        MODEL // GPT-4O-MINI
        <br />
        EMBEDDING // TEXT-3-LARGE
      </div>

      <div style={{ ...hud, bottom: "16vh", right: "4vw", textAlign: "right", color: "rgba(255,100,0,0.5)" }}>
        {state === "speaking" ? "AUDIO // ON" : ""}
      </div>
    </>
  );
}
