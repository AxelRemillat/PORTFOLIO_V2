"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CAT_COLOR, EDGES, NODES, W, H } from "./skills-graph-data";
import NodePanel from "./NodePanel";
import SkillsMarquee from "./SkillsMarquee";
import SectionLabel from "./SectionLabel";
import ConstellationNode from "./ConstellationNode";

// ── Constantes réglables ──────────────────────────────────────────────────────
const ZOOM_SCALE = 1.8;                                  // facteur de zoom au focus
const ZOOM_TRANSITION = "transform 0.4s cubic-bezier(0.22,1,0.36,1)"; // durée/easing

export default function SkillsSection() {
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

  const selectedNode = NODES.find(n => n.id === selected) ?? null;
  const selectedNeighbors = selected
    ? NODES.filter(n => neighbors[selected]?.has(n.id)).map(n => n.label)
    : [];

  // Transform unique qui centre le nœud focalisé (W/2,H/2) et zoome dessus.
  const focusTransform = selectedNode
    ? `translate(${W / 2}, ${H / 2}) scale(${ZOOM_SCALE}) translate(${-selectedNode.x * W}, ${-selectedNode.y * H})`
    : `translate(0, 0) scale(1)`;

  return (
    <section style={{ padding: "12vh 0" }}>
      <SkillsMarquee />

      {/* Constellation des compétences */}
      <div style={{ position: "relative", maxWidth: "1600px", margin: "10vh auto 0", padding: "0 4vw" }}>
        <SectionLabel>03 // COMPÉTENCES</SectionLabel>
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
            {/* Arêtes — celles du nœud focalisé passent en pointillés animés (flux) */}
            {EDGES.map((e, i) => {
              const A = NODES.find(n => n.id === e.from)!;
              const B = NODES.find(n => n.id === e.to)!;
              const highlight = !!focus && (e.from === focus || e.to === focus);
              const active = !focus || highlight;
              return (
                <line key={i}
                  className={highlight && !reduce ? "skill-edge-flow" : undefined}
                  x1={A.x * W} y1={A.y * H} x2={B.x * W} y2={B.y * H}
                  stroke={active ? CAT_COLOR[A.cat] : "#ffffff"}
                  strokeWidth={active ? 1.2 : 0.5}
                  strokeDasharray={highlight ? "6 6" : undefined}
                  opacity={visible ? (active ? 0.55 : 0.08) : 0}
                  style={{ transition: `opacity 0.6s ease ${i * 0.02}s` }}
                />
              );
            })}

            {/* Nœuds — drift organique idle (déphasé par index, figé si reduce/sélection) */}
            {NODES.map((n, i) => (
              <ConstellationNode
                key={n.id}
                node={n}
                index={i}
                active={isActive(n.id)}
                big={n.id === hovered || n.id === selected}
                isSelected={n.id === selected}
                drift={!reduce && n.id !== selected}
                visible={visible}
                onEnter={() => setHovered(n.id)}
                onLeave={() => setHovered(null)}
                onToggle={() => setSelected(s => (s === n.id ? null : n.id))}
              />
            ))}
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
    </section>
  );
}
