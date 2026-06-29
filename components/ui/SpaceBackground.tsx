"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const STAR_COUNT    = 700;
const ASTEROID_COUNT = 10;

// The spec authors asteroid sizes/speeds for a ~1-unit viewport, but this scene
// works in large world units (camera at z=10, stars span ±40, the previous
// asteroids used radius 0.3–1.2). SIZE_SCALE lifts the spec's base radii into
// this scene's scale while preserving the tier ratios; BASE_SPEED is the
// near/small world-units-per-second speed (reduced for larger / farther
// asteroids to drive the parallax). On/off-screen bounds are derived from the
// real camera frustum so "off-screen" and "full height" stay correct.
const SIZE_SCALE  = 10;
const BASE_SPEED  = 3.8;

// Share of asteroids that "approach" — flying straight toward the camera from
// deep space, looming larger until they pass close by. The rest cross laterally.
const APPROACH_PROB = 0.3;

const ASTEROID_PALETTE = ["#5a5060", "#6a6040", "#7a6850", "#4a4858"];

// Build an irregular "rock" geometry: start from a subdivided icosahedron, then
// push every vertex in/out along its direction by a sum-of-waves noise. The noise
// is a pure function of the vertex direction, so the duplicated vertices that
// share a corner move together (no cracks). With flat shading the faceted result
// reads as a craggy asteroid rather than a smooth Platonic solid.
function makeRockGeometry(detail: number, seed: number) {
  const geo = new THREE.IcosahedronGeometry(1, detail);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    const n =
      0.42 * Math.sin(2.0 * v.x + 1.3 * v.y + seed) +
      0.26 * Math.sin(2.7 * v.y + 1.9 * v.z + seed * 1.7) +
      0.20 * Math.sin(3.3 * v.z + 2.1 * v.x + seed * 0.7) +
      0.14 * Math.sin(5.1 * v.x + 4.0 * v.z + seed * 2.3) +
      0.10 * Math.sin(6.3 * v.y + 5.2 * v.x + seed * 0.4);
    v.multiplyScalar(1 + n * 0.34);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

// ─── Stars ───────────────────────────────────────────────────────────────────

function Stars() {
  const groupRef = useRef<THREE.Group>(null);
  const geomRef  = useRef<THREE.BufferGeometry>(null);
  const tick     = useRef(0);

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
    // Le scintillement recalcule 700 couleurs + ré-uploade le buffer GPU : on le
    // limite à ~1 frame sur 3 (≈20 fps), invisible à l'œil mais ~3× moins de CPU.
    if (++tick.current % 3 !== 0) return;
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

// ─── AsteroidField ────────────────────────────────────────────────────────────

type AsteroidSlot = {
  mesh:     THREE.Mesh;
  material: THREE.MeshStandardMaterial;
  mode:     "cross" | "approach";
  vel:      THREE.Vector3;  // world units / second
  axis:     THREE.Vector3;  // normalized tumble axis
  rotSpeed: number;         // radians / second
  z:        number;
  halfW:    number;         // frustum half-width at this asteroid's z (cross)
  halfH:    number;         // frustum half-height at this asteroid's z (cross)
  scaleMax: number;         // largest scale component (for off-screen margin)
};

function AsteroidField() {
  // A small pool of distinct unit "rock" shapes (varied seeds + subdivision).
  // Per-asteroid size/stretch comes from scale and rotation from the quaternion,
  // so this handful of base shapes yields plenty of variety.
  const geometries = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) =>
        makeRockGeometry(i < 4 ? 1 : 2, i * 12.7 + 3.1)
      ),
    []
  );

  const slots = useMemo<AsteroidSlot[]>(
    () =>
      Array.from({ length: ASTEROID_COUNT }, () => {
        const material = new THREE.MeshStandardMaterial({
          roughness: 0.95,
          flatShading: true,
        });
        const mesh = new THREE.Mesh(geometries[0], material);
        mesh.visible = false;
        return {
          mesh,
          material,
          mode:     "cross" as const,
          vel:      new THREE.Vector3(),
          axis:     new THREE.Vector3(0, 1, 0),
          rotSpeed: 0,
          z:        -5,
          halfW:    0,
          halfH:    0,
          scaleMax: 0,
        };
      }),
    [geometries]
  );

  useEffect(() => {
    return () => {
      geometries.forEach((g) => g.dispose());
      slots.forEach((s) => s.material.dispose());
    };
  }, [geometries, slots]);

  const initialized = useRef(false);
  const scratch = useMemo(() => new THREE.Vector3(), []);

  const frustumAt = (camera: THREE.PerspectiveCamera, z: number) => {
    const d     = camera.position.z - z;
    const halfH = Math.tan((camera.fov * Math.PI) / 360) * d;
    const halfW = halfH * camera.aspect;
    return { halfW, halfH };
  };

  // Apply a (non-uniform) scale from a spec base radius and remember the largest
  // component so off-screen margins can clear the whole rock.
  const applySize = (s: AsteroidSlot, base: number) => {
    const sized = base * SIZE_SCALE;
    const sx = sized * THREE.MathUtils.randFloat(0.6, 1.4);
    const sy = sized * THREE.MathUtils.randFloat(0.5, 1.3);
    const sz = sized * THREE.MathUtils.randFloat(0.7, 1.2);
    s.mesh.scale.set(sx, sy, sz);
    s.scaleMax = Math.max(sx, sy, sz);
  };

  // (Re)randomize every property of a slot. `initial` spreads asteroids across
  // the scene so it's populated immediately; `respawn` re-enters them fresh.
  const configure = (
    s: AsteroidSlot,
    camera: THREE.PerspectiveCamera,
    mode: "initial" | "respawn"
  ) => {
    // Geometry, colour, self-rotation and a touch of emissive glow are shared by
    // both modes (emissive lets the dark rocks read against deep space).
    s.mesh.geometry = geometries[Math.floor(Math.random() * geometries.length)];
    const color = ASTEROID_PALETTE[Math.floor(Math.random() * ASTEROID_PALETTE.length)];
    s.material.color.set(color);
    s.material.emissive.set(color);
    s.material.emissiveIntensity = 0.12; // low, so flat-shaded facets keep contrast

    s.axis.set(Math.random(), Math.random(), Math.random()).normalize();
    s.rotSpeed = THREE.MathUtils.randFloat(0.003, 0.012) * 60; // rad/frame → rad/s
    s.mesh.quaternion
      .set(Math.random(), Math.random(), Math.random(), Math.random())
      .normalize();

    if (Math.random() < APPROACH_PROB) {
      // ── Approach: a big rock flying straight out of deep space toward the
      // camera. Perspective makes it loom; a little lateral drift means it sweeps
      // past instead of staying pinned dead-centre.
      s.mode = "approach";
      applySize(s, THREE.MathUtils.randFloat(0.06, 0.14));

      const { halfW, halfH } = frustumAt(camera, -6);
      const offX = THREE.MathUtils.randFloatSpread(halfW * 0.45);
      const offY = THREE.MathUtils.randFloatSpread(halfH * 0.45);
      // `initial` ones are staggered along the path so a few are already mid-loom.
      const z =
        mode === "initial"
          ? THREE.MathUtils.randFloat(-26, -2)
          : THREE.MathUtils.randFloat(-26, -18);
      s.mesh.position.set(offX, offY, z);
      s.z = z;
      s.vel.set(
        THREE.MathUtils.randFloatSpread(1.2),  // drift x
        THREE.MathUtils.randFloatSpread(1.0),  // drift y
        THREE.MathUtils.randFloat(2.5, 5.0)    // toward camera (+z)
      );
      s.mesh.visible = true;
      return;
    }

    // ── Cross: drifts laterally across the field at a fixed depth.
    s.mode = "cross";
    const z = THREE.MathUtils.randFloat(-14, -2); // deeper range → big slow backdrops
    const { halfW, halfH } = frustumAt(camera, z);

    // Size tier: small 55% / medium 30% / large 15%, with non-uniform scale.
    const tier = Math.random();
    let base: number;
    let tierFactor: number; // speed multiplier — larger asteroids move slower
    if (tier < 0.55) {
      base = THREE.MathUtils.randFloat(0.01, 0.03);
      tierFactor = 1.0;
    } else if (tier < 0.85) {
      base = THREE.MathUtils.randFloat(0.035, 0.07);
      tierFactor = 0.8;
    } else {
      base = THREE.MathUtils.randFloat(0.08, 0.16);
      tierFactor = 0.55;
    }
    applySize(s, base);

    // Trajectory: enter from a random side, angle within ±35° of horizontal,
    // speed scaled down for larger asteroids and for distant ones (parallax).
    const fromLeft    = Math.random() < 0.5;
    const angle       = THREE.MathUtils.degToRad(THREE.MathUtils.randFloat(-35, 35));
    const depthFactor = THREE.MathUtils.mapLinear(z, -14, -2, 0.7, 1.0);
    const speed       = BASE_SPEED * tierFactor * depthFactor;
    const dirX        = fromLeft ? 1 : -1;
    s.vel.set(dirX * speed * Math.cos(angle), speed * Math.sin(angle), 0);

    s.z     = z;
    s.halfW = halfW;
    s.halfH = halfH;

    const margin = s.scaleMax + 0.5;
    const y = THREE.MathUtils.randFloat(-halfH, halfH);
    const x =
      mode === "initial"
        ? THREE.MathUtils.randFloat(-halfW, halfW)
        : fromLeft
        ? -halfW - margin
        : halfW + margin;
    s.mesh.position.set(x, y, z);
    s.mesh.visible = true;
  };

  useFrame((state, delta) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    const dt = Math.min(delta, 0.05); // clamp so a backgrounded tab doesn't jump

    if (!initialized.current) {
      slots.forEach((s) => configure(s, camera, "initial"));
      initialized.current = true;
    }

    for (const s of slots) {
      const m = s.mesh;
      m.position.addScaledVector(s.vel, dt);
      m.rotateOnAxis(s.axis, s.rotSpeed * dt);

      let off: boolean;
      if (s.mode === "approach") {
        // Cull once it passes the camera, or once its on-screen projection leaves
        // the view (it has drifted past). NDC is used because the frustum shrinks
        // to nothing at the camera, so world bounds don't work here.
        scratch.copy(m.position).project(camera);
        off =
          m.position.z > camera.position.z - 0.8 ||
          Math.abs(scratch.x) > 1.35 ||
          Math.abs(scratch.y) > 1.35;
      } else {
        const margin     = s.scaleMax + 1;
        const goingRight = s.vel.x > 0;
        const exitX      = goingRight ? s.halfW + margin : -s.halfW - margin;
        const offX       = goingRight ? m.position.x > exitX : m.position.x < exitX;
        off = offX || Math.abs(m.position.y) > s.halfH + margin;
      }
      if (off) configure(s, camera, "respawn");
    }
  });

  return (
    <group>
      {slots.map((s, i) => (
        <primitive key={i} object={s.mesh} />
      ))}
    </group>
  );
}

// ─── Scene ───────────────────────────────────────────────────────────────────

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 5]} intensity={1.5} color="#4466ff" />
      <Stars />
      <AsteroidField />
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
