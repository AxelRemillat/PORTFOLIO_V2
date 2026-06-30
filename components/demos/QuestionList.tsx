"use client";
import { useState } from "react";
import type { CSSProperties } from "react";
import { QUESTION_CATEGORIES } from "./questionsData";

// Contenu du menu de questions : accordéon de catégories (repliées par défaut).
// Réutilisé tel quel dans le panneau gauche (desktop) et le drawer (mobile).
interface Props {
  onPick: (q: string) => void;
}

const catBtn: CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 16px",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontFamily: "monospace",
  fontSize: 12,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.78)",
};

const qBtn: CSSProperties = {
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "8px 18px",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontFamily: "monospace",
  fontSize: 12.5,
  lineHeight: 1.45,
  color: "rgba(255,255,255,0.62)",
};

export default function QuestionList({ onPick }: Props) {
  const [openId, setOpenId] = useState<string | null>(null); // toutes repliées par défaut

  return (
    <div>
      <style>{`
        .ax-qitem:hover { color: #ff8a3c; text-shadow: 0 0 12px rgba(255,120,40,0.5); }
        .ax-qcat:hover  { color: #ffffff; }
      `}</style>
      {QUESTION_CATEGORIES.map((cat) => {
        const expanded = openId === cat.id;
        return (
          <div key={cat.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <button
              type="button"
              className="ax-qcat"
              style={catBtn}
              aria-expanded={expanded}
              onClick={() => setOpenId(expanded ? null : cat.id)}
            >
              <span>{cat.label}</span>
              <span style={{ color: "rgba(255,150,70,0.8)", fontSize: 14 }}>{expanded ? "−" : "+"}</span>
            </button>
            {expanded && (
              <div style={{ paddingBottom: 6 }}>
                {cat.questions.map((q) => (
                  <button key={q} type="button" className="ax-qitem" style={qBtn} onClick={() => onPick(q)}>
                    / {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
