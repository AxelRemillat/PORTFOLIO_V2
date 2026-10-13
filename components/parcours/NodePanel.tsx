"use client";

import { useEffect, useRef, useState } from "react";
import { usePanelPlacement } from "./usePanelPlacement";
import { CAT_COLOR, SKILL_DETAILS, type GNode } from "./skills-graph-data";
import { CAT_LABEL_EN, SKILL_DETAILS_EN } from "./skills-graph-data.en";
import { useLocale } from "@/lib/i18n/client";
import { parcoursCopy } from "./parcours-copy";

export default function NodePanel({
  node, neighbors, svgRef, onClose,
}: {
  node: GNode;
  neighbors: string[];
  svgRef: React.RefObject<SVGSVGElement | null>;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const place = usePanelPlacement(svgRef, ref, node.id);
  const [reduce, setReduce] = useState(false);
  const locale = useLocale();
  const t = parcoursCopy(locale).skills;
  const color = CAT_COLOR[node.cat];
  const detail = (locale === "en" ? SKILL_DETAILS_EN : SKILL_DETAILS)[node.id];
  const catLabel = locale === "en" ? CAT_LABEL_EN[node.cat] : node.cat;

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);


  // Focus le panneau à l'ouverture (accessibilité clavier)
  useEffect(() => { ref.current?.focus(); }, [node.id]);

  return (
    <>
      {/* Connecteur visuel nœud → panneau */}
      {place && (
        <svg style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 59 }}>
          <line x1={place.line.x1} y1={place.line.y1} x2={place.line.x2} y2={place.line.y2}
            stroke={color} strokeWidth={1.5} strokeDasharray="2 3" opacity={0.6} />
          <circle cx={place.line.x1} cy={place.line.y1} r={2.5} fill={color} />
        </svg>
      )}

      <div
        ref={ref}
        role="dialog"
        aria-label={t.details(node.label)}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
        style={{
          position: "fixed",
          left: place ? place.left : -9999,
          top: place ? place.top : -9999,
          visibility: place ? "visible" : "hidden",
          width: "min(340px, 86vw)",
          zIndex: 60,
          background: "rgba(16, 16, 26, 0.92)",
          backdropFilter: "blur(10px)",
          border: `1px solid ${color}55`,
          borderRadius: "14px",
          padding: "1.5rem",
          boxShadow: `0 12px 40px rgba(0,0,0,0.5), 0 0 24px ${color}22`,
          outline: "none",
          animation: reduce ? "none" : "skillPanelIn 0.3s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <button
          onClick={onClose}
          aria-label={t.close}
          style={{
            position: "absolute", top: "0.85rem", right: "0.95rem",
            background: "none", border: "none", color: "#8888a0",
            fontSize: "1.25rem", lineHeight: 1, cursor: "pointer", padding: 0,
          }}
        >
          ×
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}` }} />
          <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--color-text)", margin: 0 }}>{node.label}</h3>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <span style={{
            fontSize: "0.72rem", fontFamily: "var(--font-mono)", color,
            border: `1px solid ${color}55`, borderRadius: "999px", padding: "0.2rem 0.6rem",
          }}>
            {catLabel}
          </span>
          {detail && (
            <span style={{
              fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "#c8c8d8",
              border: "1px solid #ffffff22", borderRadius: "999px", padding: "0.2rem 0.6rem",
            }}>
              {detail.level}
            </span>
          )}
        </div>

        <p style={{ fontSize: "0.9rem", lineHeight: 1.55, color: "#b8b8c8", margin: "0 0 1rem" }}>
          {detail?.desc}
        </p>

        {neighbors.length > 0 && (
          <div>
            <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "#7a7a92", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {t.usedWith}
            </div>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {neighbors.map((label) => (
                <span key={label} style={{
                  fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#d0d0e0",
                  background: "#ffffff0d", borderRadius: "6px", padding: "0.25rem 0.55rem",
                }}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
