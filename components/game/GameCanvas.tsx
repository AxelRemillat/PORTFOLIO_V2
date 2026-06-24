"use client";

import { useRef, useEffect, useCallback, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Robot } from "./Robot";
import { Portal } from "./Portal";

// ─── Ellipsoid helpers ────────────────────────────────────────────────────────
// Planet: sphereGeometry radius 7, scale Y 0.85 → semi-axes (7, 5.95, 7)

const A_XZ = 7;
const A_Y  = 7 * 0.85; // 5.95

// Module-level temps to avoid per-frame allocations
const _sn  = new THREE.Vector3(); // surface normal
const _sp  = new THREE.Vector3(); // surface position
const _dir = new THREE.Vector3(); // direction / input
const _ax  = new THREE.Vector3(); // xAxis for basis
const _az  = new THREE.Vector3(); // zAxis for basis
const _m4  = new THREE.Matrix4();

/** Project any point onto the ellipsoid surface (along the ray from origin). */
function ellipsoidProject(p: THREE.Vector3, out: THREE.Vector3): THREE.Vector3 {
  const t = 1 / Math.sqrt(
    (p.x * p.x) / (A_XZ * A_XZ) +
    (p.y * p.y) / (A_Y  * A_Y ) +
    (p.z * p.z) / (A_XZ * A_XZ),
  );
  return out.set(p.x * t, p.y * t, p.z * t);
}

/** Outward unit normal of the ellipsoid at surface point p. */
function ellipsoidNormal(p: THREE.Vector3, out: THREE.Vector3): THREE.Vector3 {
  return out.set(
    p.x / (A_XZ * A_XZ),
    p.y / (A_Y  * A_Y ),
    p.z / (A_XZ * A_XZ),
  ).normalize();
}

// ─── Helper ──────────────────────────────────────────────────────────────────

function planetSurfaceY(x: number, z: number): number {
  return Math.sqrt(Math.max(0, 49 - x * x - z * z)) * 0.85;
}

// ─── Static data ─────────────────────────────────────────────────────────────

const PORTALS = [
  { id: "rag",   position: [ 4, planetSurfaceY( 4, -4) + 0.3, -4] as [number,number,number], yRotation: -Math.PI / 4,      color: "#f97316", label: "CV Interactif RAG",  href: "/demos/rag"     },
  { id: "rise",  position: [-4, planetSurfaceY(-4, -4) + 0.3, -4] as [number,number,number], yRotation:  Math.PI / 4,      color: "#e2e8f0", label: "RISE",                href: "/projets/rise"  },
  { id: "seaco", position: [ 4, planetSurfaceY( 4,  4) + 0.3,  4] as [number,number,number], yRotation: -3 * Math.PI / 4,  color: "#60a5fa", label: "SEACO Pipeline",      href: "/projets/seaco" },
  { id: "n8n",   position: [-4, planetSurfaceY(-4,  4) + 0.3,  4] as [number,number,number], yRotation:  3 * Math.PI / 4,  color: "#a855f7", label: "Automatisations N8N", href: "/projets/n8n"   },
];

const SURFACE_Y     = 7 * 0.85;   // ≈ 5.95 — sommet de la sphère (centre à Y=0)
const SPEED         = 6;
const PORTAL_RADIUS = 1.5;
const MAP_BOUND     = 4.5;
const JUMP_HEIGHT   = 1.5;
const JUMP_DURATION = 0.6;

const PATH_MIDS: Record<string, [number, number, number]> = {
  rag:   [ 2, planetSurfaceY( 2, -2) + 0.15, -2],
  rise:  [-2, planetSurfaceY(-2, -2) + 0.15, -2],
  seaco: [ 2, planetSurfaceY( 2,  2) + 0.15,  2],
  n8n:   [-2, planetSurfaceY(-2,  2) + 0.15,  2],
};

const CRATERS: Array<{ pos: [number, number, number]; r: number }> = [
  { pos: [ 3.5, 4.77,  1.5], r: 0.45 },
  { pos: [-2.5, 5.12,  2.0], r: 0.35 },
  { pos: [ 1.0, 4.88, -3.5], r: 0.40 },
  { pos: [-3.0, 4.85, -2.0], r: 0.50 },
  { pos: [ 2.5, 4.72,  3.0], r: 0.45 },
  { pos: [-1.5, 5.02, -3.0], r: 0.40 },
];

// ─── FogSetup ────────────────────────────────────────────────────────────────

function FogSetup() {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.Fog("#020210", 35, 70);
    return () => { scene.fog = null; };
  }, [scene]);
  return null;
}

// ─── Starfield ───────────────────────────────────────────────────────────────

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
        <bufferAttribute attach="attributes-color"    args={[colors, 3]}    />
      </bufferGeometry>
      <pointsMaterial size={0.13} vertexColors transparent opacity={0.92} sizeAttenuation depthWrite={false} fog={false} />
    </points>
  );
}

// ─── Nebula ──────────────────────────────────────────────────────────────────

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
    refs.forEach((r, i) => {
      if (r.current) r.current.rotation.z = data[i].rotZ + t * data[i].spd;
    });
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

// ─── Rocket ──────────────────────────────────────────────────────────────────

function Rocket() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime * 0.04;
    const r = 34;
    groupRef.current.position.set(Math.cos(t) * r, 10 + Math.sin(t * 2) * 5, Math.sin(t) * r);
    groupRef.current.rotation.y = Math.atan2(-Math.sin(t), Math.cos(t));
  });

  const trailColors = ["#ff8800", "#ff8800", "#ffdd00", "#ffee88", "#ffffff"];

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.14, 0.65, 8]} />
        <meshStandardMaterial color="#d0d0d0" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.48]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.07, 0.28, 8]} />
        <meshStandardMaterial color="#ff3333" roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[ 0.18, 0, -0.18]}>
        <boxGeometry args={[0.22, 0.02, 0.2]} />
        <meshStandardMaterial color="#bb2222" roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[-0.18, 0, -0.18]}>
        <boxGeometry args={[0.22, 0.02, 0.2]} />
        <meshStandardMaterial color="#bb2222" roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.06, 0.2]}>
        <sphereGeometry args={[0.055, 6, 6]} />
        <meshBasicMaterial color="#88ccff" />
      </mesh>
      {trailColors.map((col, i) => (
        <mesh key={i} position={[0, 0, -0.38 - i * 0.14]}>
          <sphereGeometry args={[0.06 - i * 0.008, 4, 4]} />
          <meshBasicMaterial color={col} transparent opacity={0.9 - i * 0.17} fog={false} />
        </mesh>
      ))}
    </group>
  );
}

// ─── LaserBeams ──────────────────────────────────────────────────────────────

function LaserBeams() {
  const g0 = useRef<THREE.Group>(null);
  const g1 = useRef<THREE.Group>(null);
  const g2 = useRef<THREE.Group>(null);
  const g3 = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (g0.current) { const p = (t * 3.8)        % 120 - 60; g0.current.position.set(p,        7,  -36); }
    if (g1.current) { const p = (t * 2.9 + 40)   % 120 - 60; g1.current.position.set(-36,      3,    p); }
    if (g2.current) { const p = (t * 5.1 + 80)   % 120 - 60; g2.current.position.set(p * 0.8, 14, p * -0.4); }
    if (g3.current) { const p = (t * 4.3 + 20)   % 120 - 60; g3.current.position.set(-p * 0.6, -3, p * 0.9); }
  });

  return (
    <>
      <group ref={g0}><mesh><boxGeometry args={[5,   0.022, 0.022]} /><meshBasicMaterial color="#00ffee" transparent opacity={0.55} depthWrite={false} fog={false} /></mesh></group>
      <group ref={g1} rotation={[0, Math.PI / 2, 0]}><mesh><boxGeometry args={[4.5, 0.018, 0.018]} /><meshBasicMaterial color="#ff00ff" transparent opacity={0.50} depthWrite={false} fog={false} /></mesh></group>
      <group ref={g2} rotation={[0.08, 0.25, 0]}><mesh><boxGeometry args={[6,   0.028, 0.028]} /><meshBasicMaterial color="#88ff00" transparent opacity={0.52} depthWrite={false} fog={false} /></mesh></group>
      <group ref={g3} rotation={[0.12, -0.4, 0.05]}><mesh><boxGeometry args={[4,   0.020, 0.020]} /><meshBasicMaterial color="#ff8844" transparent opacity={0.48} depthWrite={false} fog={false} /></mesh></group>
    </>
  );
}

// ─── OrbitalObjects ──────────────────────────────────────────────────────────

function OrbitalObjects() {
  const gr0 = useRef<THREE.Group>(null);
  const gr1 = useRef<THREE.Group>(null);
  const gr2 = useRef<THREE.Group>(null);
  const gr3 = useRef<THREE.Group>(null);
  const gr4 = useRef<THREE.Group>(null);
  const gr5 = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Asteroid 1 — rayon 9, vitesse 0.3, inclinaison Y +1.5
    if (gr0.current) {
      gr0.current.position.set(9 * Math.cos(t * 0.3), 1.5, 9 * Math.sin(t * 0.3));
      gr0.current.rotation.y += 0.010;
      gr0.current.rotation.x += 0.004;
    }
    // Asteroid 2 — rayon 10.5, vitesse -0.2, inclinaison Y -1.0
    if (gr1.current) {
      gr1.current.position.set(10.5 * Math.cos(-t * 0.2 + Math.PI), -1.0, 10.5 * Math.sin(-t * 0.2 + Math.PI));
      gr1.current.rotation.y += 0.008;
    }
    // Satellite — rayon 8.5, vitesse 0.5, inclinaison Y +0.5
    if (gr2.current) {
      const a = t * 0.5 + Math.PI / 2;
      gr2.current.position.set(8.5 * Math.cos(a), 0.5, 8.5 * Math.sin(a));
      gr2.current.rotation.y = a + Math.PI / 2;
    }
    // Cristal — rayon 11, vitesse 0.15, inclinaison Y -2.0
    if (gr3.current) {
      gr3.current.position.set(11 * Math.cos(t * 0.15 + Math.PI * 1.5), -2.0, 11 * Math.sin(t * 0.15 + Math.PI * 1.5));
      gr3.current.rotation.y += 0.020;
      gr3.current.rotation.x += 0.012;
    }
    // Rocher — rayon 9.8, vitesse -0.4, inclinaison Y +2.5
    if (gr4.current) {
      gr4.current.position.set(9.8 * Math.cos(-t * 0.4 + Math.PI / 3), 2.5, 9.8 * Math.sin(-t * 0.4 + Math.PI / 3));
      gr4.current.rotation.x += 0.015;
      gr4.current.rotation.z += 0.007;
    }
    // Étoile filante — rayon 12, vitesse 0.8, inclinaison Y 0
    if (gr5.current) {
      const a5  = t * 0.8 + Math.PI * 0.7;
      const vx  = -12 * 0.8 * Math.sin(a5);
      const vz  =  12 * 0.8 * Math.cos(a5);
      gr5.current.position.set(12 * Math.cos(a5), 0, 12 * Math.sin(a5));
      gr5.current.rotation.set(Math.PI / 2, Math.atan2(vx, vz), 0);
    }
  });

  return (
    <>
      {/* Asteroid 1 */}
      <group ref={gr0}>
        <mesh>
          <icosahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial color="#8888aa" roughness={0.9} metalness={0.1} />
        </mesh>
      </group>

      {/* Asteroid 2 */}
      <group ref={gr1}>
        <mesh>
          <icosahedronGeometry args={[0.25, 0]} />
          <meshStandardMaterial color="#6a6a8a" roughness={0.95} metalness={0.05} />
        </mesh>
      </group>

      {/* Satellite */}
      <group ref={gr2}>
        <mesh>
          <boxGeometry args={[0.3, 0.2, 0.3]} />
          <meshStandardMaterial color="#c8a84b" emissive="#c8a84b" emissiveIntensity={0.15} roughness={0.5} metalness={0.7} />
        </mesh>
        <mesh position={[-0.45, 0, 0]}>
          <boxGeometry args={[0.5, 0.05, 0.2]} />
          <meshStandardMaterial color="#223366" emissive="#001144" emissiveIntensity={0.3} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[ 0.45, 0, 0]}>
          <boxGeometry args={[0.5, 0.05, 0.2]} />
          <meshStandardMaterial color="#223366" emissive="#001144" emissiveIntensity={0.3} metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Cristal énergie */}
      <group ref={gr3}>
        <mesh>
          <octahedronGeometry args={[0.35, 0]} />
          <meshStandardMaterial color="#004444" emissive="#00ffff" emissiveIntensity={0.8} roughness={0.1} metalness={0.9} transparent opacity={0.9} />
        </mesh>
      </group>

      {/* Rocher */}
      <group ref={gr4}>
        <mesh>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial color="#555566" roughness={0.95} metalness={0.05} />
        </mesh>
      </group>

      {/* Étoile filante */}
      <group ref={gr5}>
        <mesh>
          <coneGeometry args={[0.1, 0.6, 5]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.0} />
        </mesh>
        {/* Queue */}
        <mesh position={[0, -0.5, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.05, 0.35, 4]} />
          <meshStandardMaterial color="#88aaff" emissive="#88aaff" emissiveIntensity={0.8} transparent opacity={0.6} />
        </mesh>
      </group>
    </>
  );
}

// ─── PortalParticles ─────────────────────────────────────────────────────────

function PortalParticles({ position, color, count = 6 }: {
  position: [number, number, number];
  color: string;
  count?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const particles = useMemo(
    () => Array.from({ length: count }, (_, i) => ({
      radius: 0.85 + i * 0.12,
      baseY:  (i / count - 0.5) * 1.0,
      speed:  0.55 + i * 0.08,
      phase:  (i / count) * Math.PI * 2,
    })),
    [count],
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      const child = groupRef.current!.children[i];
      if (!child) return;
      const angle = t * p.speed + p.phase;
      child.position.set(
        Math.cos(angle) * p.radius,
        p.baseY + Math.sin(t * 1.1 + p.phase) * 0.15,
        Math.sin(angle) * p.radius,
      );
    });
  });

  return (
    <group ref={groupRef} position={position}>
      {particles.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.055, 5, 5]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

// ─── ClickIndicator ──────────────────────────────────────────────────────────

function ClickIndicator({ infoRef }: {
  infoRef: React.MutableRefObject<{ pos: THREE.Vector3; t: number } | null>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef  = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((_, delta) => {
    if (!meshRef.current || !matRef.current) return;
    const info = infoRef.current;
    if (!info) { meshRef.current.visible = false; return; }
    info.t += delta;
    if (info.t >= 0.5) { infoRef.current = null; meshRef.current.visible = false; return; }
    meshRef.current.visible = true;
    meshRef.current.position.set(info.pos.x, info.pos.y, info.pos.z);
    const p = info.t / 0.5;
    matRef.current.opacity = 1 - p;
    const s = 1 + p * 0.8;
    meshRef.current.scale.set(s, s, s);
  });

  return (
    <mesh ref={meshRef} visible={false} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.3, 0.04, 6, 24]} />
      <meshBasicMaterial ref={matRef} color="#88ccff" transparent opacity={0} />
    </mesh>
  );
}

// ─── PathCurve ───────────────────────────────────────────────────────────────

function PathCurve({ from, mid, to, color }: {
  from: [number, number, number];
  mid: [number, number, number];
  to:  [number, number, number];
  color: string;
}) {
  const tubeGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(from[0], from[1], from[2]),
      new THREE.Vector3(mid[0],  mid[1],  mid[2]),
      new THREE.Vector3(to[0],   to[1],   to[2]),
    ]);
    return new THREE.TubeGeometry(curve, 24, 0.04, 5, false);
  }, [from, mid, to]);

  useEffect(() => () => { tubeGeo.dispose(); }, [tubeGeo]);

  return (
    <mesh geometry={tubeGeo}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} transparent opacity={0.6} roughness={0.6} />
    </mesh>
  );
}

// ─── PlanetSurface ───────────────────────────────────────────────────────────

function PlanetSurface({ onSurfaceClick }: { onSurfaceClick: (p: THREE.Vector3) => void }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y  += 0.0003;
    groupRef.current.position.y   = Math.sin(state.clock.elapsedTime * 0.4) * 0.04;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Sphère principale */}
      <mesh
        scale={[1, 0.85, 1]}
        onPointerDown={(e) => { if (e.button !== 0) return; onSurfaceClick(e.point); }}
      >
        <sphereGeometry args={[7, 12, 10]} />
        <meshStandardMaterial
          color="#1e2a5e"
          emissive="#0a0f2e"
          emissiveIntensity={0.3}
          roughness={0.85}
          flatShading
        />
      </mesh>

      {/* Cratères décoratifs */}
      {CRATERS.map(({ pos, r }, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[r, 7, 7]} />
          <meshStandardMaterial color="#2a3a7e" roughness={0.9} flatShading />
        </mesh>
      ))}
    </group>
  );
}

// ─── Scene ───────────────────────────────────────────────────────────────────

function Scene({ onPortalEnter }: { onPortalEnter: (href: string) => void }) {
  const posRef        = useRef(new THREE.Vector3(0, SURFACE_Y, 0));
  const movingRef     = useRef(false);
  const rotRef        = useRef(0); // kept for compatibility
  const quatRef       = useRef(new THREE.Quaternion());
  // faceRef: robot facing direction in world space (always in the tangent plane)
  // Initially faces +Z (toward camera at z=16) — same as rotation.y = 0
  const faceRef       = useRef(new THREE.Vector3(0, 0, 1));
  const keysRef       = useRef(new Set<string>());
  const enteredRef    = useRef(false);
  const targetRef     = useRef<THREE.Vector3 | null>(null);
  const jumpRef       = useRef({ active: false, t: 0 });
  const clickIndicRef = useRef<{ pos: THREE.Vector3; t: number } | null>(null);

  const handleSurfaceClick = useCallback((point: THREE.Vector3) => {
    // Project click point onto ellipsoid surface and store as target
    const target = ellipsoidProject(point, new THREE.Vector3());
    targetRef.current     = target;
    clickIndicRef.current = { pos: new THREE.Vector3(point.x, point.y + 0.15, point.z), t: 0 };
  }, []);

  useEffect(() => {
    const BLOCK_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "]);
    const down = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (BLOCK_KEYS.has(e.key)) e.preventDefault();
      if (e.key === " " && !jumpRef.current.active) jumpRef.current = { active: true, t: 0 };
    };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup",   up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  useFrame((_, delta) => {
    if (enteredRef.current) return;

    const pos = posRef.current;

    // ── 1. Snap to ellipsoid surface (base position, ignoring jump) ──
    ellipsoidProject(pos, _sp);
    ellipsoidNormal(_sp, _sn);

    // ── 2. Jump — height offset along surface normal ──
    let jumpOffset = 0;
    if (jumpRef.current.active) {
      jumpRef.current.t += delta / JUMP_DURATION;
      if (jumpRef.current.t >= 1) {
        jumpRef.current = { active: false, t: 0 };
      } else {
        const jt = jumpRef.current.t;
        jumpOffset = JUMP_HEIGHT * 4 * jt * (1 - jt);
      }
    }

    // ── 3. ZQSD / arrow input → move in tangent plane ──
    const k = keysRef.current;
    let dx = 0, dz = 0;
    if (k.has("z") || k.has("Z") || k.has("ArrowUp"))    dz -= 1;
    if (k.has("s") || k.has("S") || k.has("ArrowDown"))   dz += 1;
    if (k.has("q") || k.has("Q") || k.has("ArrowLeft"))   dx -= 1;
    if (k.has("d") || k.has("D") || k.has("ArrowRight"))  dx += 1;

    const hasKey = dx !== 0 || dz !== 0;
    if (hasKey) targetRef.current = null;

    if (hasKey) {
      // World XZ input vector, projected onto the tangent plane at current surface point
      _dir.set(dx, 0, dz).normalize();
      _dir.addScaledVector(_sn, -_dir.dot(_sn));   // subtract normal component
      if (_dir.lengthSq() > 1e-8) {
        _dir.normalize();
        _sp.addScaledVector(_dir, SPEED * delta);
        ellipsoidProject(_sp, _sp);                 // re-project onto ellipsoid
        ellipsoidNormal(_sp, _sn);                  // refresh normal after move
        faceRef.current.copy(_dir);                 // update facing direction
      }
      movingRef.current = true;

    } else if (targetRef.current) {
      // Click-to-move: compute tangent direction toward target on sphere
      _dir.copy(targetRef.current).sub(_sp);
      const dist = _dir.length();
      if (dist < 0.12) {
        targetRef.current = null;
        movingRef.current = false;
      } else {
        _dir.addScaledVector(_sn, -_dir.dot(_sn)); // project onto tangent plane
        if (_dir.lengthSq() > 1e-8) {
          _dir.normalize();
          const step = Math.min(SPEED * delta, dist);
          _sp.addScaledVector(_dir, step);
          ellipsoidProject(_sp, _sp);
          ellipsoidNormal(_sp, _sn);
          faceRef.current.copy(_dir);
        }
        movingRef.current = true;
      }
    } else {
      movingRef.current = false;
    }

    // ── 4. Final world position = surface + jump along normal ──
    pos.copy(_sp).addScaledVector(_sn, jumpOffset);

    // ── 5. Orientation quaternion ──
    // Re-project faceRef onto current tangent plane (prevents drift over time)
    const face = faceRef.current;
    face.addScaledVector(_sn, -face.dot(_sn));
    if (face.lengthSq() < 1e-8) face.set(0, 0, 1);
    else face.normalize();

    // Build orthonormal basis aligned with surface:
    //   X = normal × faceDir   (right direction)
    //   Y = normal              (up = surface normal)
    //   Z = X × normal          (re-orthogonalized forward, = faceDir)
    // Robot eyes are at local +Z, so local +Z = facing direction in world space.
    _ax.crossVectors(_sn, face).normalize();
    _az.crossVectors(_ax, _sn).normalize();
    quatRef.current.setFromRotationMatrix(_m4.makeBasis(_ax, _sn, _az));

    // ── 6. Portal detection (unchanged) ──
    for (const portal of PORTALS) {
      const [px, , pz] = portal.position;
      const d = Math.sqrt((pos.x - px) ** 2 + (pos.z - pz) ** 2);
      if (d < PORTAL_RADIUS) { enteredRef.current = true; onPortalEnter(portal.href); break; }
    }
  });

  return (
    <>
      <FogSetup />
      <Starfield count={900} />
      <Nebula />
      <Rocket />
      <LaserBeams />

      {/* Éclairage */}
      <ambientLight intensity={1.4} />
      <directionalLight position={[-5, 14, -8]} intensity={1.8} color="#aaccff" />
      <pointLight position={[0, 12, 0]} intensity={2.2} color="#ffffff" distance={24} decay={1} />
      <pointLight position={[18, 10, -10]} intensity={1.2} color="#4466ff" distance={90} decay={1} />

      {/* Planète */}
      <PlanetSurface onSurfaceClick={handleSurfaceClick} />

      {/* Lune lointaine */}
      <mesh position={[20, 8, -25]}>
        <sphereGeometry args={[1.5, 8, 8]} />
        <meshStandardMaterial color="#e8d5a0" roughness={0.9} />
      </mesh>

      {/* Objets orbitaux */}
      <OrbitalObjects />

      {/* Chemins vers les portails */}
      {PORTALS.map((p) => (
        <PathCurve
          key={p.id}
          from={[0, SURFACE_Y + 0.05, 0]}
          mid={PATH_MIDS[p.id]}
          to={p.position}
          color={p.color}
        />
      ))}

      {/* Portails */}
      {PORTALS.map((portal) => (
        <Portal
          key={portal.id}
          position={portal.position}
          color={portal.color}
          label={portal.label}
          yRotation={portal.yRotation}
          tiltX={-0.3}
        />
      ))}

      {/* Particules orbitales par portail */}
      {PORTALS.map((portal) => (
        <PortalParticles key={portal.id + "-p"} position={portal.position} color={portal.color} count={6} />
      ))}

      {/* Indicateur clic */}
      <ClickIndicator infoRef={clickIndicRef} />

      {/* Joueur */}
      <Robot posRef={posRef} movingRef={movingRef} rotRef={rotRef} quatRef={quatRef} />
    </>
  );
}

// ─── Canvas export ───────────────────────────────────────────────────────────

export function GameCanvas({ onPortalEnter }: { onPortalEnter: (href: string) => void }) {
  return (
    <Canvas
      camera={{ position: [0, 12, 16], fov: 45 }}
      frameloop="always"
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%", background: "#020210" }}
      onCreated={({ camera }) => { camera.lookAt(0, 2, 0); }}
    >
      <Scene onPortalEnter={onPortalEnter} />
    </Canvas>
  );
}
