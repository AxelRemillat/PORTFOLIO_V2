"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

interface Props {
  onSubmit: (text: string) => void;
  isVoiceOn: boolean;
  onToggleVoice: () => void;
  showSuggestions: boolean;
  disabled: boolean;
}

const SUGGESTIONS = [
  "Quels sont tes projets IA ?",
  "Parle-moi de RISE",
  "Quelles sont tes compétences data ?",
  "Où en est ton alternance ?",
  "Explique ton RAG portfolio",
];

const tag: CSSProperties = {
  background: "rgba(255,100,0,0.08)",
  border: "1px solid rgba(255,100,0,0.2)",
  borderRadius: 20,
  color: "rgba(255,255,255,0.7)",
  fontSize: 13,
  padding: "6px 14px",
  cursor: "pointer",
};

const circle = (active: boolean): CSSProperties => ({
  width: 40,
  height: 40,
  flexShrink: 0,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: 16,
  background: active ? "rgba(255,100,0,0.15)" : "rgba(255,100,0,0.15)",
  border: active ? "1px solid #ff6600" : "1px solid transparent",
});

export default function FloatingInput({ onSubmit, isVoiceOn, onToggleVoice, showSuggestions, disabled }: Props) {
  const [val, setVal] = useState("");

  function submit(text: string) {
    if (!text.trim() || disabled) return;
    onSubmit(text);
    setVal("");
  }

  return (
    <>
      {showSuggestions && (
        <div
          style={{
            position: "fixed",
            bottom: "calc(5vh + 70px)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 30,
            width: "min(600px, 88vw)",
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
          }}
        >
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" onClick={() => submit(s)} style={tag}>
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(val);
        }}
        style={{
          position: "fixed",
          bottom: "5vh",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 30,
          width: "min(600px, 88vw)",
          background: "rgba(8, 8, 16, 0.7)",
          border: "1px solid rgba(255, 100, 0, 0.25)",
          borderRadius: 40,
          backdropFilter: "blur(12px)",
          padding: "14px 20px",
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <input
          className="ax-input"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="Pose ta question à VEGA..."
          maxLength={500}
          disabled={disabled}
          style={{ background: "transparent", border: "none", color: "#fff", fontSize: 15, flex: 1, outline: "none" }}
        />
        <button type="button" onClick={onToggleVoice} title="Voix" style={circle(isVoiceOn)}>
          🔊
        </button>
        <button
          type="submit"
          disabled={disabled || !val.trim()}
          style={{ ...circle(false), background: "#ff6600", border: "none", color: "#fff", opacity: disabled || !val.trim() ? 0.4 : 1 }}
        >
          →
        </button>
      </form>
    </>
  );
}
