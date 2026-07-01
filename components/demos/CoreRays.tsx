"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type OrbState = "idle" | "thinking" | "speaking";

// Rayons fins qui partent du NOYAU vers la SURFACE → impression de structure.
// Composant DÉDIÉ. Directions aléatoires (asymétrique), longueurs inégales,
// tracé IRRÉGULIER (jitter par point → pas des traits parfaits) et opacité variable.
// ── Constantes réglables ──
const RAY_COUNT = 26;   // nb de rayons FIXES (générés une fois, ne bougent pas)
const PTS       = 2;    // 2 = traits DROITS (noyau → surface)
const R_START   = 0.5;  // départ (hors zone morte)
const R_MAX     = 2.05; // surface (coords locales)
const CURVE     = 0;    // 0 = pas de galbe
const JITTER    = 0;    // 0 = pas d'irrégularité (traits nets)
const OPACITY   = 0.55; // bien visibles

const randDir = () => {
  const phi = Math.acos(2 * Math.random() - 1), th = Math.random() * Math.PI * 2;
  return new THREE.Vector3(Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th));
};
const gauss = () => { const u = Math.random() || 1e-9, v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

export default function CoreRays({ state }: { state: OrbState }) {
  const matRef = useRef<THREE.LineBasicMaterial>(null);
  const tRef = useRef(0);

  const geo = useMemo(() => {
    const segs = RAY_COUNT * (PTS - 1);
    const pos = new Float32Array(segs * 2 * 3), col = new Float32Array(segs * 2 * 3);
    let o = 0;
    for (let r = 0; r < RAY_COUNT; r++) {
      const dir = randDir();
      const tmp = Math.abs(dir.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
      const p1 = new THREE.Vector3().crossVectors(dir, tmp).normalize();
      const p2 = new THREE.Vector3().crossVectors(dir, p1).normalize();
      const endR = 1.9 + Math.random() * 0.15; // tous atteignent (presque) la surface
      const bend = (Math.random() - 0.5) * 2 * CURVE, phase = Math.random() * Math.PI;
      const rayOp = 0.5 + Math.random() * 0.5; // certains rayons plus faibles
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < PTS; i++) {
        const f = i / (PTS - 1), rr = R_START + f * (endR - R_START);
        // galbe d'ensemble + jitter aléatoire par point (large vers la surface) → irrégulier
        pts.push(dir.clone().multiplyScalar(rr)
          .addScaledVector(p1, Math.sin(f * Math.PI + phase) * bend * rr + gauss() * JITTER * rr)
          .addScaledVector(p2, gauss() * JITTER * rr));
      }
      for (let i = 0; i < PTS - 1; i++) {
        // fade cœur→surface + petite variation de brillance par segment
        const n = 0.85 + Math.random() * 0.15;
        const ca = (1 - (i / (PTS - 1)) * 0.6) * rayOp * n, cb = (1 - ((i + 1) / (PTS - 1)) * 0.6) * rayOp * n;
        const a = pts[i], b = pts[i + 1];
        pos[o] = a.x; pos[o + 1] = a.y; pos[o + 2] = a.z; col[o] = 0.65 * ca; col[o + 1] = 0.9 * ca; col[o + 2] = ca; o += 3;
        pos[o] = b.x; pos[o + 1] = b.y; pos[o + 2] = b.z; col[o] = 0.65 * cb; col[o + 1] = 0.9 * cb; col[o + 2] = cb; o += 3;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return g;
  }, []);

  useFrame((_, dt) => {
    tRef.current += dt;
    const spd = state === "speaking" ? 1.8 : state === "thinking" ? 1.1 : 0.6;
    if (matRef.current) matRef.current.opacity = OPACITY * (0.7 + 0.3 * Math.sin(tRef.current * spd));
  });

  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial ref={matRef} vertexColors transparent opacity={OPACITY}
        blending={THREE.AdditiveBlending} depthWrite={false} />
    </lineSegments>
  );
}
