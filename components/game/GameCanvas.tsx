"use client";

import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";

export function GameCanvas({ onPortalEnter }: { onPortalEnter: (href: string) => void }) {
  return (
    <Canvas
      camera={{ position: [0, 13, -10], fov: 65 }}
      frameloop="always"
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%", background: "#020210" }}
      onCreated={({ camera }) => { camera.lookAt(0, 7, 0); }}
    >
      <Scene onPortalEnter={onPortalEnter} />
    </Canvas>
  );
}
