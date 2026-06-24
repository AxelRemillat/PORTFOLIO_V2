"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const STAR_COUNT = 400;

function Stars() {
  const geomRef = useRef<THREE.BufferGeometry>(null);

  const { positions, colors, phases, speeds } = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    const col = new Float32Array(STAR_COUNT * 3);
    const ph  = new Float32Array(STAR_COUNT);
    const sp  = new Float32Array(STAR_COUNT);
    const palette = [
      [1.0, 1.0, 1.0],
      [0.7, 0.8, 1.0],
      [0.85, 0.75, 1.0],
      [0.6, 0.7, 1.0],
    ];
    for (let i = 0; i < STAR_COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
      const c = palette[Math.floor(Math.random() * palette.length)];
      const b = 0.5 + 0.5 * Math.random();
      col[i * 3] = c[0] * b; col[i * 3 + 1] = c[1] * b; col[i * 3 + 2] = c[2] * b;
      ph[i] = Math.random() * Math.PI * 2;
      sp[i] = 0.3 + Math.random() * 1.2;
    }
    return { positions: pos, colors: col, phases: ph, speeds: sp };
  }, []);

  useFrame((state) => {
    const geo = geomRef.current;
    if (!geo) return;
    const col = geo.getAttribute("color");
    if (!(col instanceof THREE.BufferAttribute)) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < STAR_COUNT; i++) {
      const b = 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(t * speeds[i] + phases[i]));
      col.setXYZ(i, colors[i * 3] * b, colors[i * 3 + 1] * b, colors[i * 3 + 2] * b);
    }
    col.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors,    3]} />
      </bufferGeometry>
      <pointsMaterial size={0.14} vertexColors transparent opacity={0.9} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function NebulaClouds() {
  const r0 = useRef<THREE.Mesh>(null);
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (r0.current) { r0.current.rotation.x += 0.00015; r0.current.rotation.y += 0.0001; }
    if (r1.current) { r1.current.rotation.y += 0.00012; r1.current.rotation.z += 0.00018; }
    if (r2.current) { r2.current.rotation.x += 0.0002;  r2.current.rotation.z += 0.00009; }
  });

  return (
    <>
      <mesh ref={r0} position={[-8, 4, -20]}>
        <sphereGeometry args={[18, 8, 8]} />
        <meshBasicMaterial color="#4433aa" transparent opacity={0.055} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      <mesh ref={r1} position={[10, -6, -25]}>
        <sphereGeometry args={[15, 8, 8]} />
        <meshBasicMaterial color="#aa3366" transparent opacity={0.045} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      <mesh ref={r2} position={[0, 8, -18]}>
        <sphereGeometry args={[20, 8, 8]} />
        <meshBasicMaterial color="#2244bb" transparent opacity={0.06} side={THREE.BackSide} depthWrite={false} />
      </mesh>
    </>
  );
}

type ShootingStarState = {
  active: boolean;
  pos: THREE.Vector3;
  dir: THREE.Vector3;
  speed: number;
  life: number;
  maxLife: number;
};

function ShootingStars() {
  const groupRefs = useRef<Array<THREE.Group | null>>(Array(18).fill(null));
  const states = useRef<ShootingStarState[]>(
    Array.from({ length: 18 }, () => ({
      active: false,
      pos: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      speed: 0,
      life: 0,
      maxLife: 0,
    }))
  );
  const timer = useRef(0);
  const nextSpawn = useRef(1.5 + Math.random() * 2);

  const spawn = (i: number) => {
    const s = states.current[i];
    s.pos.set(
      (Math.random() - 0.5) * 60,
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 10,
    );
    const angle = Math.random() * Math.PI * 2;
    s.dir.set(Math.cos(angle), Math.sin(angle) * 0.4, 0).normalize();
    s.speed = 2.5 + Math.random() * 3;
    s.maxLife = 8 + Math.random() * 4;
    s.life = 0;
    s.active = true;
    const gr = groupRefs.current[i];
    if (gr) gr.visible = true;
  };

  useFrame((_, delta) => {
    timer.current += delta;
    if (timer.current >= nextSpawn.current) {
      timer.current = 0;
      nextSpawn.current = 2 + Math.random() * 4;
      const free = states.current.findIndex((s) => !s.active);
      if (free !== -1) spawn(free);
    }
    for (let i = 0; i < 18; i++) {
      const s  = states.current[i];
      const gr = groupRefs.current[i];
      if (!s.active) { if (gr) gr.visible = false; continue; }
      s.life += delta;
      if (s.life >= s.maxLife) { s.active = false; if (gr) gr.visible = false; continue; }
      s.pos.addScaledVector(s.dir, s.speed * delta);
      if (gr) {
        gr.position.copy(s.pos);
        const angle = Math.atan2(s.dir.y, s.dir.x);
        gr.rotation.z = angle;
      }
    }
  });

  return (
    <>
      {Array.from({ length: 18 }, (_, i) => (
        <group
          key={i}
          ref={(el) => { groupRefs.current[i] = el; }}
          visible={false}
        >
          <mesh>
            <boxGeometry args={[1.4, 0.018, 0.018]} />
            <meshBasicMaterial color="#aabbff" transparent opacity={0.3} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function Scene() {
  return (
    <>
      <Stars />
      <NebulaClouds />
      <ShootingStars />
    </>
  );
}

export default function NebulaBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 75 }}
      frameloop="always"
      gl={{ antialias: false, alpha: true }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      <Scene />
    </Canvas>
  );
}
