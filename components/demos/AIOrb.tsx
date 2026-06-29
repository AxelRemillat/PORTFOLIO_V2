"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import NeuralField from "./NeuralField";
import NeuralFilaments from "./NeuralFilaments";
import EnergyRays from "./EnergyRays";

type OrbState = "idle" | "thinking" | "speaking";

const RINGS = [
  { r: 0.42, tube: 0.006, rot: [Math.PI / 2, 0, 0] as [number, number, number], opacity: 0.9, color: "#66eeff", speed: 0.003 },
  { r: 0.72, tube: 0.007, rot: [Math.PI / 2, 0.3, 0] as [number, number, number], opacity: 0.65, color: "#44ccff", speed: -0.002 },
  { r: 1.05, tube: 0.005, rot: [Math.PI / 2.2, 0, Math.PI / 5] as [number, number, number], opacity: 0.45, color: "#2299ff", speed: 0.0018 },
  { r: 1.38, tube: 0.004, rot: [Math.PI / 2, Math.PI / 4, 0] as [number, number, number], opacity: 0.28, color: "#1166dd", speed: -0.0012 },
  { r: 1.65, tube: 0.003, rot: [Math.PI / 3, 0, Math.PI / 3] as [number, number, number], opacity: 0.16, color: "#7733ff", speed: 0.0009 },
];

// Opacités de base des 5 couches du noyau reactor (layer 0 = noyau dur opaque).
const CORE_BASE_OP = [1, 0.85, 0.95, 0.18, 0.07];

export default function AIOrb({ state }: { state: OrbState }) {
  const ringRefs = useRef<(THREE.Mesh | null)[]>([]);
  const coreRefs = useRef<(THREE.Mesh | null)[]>([]);
  const caOffset = useMemo(() => new THREE.Vector2(0.0012, 0.0012), []);
  const timeRef = useRef(0);

  const gl = useThree((s) => s.gl);
  const [fxReady, setFxReady] = useState(false);
  useEffect(() => {
    const check = () => {
      const ctx = gl.getContext();
      setFxReady(!!ctx && !ctx.isContextLost() && !!ctx.getContextAttributes());
    };
    const id = requestAnimationFrame(check);
    const c = gl.domElement;
    const onLost = () => setFxReady(false);
    c.addEventListener("webglcontextlost", onLost);
    c.addEventListener("webglcontextrestored", check);
    return () => {
      cancelAnimationFrame(id);
      c.removeEventListener("webglcontextlost", onLost);
      c.removeEventListener("webglcontextrestored", check);
    };
  }, [gl]);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;
    const spd = state === "speaking" ? 2.2 : state === "thinking" ? 1.4 : 0.8;

    RINGS.forEach((ring, i) => {
      const m = ringRefs.current[i];
      if (!m) return;
      m.rotation.z += ring.speed * spd;
      m.rotation.x += ring.speed * 0.6 * spd;
    });

    coreRefs.current.forEach((m, i) => {
      if (!m) return;
      if (i === 2) m.rotation.z += 0.002 * spd; // anneau cyan tourne lentement
      if (i === 0) return; // noyau dur opaque : pas de pulsation
      const mat = m.material as THREE.MeshBasicMaterial;
      const pulse = Math.sin(t * spd * (1.0 + i * 0.2) + i * 1.2) * 0.12;
      mat.opacity = Math.min(1, Math.max(0, CORE_BASE_OP[i] + pulse));
    });
  });

  return (
    <>
      {/* Noyau reactor — point dur + halo + anneau cyan + halos diffus */}
      <mesh ref={(m) => { coreRefs.current[0] = m; }}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh ref={(m) => { coreRefs.current[1] = m; }}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshBasicMaterial color="#e8f8ff" transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} ref={(m) => { coreRefs.current[2] = m; }}>
        <torusGeometry args={[0.24, 0.022, 8, 80]} />
        <meshBasicMaterial color="#00eeff" transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={(m) => { coreRefs.current[3] = m; }}>
        <sphereGeometry args={[0.44, 20, 20]} />
        <meshBasicMaterial color="#3377ff" transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={(m) => { coreRefs.current[4] = m; }}>
        <sphereGeometry args={[0.82, 20, 20]} />
        <meshBasicMaterial color="#0a1a55" transparent opacity={0.07} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Anneaux orbitaux */}
      {RINGS.map((ring, i) => (
        <mesh key={i} rotation={ring.rot} ref={(m) => { ringRefs.current[i] = m; }}>
          <torusGeometry args={[ring.r, ring.tube, 8, 200]} />
          <meshBasicMaterial color={ring.color} transparent opacity={ring.opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}

      <NeuralField state={state} />
      <NeuralFilaments state={state} />
      <EnergyRays state={state} />

      <pointLight color="#5599ff" intensity={state === "speaking" ? 8 : 4} distance={10} />
      <pointLight color="#00ddff" intensity={3} distance={6} position={[1.5, 1, 1.5]} />
      <pointLight color="#ffffff" intensity={2} distance={3} />

      {fxReady && (
        <EffectComposer>
          <Bloom
            intensity={state === "speaking" ? 2.8 : state === "thinking" ? 1.8 : 1.2}
            luminanceThreshold={0.25}
            luminanceSmoothing={0.6}
            blendFunction={BlendFunction.ADD}
          />
          <ChromaticAberration offset={caOffset} blendFunction={BlendFunction.NORMAL} />
        </EffectComposer>
      )}
    </>
  );
}
