"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ALL_QUESTIONS } from "@/components/demos/questionsData";
import MiniOrb from "./MiniOrb";

// Panneau VEGA (premier plan) : header online, mini-orbe canvas, et une VRAIE
// question du catalogue (questionsData) qui s'écrit en typewriter puis fond, en
// boucle (~6 s). Cliquable → /demos. Question fixe si prefers-reduced-motion.
export default function PanelVega({ reduce }: { reduce: boolean }) {
  const [typed, setTyped] = useState("");
  const [op, setOp] = useState(1);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    // Toutes les MAJ d'état passent par un timer (jamais synchrones dans le corps
    // de l'effet) — évite les rendus en cascade.
    const timers: number[] = [];
    if (reduce) {
      timers.push(window.setTimeout(() => { setTyped(ALL_QUESTIONS[0]); setOp(1); }, 0));
      return () => timers.forEach(clearTimeout);
    }
    const q = ALL_QUESTIONS[idx % ALL_QUESTIONS.length];
    let i = 0;
    const type = () => {
      setOp(1);
      setTyped(q.slice(0, i));
      if (i < q.length) {
        i++;
        timers.push(window.setTimeout(type, 45));
      } else {
        timers.push(window.setTimeout(() => setOp(0), 2200));
        timers.push(window.setTimeout(() => setIdx((n) => n + 1), 2800));
      }
    };
    timers.push(window.setTimeout(type, 350));
    return () => timers.forEach(clearTimeout);
  }, [idx, reduce]);

  return (
    <>
      <style>{`
        .hsv-dot { width:7px; height:7px; border-radius:50%; background:var(--color-orange);
          animation: hsvPulse 1.8s ease-in-out infinite; flex-shrink:0; }
        @keyframes hsvPulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.3;transform:scale(.8);} }
        .hsv-caret { color:var(--color-orange); animation: hsvBlink 1s step-end infinite; }
        @keyframes hsvBlink { 0%,100%{opacity:1;} 50%{opacity:0;} }
        @media (prefers-reduced-motion: reduce) { .hsv-dot,.hsv-caret{animation:none;} }
      `}</style>
      <Link href="/demos" className="hs-panel hsv-panel" aria-label="VEGA — parler à l'assistant">
        <div className="hs-head">
          <span className="hsv-dot" />
          VEGA // ONLINE
        </div>

        <div style={{ display: "flex", justifyContent: "center", padding: "0.35rem 0 0.2rem" }}>
          <MiniOrb reduce={reduce} />
        </div>

        <div
          style={{
            minHeight: "2.4em", fontFamily: "var(--font-mono)", fontSize: "0.78rem",
            lineHeight: 1.5, color: "#cbd5e1", opacity: op, transition: "opacity .5s ease",
          }}
        >
          <span style={{ color: "var(--color-orange)", marginRight: 6 }}>›</span>
          {typed}
          <span className="hsv-caret">▌</span>
        </div>
      </Link>
    </>
  );
}
