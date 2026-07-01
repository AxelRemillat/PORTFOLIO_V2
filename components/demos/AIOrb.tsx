"use client";
import { useMemo, useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import NeuralField     from "./NeuralField";
import CoreRays        from "./CoreRays";
import SurfaceField    from "./SurfaceField";
import SurfaceWaves    from "./SurfaceWaves";
import { useSpeakingAmplitude } from "./useSpeakingAmplitude";

type OrbState = "idle" | "thinking" | "speaking";

// ── Constantes réglables à l'œil ──────────────────────────────────────────
const GLOBAL_SCALE = 0.72; // Objectif 1 : rayon global de l'orbe (1.0 = ancienne taille)
const SPEAK_AMP    = 0.12; // Objectif 2 : dilatation max en "speaking" (±12% du rayon)
const SPEAK_GROW   = 12;   // vitesse de gonflement (rapide) — lerp = min(dt*SPEAK_GROW, 0.4)
const SPEAK_FALL   = 5;    // vitesse de retour au repos (plus mou)
// ──────────────────────────────────────────────────────────────────────────

export default function AIOrb({ state }: { state: OrbState }) {
  const groupRef   = useRef<THREE.Group>(null);
  const reactorRef = useRef<THREE.Group>(null);
  const plasmaRef  = useRef<THREE.Mesh>(null);
  const tRef       = useRef(0);
  const gl         = useThree(s => s.gl);
  const [fx, setFx] = useState(false);
  const caOff      = useMemo(() => new THREE.Vector2(0.0005, 0.0005), []);
  const ampRef     = useSpeakingAmplitude(state); // amplitude voix [0..1] (0 hors speaking)

  useEffect(() => {
    const id = requestAnimationFrame(() => { const c = gl.getContext(); setFx(!!c && !c.isContextLost()); });
    const c = gl.domElement;
    const on = () => setFx(true), off = () => setFx(false);
    c.addEventListener("webglcontextrestored", on); c.addEventListener("webglcontextlost", off);
    return () => { cancelAnimationFrame(id); c.removeEventListener("webglcontextrestored", on); c.removeEventListener("webglcontextlost", off); };
  }, [gl]);

  useFrame((_, dt) => {
    tRef.current += dt;
    const t   = tRef.current;
    const spd = state === "speaking" ? 2.2 : state === "thinking" ? 1.3 : 0.6;

    if (groupRef.current)   groupRef.current.rotation.y   += 0.0012 * spd;
    if (reactorRef.current) reactorRef.current.rotation.y += 0.004  * spd;

    // Scale racine = taille globale (Obj.1) × pulse "parle" (Obj.2), multiplicatif.
    // amp 0..1 mappé sur [-SPEAK_AMP, +SPEAK_AMP] : voix faible → compression,
    // voix forte → expansion (effet bouche/voix numérique). Hors speaking : pulse=1.
    if (groupRef.current) {
      const speakMult = state === "speaking" ? 1 + SPEAK_AMP * (2 * ampRef.current - 1) : 1;
      const target = GLOBAL_SCALE * speakMult;
      const cur = groupRef.current.scale.x;
      // gonflement rapide, retour plus mou (pas de saccade)
      const k = target > cur ? Math.min(dt * SPEAK_GROW, 0.4) : Math.min(dt * SPEAK_FALL, 0.4);
      groupRef.current.scale.setScalar(cur + (target - cur) * k);
    }

    // Plasma heartbeat
    if (plasmaRef.current) plasmaRef.current.scale.setScalar(1 + 0.14 * Math.sin(t * spd * 2.8));
  });

  return (
    <>
      <group ref={groupRef}>
        <NeuralField     state={state} />
        <CoreRays        state={state} />
        <SurfaceField    state={state} />
        <SurfaceWaves    state={state} />

        <group ref={reactorRef}>
          {/* Sphère creuse semi-transparente autour du noyau (confinement réacteur) :
              coque additive très faible + rim wireframe → on "voit à travers", creux. */}
          <mesh>
            <sphereGeometry args={[0.34, 32, 24]} />
            <meshBasicMaterial color="#66ccff" transparent opacity={0.09}
              side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.345, 18, 12]} />
            <meshBasicMaterial color="#4499ff" wireframe transparent opacity={0.14}
              blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>

          {/* Plasma central — petit point + halo (atténué : moins de lumière au centre) */}
          <mesh ref={plasmaRef}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.048, 8, 8]} />
            <meshBasicMaterial color="#cceeff" transparent opacity={0.24}
              blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.09, 8, 8]} />
            <meshBasicMaterial color="#2255ff" transparent opacity={0.045}
              blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        </group>

        <pointLight color="#3366ff" intensity={state === "speaking" ? 3.2 : 1.8} distance={8} />
        <pointLight color="#ffffff" intensity={0.9} distance={1.6} />
        <pointLight color="#0077ff" intensity={1.0} distance={10} position={[3,2,3]} />
      </group>

      {fx && (
        <EffectComposer>
          <Bloom intensity={state === "speaking" ? 2.4 : state === "thinking" ? 1.7 : 1.1}
            luminanceThreshold={0.18} luminanceSmoothing={0.6} blendFunction={BlendFunction.ADD} />
          <ChromaticAberration offset={caOff} blendFunction={BlendFunction.NORMAL} />
        </EffectComposer>
      )}
    </>
  );
}
