"use client";

import { useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  infoRef: MutableRefObject<{ pos: THREE.Vector3; t: number } | null>;
}

export function ClickIndicator({ infoRef }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef  = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((_, delta) => {
    if (!meshRef.current || !matRef.current) return;
    const info = infoRef.current;
    if (!info) { meshRef.current.visible = false; return; }
    info.t += delta;
    if (info.t >= 0.5) { infoRef.current = null; meshRef.current.visible = false; return; }
    meshRef.current.visible = true;
    meshRef.current.position.set(info.pos.x, info.pos.y, info.pos.z);
    const p = info.t / 0.5;
    matRef.current.opacity = 1 - p;
    const s = 1 + p * 0.8;
    meshRef.current.scale.set(s, s, s);
  });

  return (
    <mesh ref={meshRef} visible={false} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.3, 0.04, 6, 24]} />
      <meshBasicMaterial ref={matRef} color="#88ccff" transparent opacity={0} />
    </mesh>
  );
}
