"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type OrbState = "idle" | "thinking" | "speaking";

// "Peau" d'énergie / champ magnétique à la SURFACE de l'orbe, PARTIEL et inégal
// (par plaques de tailles variées → jamais une sphère fermée). Composant dédié,
// fait de particules — n'affecte pas le nuage.
// ── Constantes réglables ──
const COUNT   = 3000;  // nb de particules de la peau
const PATCHES = 7;     // nb de plaques (partiel → coque entamée)
const SPREAD  = 0.55;  // taille angulaire moyenne des plaques
const R_MAX   = 2.05;  // surface (coords locales, comme NeuralField)
const BAND    = 0.13;  // épaisseur radiale de la peau (sensation de "membrane")
const OPACITY = 0.55;

const randDir = () => {
  const phi = Math.acos(2 * Math.random() - 1), th = Math.random() * Math.PI * 2;
  return new THREE.Vector3(Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th));
};
const gauss = () => { const u = Math.random() || 1e-9, v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

export default function SurfaceField({ state }: { state: OrbState }) {
  const matRef = useRef<THREE.PointsMaterial>(null);
  const tRef = useRef(0);

  const geo = useMemo(() => {
    // Plaques de tailles inégales → densité de peau irrégulière (naturel).
    const patches = Array.from({ length: PATCHES }, () => ({ c: randDir(), spread: SPREAD * (0.5 + Math.random()) }));
    const pos = new Float32Array(COUNT * 3), col = new Float32Array(COUNT * 3);
    const v = new THREE.Vector3(), j = new THREE.Vector3();
    for (let i = 0; i < COUNT; i++) {
      const p = patches[Math.floor(Math.random() * patches.length)];
      v.copy(p.c).addScaledVector(j.set(gauss(), gauss(), gauss()), p.spread).normalize();
      v.multiplyScalar(R_MAX - Math.random() * BAND); // fine bande sous la surface
      pos[i * 3] = v.x; pos[i * 3 + 1] = v.y; pos[i * 3 + 2] = v.z;
      const b = 0.55 + Math.random() * 0.45; // cyan → blanc
      col[i * 3] = 0.3 * b; col[i * 3 + 1] = 0.72 * b; col[i * 3 + 2] = b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return g;
  }, []);

  useFrame((_, dt) => {
    tRef.current += dt;
    const spd = state === "speaking" ? 1.8 : state === "thinking" ? 1.1 : 0.6;
    if (matRef.current) matRef.current.opacity = OPACITY * (0.8 + 0.2 * Math.sin(tRef.current * spd * 1.2));
  });

  return (
    <points geometry={geo}>
      <pointsMaterial ref={matRef} size={0.02} vertexColors sizeAttenuation transparent opacity={OPACITY}
        blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}
