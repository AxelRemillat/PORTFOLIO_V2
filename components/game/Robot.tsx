"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RobotProps {
  posRef:   React.MutableRefObject<THREE.Vector3>;
  movingRef: React.MutableRefObject<boolean>;
  rotRef:   React.MutableRefObject<number>;
  quatRef:  React.MutableRefObject<THREE.Quaternion>;
}

export function Robot({ posRef, movingRef, quatRef }: RobotProps) {
  const groupRef    = useRef<THREE.Group>(null);
  const leftLegRef  = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef  = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    groupRef.current.position.copy(posRef.current);
    groupRef.current.quaternion.copy(quatRef.current);

    if (movingRef.current) {
      const swing = Math.sin(state.clock.elapsedTime * 9) * 0.45;
      if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.5;
      if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.5;
    } else {
      if (leftLegRef.current) leftLegRef.current.rotation.x *= 0.85;
      if (rightLegRef.current) rightLegRef.current.rotation.x *= 0.85;
      if (leftArmRef.current) leftArmRef.current.rotation.x *= 0.85;
      if (rightArmRef.current) rightArmRef.current.rotation.x *= 0.85;
    }
  });

  const bodyColor = "#3b82f6";
  const darkColor = "#1d4ed8";
  const headColor = "#60a5fa";

  return (
    <group ref={groupRef}>
      {/* Torso */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[0.52, 0.55, 0.32]} />
        <meshStandardMaterial color={bodyColor} emissive={bodyColor} emissiveIntensity={0.08} roughness={0.4} />
      </mesh>

      {/* Chest panel (emissive detail) */}
      <mesh position={[0, 0.78, 0.17]}>
        <boxGeometry args={[0.22, 0.22, 0.02]} />
        <meshBasicMaterial color="#93c5fd" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <boxGeometry args={[0.38, 0.32, 0.32]} />
        <meshStandardMaterial color={headColor} emissive={headColor} emissiveIntensity={0.12} roughness={0.3} />
      </mesh>

      {/* Left eye */}
      <mesh position={[-0.09, 1.27, 0.17]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshBasicMaterial color="white" />
      </mesh>
      {/* Left pupil */}
      <mesh position={[-0.09, 1.27, 0.185]}>
        <boxGeometry args={[0.04, 0.04, 0.01]} />
        <meshBasicMaterial color="#f97316" />
      </mesh>

      {/* Right eye */}
      <mesh position={[0.09, 1.27, 0.17]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshBasicMaterial color="white" />
      </mesh>
      {/* Right pupil */}
      <mesh position={[0.09, 1.27, 0.185]}>
        <boxGeometry args={[0.04, 0.04, 0.01]} />
        <meshBasicMaterial color="#f97316" />
      </mesh>

      {/* Antenna */}
      <mesh position={[0, 1.47, 0]}>
        <boxGeometry args={[0.04, 0.12, 0.04]} />
        <meshStandardMaterial color={darkColor} />
      </mesh>
      <mesh position={[0, 1.56, 0]}>
        <boxGeometry args={[0.08, 0.08, 0.08]} />
        <meshBasicMaterial color="#f97316" />
      </mesh>

      {/* Left arm (pivots from shoulder) */}
      <group position={[-0.36, 0.95, 0]}>
        <mesh ref={leftArmRef} position={[0, -0.18, 0]} castShadow>
          <boxGeometry args={[0.16, 0.38, 0.16]} />
          <meshStandardMaterial color={darkColor} roughness={0.5} />
        </mesh>
      </group>

      {/* Right arm */}
      <group position={[0.36, 0.95, 0]}>
        <mesh ref={rightArmRef} position={[0, -0.18, 0]} castShadow>
          <boxGeometry args={[0.16, 0.38, 0.16]} />
          <meshStandardMaterial color={darkColor} roughness={0.5} />
        </mesh>
      </group>

      {/* Left leg (pivots from hip) */}
      <group position={[-0.14, 0.45, 0]}>
        <mesh ref={leftLegRef} position={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[0.2, 0.42, 0.22]} />
          <meshStandardMaterial color={darkColor} roughness={0.5} />
        </mesh>
      </group>

      {/* Right leg */}
      <group position={[0.14, 0.45, 0]}>
        <mesh ref={rightLegRef} position={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[0.2, 0.42, 0.22]} />
          <meshStandardMaterial color={darkColor} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}
