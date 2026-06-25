"use client";

import { MAT } from "./LittlePrinceGeometry";

// Anime-style eyes: layered white / iris / pupil / highlight + dark contour.
// Positioned in bodyGroup-local space (same frame as the head, centred at y≈1.0).
const SIDES = [-1, 1];
const EYE_X = 0.1, EYE_Y = 1.05, EYE_Z = 0.19;

export function Eyes() {
  return (
    <group>
      {SIDES.map((s) => (
        <group key={s} position={[EYE_X * s, EYE_Y, EYE_Z]}>
          {/* Dark contour / lashes — slightly behind, larger */}
          <mesh position={[0, 0, -0.008]} scale={[1.35, 1.15, 1]}>
            <sphereGeometry args={[0.06, 7, 7]} />
            <meshStandardMaterial color="#1a1025" {...MAT} />
          </mesh>
          {/* White of the eye */}
          <mesh scale={[1.3, 1.1, 1]}>
            <sphereGeometry args={[0.055, 8, 8]} />
            <meshStandardMaterial color="#ffffff" {...MAT} />
          </mesh>
          {/* Coloured iris */}
          <mesh position={[0, 0, 0.035]} scale={[1, 1.15, 1]}>
            <sphereGeometry args={[0.038, 7, 7]} />
            <meshStandardMaterial color="#2255AA" {...MAT} />
          </mesh>
          {/* Pupil */}
          <mesh position={[0, 0, 0.055]}>
            <sphereGeometry args={[0.022, 6, 6]} />
            <meshStandardMaterial color="#0a0a15" {...MAT} />
          </mesh>
          {/* Always-bright highlight, top-right of the pupil */}
          <mesh position={[0.012, 0.014, 0.066]}>
            <sphereGeometry args={[0.01, 5, 5]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} {...MAT} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
