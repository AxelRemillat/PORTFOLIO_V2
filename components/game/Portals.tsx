"use client";

import { PORTALS } from "./constants/game";
import { Portal } from "./Portal";

export function Portals() {
  return (
    <>
      {PORTALS.map((p) => (
        <Portal key={p.id} position={p.position} color={p.color} label={p.label} />
      ))}
    </>
  );
}
