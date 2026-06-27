"use client";

import { useEffect, useMemo } from "react";

// WarpOverlay — phase 2 : fond noir + traits d'étoiles étirés vers le centre +
// titre "B-612". Durée fixe 1800ms puis onComplete() → passage à la phase 'zoom'.
export function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, () => ({
        a: Math.random() * 360,
        r: 30 + Math.random() * 220,
        len: 50 + Math.random() * 150,
        delay: Math.random() * 0.3,
      })),
    [],
  );

  useEffect(() => {
    const t = setTimeout(onComplete, 1800);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "#000", overflow: "hidden" }}>
      <style>{`
        @keyframes warpStar {
          0%   { transform: rotate(var(--a)) translateX(var(--r)) scaleX(0.2); opacity: 0 }
          15%  { opacity: 1 }
          100% { transform: rotate(var(--a)) translateX(var(--r)) scaleX(8); opacity: 0 }
        }
        @keyframes flashCenter {
          0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.5) }
          50%  { opacity: 1; transform: translate(-50%, -50%) scale(1.5) }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(3) }
        }
        @keyframes warpTitle {
          0% { opacity: 0 } 35% { opacity: 0 }
          55% { opacity: 1 } 80% { opacity: 1 } 100% { opacity: 0 }
        }
      `}</style>

      {/* Étoiles étirées depuis le centre */}
      <div style={{ position: "absolute", top: "50%", left: "50%" }}>
        {stars.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute", height: 2, width: s.len, background: "#fff",
              transformOrigin: "left center", borderRadius: 2,
              ["--a" as string]: `${s.a}deg`, ["--r" as string]: `${s.r}px`,
              animation: `warpStar 1.4s ease-in ${s.delay}s forwards`,
              opacity: 0,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Flash central */}
      <div
        style={{
          position: "absolute", top: "50%", left: "50%", width: 120, height: 120,
          borderRadius: "50%", background: "radial-gradient(circle, #fff 0%, rgba(255,255,255,0) 70%)",
          animation: "flashCenter 0.5s ease 1.1s forwards", opacity: 0,
        }}
      />

      {/* Titre B-612 */}
      <div
        style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          color: "#fff", fontSize: 44, fontWeight: 200, fontStyle: "italic",
          letterSpacing: 18, fontFamily: "monospace",
          animation: "warpTitle 1.8s ease forwards",
        }}
      >
        B-612
      </div>
    </div>
  );
}
