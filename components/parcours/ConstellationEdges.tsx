"use client";

import { CAT_COLOR, EDGES, NODES, W, H } from "./skills-graph-data";

interface Props {
  focus: string | null;
  visible: boolean;
  reduce: boolean;
  register: (i: number) => (el: SVGLineElement | null) => void; // refs pour useGraphPhysics
}

// Arêtes de la constellation. Positions initiales = homes ; pendant la
// simulation physique, x1/y1/x2/y2 sont réécrits impérativement dans la boucle
// rAF (useGraphPhysics) — React ne les diffe pas tant que le JSX ne change pas.
// Celles du nœud focalisé passent en pointillés animés (flux).
export default function ConstellationEdges({ focus, visible, reduce, register }: Props) {
  return (
    <>
      {EDGES.map((e, i) => {
        const A = NODES.find((n) => n.id === e.from)!;
        const B = NODES.find((n) => n.id === e.to)!;
        const highlight = !!focus && (e.from === focus || e.to === focus);
        const active = !focus || highlight;
        return (
          <line
            key={i}
            ref={register(i)}
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
    </>
  );
}
