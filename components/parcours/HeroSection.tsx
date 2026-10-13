"use client";

import Link from "next/link";
import RotatingWord from "./RotatingWord";
import { localizedHref } from "@/lib/i18n/paths";
import { useLocale } from "@/lib/i18n/client";
import { parcoursCopy } from "./parcours-copy";

// Hero plein écran. Animations au chargement (CSS keyframes, fill-mode both) :
// labels fade-in, nom en clip-reveal ligne par ligne, sous-titres + CTA fade-in.
export default function HeroSection() {
  const locale = useLocale();
  const c = parcoursCopy(locale).hero;
  const hudLabel: React.CSSProperties = {
    position: "absolute",
    top: "9vh",
    fontFamily: "var(--font-mono)",
    fontSize: "0.75rem",
    letterSpacing: "0.15em",
  };

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 6vw",
        overflow: "hidden",
        backgroundImage:
          "radial-gradient(circle at 50% 50%, rgba(249,115,22,0.04) 0%, transparent 70%)",
      }}
    >
      <p className="parcours-fade" style={{ ...hudLabel, left: "6vw", color: "var(--color-muted)", animationDelay: "0.2s" }}>
        AXEL REMILLAT — PORTFOLIO 2026
      </p>
      {/* Label HUD symétrique, même famille visuelle que /demos */}
      <p className="parcours-fade" style={{ ...hudLabel, right: "6vw", color: "rgba(255,100,0,0.5)", animationDelay: "0.2s" }}>
        {c.hudRight}
      </p>

      <h1
        style={{
          margin: 0,
          fontWeight: 700,
          lineHeight: 1.02,
          fontSize: "clamp(3.5rem, 9vw, 8rem)",
          color: "var(--color-text)",
        }}
      >
        <span style={{ display: "block", overflow: "hidden" }}>
          <span className="parcours-line" style={{ animationDelay: "0.3s" }}>
            AXEL
          </span>
        </span>
        <span style={{ display: "block", overflow: "hidden" }}>
          <span className="parcours-line" style={{ animationDelay: "0.5s" }}>
            REMILLAT
          </span>
        </span>
      </h1>

      <p
        className="parcours-fade"
        style={{
          marginTop: "1.5rem",
          fontSize: "clamp(1.05rem, 2.5vw, 1.5rem)",
          color: "var(--color-text)",
          animationDelay: "0.8s",
        }}
      >
        {c.build} <RotatingWord />
      </p>
      <p
        className="parcours-fade"
        style={{ marginTop: "0.6rem", fontSize: "clamp(0.85rem, 1.8vw, 1rem)", color: "var(--color-muted)", animationDelay: "0.9s" }}
      >
        {c.subtitle}
      </p>

      <div
        className="parcours-fade"
        style={{ marginTop: "2.25rem", display: "flex", gap: "1rem", flexWrap: "wrap", animationDelay: "1.05s" }}
      >
        <Link href={localizedHref("/projets", locale)} className="parcours-cta">{c.proof}</Link>
        <Link href={localizedHref("/demos", locale)} className="parcours-cta-outline">{c.vega}</Link>
      </div>

      {/* Indicateur de scroll — pointer-events none pour ne jamais bloquer la nav */}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.6rem",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            color: "var(--color-muted)",
          }}
        >
          scroll
        </span>
        <span
          style={{
            width: "1px",
            height: "48px",
            background:
              "linear-gradient(to bottom, var(--color-muted), transparent)",
            animation: "parcoursScrollPulse 1.5s ease-in-out infinite",
          }}
        />
      </div>
    </section>
  );
}
