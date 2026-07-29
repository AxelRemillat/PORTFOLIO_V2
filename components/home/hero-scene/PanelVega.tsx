"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ALL_QUESTIONS } from "@/components/demos/questionsData";
import MiniOrb from "./MiniOrb";

// Panneau VEGA (premier plan) : une VRAIE fenêtre de chat. Une question du
// catalogue (questionsData) s'écrit en typewriter, puis VEGA « génère » (orbe +
// état de réponse animé). Cliquable → /demos. Question fixe si reduced-motion.
export default function PanelVega({ reduce }: { reduce: boolean }) {
  const [typed, setTyped] = useState("");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timers: number[] = [];
    if (reduce) {
      timers.push(window.setTimeout(() => setTyped(ALL_QUESTIONS[0]), 0));
      return () => timers.forEach(clearTimeout);
    }
    const q = ALL_QUESTIONS[idx % ALL_QUESTIONS.length];
    let i = 0;
    const type = () => {
      setTyped(q.slice(0, i));
      if (i < q.length) { i++; timers.push(window.setTimeout(type, 42)); }
      else timers.push(window.setTimeout(() => setIdx((n) => n + 1), 3400));
    };
    timers.push(window.setTimeout(type, 300));
    return () => timers.forEach(clearTimeout);
  }, [idx, reduce]);

  return (
    <>
      <style>{`
        .hsv-av { width:16px; height:16px; border-radius:50%; flex-shrink:0;
          background:radial-gradient(circle at 35% 30%, #ffb066, var(--color-orange) 55%, #b3480d);
          box-shadow:0 0 10px rgba(249,115,22,0.6); }
        .hsv-on { color:#34d399; background:rgba(52,211,153,0.1); }
        .hsv-on i { width:6px; height:6px; border-radius:50%; background:#34d399; animation:hsvBlink 1.6s ease-in-out infinite; }
        .hsv-body { padding:0.9rem 0.9rem 0.6rem; display:flex; flex-direction:column; gap:0.7rem; }
        .hsv-q { align-self:flex-end; max-width:88%; padding:0.5rem 0.7rem; border-radius:12px 12px 3px 12px;
          background:rgba(249,115,22,0.12); border:1px solid rgba(249,115,22,0.22);
          font-size:0.78rem; line-height:1.4; color:#f1d4bf; min-height:1.4em; }
        .hsv-a { display:flex; flex-direction:column; align-items:center; gap:0.35rem; padding-top:0.1rem; }
        .hsv-status { font-family:var(--font-mono); font-size:0.72rem; color:#8b93a7; letter-spacing:.02em; }
        .hsv-status b { color:var(--color-orange); font-weight:600; }
        .hsv-status i { display:inline-block; width:1.2em; text-align:left; font-style:normal; }
        .hsv-status i::after { content:""; animation:hsvDots 1.4s steps(1,end) infinite; }
        .hsv-input { display:flex; align-items:center; gap:8px; margin:0.4rem 0.75rem 0.75rem;
          padding:0.5rem 0.7rem; border-radius:10px; background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.07); font-size:0.74rem; color:#6b7280; }
        .hsv-input svg { color:var(--color-orange); flex-shrink:0; }
        @keyframes hsvBlink { 0%,100%{opacity:1;} 50%{opacity:0.35;} }
        @keyframes hsvDots { 0%{content:"";} 25%{content:"·";} 50%{content:"··";} 75%,100%{content:"···";} }
        .hsv-caret { color:var(--color-orange); animation:hsvCaret 1s step-end infinite; }
        @keyframes hsvCaret { 0%,100%{opacity:1;} 50%{opacity:0;} }
        @media (prefers-reduced-motion: reduce) {
          .hsv-on i,.hsv-caret{animation:none;} .hsv-status i::after{content:"···";animation:none;}
        }
      `}</style>
      <Link href="/demos" className="hs-panel hsv" aria-label="VEGA — parler à l'assistant">
        <div className="hs-bar">
          <span className="hsv-av" />
          <span className="hs-title">VEGA — assistant RAG</span>
          <span className="hs-chip hsv-on hs-spacer"><i />online</span>
        </div>

        <div className="hsv-body">
          <div className="hsv-q">
            {typed}
            {!reduce && <span className="hsv-caret">▌</span>}
          </div>
          <div className="hsv-a">
            <MiniOrb reduce={reduce} />
            <div className="hsv-status">
              <b>VEGA</b> rédige la réponse<i data-dots />
            </div>
          </div>
        </div>

        <div className="hsv-input">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
            <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4" />
          </svg>
          Posez votre question — ou parlez-lui
        </div>
      </Link>
    </>
  );
}
