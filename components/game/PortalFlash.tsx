"use client";

import { useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  infoRef: MutableRefObject<{ pos: THREE.Vector3; color: string; t: number } | null>;
}

export function PortalFlash({ infoRef }: Props) {
  const meshRef  = useRef<THREE.Mesh>(null);
  const matRef   = useRef<THREE.MeshBasicMaterial>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    const info  = infoRef.current;
    const mesh  = meshRef.current;
    const mat   = matRef.current;
    const light = lightRef.current;
    if (!mesh || !mat || !light) return;
    if (!info) { mesh.visible = false; light.visible = false; return; }

    info.t += delta;
    const p = Math.min(info.t / 0.35, 1);
    if (p >= 1) { infoRef.current = null; mesh.visible = false; light.visible = false; return; }

    mesh.visible = true;
    mesh.position.copy(info.pos);
    mesh.scale.setScalar(0.4 + p * 4.0);
    mat.color.set(info.color);
    mat.opacity = (1 - p) * 0.85;

    light.visible = true;
    light.position.copy(info.pos);
    light.color.set(info.color);
    light.intensity = 30 * (1 - p);
  });

  return (
    <>
      <mesh ref={meshRef} visible={false}>
        <torusGeometry args={[0.8, 0.14, 8, 32]} />
        <meshBasicMaterial ref={matRef} transparent opacity={0} depthWrite={false} />
      </mesh>
      <pointLight ref={lightRef} visible={false} distance={20} decay={2} />
    </>
  );
}
