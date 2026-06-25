"use client";

import type { MutableRefObject } from "react";
import * as THREE from "three";

const ORANGE = "#E8822A";
const ORANGE_DARK = "#C0601A";
const CREAM = "#F5C89A";
const BLACK = "#1a1a1a";

export interface FoxRefs {
  fl: MutableRefObject<THREE.Group | null>;
  fr: MutableRefObject<THREE.Group | null>;
  bl: MutableRefObject<THREE.Group | null>;
  br: MutableRefObject<THREE.Group | null>;
  tail: MutableRefObject<THREE.Group | null>;
}

function Leg({ legRef, position }: { legRef: MutableRefObject<THREE.Group | null>; position: [number, number, number] }) {
  return (
    <group ref={legRef} position={position}>
      <mesh position={[0, -0.11, 0]}>
        <cylinderGeometry args={[0.04, 0.035, 0.22, 6]} />
        <meshStandardMaterial color={ORANGE} roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.24, 0]}>
        <cylinderGeometry args={[0.035, 0.025, 0.06, 6]} />
        <meshStandardMaterial color={BLACK} roughness={0.7} />
      </mesh>
    </group>
  );
}

// Géométrie statique du renard (face +Z). Les parties animées reçoivent des refs.
export function FoxMesh({ refs }: { refs: FoxRefs }) {
  return (
    <group>
      {/* Torse */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.28, 0.18, 0.42]} />
        <meshStandardMaterial color={ORANGE} roughness={0.8} />
      </mesh>
      {/* Ventre crème (aplati, sous le torse) */}
      <mesh position={[0, 0.21, 0]} scale={[1, 0.6, 1]}>
        <sphereGeometry args={[0.13, 6, 4]} />
        <meshStandardMaterial color={CREAM} roughness={0.85} />
      </mesh>

      {/* Tête */}
      <group position={[0, 0.36, 0.26]}>
        <mesh>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color={ORANGE} roughness={0.8} />
        </mesh>
        {/* Museau */}
        <mesh position={[0, -0.02, 0.12]}>
          <boxGeometry args={[0.12, 0.1, 0.16]} />
          <meshStandardMaterial color={ORANGE_DARK} roughness={0.8} />
        </mesh>
        {/* Truffe */}
        <mesh position={[0, -0.02, 0.21]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial color={BLACK} roughness={0.5} />
        </mesh>
        {/* Yeux + reflet brillant */}
        {([[-0.06, 0.04, 0.09], [0.06, 0.04, 0.09]] as [number, number, number][]).map((p, i) => (
          <group key={i} position={p}>
            <mesh><sphereGeometry args={[0.025, 6, 6]} /><meshStandardMaterial color={BLACK} /></mesh>
            <mesh position={[0.008, 0.012, 0.018]}>
              <sphereGeometry args={[0.008, 5, 5]} />
              <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.5} />
            </mesh>
          </group>
        ))}
        {/* Oreilles pointues (±15°) + intérieur rose */}
        {([[-0.07, 0.12, 0, 0.26], [0.07, 0.12, 0, -0.26]] as [number, number, number, number][]).map((e, i) => (
          <group key={i} position={[e[0], e[1], e[2]]} rotation={[0, 0, e[3]]}>
            <mesh><coneGeometry args={[0.06, 0.14, 4]} /><meshStandardMaterial color={ORANGE} roughness={0.8} /></mesh>
            <mesh position={[0, 0, 0.02]}><coneGeometry args={[0.03, 0.1, 4]} /><meshStandardMaterial color="#FFB6C1" /></mesh>
          </group>
        ))}
      </group>

      {/* Pattes */}
      <Leg legRef={refs.fl} position={[-0.1, 0.3, 0.15]} />
      <Leg legRef={refs.fr} position={[0.1, 0.3, 0.15]} />
      <Leg legRef={refs.bl} position={[-0.1, 0.3, -0.15]} />
      <Leg legRef={refs.br} position={[0.1, 0.3, -0.15]} />

      {/* Queue (inclinée vers le haut) */}
      <group ref={refs.tail} position={[0, 0.34, -0.22]} rotation={[-0.8, 0, 0]}>
        <mesh position={[0, 0, -0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.09, 0.28, 6]} />
          <meshStandardMaterial color={ORANGE} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0, -0.28]}>
          <sphereGeometry args={[0.09, 7, 7]} />
          <meshStandardMaterial color="#F5F5F5" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
