"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function FogSetup() {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.Fog("#020210", 35, 70);
    return () => { scene.fog = null; };
  }, [scene]);
  return null;
}

function Starfield({ count = 900 }: { count?: number }) {
  const geomRef = useRef<THREE.BufferGeometry>(null);
  const { positions, colors, phases, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors    = new Float32Array(count * 3);
    const phases    = new Float32Array(count);
    const speeds    = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 44 + Math.random() * 12;
      positions[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i*3+2] = r * Math.cos(phi);
      const b = 0.5 + 0.5 * Math.random();
      colors[i*3] = b; colors[i*3+1] = b; colors[i*3+2] = b;
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.4 + Math.random() * 1.6;
    }
    return { positions, colors, phases, speeds };
  }, [count]);

  useFrame((state) => {
    const geo = geomRef.current;
    if (!geo) return;
    const raw = geo.getAttribute("color");
    if (!(raw instanceof THREE.BufferAttribute)) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const b = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * speeds[i] + phases[i]));
      raw.setXYZ(i, b, b, b);
    }
    raw.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors,    3]} />
      </bufferGeometry>
      <pointsMaterial size={0.13} vertexColors transparent opacity={0.92} sizeAttenuation depthWrite={false} fog={false} />
    </points>
  );
}

function Nebula() {
  const ref0 = useRef<THREE.Mesh>(null);
  const ref1 = useRef<THREE.Mesh>(null);
  const ref2 = useRef<THREE.Mesh>(null);
  const refs = [ref0, ref1, ref2];

  const data = useMemo(() => [
    { x: -22, y:  6, z: -38, rotZ:  0.15, c1: "#4a0b8a", c2: "#0b1a6a", spd:  0.008 },
    { x:  18, y:  4, z: -36, rotZ: -0.20, c1: "#0a2a6a", c2: "#0a5a7a", spd: -0.006 },
    { x:  -4, y: -6, z: -40, rotZ:  0.10, c1: "#3a0b6a", c2: "#0b0b8a", spd:  0.005 },
  ].map(({ x, y, z, rotZ, c1, c2, spd }) => {
    const sz = 128;
    const cv = document.createElement("canvas");
    cv.width = sz; cv.height = sz;
    const ctx = cv.getContext("2d")!;
    const gr  = ctx.createRadialGradient(sz/2, sz/2, 0, sz/2, sz/2, sz/2);
    gr.addColorStop(0,   c1 + "cc");
    gr.addColorStop(0.5, c2 + "55");
    gr.addColorStop(1,   "transparent");
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, sz, sz);
    return { x, y, z, rotZ, spd, tex: new THREE.CanvasTexture(cv) };
  }), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    refs.forEach((r, i) => { if (r.current) r.current.rotation.z = data[i].rotZ + t * data[i].spd; });
  });

  return (
    <>
      {data.map(({ x, y, z, tex }, i) => (
        <mesh key={i} ref={refs[i]} position={[x, y, z]}>
          <planeGeometry args={[28, 28]} />
          <meshBasicMaterial map={tex} transparent opacity={0.38} depthWrite={false} blending={THREE.AdditiveBlending} fog={false} />
        </mesh>
      ))}
    </>
  );
}

export function Background() {
  return (
    <>
      <FogSetup />
      <Starfield count={900} />
      <Nebula />
    </>
  );
}
