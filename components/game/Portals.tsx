"use client";

import { PORTALS } from "./constants/game";
import { Portal } from "./Portal";
import { useVisitedPortals } from "./hooks/useVisitedPortals";

export function Portals() {
  const { visitedPortals } = useVisitedPortals();
  return (
    <>
      {PORTALS.map((p) => (
        <Portal
          key={p.id}
          position={p.position}
          color={p.color}
          isVisited={visitedPortals.has(p.label)}
        />
      ))}
    </>
  );
}
