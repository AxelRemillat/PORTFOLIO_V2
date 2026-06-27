"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const BARK      = "#8a6a39"; // écorce du tronc (ocre chaud)
const BARK_DARK = "#6f5026"; // branches & racines (plus sombre)
const LEAF_1    = "#3f7d46"; // feuillage clair
const LEAF_2    = "#2d5a36"; // feuillage sombre

const MAT = { roughness: 0.92, flatShading: true } as const;

// Branches noueuses : angle autour de Y, inclinaison depuis la verticale.
const BRANCHES = [
  { a: 0.0,  tilt: 0.55 },
  { a: 1.05, tilt: 0.75 },
  { a: 2.10, tilt: 0.5  },
  { a: 3.14, tilt: 0.8  },
  { a: 4.19, tilt: 0.6  },
  { a: 5.24, tilt: 0.72 },
];

// Canopée large et aplatie (couronne du baobab). [x, y, z, rayon, teinte]
const FOLIAGE: [number, number, number, number, number][] = [
  [ 0.00, 1.20, 0.00, 0.30, 0],
  [ 0.34, 1.07, 0.12, 0.26, 1],
  [-0.31, 1.09, 0.13, 0.26, 1],
  [ 0.15, 1.04, 0.35, 0.25, 0],
  [-0.18, 1.03, -0.31, 0.24, 1],
  [ 0.31, 1.01, -0.25, 0.23, 0],
  [-0.35, 1.00, -0.08, 0.22, 0],
  [ 0.07, 1.28, 0.03, 0.23, 1],
];

const ROOTS = [0, 1, 2, 3, 4];

// Baobab massif et trapu — 100 % géométrie procédurale, style low-poly facetté.
export function Baobab() {
  const leavesRef = useRef<THREE.Group>(null);

  // Profil du tronc « bouteille » : large à la base, ventru, puis affiné en haut.
  const trunkProfile = useMemo(
    () =>
      [
        [0.30, 0.00], [0.43, 0.06], [0.45, 0.16], [0.41, 0.32],
        [0.33, 0.50], [0.25, 0.68], [0.20, 0.80], [0.18, 0.88],
      ].map(([r, y]) => new THREE.Vector2(r, y)),
    [],
  );

  // Léger balancement de la canopée.
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const g = leavesRef.current;
    if (!g) return;
    g.children.forEach((leaf, i) => {
      leaf.rotation.z = Math.sin(t * 0.5 + i * 1.2) * 0.02;
      leaf.rotation.x = Math.cos(t * 0.4 + i * 0.9) * 0.015;
    });
  });

  return (
    <group>
      {/* Tronc bouteille (LatheGeometry révolutionné, facetté) */}
      <mesh position={[0, 0, 0]}>
        <latheGeometry args={[trunkProfile, 9]} />
        <meshStandardMaterial color={BARK} {...MAT} />
      </mesh>

      {/* Branches : montent et s'évasent depuis le sommet du tronc, avec un rameau */}
      {BRANCHES.map((b, i) => (
        <group key={i} rotation={[0, b.a, 0]}>
          <mesh position={[0.18, 0.95, 0]} rotation={[0, 0, -b.tilt]}>
            <cylinderGeometry args={[0.05, 0.1, 0.42, 6]} />
            <meshStandardMaterial color={BARK_DARK} {...MAT} />
          </mesh>
          <mesh position={[0.34, 1.12, 0]} rotation={[0, 0, -b.tilt - 0.3]}>
            <cylinderGeometry args={[0.025, 0.05, 0.24, 5]} />
            <meshStandardMaterial color={BARK_DARK} {...MAT} />
          </mesh>
        </group>
      ))}

      {/* Canopée — icosaèdres facettés, aplatis, bi-ton */}
      <group ref={leavesRef}>
        {FOLIAGE.map(([x, y, z, r, tint], i) => (
          <mesh key={i} position={[x, y, z]} scale={[1, 0.78, 1]}>
            <icosahedronGeometry args={[r, 0]} />
            <meshStandardMaterial color={tint === 0 ? LEAF_1 : LEAF_2} {...MAT} />
          </mesh>
        ))}
      </group>

      {/* Racines contreforts — ailettes évasées qui rejoignent le ventre du tronc */}
      {ROOTS.map((i) => {
        const a = (i / ROOTS.length) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, a, 0]}>
            <mesh position={[0.33, 0.17, 0]} rotation={[0, 0, 0.16]} scale={[1, 1, 0.42]}>
              <coneGeometry args={[0.15, 0.44, 5]} />
              <meshStandardMaterial color={BARK_DARK} {...MAT} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
