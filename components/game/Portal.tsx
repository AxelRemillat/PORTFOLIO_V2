"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface PortalProps {
  position: [number, number, number];
  color: string;
  label: string;
  yRotation: number;
  tiltX?: number;
}

export function Portal({ position, color, label, yRotation, tiltX = 0 }: PortalProps) {
  const lightRef = useRef<THREE.PointLight>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (lightRef.current) {
      lightRef.current.intensity = 5.0 + Math.sin(t * 2.4) * 2.0;
    }
    if (innerRef.current) {
      const mat = innerRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.12 + Math.sin(t * 2.4) * 0.07;
    }
    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.6 + Math.sin(t * 2.4) * 0.3;
    }
  });

  return (
    <group position={position} rotation={[tiltX, yRotation, 0]}>
      {/* Outer ring */}
      <mesh ref={ringRef} castShadow>
        <torusGeometry args={[1.1, 0.1, 8, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.7}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Inner glow disc */}
      <mesh ref={innerRef}>
        <circleGeometry args={[1.0, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      {/* Base pedestal */}
      <mesh position={[0, -1.1, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.35, 0.15, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Pillar */}
      <mesh position={[0, -0.65, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.9, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Point light */}
      <pointLight ref={lightRef} color={color} intensity={5} distance={10} decay={2} />

      {/* Billboard label */}
      <Html
        center
        distanceFactor={10}
        position={[0, 1.8, 0]}
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            color: "white",
            background: "rgba(8, 8, 16, 0.75)",
            border: `1px solid ${color}40`,
            padding: "3px 10px",
            borderRadius: "6px",
            fontSize: "11px",
            fontFamily: "monospace",
            whiteSpace: "nowrap",
            letterSpacing: "0.05em",
            backdropFilter: "blur(4px)",
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  );
}
