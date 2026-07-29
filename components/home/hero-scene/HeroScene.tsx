"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PanelVega from "./PanelVega";
import PanelOps from "./PanelOps";
import PanelFlow from "./PanelFlow";
import { useHeroParallax } from "./useHeroParallax";

// Scène HUD du hero : 3 panneaux flottants inclinés (VEGA / OPS / N8N), chacun
// cliquable vers un VRAI système du site. Perspective par panneau (robuste au
// nesting parallaxe/flottement) + entrée en stagger. Statique si reduced-motion.
// Mobile < 900px : seul VEGA reste, à plat, dans le flux.
export default function HeroScene() {
  const [reduce, setReduce] = useState(false);
  const [mobile, setMobile] = useState(false);
  const p1 = useRef<HTMLDivElement>(null);
  const p2 = useRef<HTMLDivElement>(null);
  const p3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mqR = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqM = window.matchMedia("(max-width: 899px)");
    const sync = () => { setReduce(mqR.matches); setMobile(mqM.matches); };
    sync();
    mqR.addEventListener("change", sync);
    mqM.addEventListener("change", sync);
    return () => { mqR.removeEventListener("change", sync); mqM.removeEventListener("change", sync); };
  }, []);

  // Parallaxe : translateY direct sur chaque ref (vitesses différentes). Le hook
  // ne fait que fournir le scrollY throttlé par rAF.
  const onFrame = useCallback((y: number) => {
    if (p1.current) p1.current.style.transform = `translateY(${(y * 0.06).toFixed(1)}px)`;
    if (p2.current) p2.current.style.transform = `translateY(${(y * 0.03).toFixed(1)}px)`;
    if (p3.current) p3.current.style.transform = `translateY(${(y * 0.09).toFixed(1)}px)`;
  }, []);
  useHeroParallax(onFrame, !reduce && !mobile);

  return (
    <div className="hs-wrap">
      <style>{`
        .hs-wrap { position:relative; width:100%; height:min(78vh,560px); }
        .hs-enter { position:absolute; opacity:0; animation: hsIn .8s cubic-bezier(.16,1,.3,1) both; }
        @keyframes hsIn { from{opacity:0;transform:translateY(24px) rotate(1.2deg);} to{opacity:1;transform:none;} }
        .hs-parallax { will-change:transform; }
        .hs-float { animation: hsFloat 7s ease-in-out infinite; }
        .hs-float-2 { animation-duration:8.4s; animation-delay:-2s; }
        .hs-float-3 { animation-duration:6.2s; animation-delay:-1s; }
        @keyframes hsFloat { 0%,100%{transform:translateY(-7px) rotate(-.4deg);} 50%{transform:translateY(7px) rotate(.4deg);} }
        .hs-panel {
          display:flex; flex-direction:column; text-decoration:none; cursor:pointer;
          border:1px solid rgba(249,115,22,0.35); border-radius:14px;
          background:rgba(10,10,20,0.72); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px);
          box-shadow:0 20px 50px -20px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04);
          padding:1rem 1.1rem;
          transition:transform .35s cubic-bezier(.16,1,.3,1), border-color .3s ease, box-shadow .3s ease;
        }
        .hs-panel:hover { border-color:rgba(249,115,22,0.7);
          box-shadow:0 26px 60px -18px rgba(0,0,0,0.85), 0 0 34px rgba(249,115,22,0.18); }
        .hs-head { font-family:var(--font-mono); font-size:10px; letter-spacing:.14em; text-transform:uppercase;
          color:var(--color-orange); display:flex; align-items:center; gap:8px; margin-bottom:.5rem; }
        .hs-pos-vega { top:14%; right:2%;  z-index:3; width:min(300px,86%); }
        .hs-pos-ops  { top:1%;  right:24%; z-index:2; width:min(228px,66%); }
        .hs-pos-flow { top:47%; right:31%; z-index:1; width:min(216px,62%); }
        .hs-pos-vega .hs-panel { transform:perspective(1200px) rotateY(-12deg) rotateX(3deg); }
        .hs-pos-ops  .hs-panel { transform:perspective(1200px) rotateY(-14deg) rotateX(4deg); }
        .hs-pos-flow .hs-panel { transform:perspective(1200px) rotateY(-9deg)  rotateX(2deg); }
        .hs-pos-vega .hs-panel:hover,
        .hs-pos-ops  .hs-panel:hover,
        .hs-pos-flow .hs-panel:hover { transform:perspective(1200px) rotateY(-2deg) rotateX(0deg) scale(1.02); }
        @media (prefers-reduced-motion: reduce) {
          .hs-enter { animation:none; opacity:1; }
          .hs-float { animation:none; }
        }
        @media (max-width: 899px) {
          .hs-wrap { height:auto; display:flex; justify-content:center; padding-top:.5rem; }
          .hs-pos-ops, .hs-pos-flow { display:none; }
          .hs-enter, .hs-pos-vega { position:static; }
          .hs-pos-vega { width:min(340px,92%); }
          .hs-pos-vega .hs-panel { transform:none; }
          .hs-float { animation:none; }
        }
      `}</style>

      <div className="hs-enter hs-pos-vega" style={{ animationDelay: "0.95s" }}>
        <div ref={p1} className="hs-parallax">
          <div className="hs-float hs-float-1"><PanelVega reduce={reduce} /></div>
        </div>
      </div>
      <div className="hs-enter hs-pos-ops" style={{ animationDelay: "1.1s" }}>
        <div ref={p2} className="hs-parallax">
          <div className="hs-float hs-float-2"><PanelOps /></div>
        </div>
      </div>
      <div className="hs-enter hs-pos-flow" style={{ animationDelay: "1.25s" }}>
        <div ref={p3} className="hs-parallax">
          <div className="hs-float hs-float-3"><PanelFlow /></div>
        </div>
      </div>
    </div>
  );
}
