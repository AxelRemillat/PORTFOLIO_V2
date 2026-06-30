"use client";
import { useEffect, useRef, useState } from "react";

interface Props { containerRef: React.RefObject<HTMLDivElement>; }

// Cycloïde PROLATE descendante (spirographe) : le point tourne en cercle pendant
// que le centre descend lentement. Comme le rayon vertical Ry > l'avance A, la
// courbe repart périodiquement vers le haut et SE CROISE → vraies boucles sur
// elle-même (pas une sinusoïde). Amplitudes modulées pour un rendu libre/organique.
function buildSnakePath(w: number, h: number): string {
  const cx = w * 0.5;
  const loops = 3.5;                       // nb de boucles sur la hauteur
  const thetaMax = loops * Math.PI * 2;
  const A = h / thetaMax;                   // descente moyenne par radian
  const samples = 480;

  let d = "";
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const th = t * thetaMax;
    const Rx = w * (0.32 + 0.10 * Math.sin(th * 0.6 + 0.5));   // largeur des boucles varie
    const Ry = A * (1.85 + 0.45 * Math.sin(th * 0.4));         // > A ⇒ boucles (prolate)
    const drift = w * 0.05 * Math.sin(th * 0.27);              // dérive horizontale lente
    const x = cx + drift + Rx * Math.cos(th);
    const y = A * th + Ry * Math.sin(th);
    d += (i === 0 ? "M " : " L ") + x.toFixed(1) + " " + y.toFixed(1);
  }
  return d;
}

export default function ParcoursSnake({ containerRef }: Props) {
  const [dims, setDims] = useState({ w: 900, h: 3000 });
  const [totalLen, setTotalLen] = useState(0);

  const mainRef  = useRef<SVGPathElement>(null);
  const haloRef  = useRef<SVGPathElement>(null);
  const reflRef  = useRef<SVGPathElement>(null);
  const sparkRef = useRef<SVGPathElement>(null);

  const path = buildSnakePath(dims.w, dims.h);

  // 1 — Observer les dimensions du container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setDims({ w: el.offsetWidth || 900, h: el.offsetHeight || 3000 });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  // 2 — Calculer la longueur totale quand le path change, initialiser à "non dessiné"
  useEffect(() => {
    const pathEl = mainRef.current;
    if (!pathEl) return;
    // getTotalLength() nécessite que le SVG soit dans le DOM
    requestAnimationFrame(() => {
      const len = pathEl.getTotalLength();
      if (len <= 0) return;
      setTotalLen(len);
      [mainRef, haloRef, reflRef, sparkRef].forEach(r => {
        if (!r.current) return;
        r.current.style.strokeDasharray = `${len}`;
        r.current.style.strokeDashoffset = `${len}`;
      });
    });
  }, [path]);

  // 3 — Scroll listener : révèle le path + déplace le spark
  useEffect(() => {
    if (!totalLen) return;
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect     = el.getBoundingClientRect();
      // Le spark vise ~60% de la hauteur d'écran (niveau de lecture de l'utilisateur),
      // pour que la tête du serpent suive le scroll au lieu de rester en retard/haut.
      const lead       = window.innerHeight * 0.6;
      const scrolled   = Math.max(0, lead - rect.top);
      const scrollable = Math.max(1, rect.height - window.innerHeight * 0.3);
      const progress   = Math.min(1, scrolled / scrollable);
      const offset     = totalLen * (1 - progress);

      // Révéler les 3 couches du serpent
      mainRef.current && (mainRef.current.style.strokeDashoffset = String(offset));
      haloRef.current && (haloRef.current.style.strokeDashoffset = String(offset));
      reflRef.current && (reflRef.current.style.strokeDashoffset = String(offset));

      // Spark : segment court (90px) au bord de la partie révélée
      if (sparkRef.current && progress > 0.01) {
        const sparkLen = 90;
        const drawn    = progress * totalLen;
        sparkRef.current.style.strokeDasharray  = `${sparkLen} ${totalLen}`;
        sparkRef.current.style.strokeDashoffset = String(-(drawn - sparkLen * 0.5));
        sparkRef.current.style.opacity          = progress > 0.98 ? "0" : "0.9";
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // init sur montage
    return () => window.removeEventListener("scroll", onScroll);
  }, [totalLen, containerRef]);

  const isMobile = dims.w < 640;

  return (
    <svg
      aria-hidden
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
               pointerEvents: "none", overflow: "visible", zIndex: 0 }}
      viewBox={`0 0 ${dims.w} ${dims.h}`}
      preserveAspectRatio="none"
    >
      <defs>
        {/* Gradient violet haut → profond bas */}
        <linearGradient id="snake-grad" x1="0" y1="0" x2="0" y2={dims.h} gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#d8b4fe" />
          <stop offset="25%"  stopColor="#a855f7" />
          <stop offset="60%"  stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#4c1d95" />
        </linearGradient>
        {/* Glow principal */}
        <filter id="snake-glow" x="-60%" y="-5%" width="220%" height="110%">
          <feGaussianBlur stdDeviation={isMobile ? 14 : 26} result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Glow ultra-bright pour le spark */}
        <filter id="spark-glow" x="-150%" y="-20%" width="400%" height="140%">
          <feGaussianBlur stdDeviation={isMobile ? 6 : 10} result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Couche 1 : halo large et flou (aura de fond) */}
      <path ref={haloRef} d={path} fill="none" stroke="#5b21b6"
        strokeWidth={isMobile ? 60 : 110} strokeLinecap="round" opacity={0.06} />

      {/* Couche 2 : corps gradient avec glow */}
      <path ref={mainRef} d={path} fill="none" stroke="url(#snake-grad)"
        strokeWidth={isMobile ? 28 : 46} strokeLinecap="round" opacity={0.68}
        filter="url(#snake-glow)" />

      {/* Couche 3 : reflet central blanc-violet (illusion de brillance) */}
      <path ref={reflRef} d={path} fill="none" stroke="#ede9fe"
        strokeWidth={isMobile ? 7 : 13} strokeLinecap="round" opacity={0.28} />

      {/* Couche 4 : spark — point de lumière qui trace le chemin en direct */}
      <path ref={sparkRef} d={path} fill="none" stroke="#ffffff"
        strokeWidth={isMobile ? 14 : 22} strokeLinecap="round" opacity={0}
        filter="url(#spark-glow)" />
    </svg>
  );
}
