"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const STAR_COUNT     = 700;
const POOL_SIZE      = 4;
const ASTEROID_COLORS = ["#3a3a5c", "#4a4a6a", "#2a2a4a", "#5a4a6a"];

// ─── Stars ───────────────────────────────────────────────────────────────────

function Stars() {
  const groupRef = useRef<THREE.Group>(null);
  const geomRef  = useRef<THREE.BufferGeometry>(null);

  const { positions, colors, phases, speeds } = useMemo(() => {
    const pos    = new Float32Array(STAR_COUNT * 3);
    const col    = new Float32Array(STAR_COUNT * 3);
    const ph     = new Float32Array(STAR_COUNT);
    const sp     = new Float32Array(STAR_COUNT);
    for (let i = 0; i < STAR_COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
      const b = 0.4 + 0.6 * Math.random();
      col[i * 3] = b; col[i * 3 + 1] = b; col[i * 3 + 2] = b;
      ph[i] = Math.random() * Math.PI * 2;
      sp[i] = 0.5 + Math.random() * 2.0;
    }
    return { positions: pos, colors: col, phases: ph, speeds: sp };
  }, []);

  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y += 0.00005;
    const geo = geomRef.current;
    if (!geo) return;
    const col = geo.getAttribute("color");
    if (!(col instanceof THREE.BufferAttribute)) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < STAR_COUNT; i++) {
      const b = 0.15 + 0.85 * (0.5 + 0.5 * Math.sin(t * speeds[i] + phases[i]));
      col.setXYZ(i, b, b, b);
    }
    col.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry ref={geomRef}>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color"    args={[colors,    3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.9}
          alphaTest={0.01}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}

// ─── AsteroidPool ─────────────────────────────────────────────────────────────

type AsteroidSlot = {
  active: boolean;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  velNorm: THREE.Vector3;
  rotX: number;
  rotZ: number;
  rotSpeedX: number;
  rotSpeedZ: number;
  depth: number;
};

function AsteroidPool() {
  const gr0 = useRef<THREE.Group>(null);
  const gr1 = useRef<THREE.Group>(null);
  const gr2 = useRef<THREE.Group>(null);
  const gr3 = useRef<THREE.Group>(null);
  const groupRefs = [gr0, gr1, gr2, gr3];

  const trailRefs = useRef<Array<THREE.Mesh | null>>(Array(POOL_SIZE * 2).fill(null));

  const poolProps = useMemo(
    () =>
      Array.from({ length: POOL_SIZE }, () => ({
        radius: 0.3 + Math.random() * 0.9,
        color: ASTEROID_COLORS[Math.floor(Math.random() * ASTEROID_COLORS.length)],
      })),
    []
  );

  const slotsRef = useRef<AsteroidSlot[]>(
    Array.from({ length: POOL_SIZE }, () => ({
      active:     false,
      pos:        new THREE.Vector3(),
      vel:        new THREE.Vector3(),
      velNorm:    new THREE.Vector3(),
      rotX:       0,
      rotZ:       0,
      rotSpeedX:  0.01,
      rotSpeedZ:  0.01,
      depth:      0,
    }))
  );

  const timer     = useRef(0);
  const nextSpawn = useRef(1 + Math.random() * 2);

  const spawnAt = (i: number) => {
    const s     = slotsRef.current[i];
    const edge  = Math.floor(Math.random() * 4);
    const depth = (Math.random() - 0.5) * 6;
    const speed = 2.5 + Math.random() * 3.5;
    let vx = 0, vy = 0;

    if (edge === 0) {
      s.pos.set(-25, (Math.random() - 0.5) * 16, depth);
      vx = speed; vy = (Math.random() - 0.5) * 2;
    } else if (edge === 1) {
      s.pos.set(25, (Math.random() - 0.5) * 16, depth);
      vx = -speed; vy = (Math.random() - 0.5) * 2;
    } else if (edge === 2) {
      s.pos.set((Math.random() - 0.5) * 30, 15, depth);
      vx = (Math.random() - 0.5) * 2; vy = -speed;
    } else {
      s.pos.set((Math.random() - 0.5) * 30, -15, depth);
      vx = (Math.random() - 0.5) * 2; vy = speed;
    }

    s.vel.set(vx, vy, 0);
    s.velNorm.set(vx, vy, 0).normalize();
    s.rotX = 0;
    s.rotZ = 0;
    s.rotSpeedX = (0.005 + Math.random() * 0.015) * (Math.random() < 0.5 ? 1 : -1);
    s.rotSpeedZ = (0.005 + Math.random() * 0.015) * (Math.random() < 0.5 ? 1 : -1);
    s.depth = depth;
    s.active = true;

    const gr = groupRefs[i].current;
    if (gr) { gr.position.copy(s.pos); gr.visible = true; }
  };

  useFrame((_, delta) => {
    timer.current += delta;
    if (timer.current >= nextSpawn.current) {
      timer.current     = 0;
      nextSpawn.current = 3 + Math.random() * 5;
      const free = slotsRef.current.findIndex((s) => !s.active);
      if (free !== -1) spawnAt(free);
    }

    for (let i = 0; i < POOL_SIZE; i++) {
      const s  = slotsRef.current[i];
      const gr = groupRefs[i].current;

      if (!s.active) {
        if (gr) gr.visible = false;
        for (let t = 0; t < 2; t++) {
          const tm = trailRefs.current[i * 2 + t];
          if (tm) tm.visible = false;
        }
        continue;
      }
      if (!gr) continue;

      s.pos.addScaledVector(s.vel, delta);
      gr.position.copy(s.pos);
      s.rotX += s.rotSpeedX;
      s.rotZ += s.rotSpeedZ;
      gr.rotation.set(s.rotX, 0, s.rotZ);

      if (Math.abs(s.pos.x) > 32 || Math.abs(s.pos.y) > 22) {
        s.active = false;
        gr.visible = false;
        for (let t = 0; t < 2; t++) {
          const tm = trailRefs.current[i * 2 + t];
          if (tm) tm.visible = false;
        }
        continue;
      }

      // Motion blur trail — only for close asteroids (depth > 1)
      const isClose = s.depth > 1;
      for (let t = 0; t < 2; t++) {
        const tm = trailRefs.current[i * 2 + t];
        if (!tm) continue;
        if (!isClose) { tm.visible = false; continue; }
        const off = -(t + 1) * 0.45;
        tm.position.set(
          s.pos.x + s.velNorm.x * off,
          s.pos.y + s.velNorm.y * off,
          s.pos.z
        );
        tm.rotation.set(s.rotX, 0, s.rotZ);
        tm.visible = true;
      }
    }
  });

  return (
    <>
      {Array.from({ length: POOL_SIZE }, (_, i) => (
        <group key={i} ref={groupRefs[i]} visible={false}>
          <mesh>
            <icosahedronGeometry args={[poolProps[i].radius, 0]} />
            <meshStandardMaterial
              color={poolProps[i].color}
              emissive={poolProps[i].color}
              emissiveIntensity={0.15}
              roughness={0.9}
            />
          </mesh>
        </group>
      ))}

      {Array.from({ length: POOL_SIZE * 2 }, (_, i) => {
        const slot = Math.floor(i / 2);
        const ti   = i % 2;
        const trailRadius = poolProps[slot].radius * (ti === 0 ? 0.65 : 0.45);
        return (
          <mesh
            key={`trail-${i}`}
            ref={(el) => { trailRefs.current[i] = el; }}
            visible={false}
          >
            <icosahedronGeometry args={[trailRadius, 0]} />
            <meshStandardMaterial
              color={poolProps[slot].color}
              transparent
              opacity={ti === 0 ? 0.28 : 0.10}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </>
  );
}

// ─── Scene ───────────────────────────────────────────────────────────────────

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 5]} intensity={1.5} color="#4466ff" />
      <Stars />
      <AsteroidPool />
    </>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export default function SpaceBackground() {
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
