"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SpaceBackground = dynamic(() => import("@/components/ui/SpaceBackground"), { ssr: false });

// ── Fond du hero, vidéo-ready ────────────────────────────────────────────────
// Déposer plus tard dans public/hero/ : hero.webm (+ hero.mp4) et
// hero-poster.jpg — détectés au chargement (requêtes HEAD), la vidéo s'active
// sans retoucher le code. Tant qu'ils n'existent pas : SpaceBackground animé.
// prefers-reduced-motion OU mobile < 768 px : poster statique (ou
// SpaceBackground si pas de poster).
const SRC_WEBM = "/hero/hero.webm";
const SRC_MP4 = "/hero/hero.mp4";
const POSTER = "/hero/hero-poster.jpg";

type Mode = "probe" | "video" | "poster" | "space";

export default function HeroMedia() {
  const [mode, setMode] = useState<Mode>("probe");

  useEffect(() => {
    let cancelled = false;
    const head = (url: string) =>
      fetch(url, { method: "HEAD" }).then((r) => r.ok).catch(() => false);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 768;
    (async () => {
      const hasPoster = await head(POSTER);
      if (reduce || mobile) {
        if (!cancelled) setMode(hasPoster ? "poster" : "space");
        return;
      }
      const hasVideo = (await head(SRC_WEBM)) || (await head(SRC_MP4));
      if (!cancelled) setMode(hasVideo ? "video" : "space");
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    // transform: le wrapper devient le containing block du canvas fixed de
    // SpaceBackground → le fond reste confiné au hero au lieu de couvrir la page.
    <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", transform: "translateZ(0)" }}>
      {mode === "video" && (
        <video
          autoPlay muted loop playsInline
          poster={POSTER}
          onError={() => setMode("space")}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        >
          {/* mp4 en premier : c'est la version haute qualité (le webm est un
              encodage rapide de moindre qualité, gardé en simple secours) */}
          <source src={SRC_MP4} type="video/mp4" />
          <source src={SRC_WEBM} type="video/webm" />
        </video>
      )}
      {mode === "poster" && (
        <div
          style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${POSTER})`,
            backgroundSize: "cover", backgroundPosition: "center",
          }}
        />
      )}
      {mode === "space" && <SpaceBackground />}

      {/* Overlay : voile sombre global (lisibilité sur les scènes claires +
          masque les artefacts de compression) + dégradé renforcé en bas */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background:
            "linear-gradient(to top, rgba(8,8,16,0.92) 0%, rgba(8,8,16,0.55) 30%, rgba(8,8,16,0.38) 60%, rgba(8,8,16,0.3) 100%)",
        }}
      />
    </div>
  );
}
