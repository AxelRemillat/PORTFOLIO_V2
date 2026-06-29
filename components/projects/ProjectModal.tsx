"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { ProjectModalDetail } from "@/lib/projects-modal-data";

export default function ProjectModal({
  project,
  onClose,
}: {
  project: ProjectModalDetail;
  onClose: () => void;
}) {
  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const { color } = project;

  // CSS custom props drive the colored pulse keyframe.
  const ctaStyle = {
    display: "block",
    width: "100%",
    textAlign: "center",
    background: color,
    color: "#0a0a0a",
    fontWeight: 800,
    fontSize: 19,
    padding: "19px 28px",
    borderRadius: 14,
    textDecoration: "none",
    letterSpacing: 0.5,
    boxShadow: `0 0 24px ${color}88`,
    animation: "ctaPulse 1.6s ease-in-out infinite",
    "--cta-glow": `${color}88`,
    "--cta-glow-strong": `${color}cc`,
  } as CSSProperties;

  return (
    <div
      onClick={onClose}
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        animation: "modalFadeIn 0.25s ease",
      }}
    >
      <style>{`
        @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes ctaPulse {
          0%, 100% { transform: scale(1);    box-shadow: 0 0 24px var(--cta-glow); }
          50%      { transform: scale(1.03); box-shadow: 0 0 40px var(--cta-glow-strong); }
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        style={{
          background: "rgba(10,8,20,0.96)",
          border: `1px solid ${color}44`,
          borderRadius: 22,
          padding: "52px 60px",
          maxWidth: 760,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: `0 0 60px ${color}22, 0 20px 60px rgba(0,0,0,0.6)`,
          animation: "modalSlideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Fermer"
          style={{
            position: "absolute",
            top: 20,
            right: 24,
            background: "none",
            border: "none",
            color: "#8a7aa6",
            fontSize: 26,
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        {/* Header */}
        <div
          style={{
            color,
            fontSize: 12,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          Projet
        </div>
        <h2 style={{ color: "#fff", fontSize: 34, fontWeight: 700, margin: "0 0 12px" }}>
          {project.title}
        </h2>
        <p
          style={{
            color,
            fontSize: 18,
            fontStyle: "italic",
            margin: "0 0 24px",
            opacity: 0.95,
          }}
        >
          {project.tagline}
        </p>

        {/* Description */}
        <p style={{ color: "#e6e3ee", fontSize: 17, lineHeight: 1.8, margin: "0 0 34px" }}>
          {project.description}
        </p>

        {/* Key metrics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14,
            marginBottom: 32,
          }}
        >
          {project.metrics.map((m) => (
            <div
              key={m.label}
              style={{
                background: "rgba(255,255,255,0.05)",
                borderRadius: 12,
                padding: "16px 10px",
                textAlign: "center",
                border: `1px solid ${color}33`,
              }}
            >
              <div style={{ color, fontSize: 21, fontWeight: 700, marginBottom: 6 }}>
                {m.value}
              </div>
              <div
                style={{
                  color: "#9384b8",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Stack */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 38 }}>
          {project.stack.map((s) => (
            <span
              key={s}
              style={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: 8,
                padding: "6px 14px",
                fontSize: 14,
                color: "#ddd8e8",
              }}
            >
              {s}
            </span>
          ))}
        </div>

        {/* Blinking CTA */}
        {project.ctaExternal ? (
          <a href={project.ctaUrl} target="_blank" rel="noopener noreferrer" style={ctaStyle}>
            {project.ctaLabel}
          </a>
        ) : (
          <Link href={project.ctaUrl} style={ctaStyle}>
            {project.ctaLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
