"use client";

import { useRef, useMemo } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const N        = 13;         // cross-sections along the scarf
const SEG_LEN  = 0.13;       // fixed distance between cross-sections (rigid)
const ANTIGRAV = 0.003;
const BEHIND   = 0.006;      // constant pull behind the head
const DAMPING  = 0.88;
const INERTIA  = 0.25;
const IDLE     = 0.005;
const HALF_W0  = 0.15;       // half-width at the neck
const HALF_W1  = 0.08;       // half-width at the tip (gentle taper)
const FUZZ     = 0.5;        // woolly edge irregularity (fraction of half-width)

// Constant "space wind"
const WIND_X = 0.001;
const WIND_Y = 0.0005;

// Character collision capsule (two spheres along the local up axis)
const HEAD_OFF  =  0.18, HEAD_R  = 0.22;
const TORSO_OFF = -0.18, TORSO_R = 0.24;

// Module-level temps (single instance)
const _wp    = new THREE.Vector3();
const _dir   = new THREE.Vector3();
const _out   = new THREE.Vector3();
const _side  = new THREE.Vector3();
const _tan   = new THREE.Vector3();
const _q      = new THREE.Quaternion();
const _behind = new THREE.Vector3();
const _up     = new THREE.Vector3();
const _hc     = new THREE.Vector3();
const _tc     = new THREE.Vector3();
const _push   = new THREE.Vector3();

interface Props {
  anchorRef:     MutableRefObject<THREE.Object3D | null>;
  velRef:        MutableRefObject<THREE.Vector3>;
  jumpRef?:      MutableRefObject<{ active: boolean; t: number }>;
  movingRef:     MutableRefObject<boolean>;
  planetCenter?: THREE.Vector3;
}

// Push a point out of a sphere (center c, radius r) if it is inside
function resolveSphere(p: THREE.Vector3, c: THREE.Vector3, r: number) {
  _push.subVectors(p, c);
  const d = _push.length();
  if (d < r) {
    if (d > 1e-6) _push.multiplyScalar(1 / d);
    else _push.copy(_behind);
    p.copy(c).addScaledVector(_push, r);
  }
}

// Rigid "follow the leader" pass — keeps each joint at EXACTLY SEG_LEN
function enforceLength(pos: THREE.Vector3[]) {
  for (let i = 1; i < N; i++) {
    _dir.subVectors(pos[i], pos[i - 1]);
    const len = _dir.length();
    if (len > 1e-6) _dir.multiplyScalar(1 / len);
    else _dir.copy(_behind);
    pos[i].copy(pos[i - 1]).addScaledVector(_dir, SEG_LEN);
  }
}

export function ScarfPhysics({ anchorRef, velRef, jumpRef }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);

  const segPos = useRef(Array.from({ length: N }, (_, i) => new THREE.Vector3(0, -i * SEG_LEN, 0)));
  const segVel = useRef(Array.from({ length: N }, () => new THREE.Vector3()));

  const jumpFrames = useRef(0);
  const wasJumping = useRef(false);

  // Stable per-edge noise → woolly, ragged silhouette (computed once)
  const fuzz = useMemo(() => {
    const h = (n: number) => Math.abs(Math.sin(n * 127.1) * 43758.5453) % 1;
    return Array.from({ length: N }, (_, i) => ({
      l: (h(i + 1) - 0.5) * FUZZ,
      r: (h(i + 31.7) - 0.5) * FUZZ,
    }));
  }, []);

  // Ribbon geometry: 2 vertices per cross-section (left/right edge) → flat strip
  const geom = useMemo(() => {
    const g    = new THREE.BufferGeometry();
    const posA = new Float32Array(N * 2 * 3);
    const idx: number[] = [];
    for (let i = 0; i < N - 1; i++) {
      const a = i * 2, b = i * 2 + 1, c = (i + 1) * 2, d = (i + 1) * 2 + 1;
      idx.push(a, b, c, b, d, c);
    }
    g.setAttribute("position", new THREE.BufferAttribute(posA, 3));
    g.setIndex(idx);
    return g;
  }, []);

  useFrame((state) => {
    if (!anchorRef.current || !meshRef.current) return;
    const t   = state.clock.elapsedTime;
    const pos = segPos.current;
    const vel = segVel.current;

    const jumping = jumpRef?.current.active ?? false;
    if (jumping && !wasJumping.current) jumpFrames.current = 3;
    wasJumping.current = jumping;
    if (jumpFrames.current > 0) jumpFrames.current--;

    // Segment 0 pinned to the neck anchor in world space
    anchorRef.current.getWorldPosition(_wp);
    pos[0].copy(_wp);
    vel[0].set(0, 0, 0);

    // "Behind the head" = the character's local -Z axis in world space
    anchorRef.current.getWorldQuaternion(_q);
    _behind.set(0, 0, -1).applyQuaternion(_q).normalize();

    const cv = velRef.current;

    for (let i = 1; i < N; i++) {
      // Anti-gravity: float outward (away from planet center)
      _out.copy(pos[i]).normalize();
      vel[i].addScaledVector(_out, ANTIGRAV);

      // Permanent pull so the scarf trails behind the head
      vel[i].addScaledVector(_behind, BEHIND);

      // Constant "space wind"
      vel[i].x += WIND_X;
      vel[i].y += WIND_Y;

      // Inertia: scarf drags opposite to character movement
      vel[i].x -= cv.x * INERTIA;
      vel[i].y -= cv.y * INERTIA;
      vel[i].z -= cv.z * INERTIA;

      // Jump impulse on the tail segments — extra outward lift
      if (jumpFrames.current > 0 && i >= N - 6) {
        vel[i].addScaledVector(_out, ANTIGRAV * 5);
      }

      // Idle micro-oscillation — ripple in the "space wind"
      vel[i].x += Math.sin(t * 1.5 + i * 0.8) * IDLE;
      vel[i].y += Math.cos(t * 1.5 + i * 0.8) * IDLE;
      vel[i].z += Math.sin(t * 1.5 + i * 0.8 + 1.0) * IDLE;

      vel[i].multiplyScalar(DAMPING);
      pos[i].add(vel[i]);
    }

    // Length → collision → length again (keeps length constant AND off the body)
    enforceLength(pos);

    _up.copy(pos[0]).normalize();
    _hc.copy(pos[0]).addScaledVector(_up, HEAD_OFF);
    _tc.copy(pos[0]).addScaledVector(_up, TORSO_OFF);
    for (let i = 1; i < N; i++) {
      resolveSphere(pos[i], _hc, HEAD_R);
      resolveSphere(pos[i], _tc, TORSO_R);
    }

    enforceLength(pos);

    // Build the flat ribbon: side vector ⟂ to both tangent and outward normal
    const arr = geom.attributes.position.array as Float32Array;
    for (let i = 0; i < N; i++) {
      if (i === 0)          _tan.subVectors(pos[1], pos[0]);
      else if (i === N - 1) _tan.subVectors(pos[N - 1], pos[N - 2]);
      else                  _tan.subVectors(pos[i + 1], pos[i - 1]);
      if (_tan.lengthSq() < 1e-8) _tan.set(0, -1, 0);
      _tan.normalize();

      _out.copy(pos[i]).normalize();
      _side.crossVectors(_tan, _out);
      if (_side.lengthSq() < 1e-8) _side.set(1, 0, 0);
      _side.normalize();

      const hw = THREE.MathUtils.lerp(HALF_W0, HALF_W1, i / (N - 1));
      // Woolly ragged edges: independent jitter on each side + tiny live flutter
      const flutter = Math.sin(t * 3 + i * 1.3) * 0.012;
      const hwL = hw * (1 + fuzz[i].l) + flutter;
      const hwR = hw * (1 + fuzz[i].r) - flutter;
      const li = i * 6, ri = i * 6 + 3;
      arr[li]     = pos[i].x - _side.x * hwL;
      arr[li + 1] = pos[i].y - _side.y * hwL;
      arr[li + 2] = pos[i].z - _side.z * hwL;
      arr[ri]     = pos[i].x + _side.x * hwR;
      arr[ri + 1] = pos[i].y + _side.y * hwR;
      arr[ri + 2] = pos[i].z + _side.z * hwR;
    }
    geom.attributes.position.needsUpdate = true;
    geom.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geom} frustumCulled={false}>
      <meshStandardMaterial
        color="#C81818"
        emissive="#3a0000"
        roughness={1}
        metalness={0}
        flatShading
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
