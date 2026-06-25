"use client";

import { useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useNPCMovement } from "./hooks/useNPCMovement";
import { FoxMesh, type FoxRefs } from "./FoxMesh";

interface FoxProps {
  posRef: MutableRefObject<THREE.Vector3>;
  planetRadius: number;
  avoidPositions?: THREE.Vector3[];
  avoidRefs?: MutableRefObject<THREE.Vector3>[];
  pausedRef: MutableRefObject<boolean>;
  isInteracting: boolean;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
  followRef?: MutableRefObject<THREE.Vector3>; // position du joueur
  tamed?: boolean;                              // apprivoisé → suit le joueur
}

const SPEED = 0.012;

export function Fox({ posRef, planetRadius, avoidPositions, avoidRefs, pausedRef, isInteracting, onClick, followRef, tamed }: FoxProps) {
  const groupRef = useRef<THREE.Group | null>(null);
  const bodyRef = useRef<THREE.Group | null>(null);
  const fl = useRef<THREE.Group | null>(null);
  const fr = useRef<THREE.Group | null>(null);
  const bl = useRef<THREE.Group | null>(null);
  const br = useRef<THREE.Group | null>(null);
  const tail = useRef<THREE.Group | null>(null);
  const refs: FoxRefs = { fl, fr, bl, br, tail };

  // Mode familier piloté par `tamed` (lu chaque frame par le hook).
  const followingRef = useRef(!!tamed);
  followingRef.current = !!tamed;

  const { isMovingRef } = useNPCMovement({
    groupRef, positionRef: posRef, planetRadius, speed: SPEED,
    waitTimeRange: [2, 5], avoidPositions, avoidRefs, pausedRef,
    followRef, followingRef, followSpeed: 1.6, followDistance: 0.9,
  });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const moving = isMovingRef.current;
    const phase = t * 9;
    const swing = Math.sin(phase) * 0.5;

    // Pattes en opposition (avant-gauche + arrière-droit en phase)
    const step = (g: THREE.Group | null, x: number) => {
      if (!g) return;
      g.rotation.x = moving ? x : THREE.MathUtils.lerp(g.rotation.x, 0, 0.15);
    };
    step(fl.current, swing); step(br.current, swing);
    step(fr.current, -swing); step(bl.current, -swing);

    if (bodyRef.current) {
      bodyRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.02);  // respiration
      bodyRef.current.rotation.z = moving ? Math.sin(phase) * 0.05 : 0; // oscillation latérale
    }
    if (tail.current) {
      tail.current.rotation.x = THREE.MathUtils.lerp(tail.current.rotation.x, moving ? -0.4 : -0.8, 0.1);
      tail.current.rotation.z = isInteracting ? Math.sin(t * 6) * 0.5 : Math.sin(t * 1.5) * 0.3; // wagging / idle
    }
  });

  return (
    <group ref={groupRef} onClick={onClick} onPointerDown={(e) => e.stopPropagation()}>
      <group ref={bodyRef}>
        <FoxMesh refs={refs} />
      </group>
    </group>
  );
}
