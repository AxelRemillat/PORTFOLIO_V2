"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const GLB = "/classic_retro_vintage_metal_robot_toy_meshy_6.glb";

function RobotScene() {
  const { scene } = useGLTF(GLB);
  const rotRef = useRef<THREE.Group>(null);

  const { normScale, cx, cy, cz } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    if (box.isEmpty()) return { normScale: 1, cx: 0, cy: 0, cz: 0 };
    const center  = box.getCenter(new THREE.Vector3());
    const size    = box.getSize(new THREE.Vector3());
    const maxDim  = Math.max(size.x, size.y, size.z);
    return {
      normScale: 3.024 / maxDim, // 3.36 × 0.9
      cx: -center.x,
      cy: -center.y,
      cz: -center.z,
    };
  }, [scene]);

  useFrame((state) => {
    if (!rotRef.current) return;
    rotRef.current.rotation.y += 0.008;
    rotRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.06;
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

export default function RobotModel() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
        frameloop="always"
        dpr={[1, 1]}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <ambientLight intensity={4.0} />
        <directionalLight position={[2, 3, 3]}  intensity={2.0} />
        <directionalLight position={[-2, 1, -2]} intensity={1.0} />
        <Suspense fallback={null}>
          <RobotScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
