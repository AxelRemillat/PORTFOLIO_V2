"use client";

import { useEffect, useState } from "react";
import MiniOrb from "@/components/home/hero-scene/MiniOrb";
import ArchFlow from "../ArchFlow";

// Fenêtre VEGA : mini-chat (question réelle + orbe + état de réponse) surmontant
// la bande de flux du VRAI pipeline RAG. Orbe figée si reduced-motion.
export default function VegaWindow() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const s = () => setReduce(m.matches);
    s();
    m.addEventListener("change", s);
    return () => m.removeEventListener("change", s);
  }, []);

  return (
    <div className="pv-win">
      <style>{`
        .pvv-body { display:flex; flex-direction:column; align-items:center; gap:.55rem; padding:.9rem .85rem .55rem; }
        .pvv-q { align-self:flex-end; max-width:92%; padding:.42rem .65rem; border-radius:11px 11px 3px 11px;
          background:var(--pv-accent-weak); border:1px solid var(--pv-accent-line); font-size:.74rem; color:#f4ddcb; }
        .pvv-status { font-family:var(--font-mono); font-size:.72rem; color:#8b93a7; }
        .pvv-status b { color:var(--pv-accent); font-weight:600; }
        .pvv-status i { display:inline-block; width:1.1em; font-style:normal; }
        .pvv-status i::after { content:""; animation:pvvDots 1.4s steps(1,end) infinite; }
        @keyframes pvvDots { 0%{content:"";} 25%{content:"·";} 50%{content:"··";} 75%,100%{content:"···";} }
        .pvv-on { margin-left:auto; color:#34d399; }
        @media (prefers-reduced-motion: reduce) { .pvv-status i::after{content:"···";animation:none;} }
      `}</style>
      <div className="pv-bar">
        <span className="pv-bdot" />VEGA · assistant RAG
        <span className="pvv-on">● online</span>
      </div>
      <div className="pvv-body">
        <div className="pvv-q">Quel est ton parcours&nbsp;?</div>
        <MiniOrb reduce={reduce} size={112} />
        <div className="pvv-status"><b>VEGA</b> rédige la réponse<i /></div>
      </div>
      <ArchFlow steps={["Question", "Embed", "pgvector", "gpt-4o", "Voix"]} />
    </div>
  );
}
