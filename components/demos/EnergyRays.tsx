"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type OrbState = "idle" | "thinking" | "speaking";
const N_RAYS = 18;

type Ray = { dir: THREE.Vector3; startR: number; endR: number; birth: number; life: number };

function makeRay(now: number): Ray {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  return {
    dir: new THREE.Vector3(Math.sin(phi) * Math.cos(theta), Math.sin(phi) * Math.sin(theta), Math.cos(phi)),
    startR: 0.2 + Math.random() * 0.1,
    endR: 0.6 + Math.random() * 0.9, // variable : courts et longs
    birth: now,
    life: 0.3 + Math.random() * 0.7,
  };
}

export default function EnergyRays({ state }: { state: OrbState }) {
  const geoRef = useRef<THREE.BufferGeometry>(null);
  const timeRef = useRef(0);

  const { posBuf, colBuf, rays } = useMemo(
    () => ({
      posBuf: new Float32Array(N_RAYS * 2 * 3),
      colBuf: new Float32Array(N_RAYS * 2 * 3),
      rays: Array.from({ length: N_RAYS }, (_, i) => makeRay(-i * 0.15)),
    }),
    [],
  );

  useFrame((_, delta) => {
    timeRef.current += delta;
    const now = timeRef.current;
    const spd = state === "speaking" ? 1.8 : state === "thinking" ? 1.2 : 0.7;

    for (let i = 0; i < N_RAYS; i++) {
      const ray = rays[i];
      const age = (now * spd - ray.birth) / ray.life;
      if (age >= 1) { rays[i] = makeRay(now * spd); continue; }

      const op = age < 0.3 ? age / 0.3 : age > 0.7 ? (1 - age) / 0.3 : 1.0;

      const o = i * 2 * 3;
      posBuf[o] = ray.dir.x * ray.startR;
      posBuf[o + 1] = ray.dir.y * ray.startR;
      posBuf[o + 2] = ray.dir.z * ray.startR;
      posBuf[o + 3] = ray.dir.x * ray.endR;
      posBuf[o + 4] = ray.dir.y * ray.endR;
      posBuf[o + 5] = ray.dir.z * ray.endR;

      // Blanc à la base → cyan transparent à la pointe
      colBuf[o] = op; colBuf[o + 1] = op; colBuf[o + 2] = op;
      colBuf[o + 3] = 0; colBuf[o + 4] = op * 0.6; colBuf[o + 5] = op * 0.9;
    }

    const geo = geoRef.current;
    if (!geo) return;
    if (!geo.attributes.position) {
      geo.setAttribute("position", new THREE.BufferAttribute(posBuf, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(colBuf, 3));
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
  });

  return (
    <lineSegments>
      <bufferGeometry ref={geoRef} />
      <lineBasicMaterial vertexColors blending={THREE.AdditiveBlending} depthWrite={false} transparent />
    </lineSegments>
  );
}
