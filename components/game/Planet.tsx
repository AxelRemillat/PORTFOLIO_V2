"use client";

import type { ThreeEvent } from "@react-three/fiber";

interface PlanetProps {
  onPointerDown: (e: ThreeEvent<PointerEvent>) => void;
}

export function Planet({ onPointerDown }: PlanetProps) {
  return (
    <mesh onPointerDown={onPointerDown}>
      <sphereGeometry args={[7, 32, 24]} />
      <meshStandardMaterial
        color="#1e2a5e"
        emissive="#0a0f2e"
        emissiveIntensity={0.3}
        roughness={0.85}
        flatShading
      />
    </mesh>
  );
}
