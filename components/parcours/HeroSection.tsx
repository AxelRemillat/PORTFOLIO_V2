"use client";

// Hero plein écran. Animations au chargement (CSS keyframes, fill-mode both) :
// label fade-in, nom en clip-reveal ligne par ligne, sous-titre fade-in.
export default function HeroSection() {
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
      <p
        className="parcours-fade"
        style={{
          position: "absolute",
          top: "9vh",
          left: "6vw",
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          letterSpacing: "0.15em",
          color: "var(--color-muted)",
          animationDelay: "0.2s",
        }}
      >
        AXEL REMILLAT — PORTFOLIO 2026
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
          fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
          color: "var(--color-muted)",
          animationDelay: "0.8s",
        }}
      >
        Ingénieur IA &amp; Data · ESME Paris
      </p>

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
