"use client";

import { CAT_COLOR, W, H, type GNode } from "./skills-graph-data";

interface Props {
  node: GNode;
  index: number;
  active: boolean;     // fait partie du voisinage du focus (ou pas de focus)
  big: boolean;        // survolé ou sélectionné
  isSelected: boolean;
  drift: boolean;      // drift organique idle (désactivé si reduce / sélection)
  visible: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onToggle: () => void;
}

// Un nœud de la constellation : zone de tap élargie, anneau pulsant si
// sélectionné, halo + pastille + label. Drift déphasé par index.
export default function ConstellationNode({
  node, index, active, big, isSelected, drift, visible, onEnter, onLeave, onToggle,
}: Props) {
  const cx = node.x * W, cy = node.y * H;
  const color = CAT_COLOR[node.cat];

  return (
    <g
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      // stopPropagation : ne PAS déclencher le dézoom du fond.
      // Clic sur un autre nœud → re-focus direct ; même nœud → toggle.
      onClick={(ev) => { ev.stopPropagation(); onToggle(); }}
      style={{ cursor: "pointer" }}
      opacity={visible ? (active ? 1 : 0.22) : 0}
    >
      <g
        className={drift ? "skill-drift" : undefined}
        style={drift ? { animationDelay: `${-index * 0.9}s`, animationDuration: `${6 + (index % 4)}s` } : undefined}
      >
        {/* Zone de tap élargie (mobile) : cercle transparent r=22 */}
        <circle cx={cx} cy={cy} r={22} fill="transparent" />
        {isSelected && (
          <circle cx={cx} cy={cy} r={13} fill="none" stroke={color} strokeWidth={1.5} opacity={0.9}>
            <animate attributeName="r" values="11;15;11" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite" />
          </circle>
        )}
        <circle cx={cx} cy={cy} r={big ? 18 : 11} fill={color} opacity={0.18}
          filter="url(#node-glow)" style={{ transition: "r 0.2s ease, opacity 0.3s ease" }} />
        <circle cx={cx} cy={cy} r={big ? 8 : 5.5} fill={color}
          style={{ transition: "r 0.2s ease, opacity 0.4s ease", transitionDelay: `${index * 0.03}s` }} />
        <text x={cx} y={cy + 20} textAnchor="middle" fontSize={big ? 13 : 11} fontWeight={big ? 700 : 400}
          fill={active ? color : "#555577"}
          style={{ fontFamily: "var(--font-mono)", transition: "font-size 0.2s, fill 0.3s", userSelect: "none" }}>
          {node.label}
        </text>
      </g>
    </g>
  );
}
