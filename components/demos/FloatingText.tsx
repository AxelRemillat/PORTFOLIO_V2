"use client";

interface Props {
  text: string;
  isStreaming: boolean;
  isVisible: boolean;
}

// Texte de l'IA en superposition libre (pas de card) — apparition/disparition douce.
export default function FloatingText({ text, isStreaming, isVisible }: Props) {
  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        bottom: "15vh",
        transform: `translateX(-50%) translateY(${isVisible ? 0 : 12}px)`,
        zIndex: 20,
        maxWidth: 700,
        width: "90vw",
        textAlign: "center",
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${isVisible ? 0.5 : 0.3}s ease, transform ${isVisible ? 0.5 : 0.3}s ease`,
        pointerEvents: "none",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
          color: "rgba(255, 255, 255, 0.92)",
          lineHeight: 1.6,
          fontWeight: 400,
          textShadow: "0 0 40px rgba(255, 100, 0, 0.4), 0 2px 20px rgba(0,0,0,0.8)",
        }}
      >
        {text}
        {isStreaming && (
          <span className="ax-cursor" style={{ color: "#ff8800" }}>
            |
          </span>
        )}
      </p>
    </div>
  );
}
