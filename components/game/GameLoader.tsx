"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";

// Écran de chargement. Combine la vraie progression (useProgress) avec une rampe
// temporelle : la scène est surtout procédurale (peu/pas de loaders THREE), donc
// useProgress peut rester à 0 — la rampe garantit une barre fluide et une sortie.
export function GameLoader({ onReady }: { onReady: () => void }) {
  const { progress, active } = useProgress();
  const progRef = useRef(0);
  const activeRef = useRef(false);
  const done = useRef(false);
  const [pct, setPct] = useState(0);

  useEffect(() => { progRef.current = progress; activeRef.current = active; }, [progress, active]);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const timed = Math.min(((performance.now() - start) / 1500) * 100, 100);
      const p = Math.max(timed, progRef.current);
      setPct(p);
      if (!done.current && p >= 100 && !activeRef.current) {
        done.current = true;
        setTimeout(onReady, 400); // marge pour la compilation des shaders GPU
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onReady]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200, background: "#05040F",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ color: "#FFE080", fontSize: 14, letterSpacing: 6, textTransform: "uppercase", marginBottom: 32, opacity: 0.7, fontFamily: "monospace" }}>
        B-612
      </div>
      <div style={{ width: 200, height: 2, background: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
        <div style={{
          height: "100%", borderRadius: 2, width: `${pct}%`,
          background: "linear-gradient(90deg, #FFE080, #FF9A3C)",
          boxShadow: "0 0 8px rgba(255,200,60,0.6)", transition: "width 0.2s ease-out",
        }} />
      </div>
      <div style={{ color: "#554466", fontSize: 11, marginTop: 12, fontFamily: "monospace" }}>
        {Math.round(pct)}%
      </div>
    </div>
  );
}
