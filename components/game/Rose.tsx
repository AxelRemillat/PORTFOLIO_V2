"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PETAL_COUNT = 5;

// Rose sous cloche en verre — géométrie procédurale uniquement.
export function Rose() {
  const ref = useRef<THREE.Group>(null);

  // 5 pétales disposés en étoile, légèrement inclinés vers l'extérieur
  const petals = useMemo(
    () =>
      Array.from({ length: PETAL_COUNT }, (_, i) => {
        const a = (i / PETAL_COUNT) * Math.PI * 2;
        return {
          pos: [Math.cos(a) * 0.07, 0, Math.sin(a) * 0.07] as [number, number, number],
          rot: [Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5] as [number, number, number],
        };
      }),
    [],
  );

  // Légère oscillation idle autour de la normale de surface (axe Y local)
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.01;
  });

  return (
    <group ref={ref}>
      {/* Socle */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 0.04, 20]} />
        <meshStandardMaterial color="#8B7355" roughness={0.9} />
      </mesh>

      {/* Tige */}
      <mesh position={[0, 0.21, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.35, 8]} />
        <meshStandardMaterial color="#2D5A1B" roughness={0.8} />
      </mesh>

      {/* 2 feuilles (ellipsoïdes approchés par des sphères aplaties) */}
      <mesh position={[0.07, 0.16, 0]} rotation={[0, 0, -0.7]} scale={[1, 0.45, 0.18]}>
        <sphereGeometry args={[0.08, 10, 8]} />
        <meshStandardMaterial color="#2D5A1B" roughness={0.8} />
      </mesh>
      <mesh position={[-0.06, 0.23, 0.02]} rotation={[0, 0.5, 0.8]} scale={[1, 0.45, 0.18]}>
        <sphereGeometry args={[0.08, 10, 8]} />
        <meshStandardMaterial color="#2D5A1B" roughness={0.8} />
      </mesh>

      {/* Tête de la rose + pétales — lumineux et brillants */}
      <group position={[0, 0.4, 0]}>
        <mesh>
          <sphereGeometry args={[0.08, 14, 14]} />
          <meshStandardMaterial
            color="#FF6B8A"
            emissive="#FF5577"
            emissiveIntensity={0.6}
            roughness={0.25}
            metalness={0.15}
          />
        </mesh>
        {petals.map((p, i) => (
          <mesh key={i} position={p.pos} rotation={p.rot} scale={[1, 0.8, 1]}>
            <sphereGeometry args={[0.06, 10, 10]} />
            <meshStandardMaterial
              color="#FF85A1"
              emissive="#FF6F95"
              emissiveIntensity={0.5}
              roughness={0.25}
              metalness={0.15}
            />
          </mesh>
        ))}

        {/* Halo rose qui émane de la fleur */}
        <pointLight color="#FF85A1" intensity={1.3} distance={2.2} decay={2} />
      </group>

      {/* Cloche en verre — dôme ouvert en bas */}
      <mesh position={[0, 0.24, 0]}>
        <sphereGeometry args={[0.22, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.15}
          roughness={0}
          metalness={0.1}
          color="#88CCFF"
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
