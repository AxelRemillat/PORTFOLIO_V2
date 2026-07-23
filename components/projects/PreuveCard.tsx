"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import type { Project, PreuveModel, PreuveState } from "@/lib/projects-data";

// Canvas 3D réutilisés (aucune duplication) — un modèle par preuve.
const MODELS: Record<PreuveModel, React.ComponentType> = {
  robot:     dynamic(() => import("@/components/projects/RobotModel"),     { ssr: false }),
  drone:     dynamic(() => import("@/components/projects/GearsModel"),     { ssr: false }),
  satellite: dynamic(() => import("@/components/projects/SatelliteModel"), { ssr: false }),
};

const DOT: Record<PreuveState, string> = {
  live:     "#22c55e",
  wip:      "#f59e0b",
  building: "#60a5fa",
};

export default function PreuveCard({ project }: { project: Project }) {
  const { accent, cardBg, glow, badge, state, stack, primaryCta, detailCta } = project;
  const Model = MODELS[project.model];

  return (
    <div
      style={{
        border: `2px solid ${accent}`,
        background: cardBg,
        borderRadius: 16,
        minHeight: 280,
        position: "relative",
        overflow: "hidden",
        animation: glow,
      }}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Texte — ~58% */}
        <div
          style={{
            flexBasis: "58%",
            flexShrink: 0,
            padding: 40,
            borderRight: `1px solid ${accent}44`,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span
              className={state === "live" ? "preuve-dot-pulse" : undefined}
              style={{ width: 9, height: 9, borderRadius: "50%", background: DOT[state], flexShrink: 0 }}
            />
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.5px",
                color: "#fff",
                background: `${accent}22`,
                border: `1px solid ${accent}66`,
                borderRadius: 999,
                padding: "4px 12px",
              }}
            >
              {badge}
            </span>
          </div>

          <h3 style={{ color: "#fff", fontSize: "1.7rem", fontWeight: 800, lineHeight: 1.2, margin: "0 0 12px" }}>
            {project.title}
          </h3>
          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.92rem", lineHeight: 1.6, margin: 0 }}>
            {project.tagline}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "20px 0 24px" }}>
            {stack.map((tech) => (
              <span
                key={tech}
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.72rem",
                  fontWeight: 500,
                  padding: "3px 12px",
                  borderRadius: 6,
                  background: `${accent}18`,
                  border: `1px solid ${accent}55`,
                  color: "#fff",
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {primaryCta && (
              <Link
                href={primaryCta.href}
                style={{
                  background: accent,
                  color: "#0a0a0a",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  padding: "9px 18px",
                  borderRadius: 8,
                  textDecoration: "none",
                }}
              >
                {primaryCta.label}
              </Link>
            )}
            <Link
              href={detailCta.href}
              style={{
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.85rem",
                padding: "9px 18px",
                borderRadius: 8,
                border: `1px solid ${accent}88`,
                background: `${accent}14`,
                textDecoration: "none",
              }}
            >
              {detailCta.label}
            </Link>
          </div>
        </div>

        {/* Canvas 3D — ~42% */}
        <div style={{ flex: 1, minHeight: 220, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <Model />
          </div>
        </div>
      </div>
    </div>
  );
}
