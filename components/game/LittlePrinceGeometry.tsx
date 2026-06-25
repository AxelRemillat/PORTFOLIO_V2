"use client";

import * as THREE from "three";

// Shared material props — low-poly matte look
export const MAT = { roughness: 0.8, flatShading: true } as const;

// ── Golden volumetric hair: dome of spheres over the crown + back ──────────────
const HAIR: [number, number, number][] = [
  [  0,    1.19,  0.05],
  [-0.13,  1.16,  0.03],
  [ 0.13,  1.16,  0.03],
  [-0.19,  1.07, -0.06],
  [ 0.19,  1.07, -0.06],
  [-0.10,  1.10, -0.16],
  [ 0.10,  1.10, -0.16],
  [  0,    1.13, -0.13],
];

export function Hair() {
  return (
    <group>
      {HAIR.map((p, i) => (
        <mesh key={i} position={p} scale={[1, 1.1, 1]}>
          <sphereGeometry args={[0.13, 7, 7]} />
          <meshStandardMaterial color="#FFB020" emissive="#FFB020" emissiveIntensity={0.15} {...MAT} />
        </mesh>
      ))}
      {/* Main forelock — bigger, brighter sphere at the very top */}
      <mesh position={[0, 1.24, -0.01]} scale={[1.05, 1.1, 1.05]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#FFC030" emissive="#FFB020" emissiveIntensity={0.15} {...MAT} />
      </mesh>
    </group>
  );
}

// ── Face: expressive eyes (+ white highlight), nose, blush cheeks ──────────────
const EYE_X = 0.085, EYE_Y = 1.05, EYE_Z = 0.205;

export function FaceDetails() {
  return (
    <group>
      {/* Eyes — dark, slightly protruding */}
      <mesh position={[-EYE_X, EYE_Y, EYE_Z]}>
        <sphereGeometry args={[0.045, 7, 7]} />
        <meshStandardMaterial color="#1a1025" {...MAT} />
      </mesh>
      <mesh position={[EYE_X, EYE_Y, EYE_Z]}>
        <sphereGeometry args={[0.045, 7, 7]} />
        <meshStandardMaterial color="#1a1025" {...MAT} />
      </mesh>
      {/* White highlights — offset up-right */}
      <mesh position={[-EYE_X + 0.018, EYE_Y + 0.018, EYE_Z + 0.025]}>
        <sphereGeometry args={[0.015, 5, 5]} />
        <meshStandardMaterial color="#ffffff" {...MAT} />
      </mesh>
      <mesh position={[EYE_X + 0.018, EYE_Y + 0.018, EYE_Z + 0.025]}>
        <sphereGeometry args={[0.015, 5, 5]} />
        <meshStandardMaterial color="#ffffff" {...MAT} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.99, 0.225]}>
        <sphereGeometry args={[0.018, 5, 5]} />
        <meshStandardMaterial color="#E0A060" {...MAT} />
      </mesh>
      {/* Cheeks — childish blush */}
      <mesh position={[-0.135, 0.965, 0.155]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color="#FFB0A0" transparent opacity={0.6} {...MAT} />
      </mesh>
      <mesh position={[0.135, 0.965, 0.155]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color="#FFB0A0" transparent opacity={0.6} {...MAT} />
      </mesh>
    </group>
  );
}

// ── Collar under the head ──────────────────────────────────────────────────────
export function Collar() {
  return (
    <mesh position={[0, 0.84, 0]}>
      <cylinderGeometry args={[0.09, 0.09, 0.04, 8]} />
      <meshStandardMaterial color="#e8e0d0" {...MAT} />
    </mesh>
  );
}

// ── Torso: two stacked boxes (slim upper, wider lower) + golden buttons ─────────
export function Torso() {
  return (
    <group>
      <mesh position={[0, 0.71, 0]}>
        <boxGeometry args={[0.22, 0.18, 0.14]} />
        <meshStandardMaterial color="#2d7a2d" {...MAT} />
      </mesh>
      <mesh position={[0, 0.54, 0]}>
        <boxGeometry args={[0.24, 0.16, 0.15]} />
        <meshStandardMaterial color="#2d7a2d" {...MAT} />
      </mesh>
      {[0.74, 0.66, 0.58].map((y, i) => (
        <mesh key={i} position={[0, y, 0.076]}>
          <sphereGeometry args={[0.018, 5, 5]} />
          <meshStandardMaterial color="#FFD700" {...MAT} />
        </mesh>
      ))}
    </group>
  );
}

// ── Belt with central buckle ────────────────────────────────────────────────────
export function Belt() {
  return (
    <group>
      <mesh position={[0, 0.465, 0]}>
        <boxGeometry args={[0.26, 0.035, 0.17]} />
        <meshStandardMaterial color="#8B7030" {...MAT} />
      </mesh>
      <mesh position={[0, 0.465, 0.088]}>
        <boxGeometry args={[0.04, 0.04, 0.02]} />
        <meshStandardMaterial color="#FFD700" {...MAT} />
      </mesh>
    </group>
  );
}

// ── Arm limb (inside the shoulder pivot group): tapered sleeve + hand ───────────
export function ArmLimb() {
  return (
    <group>
      <mesh position={[0, -0.13, 0]}>
        <cylinderGeometry args={[0.048, 0.042, 0.26, 6]} />
        <meshStandardMaterial color="#2d7a2d" {...MAT} />
      </mesh>
      <mesh position={[0, -0.28, 0]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshStandardMaterial color="#F0C080" {...MAT} />
      </mesh>
    </group>
  );
}

// ── Leg limb (inside the hip pivot group): trouser + boot shaft + sole ──────────
export function LegLimb() {
  return (
    <group>
      <mesh position={[0, -0.14, 0]}>
        <cylinderGeometry args={[0.055, 0.05, 0.28, 6]} />
        <meshStandardMaterial color="#1e5a1e" {...MAT} />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.062, 0.058, 0.14, 6]} />
        <meshStandardMaterial color="#2a1508" {...MAT} />
      </mesh>
      <mesh position={[0, -0.44, 0.02]}>
        <boxGeometry args={[0.1, 0.04, 0.14]} />
        <meshStandardMaterial color="#1a0d05" {...MAT} />
      </mesh>
    </group>
  );
}
