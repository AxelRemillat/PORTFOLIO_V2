"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Sphere constants — must match GameCanvas.tsx (A_XZ = A_Y = 7, perfect sphere)
const A_XZ = 7;
const A_Y  = 7;

// Module-level temp vectors to avoid per-frame allocations
const _n   = new THREE.Vector3();
const _fwd = new THREE.Vector3();
const _rgt = new THREE.Vector3();
const _fwdOrtho = new THREE.Vector3();
const _m4portal  = new THREE.Matrix4();

interface PortalProps {
  position: [number, number, number];
  color: string;
  isVisited: boolean;
}

const PARTICLE_COUNT = 5;

export function Portal({ position, color, isVisited }: PortalProps) {
  const ringRef      = useRef<THREE.Mesh>(null);
  const membraneRef  = useRef<THREE.Mesh>(null);
  const lightRef     = useRef<THREE.PointLight>(null);
  const particlesRef = useRef<THREE.Group>(null);

  // ── Orientation: ring stands perpendicular to the ellipsoid surface ──
  // Local Y = surface normal (up on surface)
  // Local Z = tangent facing toward north pole (the direction you walk through)
  // Local X = right tangent = n × Z
  // ⟹ TorusGeometry (XY plane) lies in the plane containing Y(normal) & X(right).
  //   The ring stands like a doorway on the planet surface.
  const quaternion = useMemo(() => {
    const pos = new THREE.Vector3(...position);

    // Surface normal at this point on the ellipsoid
    _n.set(pos.x / (A_XZ * A_XZ), pos.y / (A_Y * A_Y), pos.z / (A_XZ * A_XZ)).normalize();

    // Choose facing direction: toward the starting position (north pole)
    _fwd.set(0, A_Y, 0).sub(pos).normalize();
    // Project onto tangent plane (remove normal component)
    _fwd.addScaledVector(_n, -_fwd.dot(_n));
    if (_fwd.lengthSq() < 0.01) {
      // Fallback: any tangent direction
      _fwd.set(1, 0, 0).addScaledVector(_n, -_n.x).normalize();
    } else {
      _fwd.normalize();
    }

    // right = n × facing, then re-orthogonalize forward
    _rgt.crossVectors(_n, _fwd).normalize();
    _fwdOrtho.crossVectors(_rgt, _n).normalize();

    // Basis: X=right, Y=normal(up), Z=forward(tangent facing)
    _m4portal.makeBasis(_rgt, _n, _fwdOrtho);
    return new THREE.Quaternion().setFromRotationMatrix(_m4portal);
  }, [position]);

  // Evenly distributed initial phases for particles
  const phases = useMemo(
    () => Array.from({ length: PARTICLE_COUNT }, (_, i) => (i / PARTICLE_COUNT) * Math.PI * 2),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    const ringMat     = ringRef.current?.material as THREE.MeshStandardMaterial | undefined;
    const membraneMat = membraneRef.current?.material as THREE.MeshBasicMaterial | undefined;

    if (isVisited) {
      // Portail déjà exploré : émissif fixe, disque discret, halo léger.
      if (ringMat)     ringMat.emissiveIntensity = 0.3;
      if (membraneMat) membraneMat.opacity = 0.1;
      if (lightRef.current) lightRef.current.intensity = 1.2;
      if (particlesRef.current) particlesRef.current.scale.setScalar(1);
    } else {
      // Non visité : clignotement net pour attirer le joueur (~période 1.5s).
      const pulse = Math.abs(Math.sin(t * 2.0)); // 0 → 1, rapide et net
      if (ringMat)     ringMat.emissiveIntensity = 0.4 + pulse * 1.6; // 0.4 → 2.0
      if (membraneMat) membraneMat.opacity = 0.15 + pulse * 0.20;     // 0.15 → 0.35
      if (lightRef.current) lightRef.current.intensity = 3.0 + pulse * 4.0;
      if (particlesRef.current) particlesRef.current.scale.setScalar(1 + pulse * 0.15);
    }

    // Orbit particles in the ring plane (local XY = the ring plane)
    if (particlesRef.current) {
      particlesRef.current.children.forEach((child, i) => {
        const angle = t * 0.50 + phases[i];
        const r     = 0.86 + Math.sin(t * 0.9 + i * 1.3) * 0.05;
        child.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0);
      });
    }
  });

  return (
    <group position={position} quaternion={quaternion}>
      {/* Dimensional ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.80, 0.060, 14, 80]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.70}
          roughness={0.15}
          metalness={0.80}
        />
      </mesh>

      {/* Portal membrane — translucent disc simulating the dimensional surface */}
      <mesh ref={membraneRef}>
        <circleGeometry args={[0.80, 56]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.22}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Orbiting particles — stay in the ring plane (local XY) */}
      <group ref={particlesRef}>
        {phases.map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.040, 7, 7]} />
            <meshBasicMaterial color={color} />
          </mesh>
        ))}
      </group>

      {/* Point light */}
      <pointLight ref={lightRef} color={color} intensity={5} distance={10} decay={2} />
    </group>
  );
}
