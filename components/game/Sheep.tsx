"use client";

import { useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useNPCMovement } from "./hooks/useNPCMovement";
import { SheepMesh, type SheepRefs } from "./SheepMesh";

interface SheepProps {
  posRef: MutableRefObject<THREE.Vector3>;
  planetRadius: number;
  avoidPositions?: THREE.Vector3[];
  avoidRefs?: MutableRefObject<THREE.Vector3>[];
  pausedRef: MutableRefObject<boolean>;
  isInteracting: boolean;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
}

const SPEED = 0.004;       // plus lent et tranquille
const SHEEP_SCALE = 1.7;   // plus gros que le renard

export function Sheep({ posRef, planetRadius, avoidPositions, avoidRefs, pausedRef, isInteracting, onClick }: SheepProps) {
  const groupRef = useRef<THREE.Group | null>(null);
  const bodyRef = useRef<THREE.Group | null>(null);
  const fl = useRef<THREE.Group | null>(null);
  const fr = useRef<THREE.Group | null>(null);
  const bl = useRef<THREE.Group | null>(null);
  const br = useRef<THREE.Group | null>(null);
  const head = useRef<THREE.Group | null>(null);
  const refs: SheepRefs = { fl, fr, bl, br, head };

  // Pauses plus longues → reste posé, ne « fuit » pas. N'évite PAS le joueur.
  const { isMovingRef } = useNPCMovement({
    groupRef, positionRef: posRef, planetRadius, speed: SPEED,
    waitTimeRange: [6, 11], avoidPositions, avoidRefs, pausedRef,
  });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const moving = isMovingRef.current;
    const phase = t * 12; // petits pas rapides
    const swing = Math.sin(phase) * 0.3;

    const step = (g: THREE.Group | null, x: number) => {
      if (!g) return;
      g.rotation.x = moving ? x : THREE.MathUtils.lerp(g.rotation.x, 0, 0.15);
    };
    step(fl.current, swing); step(br.current, swing);
    step(fr.current, -swing); step(bl.current, -swing);

    if (bodyRef.current) {
      // Dandinement marqué + micro-sautillement à l'arrêt
      bodyRef.current.position.y = moving ? Math.abs(Math.sin(phase)) * 0.03 : Math.sin(t * 1.2) * 0.005;
      bodyRef.current.rotation.z = moving ? Math.sin(phase * 0.5) * 0.07 : 0;
    }
    if (head.current) {
      if (isInteracting) {
        head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, -0.3, 0.1); // tête levée
        head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, 0, 0.1);
      } else {
        head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, 0, 0.1);
        head.current.rotation.y = Math.sin(t * 0.6) * 0.08; // bêlement implicite
      }
    }
  });

  return (
    <group ref={groupRef} scale={SHEEP_SCALE} onClick={onClick} onPointerDown={(e) => e.stopPropagation()}>
      <group ref={bodyRef}>
        <SheepMesh refs={refs} />
      </group>
    </group>
  );
}
