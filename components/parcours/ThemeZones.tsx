"use client";

import { CAT_COLOR } from "./skills-graph-data";
import { ZONE_CATS, homePoints, zonePath, zoneLabelAnchor } from "./skills-zones";

// Zones de thème « territoire » (arrière-plan), DERRIÈRE arêtes et nœuds :
// contour fin + léger glow sur le contour + fill très discret + étiquette de
// catégorie. Le `d` (et l'ancre du label) sont réécrits à chaque tick physique
// (useGraphPhysics.render) via les refs. pointer-events:none → drag/clic intacts.
export default function ThemeZones({
  registerPath,
  registerLabel,
}: {
  registerPath: (cat: string) => (el: SVGPathElement | null) => void;
  registerLabel: (cat: string) => (el: SVGTextElement | null) => void;
}) {
  return (
    <g aria-hidden style={{ pointerEvents: "none" }}>
      <defs>
        {/* Glow léger réservé au CONTOUR (petit blur, bords lisibles) */}
        <filter id="zone-glow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>
      {ZONE_CATS.map((cat) => {
        const color = CAT_COLOR[cat];
        const d = zonePath(homePoints(cat));
        const [lx, ly] = zoneLabelAnchor(homePoints(cat));
        return (
          <g key={cat}>
            {/* Halo du contour (blur appliqué au stroke seul) */}
            <path ref={registerPath(cat)} d={d} fill="none" stroke={color}
              strokeWidth={2} strokeOpacity={0.5} strokeLinejoin="round"
              filter="url(#zone-glow)" />
            {/* Territoire net : contour fin + fill très léger */}
            <path ref={registerPath(cat)} d={d} fill={color} fillOpacity={0.07}
              stroke={color} strokeOpacity={0.55} strokeWidth={1.5} strokeLinejoin="round" />
            {/* Étiquette de catégorie */}
            <text ref={registerLabel(cat)} x={lx} y={ly} textAnchor="middle"
              fill={color} fillOpacity={0.7}
              style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", userSelect: "none" }}>
              {cat.toUpperCase()}
            </text>
          </g>
        );
      })}
    </g>
  );
}
