"use client";

import type { MutableRefObject } from "react";
import * as THREE from "three";

const WOOL = "#E8E8E0";
const DARK = "#2a2a2a";
const DARK2 = "#3a3a3a";
const BLACK = "#1a1a1a";
const HOOF = "#0a0a0a";

export interface SheepRefs {
  fl: MutableRefObject<THREE.Group | null>;
  fr: MutableRefObject<THREE.Group | null>;
  bl: MutableRefObject<THREE.Group | null>;
  br: MutableRefObject<THREE.Group | null>;
  head: MutableRefObject<THREE.Group | null>;
}

// Toison : 7 sphères en cluster irrégulier (pas une sphère parfaite)
const FLEECE: [number, number, number, number][] = [
  [0, 0.34, 0, 0.18],        // centre
  [-0.12, 0.32, 0.12, 0.15], // avant-gauche
  [0.12, 0.32, 0.12, 0.15],  // avant-droit
  [-0.12, 0.32, -0.12, 0.15],// arrière-gauche
  [0.12, 0.32, -0.12, 0.15], // arrière-droit
  [0, 0.46, 0.08, 0.14],     // dessus-avant
  [0, 0.46, -0.1, 0.14],     // dessus-arrière
];

function Leg({ legRef, position }: { legRef: MutableRefObject<THREE.Group | null>; position: [number, number, number] }) {
  return (
    <group ref={legRef} position={position}>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.2, 6]} />
        <meshStandardMaterial color={BLACK} roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.205, 0]}>
        <cylinderGeometry args={[0.045, 0.04, 0.05, 6]} />
        <meshStandardMaterial color={HOOF} roughness={0.6} />
      </mesh>
    </group>
  );
}

// Géométrie statique du mouton (face +Z).
export function SheepMesh({ refs }: { refs: SheepRefs }) {
  return (
    <group>
      {/* Toison */}
      {FLEECE.map((f, i) => (
        <mesh key={i} position={[f[0], f[1], f[2]]}>
          <sphereGeometry args={[f[3], 7, 6]} />
          <meshStandardMaterial color={WOOL} roughness={0.95} flatShading />
        </mesh>
      ))}

      {/* Tête */}
      <group ref={refs.head} position={[0, 0.36, 0.24]}>
        <mesh scale={[1, 1, 1.2]}>
          <sphereGeometry args={[0.11, 8, 8]} />
          <meshStandardMaterial color={DARK} roughness={0.85} />
        </mesh>
        {/* Museau */}
        <mesh position={[0, -0.02, 0.12]}>
          <sphereGeometry args={[0.06, 6, 4]} />
          <meshStandardMaterial color={DARK2} roughness={0.85} />
        </mesh>
        {/* Naseaux */}
        <mesh position={[-0.02, -0.03, 0.17]}><sphereGeometry args={[0.012, 5, 5]} /><meshStandardMaterial color={BLACK} /></mesh>
        <mesh position={[0.02, -0.03, 0.17]}><sphereGeometry args={[0.012, 5, 5]} /><meshStandardMaterial color={BLACK} /></mesh>
        {/* Yeux doux (jaune clair) */}
        <mesh position={[-0.05, 0.03, 0.08]}><sphereGeometry args={[0.02, 6, 6]} /><meshStandardMaterial color="#FFFFaa" emissive="#FFFFaa" emissiveIntensity={0.3} /></mesh>
        <mesh position={[0.05, 0.03, 0.08]}><sphereGeometry args={[0.02, 6, 6]} /><meshStandardMaterial color="#FFFFaa" emissive="#FFFFaa" emissiveIntensity={0.3} /></mesh>
        {/* Oreilles tombantes */}
        <mesh position={[-0.11, 0.02, 0]} rotation={[0, 0, 0.9]}><cylinderGeometry args={[0.025, 0.015, 0.08, 5]} /><meshStandardMaterial color={DARK} /></mesh>
        <mesh position={[0.11, 0.02, 0]} rotation={[0, 0, -0.9]}><cylinderGeometry args={[0.025, 0.015, 0.08, 5]} /><meshStandardMaterial color={DARK} /></mesh>
      </group>

      {/* Pattes courtes */}
      <Leg legRef={refs.fl} position={[-0.09, 0.2, 0.1]} />
      <Leg legRef={refs.fr} position={[0.09, 0.2, 0.1]} />
      <Leg legRef={refs.bl} position={[-0.09, 0.2, -0.1]} />
      <Leg legRef={refs.br} position={[0.09, 0.2, -0.1]} />
    </group>
  );
}
