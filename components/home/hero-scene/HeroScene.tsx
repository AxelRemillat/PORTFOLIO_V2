"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PanelVega from "./PanelVega";
import PanelOps from "./PanelOps";
import PanelFlow from "./PanelFlow";
import { useHeroParallax } from "./useHeroParallax";
import { SCENE_CSS } from "./sceneCss";

// Scène HUD du hero : 3 mini-interfaces produit (VEGA / OPS / n8n) en perspective,
// chacune cliquable vers un VRAI système du site. Verre premium + profondeur.
// Flottement + parallaxe + entrée en stagger. Statique si reduced-motion ; sur
// mobile < 900px, seul VEGA reste, à plat, dans le flux.
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
      <style>{SCENE_CSS}</style>

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
