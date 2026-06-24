"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

function AirplaneModel() {
  const { scene } = useGLTF("/Airplane.glb");
  const rotRef = useRef<THREE.Group>(null);

  const { normScale, cx, cy, cz } = useMemo(() => {
    const box    = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size   = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const safeMax = maxDim > 0 ? maxDim : 1;
    console.log("[PlaneModel] bbox size:", size, "maxDim:", safeMax, "center:", center);
    return {
      normScale: 3.5 / safeMax,
      cx: -center.x,
      cy: -center.y,
      cz: -center.z,
    };
  }, [scene]);

  useFrame((state) => {
    if (!rotRef.current) return;
    rotRef.current.rotation.y += 0.008;
    rotRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
  });

  // Hiérarchie correcte :
  //  rotRef  → rotation (useFrame)
  //    scale group → normalise la taille
  //      center group → déplace le modèle pour centrer sur l'origine
  //        primitive → scène GLTF non mutée
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

useGLTF.preload("/Airplane.glb");

export default function PlaneModel() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 40 }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
        frameloop="always"
        dpr={[1, 1]}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[3, 3, 3]} intensity={2.0} color="#38bdf8" />
        <pointLight position={[-2, -1, 2]} intensity={0.5} color="#ffffff" />
        <Suspense fallback={null}>
          <AirplaneModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
