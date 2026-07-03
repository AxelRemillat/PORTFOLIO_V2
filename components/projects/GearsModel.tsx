"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const GLB = "/Anti-Gravity Drone.glb";

function DroneScene() {
  const { scene } = useGLTF(GLB);
  const rotRef = useRef<THREE.Group>(null);

  const { normScale, cx, cy, cz } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    if (box.isEmpty()) return { normScale: 1, cx: 0, cy: 0, cz: 0 };
    const center = box.getCenter(new THREE.Vector3());
    const size   = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    return {
      normScale: 4.37 / maxDim, // 3.36 × 1.3
      cx: -center.x,
      cy: -center.y,
      cz: -center.z,
    };
  }, [scene]);

  useFrame((state) => {
    if (!rotRef.current) return;
    rotRef.current.rotation.y += 0.007;
    // légère lévitation
    rotRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.08;
  });

  return (
    <group ref={rotRef}>
      <group scale={normScale}>
        <group position={[cx, cy, cz]}>
          <primitive object={scene} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(GLB);

export default function GearsModel() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 1.2, 5], fov: 45 }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
        frameloop="always"
        dpr={[1, 1]}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <ambientLight intensity={3.0} />
        <directionalLight position={[3, 4, 3]}  intensity={2.5} />
        <directionalLight position={[-3, 1, -2]} intensity={1.0} />
        {/* Accent assorti à la card hôte (RAG, orange) depuis le swap drone ↔ robot */}
        <pointLight position={[0, 3, 3]} intensity={1.5} color="#ff6b35" />
        <Suspense fallback={null}>
          <DroneScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
