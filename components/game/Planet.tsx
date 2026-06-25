"use client";

import { useMemo } from "react";
import * as THREE from "three";
import type { ThreeEvent } from "@react-three/fiber";
import { generateMoonTextures } from "./utils/moonTexture";

interface PlanetProps {
  onPointerDown: (e: ThreeEvent<PointerEvent>) => void;
}

const PLANET_RADIUS = 7;

// Cratères creusés dans la géométrie : direction sur la sphère, rayon angulaire,
// profondeur de la cuvette. Bien répartis pour éviter les chevauchements.
const CRATERS = [
  { dir: new THREE.Vector3(0.2, 0.9, 0.35), ang: 0.3, depth: 0.3 },
  { dir: new THREE.Vector3(-0.7, 0.3, 0.5), ang: 0.24, depth: 0.22 },
  { dir: new THREE.Vector3(0.6, 0.1, -0.75), ang: 0.34, depth: 0.34 },
  { dir: new THREE.Vector3(-0.3, -0.5, 0.8), ang: 0.2, depth: 0.18 },
  { dir: new THREE.Vector3(0.85, 0.45, 0.2), ang: 0.16, depth: 0.14 },
  { dir: new THREE.Vector3(-0.5, -0.6, -0.6), ang: 0.26, depth: 0.24 },
  { dir: new THREE.Vector3(0.1, -0.95, 0.12), ang: 0.18, depth: 0.16 },
].map((c) => ({ ...c, dir: c.dir.normalize() }));

// Profil radial : cuvette cosinus lisse (t<0.8) + très léger bourrelet (0.8..1)
function craterOffset(t: number, depth: number) {
  if (t >= 1) return 0;
  if (t < 0.8) {
    const k = t / 0.8;
    return -depth * (Math.cos(Math.PI * k) * 0.5 + 0.5); // -depth au centre → 0 au bord
  }
  const u = (t - 0.8) / 0.2;
  return depth * 0.12 * Math.sin(Math.PI * u); // bourrelet discret
}

export function Planet({ onPointerDown }: PlanetProps) {
  // Géométrie : bruit de surface + cratères (déplacement + couleurs de sommet)
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(PLANET_RADIUS, 128, 96);
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const v = new THREE.Vector3();
    const dir = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const len = v.length();
      dir.copy(v).divideScalar(len); // normale radiale unitaire

      let offset =
        Math.sin(v.x * 3.1) * 0.08 +
        Math.sin(v.y * 2.7 + 1.2) * 0.06 +
        Math.sin(v.z * 3.5 + 0.8) * 0.07;

      let shade = 1; // multiplicateur de luminosité (assombrit les cuvettes)
      for (const c of CRATERS) {
        const ang = Math.acos(THREE.MathUtils.clamp(dir.dot(c.dir), -1, 1));
        const t = ang / c.ang;
        if (t >= 1) continue;
        offset += craterOffset(t, c.depth);
        if (t < 0.8) {
          const bowl = Math.cos(Math.PI * (t / 0.8)) * 0.5 + 0.5; // 1 centre → 0 bord
          shade *= 1 - 0.5 * bowl; // intérieur jusqu'à -50%
        } else {
          const u = (t - 0.8) / 0.2;
          shade *= 1 + 0.1 * Math.sin(Math.PI * u); // bord légèrement éclairci
        }
      }

      v.multiplyScalar((len + offset) / len);
      pos.setXYZ(i, v.x, v.y, v.z);
      colors[i * 3] = colors[i * 3 + 1] = colors[i * 3 + 2] = shade;
    }

    pos.needsUpdate = true;
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals(); // normales lissées → cuvettes douces, plus de traits
    return geo;
  }, []);

  // Texture lunaire générée par canvas (une seule fois)
  const { map, roughnessMap } = useMemo(() => generateMoonTextures(), []);

  return (
    <mesh geometry={geometry} onPointerDown={onPointerDown}>
      <meshStandardMaterial
        map={map}
        roughnessMap={roughnessMap}
        vertexColors
        roughness={0.95}
        metalness={0}
      />
    </mesh>
  );
}
