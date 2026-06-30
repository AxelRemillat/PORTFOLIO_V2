"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { CAT_COLOR, SKILL_DETAILS, type GNode } from "./skills-graph-data";

// ── Constantes réglables ──────────────────────────────────────────────────────
const PANEL_OFFSET = 26;     // écart franc entre le bord du nœud et le panneau (px)
const VIEWPORT_MARGIN = 16;  // marge minimale avec les bords du viewport (px)
const FOCUS_NODE_HALF = 20;  // demi-taille approx. du nœud focalisé (au centre du SVG)

interface Placement {
  left: number; top: number;          // position du panneau (fixed)
  line: { x1: number; y1: number; x2: number; y2: number }; // connecteur nœud→panneau
}

export default function NodePanel({
  node, neighbors, svgRef, onClose,
}: {
  node: GNode;
  neighbors: string[];
  svgRef: React.RefObject<SVGSVGElement | null>;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [place, setPlace] = useState<Placement | null>(null);
  const [reduce, setReduce] = useState(false);
  const color = CAT_COLOR[node.cat];
  const detail = SKILL_DETAILS[node.id];

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Le zoom centre TOUJOURS le nœud focalisé → sa position finale = centre du <svg>,
  // qui ne bouge pas pendant l'animation. On ancre donc le panneau sur ce centre,
  // calculé une seule fois : le panneau apparaît directement à sa place finale
  // (à droite) sans suivre le nœud → plus de saut gauche→droite.
  const compute = useCallback(() => {
    const svg = svgRef.current, panel = ref.current;
    if (!svg || !panel) return;
    const r = svg.getBoundingClientRect();
    const ax = r.left + r.width / 2;   // X écran du nœud focalisé (centre du SVG)
    const ay = r.top + r.height / 2;   // Y écran du nœud focalisé
    const pw = panel.offsetWidth, ph = panel.offsetHeight;
    const vw = window.innerWidth, vh = window.innerHeight;
    const M = VIEWPORT_MARGIN;

    // Toujours à DROITE ; flip à gauche uniquement si ça ne rentre pas.
    let left = ax + FOCUS_NODE_HALF + PANEL_OFFSET;
    let onRight = true;
    if (left + pw > vw - M) { left = ax - FOCUS_NODE_HALF - PANEL_OFFSET - pw; onRight = false; }
    left = Math.min(Math.max(left, M), vw - pw - M);

    // Vertical : centré sur le nœud puis clampé (jamais hors écran).
    let top = ay - ph / 2;
    top = Math.min(Math.max(top, M), vh - ph - M);

    // Connecteur : du bord du nœud vers le bord du panneau, à hauteur du nœud.
    const x1 = ax + (onRight ? FOCUS_NODE_HALF : -FOCUS_NODE_HALF);
    const x2 = onRight ? left : left + pw;
    const y2 = Math.min(Math.max(ay, top + 12), top + ph - 12);
    setPlace({ left, top, line: { x1, y1: ay, x2, y2 } });
  }, [svgRef]);

  // Mesure avant peinture (position finale immédiate, pas de flash ni de saut)
  // + recalage uniquement au resize / scroll (dimensions réelles).
  useLayoutEffect(() => { compute(); }, [compute, node.id]);
  useEffect(() => {
    window.addEventListener("resize", compute);
    window.addEventListener("scroll", compute, true);
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute, true);
    };
  }, [compute]);

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
        aria-label={`Détails : ${node.label}`}
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
          aria-label="Fermer"
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
            {node.cat}
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
              Souvent utilisé avec
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
