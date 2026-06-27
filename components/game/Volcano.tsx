"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { VolcanoParticles } from "./VolcanoParticles";

const SCALE = 0.45; // multiplicateur global (le perso ~0.9u, volcan trapu)
const DARK = "#1A1208";
const MAT = { roughness: 0.95, metalness: 0.05, flatShading: true } as const; // basalte mat

const STRIAE = [0.5, 2.0, 3.5, 5.0];        // angles des stries de lave solidifiée
const CREVASSES = [0.9, 2.8, 4.6];          // angles des fentes lumineuses
const ROCKS = [
  { a: 0.6, d: 0.82, r: 0.09 },
  { a: 2.3, d: 0.90, r: 0.07 },
  { a: 3.9, d: 0.85, r: 0.10 },
  { a: 5.4, d: 0.88, r: 0.06 },
];

// Socle rocheux : cylindre aplati aux vertices légèrement bruités (aspect irrégulier).
function makeBase() {
  const g = new THREE.CylinderGeometry(0.7, 0.9, 0.12, 10);
  const p = g.attributes.position;
  let seed = 7;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  for (let i = 0; i < p.count; i++) {
    p.setX(i, p.getX(i) + (rand() - 0.5) * 0.06);
    p.setZ(i, p.getZ(i) + (rand() - 0.5) * 0.06);
    p.setY(i, p.getY(i) + (rand() - 0.5) * 0.02);
  }
  p.needsUpdate = true;
  g.computeVertexNormals();
  return g;
}

// Volcan trapu et irrégulier — basalte sombre, lave qui filtre dans les fentes.
export function Volcano({ onClick }: { onClick: (e: ThreeEvent<MouseEvent>) => void }) {
  const baseGeo = useMemo(makeBase, []);
  const lightRef = useRef<THREE.PointLight>(null);
  const discRef = useRef<THREE.MeshStandardMaterial>(null);
  const crevRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (lightRef.current) lightRef.current.intensity = 1.2 + Math.sin(t * 2.5) * 0.6;
    if (discRef.current) discRef.current.emissiveIntensity = 3.5 + Math.sin(t * 3.2) * 1.0;
    // Scintillement de la lave dans les fentes
    crevRefs.current.forEach((m, i) => { if (m) m.emissiveIntensity = 2.5 + Math.sin(t * 5 + i * 2.1) * 0.7; });
  });

  return (
    <group scale={SCALE} onClick={onClick} onPointerDown={(e) => e.stopPropagation()}>
      {/* Socle rocheux large et aplati */}
      <mesh geometry={baseGeo} position={[0, 0.06, 0]}>
        <meshStandardMaterial color={DARK} {...MAT} />
      </mesh>

      {/* Corps : 3 cônes empilés, légèrement décalés (irrégulier) */}
      <mesh position={[0.02, 0.295, -0.015]}><coneGeometry args={[0.60, 0.35, 9]} /><meshStandardMaterial color="#241808" {...MAT} /></mesh>
      <mesh position={[-0.02, 0.67, 0.02]}><coneGeometry args={[0.42, 0.40, 9]} /><meshStandardMaterial color="#1E1408" {...MAT} /></mesh>
      <mesh position={[0.015, 1.02, 0.01]}><coneGeometry args={[0.26, 0.30, 8]} /><meshStandardMaterial color="#160E06" {...MAT} /></mesh>

      {/* Stries de lave solidifiée le long des flancs (presque éteintes) */}
      {STRIAE.map((a, i) => (
        <group key={i} rotation={[0, a, 0]}>
          <mesh position={[0.36, 0.58, 0]} rotation={[0, 0, -0.32]}>
            <cylinderGeometry args={[0.022, 0.035, 0.75, 4]} />
            <meshStandardMaterial color="#2E0E00" emissive="#220800" emissiveIntensity={0.4} roughness={0.95} metalness={0.05} flatShading />
          </mesh>
        </group>
      ))}

      {/* Crevasses lumineuses : la lave active filtre à travers la roche */}
      {CREVASSES.map((a, i) => (
        <group key={i} rotation={[0, a, 0]}>
          <mesh position={[0.32, 0.6, 0]} rotation={[0, 0, -0.28]}>
            <boxGeometry args={[0.015, 0.12, 0.06]} />
            <meshStandardMaterial ref={(m) => { crevRefs.current[i] = m; }} color="#FF3300" emissive="#FF5500" emissiveIntensity={2.5} transparent opacity={0.8} />
          </mesh>
        </group>
      ))}

      {/* Cratère incandescent : anneau + disque pulsant */}
      <mesh position={[0, 1.10, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.11, 0.035, 6, 10]} />
        <meshStandardMaterial color="#CC2200" emissive="#FF4400" emissiveIntensity={2.5} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.09, 12]} />
        <meshStandardMaterial ref={discRef} color="#FF2200" emissive="#FF6600" emissiveIntensity={3.5} transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* Lueur pulsante du cratère (distance réduite pour matcher la taille) */}
      <pointLight ref={lightRef} position={[0, 1.16, 0]} color="#FF5500" intensity={1.2} distance={2} decay={2} />

      {/* Rochers épars au pied, légèrement enfoncés */}
      {ROCKS.map((rk, i) => (
        <mesh key={i} position={[Math.cos(rk.a) * rk.d, -0.02, Math.sin(rk.a) * rk.d]} rotation={[rk.a, rk.d, rk.a]}>
          <dodecahedronGeometry args={[rk.r, 0]} />
          <meshStandardMaterial color={DARK} {...MAT} />
        </mesh>
      ))}

      <VolcanoParticles />
    </group>
  );
}
