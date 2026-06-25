"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Un seul groupe orbital qui tourne lentement autour de Z. Le soleil et la lune
// y sont fixés à +X / -X (toujours opposés). Chaque astre porte une
// DirectionalLight qui éclaire toute la planète depuis sa direction — c'est ça
// qui crée le vrai contraste jour/nuit (pas des PointLight).
export function SunMoon() {
  const orbitRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (orbitRef.current) orbitRef.current.rotation.z += 0.0006;
  });

  return (
    <group ref={orbitRef}>
      {/* ── SOLEIL — à +X ──────────────────────────────────────────────────── */}
      <group position={[28, 0, 0]}>
        <mesh>
          <sphereGeometry args={[2.5, 16, 16]} />
          <meshStandardMaterial color="#FFF5D0" emissive="#FFD700" emissiveIntensity={2} />
        </mesh>
        {/* Halo */}
        <mesh>
          <sphereGeometry args={[3.5, 12, 12]} />
          <meshStandardMaterial color="#FFB347" transparent opacity={0.15} />
        </mesh>
        {/* Lumière directionnelle chaude — pointe vers le centre (0,0,0) */}
        <directionalLight
          color="#FFB860"
          intensity={4}
          position={[28, 0, 0]}
          castShadow={false}
        />
      </group>

      {/* ── LUNE — à -X, exactement opposée ────────────────────────────────── */}
      <group position={[-28, 0, 0]}>
        <mesh>
          <sphereGeometry args={[1.8, 14, 14]} />
          <meshStandardMaterial color="#C8D8FF" emissive="#9090BB" emissiveIntensity={0.5} />
        </mesh>
        {/* Lumière directionnelle froide */}
        <directionalLight
          color="#4F70E6"
          intensity={3}
          position={[-28, 0, 0]}
          castShadow={false}
        />
      </group>
    </group>
  );
}
