"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CAT_COLOR, EDGES, NODES, W, H, type GEdge } from "./skills-graph-data";
import NodePanel from "./NodePanel";

// Liste pour le marquee horizontal (inchangé)
const ALL_SKILLS = [
  "Python", "SQL", "OpenAI API", "pgvector", "FastAPI", "Supabase", "N8N",
  "Make", "Webhooks", "Google Cloud", "React", "Next.js", "TypeScript",
  "Docker", "Vercel", "BigQuery", "Vertex AI",
];

// ── Constantes réglables ──────────────────────────────────────────────────────
const ZOOM_SCALE = 1.8;                                  // facteur de zoom au focus
const ZOOM_TRANSITION = "transform 0.4s cubic-bezier(0.22,1,0.36,1)"; // durée/easing

export default function SkillsSection() {
  // Tableau dupliqué ×2 : la translation de -50% boucle de façon transparente.
  const loop = [...ALL_SKILLS, ...ALL_SKILLS];

  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null); // = focusedNodeId
  const [visible, setVisible] = useState(false);
  const [reduce, setReduce] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (svgRef.current) obs.observe(svgRef.current);
    return () => obs.disconnect();
  }, []);

  // Échap = dézoom (accessibilité)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const neighbors = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    NODES.forEach(n => { map[n.id] = new Set(); });
    EDGES.forEach(e => { map[e.from].add(e.to); map[e.to].add(e.from); });
    return map;
  }, []);

  // Le focus visuel = survol (priorité) sinon nœud sélectionné
  const focus = hovered ?? selected;
  const isActive = (id: string) => !focus || id === focus || (neighbors[focus]?.has(id) ?? false);
  const isEdgeActive = (e: GEdge) => !focus || e.from === focus || e.to === focus;

  const selectedNode = NODES.find(n => n.id === selected) ?? null;
  const selectedNeighbors = selected
    ? NODES.filter(n => neighbors[selected]?.has(n.id)).map(n => n.label)
    : [];

  // Transform unique qui centre le nœud focalisé (W/2,H/2) et zoome dessus.
  // Les coordonnées des nœuds ne bougent pas — seul ce <g> est transformé.
  const focusTransform = selectedNode
    ? `translate(${W / 2}, ${H / 2}) scale(${ZOOM_SCALE}) translate(${-selectedNode.x * W}, ${-selectedNode.y * H})`
    : `translate(0, 0) scale(1)`;

  return (
    <section style={{ padding: "12vh 0" }}>
      {/* Marquee horizontal infini */}
      <div
        style={{
          overflow: "hidden",
          width: "100%",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
          maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        }}
      >
        <div className="parcours-marquee" style={{ display: "flex", width: "max-content" }}>
          {loop.map((s, i) => (
            <span key={i} className="parcours-skill-tag">{s}</span>
          ))}
        </div>
      </div>

      {/* Constellation des compétences */}
      <div style={{ position: "relative", maxWidth: "1600px", margin: "10vh auto 0", padding: "0 4vw" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "0.75rem" }}>
          Compétences
        </h2>
        <p style={{ fontSize: "0.9rem", color: "#7a7a92", marginBottom: "2rem", fontFamily: "var(--font-mono)" }}>
          Cliquez sur un outil pour zoomer et en savoir plus.
        </p>

        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ overflow: "visible", display: "block", minHeight: "60vh" }}
          onClick={() => setSelected(null)}  // clic sur le fond = dézoom
        >
          <defs>
            <filter id="node-glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Groupe zoomable (edges + nodes) — seul élément transformé */}
          <g transform={focusTransform} style={{ transition: reduce ? "none" : ZOOM_TRANSITION }}>
            {/* Arêtes */}
            {EDGES.map((e, i) => {
              const A = NODES.find(n => n.id === e.from)!;
              const B = NODES.find(n => n.id === e.to)!;
              const active = isEdgeActive(e);
              return (
                <line key={i}
                  x1={A.x * W} y1={A.y * H} x2={B.x * W} y2={B.y * H}
                  stroke={active ? CAT_COLOR[A.cat] : "#ffffff"}
                  strokeWidth={active ? 1.2 : 0.5}
                  opacity={visible ? (active ? 0.55 : 0.08) : 0}
                  style={{ transition: `opacity 0.6s ease ${i * 0.02}s` }}
                />
              );
            })}

            {/* Nœuds */}
            {NODES.map((n, i) => {
              const cx = n.x * W, cy = n.y * H;
              const color = CAT_COLOR[n.cat];
              const active = isActive(n.id);
              const big = n.id === hovered || n.id === selected;
              return (
                <g key={n.id}
                  onMouseEnter={() => setHovered(n.id)}
                  onMouseLeave={() => setHovered(null)}
                  // stopPropagation : ne PAS déclencher le dézoom du fond.
                  // Clic sur un autre nœud → re-focus direct ; même nœud → toggle.
                  onClick={(ev) => { ev.stopPropagation(); setSelected(s => s === n.id ? null : n.id); }}
                  style={{ cursor: "pointer" }}
                  opacity={visible ? (active ? 1 : 0.22) : 0}
                >
                  {n.id === selected && (
                    <circle cx={cx} cy={cy} r={13} fill="none" stroke={color} strokeWidth={1.5} opacity={0.9}>
                      <animate attributeName="r" values="11;15;11" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle cx={cx} cy={cy} r={big ? 18 : 11} fill={color} opacity={0.18}
                    filter="url(#node-glow)" style={{ transition: "r 0.2s ease, opacity 0.3s ease" }} />
                  <circle cx={cx} cy={cy} r={big ? 8 : 5.5} fill={color}
                    style={{ transition: "r 0.2s ease, opacity 0.4s ease", transitionDelay: `${i * 0.03}s` }} />
                  <text x={cx} y={cy + 20} textAnchor="middle" fontSize={big ? 13 : 11} fontWeight={big ? 700 : 400}
                    fill={active ? color : "#555577"}
                    style={{ fontFamily: "var(--font-mono)", transition: "font-size 0.2s, fill 0.3s", userSelect: "none" }}>
                    {n.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Panneau ancré au nœud focalisé (flip/clamp gérés dans NodePanel) */}
        {selectedNode && (
          <NodePanel
            node={selectedNode}
            neighbors={selectedNeighbors}
            svgRef={svgRef}
            onClose={() => setSelected(null)}
          />
        )}
      </div>

      <style>{`@keyframes skillPanelIn { from { opacity: 0; transform: translateY(12px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
    </section>
  );
}
