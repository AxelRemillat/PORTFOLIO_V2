"use client";
import { useMemo, useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import NeuralField     from "./NeuralField";
import NeuralFilaments from "./NeuralFilaments";
import { useSpeakingAmplitude } from "./useSpeakingAmplitude";

type OrbState = "idle" | "thinking" | "speaking";

// ── Constantes réglables à l'œil ──────────────────────────────────────────
const GLOBAL_SCALE = 0.72; // Objectif 1 : rayon global de l'orbe (1.0 = ancienne taille)
const SPEAK_AMP    = 0.12; // Objectif 2 : dilatation max en "speaking" (±12% du rayon)
const SPEAK_GROW   = 12;   // vitesse de gonflement (rapide) — lerp = min(dt*SPEAK_GROW, 0.4)
const SPEAK_FALL   = 5;    // vitesse de retour au repos (plus mou)
// ──────────────────────────────────────────────────────────────────────────

const DISC = [
  { r:0.18, tube:0.008, rot:[Math.PI/2, 0,    0   ] as [number,number,number], color:"#ffffff", op:1.00 },
  { r:0.32, tube:0.006, rot:[Math.PI/2, 0,    0.18] as [number,number,number], color:"#aaddff", op:0.80 },
  { r:0.50, tube:0.005, rot:[Math.PI/2, 0.12, 0   ] as [number,number,number], color:"#66aaff", op:0.62 },
  { r:0.70, tube:0.004, rot:[Math.PI/2, 0,    0.28] as [number,number,number], color:"#3366bb", op:0.46 },
  { r:0.94, tube:0.003, rot:[Math.PI/2, 0.20, 0.12] as [number,number,number], color:"#2255aa", op:0.33 },
  { r:1.22, tube:0.002, rot:[Math.PI/2, 0.08, 0.22] as [number,number,number], color:"#1133aa", op:0.20 },
  { r:1.62, tube:0.0015,rot:[Math.PI/2, 0.15, 0.10] as [number,number,number], color:"#0a2288", op:0.13 },
];

// Pendant "speaking" : anneaux pairs se rétractent (vers l'intérieur),
// anneaux impairs s'extraient (vers l'extérieur) + décalage Y
const RING_SCALE_SPK = [0.80, 1.40, 0.74, 1.46, 0.68, 1.54, 0.62];
const RING_Y_SPK     = [-0.13, 0.11, -0.09, 0.07, -0.05, 0.03, -0.02];

export default function AIOrb({ state }: { state: OrbState }) {
  const groupRef   = useRef<THREE.Group>(null);
  const reactorRef = useRef<THREE.Group>(null);
  const plasmaRef  = useRef<THREE.Mesh>(null);
  const discRefs   = useRef<(THREE.Mesh | null)[]>([]);
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
    const lrp = Math.min(dt * 2.8, 0.13); // lerp — transition ~1s

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

    // Anneaux : extraction/rétraction alternée + déplacement Y → "blossoming"
    discRefs.current.forEach((m, i) => {
      if (!m) return;
      const tScale = state === "speaking" ? RING_SCALE_SPK[i] : 1.0;
      const tY     = state === "speaking" ? RING_Y_SPK[i]     : 0.0;
      m.scale.setScalar(m.scale.x + (tScale - m.scale.x) * lrp);
      m.position.y += (tY - m.position.y) * lrp;
      (m.material as THREE.MeshBasicMaterial).opacity =
        DISC[i].op * (0.48 + 0.52 * Math.sin(t * spd * 1.3 + i * 1.1));
    });
  });

  return (
    <>
      <group ref={groupRef}>
        <NeuralField     state={state} />
        <NeuralFilaments state={state} />

        <group ref={reactorRef}>
          {DISC.map((d, i) => (
            <mesh key={i} rotation={d.rot} ref={m => { discRefs.current[i] = m; }}>
              <torusGeometry args={[d.r, d.tube, 12, 180]} />
              <meshBasicMaterial color={d.color} transparent opacity={d.op}
                blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
          ))}

          {/* Plasma central — petit point + halo */}
          <mesh ref={plasmaRef}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.048, 8, 8]} />
            <meshBasicMaterial color="#cceeff" transparent opacity={0.42}
              blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.09, 8, 8]} />
            <meshBasicMaterial color="#2255ff" transparent opacity={0.07}
              blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        </group>

        <pointLight color="#3366ff" intensity={state === "speaking" ? 3.2 : 1.8} distance={8} />
        <pointLight color="#ffffff" intensity={1.8} distance={2} />
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
