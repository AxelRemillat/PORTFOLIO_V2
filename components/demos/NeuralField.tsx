"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type OrbState = "idle" | "thinking" | "speaking";
const SPHERE_R = 1.8;
// Populations : A=micro fond, B=clusters moyens, C=membrane+nœuds brillants
const NA = 11000, NB = 3500, NC = 600;
const N = NA + NB + NC;

// 6 centres de clusters
const CLUSTERS = Array.from({ length: 6 }, () => {
  const r = 0.3 + Math.random() * 0.9;
  const t = Math.random() * Math.PI * 2;
  const p = Math.acos(2 * Math.random() - 1);
  return new THREE.Vector3(r * Math.sin(p) * Math.cos(t), r * Math.sin(p) * Math.sin(t), r * Math.cos(p));
});

export default function NeuralField({ state }: { state: OrbState }) {
  const { positions, colors, sizes, twinkle } = useMemo(() => {
    const positions = new Float32Array(N * 3);
    const colors = new Float32Array(N * 3);
    const sizes = new Float32Array(N);
    const twinkle = new Float32Array(N);

    let idx = 0;

    // A — micro-particules de fond
    for (let i = 0; i < NA; i++, idx++) {
      const r = Math.pow(Math.random(), 0.45) * SPHERE_R;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[idx * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[idx * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[idx * 3 + 2] = r * Math.cos(phi);
      const t = r / SPHERE_R;
      const roll = Math.random();
      if (roll < 0.05) {
        colors[idx * 3] = 0.5; colors[idx * 3 + 1] = 0.2; colors[idx * 3 + 2] = 1.0; // violet
      } else if (roll < 0.12) {
        colors[idx * 3] = 0.9; colors[idx * 3 + 1] = 0.95; colors[idx * 3 + 2] = 1.0; // blanc-cyan
      } else {
        colors[idx * 3] = 0.1 + (1 - t) * 0.25; colors[idx * 3 + 1] = 0.4 + (1 - t) * 0.4; colors[idx * 3 + 2] = 0.9 + (1 - t) * 0.1;
      }
      const depthBoost = 1.0 + Math.max(-0.25, Math.min(0.4, (positions[idx * 3 + 2] / SPHERE_R) * 0.35));
      sizes[idx] = (0.004 + Math.random() * 0.008) * depthBoost;
      twinkle[idx] = Math.random() * Math.PI * 2;
    }

    // B — nœuds de cluster
    for (let i = 0; i < NB; i++, idx++) {
      const cl = CLUSTERS[i % CLUSTERS.length];
      const offset = 0.25 + Math.random() * 0.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      let x = cl.x + offset * Math.sin(phi) * Math.cos(theta);
      let y = cl.y + offset * Math.sin(phi) * Math.sin(theta);
      let z = cl.z + offset * Math.cos(phi);
      const d = Math.sqrt(x * x + y * y + z * z);
      if (d > SPHERE_R) { x *= SPHERE_R / d; y *= SPHERE_R / d; z *= SPHERE_R / d; }
      positions[idx * 3] = x; positions[idx * 3 + 1] = y; positions[idx * 3 + 2] = z;
      colors[idx * 3] = 0.4; colors[idx * 3 + 1] = 0.85; colors[idx * 3 + 2] = 1.0; // cyan cluster
      const depthBoost = 1.0 + Math.max(-0.2, Math.min(0.5, (z / SPHERE_R) * 0.4));
      sizes[idx] = (0.014 + Math.random() * 0.022) * depthBoost;
      twinkle[idx] = Math.random() * Math.PI * 2;
    }

    // C — membrane externe + gros nœuds brillants
    for (let i = 0; i < NC; i++, idx++) {
      const onSurface = i < 450;
      const r = onSurface ? SPHERE_R * (0.91 + Math.random() * 0.09) : 0.3 + Math.random() * 1.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[idx * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[idx * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[idx * 3 + 2] = r * Math.cos(phi);
      colors[idx * 3] = 0.9; colors[idx * 3 + 1] = 0.95; colors[idx * 3 + 2] = 1.0;
      sizes[idx] = onSurface ? 0.006 + Math.random() * 0.01 : 0.055 + Math.random() * 0.07;
      twinkle[idx] = Math.random() * Math.PI * 2;
    }

    return { positions, colors, sizes, twinkle };
  }, []);

  const groupRef = useRef<THREE.Group>(null);
  const geoRef = useRef<THREE.BufferGeometry>(null);
  const posRef = useRef(positions.slice());
  const szRef = useRef(sizes.slice());
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;
    const spd = state === "speaking" ? 1.8 : state === "thinking" ? 1.1 : 0.5;
    const pos = posRef.current, sz = szRef.current;

    for (let i = 0; i < N; i++) {
      const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2, seed = i * 0.017;
      pos[ix] += Math.sin(t * spd * 0.3 + seed * 7.3) * 0.0005;
      pos[iy] += Math.cos(t * spd * 0.25 + seed * 5.1) * 0.0005;
      pos[iz] += Math.sin(t * spd * 0.35 + seed * 9.7) * 0.0005;
      pos[ix] += (positions[ix] - pos[ix]) * 0.008;
      pos[iy] += (positions[iy] - pos[iy]) * 0.008;
      pos[iz] += (positions[iz] - pos[iz]) * 0.008;
      const d = Math.sqrt(pos[ix] ** 2 + pos[iy] ** 2 + pos[iz] ** 2);
      if (d > SPHERE_R) { const sc = (SPHERE_R * 0.97) / d; pos[ix] *= sc; pos[iy] *= sc; pos[iz] *= sc; }
      const tw = 0.45 + 0.55 * Math.abs(Math.sin(t * (1.2 + (i % 7) * 0.25) + twinkle[i]));
      sz[i] = sizes[i] * tw;
    }

    const geo = geoRef.current;
    if (geo) {
      geo.attributes.position.needsUpdate = true;
      geo.attributes.size.needsUpdate = true;
    }
    if (groupRef.current) groupRef.current.scale.setScalar(0.97 + Math.sin(t * 0.32) * 0.05);
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry ref={geoRef}>
          <bufferAttribute attach="attributes-position" args={[posRef.current, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          <bufferAttribute attach="attributes-size" args={[szRef.current, 1]} />
        </bufferGeometry>
        <pointsMaterial size={0.015} vertexColors sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={0.92} />
      </points>
      {/* Membrane externe : brouillard de surface */}
      <mesh>
        <sphereGeometry args={[SPHERE_R * 1.0, 48, 48]} />
        <meshBasicMaterial color="#001840" transparent opacity={0.07} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}
