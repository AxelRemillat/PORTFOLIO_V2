"use client";

import { useRef, useEffect, useCallback, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Robot } from "./Robot";
import { Portal } from "./Portal";

// ─── Sphere helpers ───────────────────────────────────────────────────────────
// Planet: perfect sphere radius 7. A_XZ = A_Y = 7.
// ellipsoidProject / ellipsoidNormal work for any ellipsoid; with equal axes
// they degenerate to simple normalize-to-radius helpers for a sphere.

const A_XZ = 7;
const A_Y  = 7;       // was 7 * 0.85 — now a perfect sphere

// Movement temps (used in Scene useFrame)
const _sn  = new THREE.Vector3(); // surface normal
const _sp  = new THREE.Vector3(); // surface position
const _dir = new THREE.Vector3(); // direction / input
const _ax  = new THREE.Vector3(); // xAxis for basis
const _az  = new THREE.Vector3(); // zAxis for basis
const _m4  = new THREE.Matrix4();

// Camera constants
const CAM_BACK      = 10.0; // units behind robot (gives room to see portals/asteroids)
const CAM_HEIGHT    =  6.0; // units above robot along surface normal
const CAM_LERP      =  0.05; // position smooth factor per frame
const CAM_FACE_LERP =  0.025; // how fast camera direction follows robot facing (low = no sudden pivots)

// Camera temps (independent from movement temps)
const _cn  = new THREE.Vector3();    // camera: surface normal at robot
const _cd  = new THREE.Vector3();    // camera: desired world position
const _m4c = new THREE.Matrix4();    // camera: lookAt rotation matrix

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

// Compute portal world-space position from a pre-normalized surface direction vector.
// Portal center = dir × (planetRadius + portalOffset) = dir × 7.9
function dirToPortalPos(nx: number, ny: number, nz: number): [number, number, number] {
  const r = A_XZ + 0.9; // 7 + portalOffset(0.9) = 7.9
  return [nx * r, ny * r, nz * r];
}

// ─── Static data ─────────────────────────────────────────────────────────────

const PORTALS = [
  { id: "rag",   position: dirToPortalPos( 0.62,  0.55,  0.56), color: "#FF8C00", label: "CV Interactif RAG",  href: "/demos/rag"     },
  { id: "rise",  position: dirToPortalPos(-0.71,  0.38, -0.59), color: "#FFFFFF", label: "RISE",                href: "/projets/rise"  },
  { id: "seaco", position: dirToPortalPos(-0.48, -0.52,  0.71), color: "#00BFFF", label: "SEACO Pipeline",      href: "/projets/seaco" },
  { id: "n8n",   position: dirToPortalPos( 0.35, -0.78, -0.52), color: "#CC44FF", label: "Automatisations N8N", href: "/projets/n8n"   },
  { id: "music", position: dirToPortalPos( 0.80,  0.42, -0.43), color: "#FFD700", label: "Planète qui Chante",  href: "/projets/music" },
];

const SURFACE_Y     = 7;           // sommet de la sphère parfaite (rayon 7)
const SPEED         = 6;
// Detection radius: portal center is 0.9 units above surface along normal.
// With 1.2, robot triggers when within ~0.8 units horizontally = the full ring opening.
const PORTAL_RADIUS = 1.2;
const JUMP_HEIGHT   = 1.5;
const JUMP_DURATION = 0.6;
const SPAWN_COOLDOWN = 2.0;       // secondes d'immunité après apparition


// ─── Decoration palette ──────────────────────────────────────────────────────

const ROCK_COLORS  = ["#4a4a5a", "#5a5a6a", "#6a6070", "#3a3a4a"] as const;
const GRASS_COLORS = ["#1a3d0c", "#2d5a1b", "#3a6b22", "#1e4a12", "#0f2a08"] as const;
const BUSH_COLORS  = ["#1a3d0c", "#1e4a12", "#243d12", "#0d2607"] as const;

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

// ─── PlanetSurface ───────────────────────────────────────────────────────────

function PlanetSurface({ onSurfaceClick }: { onSurfaceClick: (p: THREE.Vector3) => void }) {
  const groupRef = useRef<THREE.Group>(null);

  // Rocks and grass generated once with a deterministic seeded hash.
  // Positions are computed per-index so they never shift between renders.
  const { rocks, grasses, bushes } = useMemo(() => {
    const h = (n: number) => Math.abs(Math.sin(n * 127.1) * 43758.5453) % 1;
    const localUp = new THREE.Vector3(0, 1, 0);

    function tooClose(x: number, y: number, z: number): boolean {
      for (const p of PORTALS) {
        const [px, py, pz] = p.position;
        if ((x - px) ** 2 + (y - py) ** 2 + (z - pz) ** 2 < 1.44) return true; // 1.2² = 1.44
      }
      return false;
    }

    function spherePt(seed: number, radius: number) {
      const theta = h(seed * 13 + 0) * Math.PI * 2;
      const phi   = Math.acos(2 * h(seed * 13 + 1) - 1);
      const nx = Math.sin(phi) * Math.cos(theta);
      const ny = Math.cos(phi);
      const nz = Math.sin(phi) * Math.sin(theta);
      return { x: nx * radius, y: ny * radius, z: nz * radius, nx, ny, nz };
    }

    // ── Rocks ─────────────────────────────────────────────────────────────────
    type Rock = {
      pos:   [number, number, number];
      rx: number; ry: number; rz: number;
      scale: number;
      color: string;
      geo:   "dodec" | "ico";
    };
    const rocks: Rock[] = [];
    let ri = 0;
    while (rocks.length < 30 && ri < 300) {
      const { x, y, z } = spherePt(ri, 7.05);
      if (!tooClose(x, y, z)) {
        rocks.push({
          pos:   [x, y, z],
          rx:    h(ri * 13 + 2) * Math.PI * 2,
          ry:    h(ri * 13 + 3) * Math.PI * 2,
          rz:    h(ri * 13 + 4) * Math.PI * 2,
          scale: 0.15 + h(ri * 13 + 5) * 0.55,
          color: ROCK_COLORS[Math.floor(h(ri * 13 + 6) * ROCK_COLORS.length)],
          geo:   h(ri * 13 + 7) > 0.5 ? "dodec" : "ico",
        });
      }
      ri++;
    }

    // ── Grass tufts (cone-based) ───────────────────────────────────────────────
    type Cone  = { ox: number; oz: number; tilt: number; tiltDir: number; height: number; colorIdx: number };
    type Grass = { pos: [number, number, number]; quat: THREE.Quaternion; scale: number; cones: Cone[] };
    const grasses: Grass[] = [];
    let gi = 0;
    while (grasses.length < 55 && gi < 500) {
      const seed = gi + 500;
      const { x, y, z, nx, ny, nz } = spherePt(seed, 7.03);
      if (!tooClose(x, y, z)) {
        const quat   = new THREE.Quaternion().setFromUnitVectors(localUp, new THREE.Vector3(nx, ny, nz));
        const cCount = 5 + Math.floor(h(seed * 13 + 8) * 4); // 5–8 cones per tuft
        const cones  = Array.from({ length: cCount }, (_, c) => ({
          ox:       (h(seed * 13 + 10 + c * 5) - 0.5) * 0.18,
          oz:       (h(seed * 13 + 11 + c * 5) - 0.5) * 0.18,
          tilt:     h(seed * 13 + 12 + c * 5) * 0.3,
          tiltDir:  h(seed * 13 + 13 + c * 5) * Math.PI * 2,
          height:   0.3 + h(seed * 13 + 14 + c * 5) * 0.4, // 0.3–0.7
          colorIdx: Math.floor(h(seed * 13 + 15 + c * 5) * GRASS_COLORS.length),
        }));
        grasses.push({ pos: [x, y, z], quat, scale: 1.5 + h(seed * 13 + 9) * 3.0, cones });
      }
      gi++;
    }

    // ── Bushes ────────────────────────────────────────────────────────────────
    type Cluster = { ox: number; oy: number; oz: number; r: number; colorIdx: number };
    type Bush    = { pos: [number, number, number]; quat: THREE.Quaternion; scale: number; clusters: Cluster[] };
    const bushes: Bush[] = [];
    let bi = 0;
    while (bushes.length < 10 && bi < 200) {
      const seed = bi + 1000;
      const { x, y, z, nx, ny, nz } = spherePt(seed, 7.06);
      if (!tooClose(x, y, z)) {
        const quat    = new THREE.Quaternion().setFromUnitVectors(localUp, new THREE.Vector3(nx, ny, nz));
        const cCount  = 2 + Math.floor(h(seed * 17 + 0) * 2); // 2–3 foliage spheres
        const clusters = Array.from({ length: cCount }, (_, c) => ({
          ox:       (h(seed * 17 + 2 + c * 4) - 0.5) * 0.5,
          oy:       0.45 + h(seed * 17 + 3 + c * 4) * 0.45,
          oz:       (h(seed * 17 + 4 + c * 4) - 0.5) * 0.5,
          r:        0.28 + h(seed * 17 + 5 + c * 4) * 0.28,
          colorIdx: Math.floor(h(seed * 17 + 6 + c * 4) * BUSH_COLORS.length),
        }));
        bushes.push({ pos: [x, y, z], quat, scale: 0.8 + h(seed * 17 + 1) * 1.0, clusters });
      }
      bi++;
    }

    return { rocks, grasses, bushes };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y  += 0.0003;
    groupRef.current.position.y   = Math.sin(state.clock.elapsedTime * 0.4) * 0.04;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Sphère principale */}
      <mesh onPointerDown={(e) => { if (e.button !== 0) return; onSurfaceClick(e.point); }}>
        <sphereGeometry args={[7, 32, 24]} />
        <meshStandardMaterial color="#1e2a5e" emissive="#0a0f2e" emissiveIntensity={0.3} roughness={0.85} flatShading />
      </mesh>

      {/* Cailloux distribués sur toute la surface */}
      {rocks.map((r, i) => (
        <mesh key={`r${i}`} position={r.pos} rotation={[r.rx, r.ry, r.rz]} scale={r.scale}>
          {r.geo === "dodec"
            ? <dodecahedronGeometry args={[1, 0]} />
            : <icosahedronGeometry  args={[1, 0]} />
          }
          <meshStandardMaterial color={r.color} roughness={0.9} metalness={0.1} />
        </mesh>
      ))}

      {/* Touffes d'herbe (cônes 4-sided) orientées selon la normale de surface */}
      {grasses.map((g, i) => (
        <group key={`g${i}`} position={g.pos} quaternion={g.quat} scale={g.scale}>
          {g.cones.map((c, j) => (
            <mesh
              key={j}
              position={[c.ox, c.height * 0.5, c.oz]}
              rotation={[Math.sin(c.tiltDir) * c.tilt, 0, Math.cos(c.tiltDir) * c.tilt]}
            >
              <coneGeometry args={[0.035, c.height, 4]} />
              <meshStandardMaterial color={GRASS_COLORS[c.colorIdx]} roughness={0.95} flatShading />
            </mesh>
          ))}
        </group>
      ))}

      {/* Buissons : tronc + sphères de feuillage */}
      {bushes.map((b, i) => (
        <group key={`b${i}`} position={b.pos} quaternion={b.quat} scale={b.scale}>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.06, 0.13, 0.6, 5]} />
            <meshStandardMaterial color="#2a1a0e" roughness={0.97} />
          </mesh>
          {b.clusters.map((c, j) => (
            <mesh key={j} position={[c.ox, c.oy, c.oz]}>
              <icosahedronGeometry args={[c.r, 1]} />
              <meshStandardMaterial color={BUSH_COLORS[c.colorIdx]} roughness={0.9} flatShading />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// ─── SunObject ────────────────────────────────────────────────────────────────

function SunObject() {
  return (
    <group position={[35, 18, 28]}>
      {/* Core — bright yellow-white */}
      <mesh>
        <sphereGeometry args={[3.2, 24, 24]} />
        <meshBasicMaterial color="#fffbe0" fog={false} />
      </mesh>
      {/* Inner corona */}
      <mesh>
        <sphereGeometry args={[3.9, 16, 16]} />
        <meshBasicMaterial color="#ffcc00" transparent opacity={0.45} depthWrite={false} fog={false} />
      </mesh>
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[5.0, 16, 16]} />
        <meshBasicMaterial color="#ff8800" transparent opacity={0.15} depthWrite={false} fog={false} />
      </mesh>
    </group>
  );
}

// ─── MoonObject ───────────────────────────────────────────────────────────────

function MoonObject() {
  // Crescent: outer disc minus a large inner disc offset to the right.
  // With hole radius ≈ outer radius and significant offset, the resulting shape
  // is a thin curved sliver — a proper crescent, not a "D".
  // Tips meet where the two circles intersect: (x ≈ 1.2, y ≈ ±1.8).
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.absarc(0, 0, 2.2, 0, Math.PI * 2, false); // outer disc
    const hole = new THREE.Path();
    hole.absarc(0.58, 0, 1.96, 0, Math.PI * 2, true); // inner disc offset right → thin left sliver
    s.holes.push(hole);
    return s;
  }, []);

  return (
    <>
      {/* Diffuse spherical glow — no oval border, pure atmospheric bloom */}
      <mesh position={[-28, 6, -22]}>
        <sphereGeometry args={[4.2, 10, 10]} />
        <meshBasicMaterial color="#3355bb" transparent opacity={0.09} depthWrite={false} fog={false} />
      </mesh>
      {/* Crescent disc — minimal Y-rotation to avoid oval foreshortening,
          Z tilted ~32° for natural sky appearance, X slight depth tilt */}
      <group position={[-28, 6, -22]} rotation={[0.12, -0.18, 0.56]}>
        <mesh>
          <shapeGeometry args={[shape, 64]} />
          <meshBasicMaterial color="#ddeeff" side={THREE.DoubleSide} fog={false} />
        </mesh>
      </group>
    </>
  );
}

// ─── CameraRig ───────────────────────────────────────────────────────────────
// Runs AFTER Scene's useFrame so posRef/faceRef are always up-to-date.
//
// Strategy:
//  - camFaceRef is the camera's OWN facing direction, lagging far behind the robot's
//    facing (CAM_FACE_LERP = 0.025/frame ≈ 2 s swing for 90°) → no sudden pivots.
//  - camera.position lerps toward desiredPos (smooth translation).
//  - lookAt is computed from camera.CURRENT position (not desiredPos) → robot is
//    ALWAYS centered on screen without any quaternion slerp lag.

function CameraRig({
  posRef,
  faceRef,
}: {
  posRef:  React.MutableRefObject<THREE.Vector3>;
  faceRef: React.MutableRefObject<THREE.Vector3>;
}) {
  const { camera } = useThree();
  // Camera's own facing direction — initialized same as faceRef
  const camFaceRef = useRef(new THREE.Vector3(0, 0, 1));

  useFrame(() => {
    const robotPos = posRef.current;
    const face     = faceRef.current;

    // Surface normal at robot position
    ellipsoidNormal(robotPos, _cn);

    // ── Lazily update camFace toward robot's actual facing ──
    const cf = camFaceRef.current;
    // Re-project onto current tangent plane (drift correction as robot moves on sphere)
    cf.addScaledVector(_cn, -cf.dot(_cn));
    if (cf.lengthSq() < 1e-6) cf.copy(face);
    else cf.normalize();
    // Very slow lerp → camera swings smoothly, never snaps on direction change
    cf.lerp(face, CAM_FACE_LERP).normalize();

    // ── Desired camera position: above robot + behind along camFace ──
    _cd
      .copy(robotPos)
      .addScaledVector(_cn, CAM_HEIGHT)
      .addScaledVector(cf, -CAM_BACK);

    // ── Smooth translation toward desired position ──
    camera.position.lerp(_cd, CAM_LERP);

    // ── Always look at robot from wherever camera currently is ──
    // Computing lookAt from camera.position (not _cd) guarantees the robot stays
    // perfectly centered even while the camera is still translating toward _cd.
    // No quaternion slerp needed — orientation is always correct, only position lags.
    _m4c.lookAt(camera.position, robotPos, _cn);
    camera.quaternion.setFromRotationMatrix(_m4c);
  });

  return null;
}

// ─── PortalFlash ─────────────────────────────────────────────────────────────
// Expanding torus ring + point light burst when the robot enters a portal.

function PortalFlash({ infoRef }: {
  infoRef: React.MutableRefObject<{ pos: THREE.Vector3; color: string; t: number } | null>;
}) {
  const meshRef  = useRef<THREE.Mesh>(null);
  const matRef   = useRef<THREE.MeshBasicMaterial>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    const info  = infoRef.current;
    const mesh  = meshRef.current;
    const mat   = matRef.current;
    const light = lightRef.current;
    if (!mesh || !mat || !light) return;

    if (!info) { mesh.visible = false; light.visible = false; return; }

    info.t += delta;
    const p = Math.min(info.t / 0.35, 1);
    if (p >= 1) { infoRef.current = null; mesh.visible = false; light.visible = false; return; }

    // Ring expands and fades out
    mesh.visible = true;
    mesh.position.copy(info.pos);
    mesh.scale.setScalar(0.4 + p * 4.0);
    mat.color.set(info.color);
    mat.opacity = (1 - p) * 0.85;

    // Point light flares and dies
    light.visible = true;
    light.position.copy(info.pos);
    light.color.set(info.color);
    light.intensity = 30 * (1 - p);
  });

  return (
    <>
      <mesh ref={meshRef} visible={false}>
        <torusGeometry args={[0.8, 0.14, 8, 32]} />
        <meshBasicMaterial ref={matRef} transparent opacity={0} depthWrite={false} />
      </mesh>
      <pointLight ref={lightRef} visible={false} distance={20} decay={2} />
    </>
  );
}

// ─── Scene ───────────────────────────────────────────────────────────────────

function Scene({ onPortalEnter }: { onPortalEnter: (href: string) => void }) {
  const posRef        = useRef(new THREE.Vector3(0, SURFACE_Y, 0));
  const prevPosRef    = useRef(new THREE.Vector3(0, SURFACE_Y, 0)); // for velocity tracking
  const movingRef     = useRef(false);
  const rotRef        = useRef(0); // kept for compatibility
  const quatRef       = useRef(new THREE.Quaternion());
  const faceRef       = useRef(new THREE.Vector3(0, 0, 1));
  const keysRef       = useRef(new Set<string>());
  const enteredRef    = useRef(false);
  const targetRef     = useRef<THREE.Vector3 | null>(null);
  const jumpRef       = useRef({ active: false, t: 0 });
  const clickIndicRef = useRef<{ pos: THREE.Vector3; t: number } | null>(null);
  // Portal entry state
  const spawnCooldown = useRef(SPAWN_COOLDOWN);
  const enterAnim     = useRef<{ t: number; href: string; pos: THREE.Vector3; color: string } | null>(null);
  const robotScaleRef = useRef(1.0);
  const flashRef      = useRef<{ pos: THREE.Vector3; color: string; t: number } | null>(null);

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

  useFrame((state, delta) => {
    if (enteredRef.current) return;

    // ── 0a. Spawn cooldown — portal detection disabled for 2s after mount ──
    if (spawnCooldown.current > 0) {
      spawnCooldown.current = Math.max(0, spawnCooldown.current - delta);
    }

    // ── 0b. Portal entry animation — scale robot to 0 over 0.3s then redirect ──
    const ea = enterAnim.current;
    if (ea) {
      ea.t += delta;
      const p = Math.min(ea.t / 0.3, 1);
      robotScaleRef.current = 1 - p;           // shrink to 0
      if (ea.t >= 0.3) {
        enteredRef.current = true;
        onPortalEnter(ea.href);
      }
      return; // freeze movement during animation
    }

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
      // Camera-relative input: project camera's look direction onto the tangent plane,
      // then derive the right axis. This fixes equator blockage (when world-XZ input
      // is collinear with the surface normal the projection degenerates to zero) and
      // keeps controls consistent everywhere on the sphere.
      state.camera.getWorldDirection(_dir);  // camera look direction = "forward on screen"
      _dir.addScaledVector(_sn, -_dir.dot(_sn)); // project onto tangent plane
      if (_dir.lengthSq() < 1e-8) _dir.set(1, 0, 0).addScaledVector(_sn, -_sn.x).normalize();
      else _dir.normalize();
      _ax.crossVectors(_sn, _dir).normalize(); // camera right = normal × camForward
      // dz = -1 (Z/up)  → move in camera-forward direction
      // dx = +1 (D/right) → move in camera-right direction
      _az.copy(_dir).multiplyScalar(-dz).addScaledVector(_ax, dx);
      if (_az.lengthSq() > 1e-8) {
        _az.normalize();
        _sp.addScaledVector(_az, SPEED * delta);
        ellipsoidProject(_sp, _sp);
        ellipsoidNormal(_sp, _sn);
        faceRef.current.copy(_az);
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

    // ── 6. Portal detection ──
    // Conditions: cooldown expired + 3D distance < 0.5 + robot moving toward portal
    if (spawnCooldown.current <= 0) {
      for (const portal of PORTALS) {
        const [px, py, pz] = portal.position;
        const d3 = Math.sqrt((pos.x-px)**2 + (pos.y-py)**2 + (pos.z-pz)**2);
        if (d3 < PORTAL_RADIUS) {
          // Velocity = displacement this frame (pos was updated above, prevPos is last frame)
          const vx = pos.x - prevPosRef.current.x;
          const vy = pos.y - prevPosRef.current.y;
          const vz = pos.z - prevPosRef.current.z;
          if (vx*vx + vy*vy + vz*vz > 1e-8) {
            // dot(velocity, robot→portal) > 0 means actively moving toward the portal
            const dot = vx*(px-pos.x) + vy*(py-pos.y) + vz*(pz-pos.z);
            if (dot > 0) {
              enterAnim.current = { t: 0, href: portal.href, pos: new THREE.Vector3(px, py, pz), color: portal.color };
              flashRef.current  = { pos: new THREE.Vector3(px, py, pz), color: portal.color, t: 0 };
              break;
            }
          }
        }
      }
    }

    // ── 7. Record position for next-frame velocity ──
    prevPosRef.current.copy(pos);
  });

  return (
    <>
      <FogSetup />
      <Starfield count={900} />
      <Nebula />
      <Rocket />
      <LaserBeams />

      {/* ── Éclairage : Soleil chaud + Lune froide + fill omnidirectionnel ── */}
      {/* Ambient élevé pour garantir qu'aucune face n'est dans le noir complet */}
      <ambientLight intensity={1.5} color="#99aabb" />
      {/* Soleil — côté +X/+Z, lumière principale chaude */}
      <directionalLight position={[35, 18, 28]} intensity={2.8} color="#ffe060" />
      <pointLight position={[22, 10, 16]} intensity={1.4} color="#ffcc44" distance={70} decay={1.4} />
      {/* Lune croissant — côté −X/−Z, lumière froide */}
      <directionalLight position={[-28, 6, -22]} intensity={1.2} color="#7799dd" />
      <pointLight position={[-16, 4, -13]} intensity={0.7} color="#5566bb" distance={55} decay={1.4} />
      {/* Fill light sous la planète — éclaire l'hémisphère sud et l'équateur */}
      <directionalLight position={[0, -14, 0]} intensity={0.8} color="#aabbcc" />

      {/* Planète */}
      <PlanetSurface onSurfaceClick={handleSurfaceClick} />

      {/* Soleil visuel */}
      <SunObject />
      {/* Lune croissant visuelle */}
      <MoonObject />

      {/* Objets orbitaux */}
      <OrbitalObjects />

      {/* Portails — anneaux dimensionnels perpendiculaires à la surface */}
      {PORTALS.map((portal) => (
        <Portal
          key={portal.id}
          position={portal.position}
          color={portal.color}
          label={portal.label}
        />
      ))}

      {/* Indicateur clic */}
      <ClickIndicator infoRef={clickIndicRef} />

      {/* Flash d'entrée portail */}
      <PortalFlash infoRef={flashRef} />

      {/* Joueur */}
      <Robot posRef={posRef} movingRef={movingRef} rotRef={rotRef} quatRef={quatRef} scaleRef={robotScaleRef} />

      {/* Caméra suiveuse — monté après Robot pour que useFrame lise les refs à jour */}
      <CameraRig posRef={posRef} faceRef={faceRef} />
    </>
  );
}

// ─── Canvas export ───────────────────────────────────────────────────────────

export function GameCanvas({ onPortalEnter }: { onPortalEnter: (href: string) => void }) {
  // Initial camera: behind robot along -Z + above along normal (+Y) for sphere radius 7.
  // robotPos=(0,7,0), face=(0,0,1) → desiredCam=(0, 7+6, 0-10)=(0, 13, -10)
  return (
    <Canvas
      camera={{ position: [0, 13, -10], fov: 65 }}
      frameloop="always"
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%", background: "#020210" }}
      onCreated={({ camera }) => { camera.lookAt(0, 7, 0); }}
    >
      <Scene onPortalEnter={onPortalEnter} />
    </Canvas>
  );
}
