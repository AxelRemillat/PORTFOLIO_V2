"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const BARK = "#8B6914"; // ocre foncé (tronc + branches + racines)
const LEAF = "#2D6B3A";

// 5 branches principales : angle autour de Y + inclinaison (lean)
const BRANCHES = [
  { a: 0.0, tilt: 0.7 },
  { a: 1.26, tilt: 1.0 },
  { a: 2.51, tilt: 0.6 },
  { a: 3.77, tilt: 1.1 },
  { a: 5.03, tilt: 0.85 },
];

// Cluster de 6 feuillages, aux extrémités hautes
const FOLIAGE: [number, number, number][] = [
  [0.5, 0.95, 0.0],
  [-0.45, 0.92, 0.22],
  [0.22, 1.05, 0.45],
  [-0.28, 1.0, -0.4],
  [0.0, 1.15, 0.05],
  [0.45, 0.9, -0.32],
];

const ROOTS = [0, 1, 2, 3];

// Baobab massif et trapu — géométrie procédurale uniquement.
export function Baobab() {
  const leavesRef = useRef<THREE.Group>(null);

  // Légère oscillation des feuillages
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const g = leavesRef.current;
    if (!g) return;
    g.children.forEach((leaf, i) => {
      leaf.rotation.z = Math.sin(t * 0.5 + i * 1.2) * 0.015;
    });
  });

  return (
    <group>
      {/* Tronc — large et court */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.25, 0.4, 0.8, 8]} />
        <meshStandardMaterial color={BARK} roughness={0.95} />
      </mesh>

      {/* Branches principales + petites branches au bout */}
      {BRANCHES.map((b, i) => (
        <group key={i} rotation={[0, b.a, 0]}>
          <mesh position={[0.2, 0.55, 0]} rotation={[0, 0, -b.tilt]}>
            <cylinderGeometry args={[0.08, 0.05, 0.4, 6]} />
            <meshStandardMaterial color={BARK} roughness={0.9} />
          </mesh>
          <mesh position={[0.36, 0.74, 0]} rotation={[0, 0, -b.tilt - 0.25]}>
            <cylinderGeometry args={[0.04, 0.02, 0.25, 6]} />
            <meshStandardMaterial color={BARK} roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Feuillage (chaque sphère dans un group pivoté à l'origine → balancement visible) */}
      <group ref={leavesRef}>
        {FOLIAGE.map((p, i) => (
          <group key={i}>
            <mesh position={p}>
              <sphereGeometry args={[0.2, 12, 12]} />
              <meshStandardMaterial color={LEAF} roughness={0.85} transparent opacity={0.9} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Racines apparentes autour de la base */}
      {ROOTS.map((i) => {
        const a = (i / ROOTS.length) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, a, 0]}>
            <mesh position={[0.2, 0.04, 0]} rotation={[0, 0, -0.7]}>
              <cylinderGeometry args={[0.06, 0.08, 0.15, 6]} />
              <meshStandardMaterial color={BARK} roughness={0.97} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
