"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FieldCfg, genSeeds, genShellLayer, genNodeLayer } from "./neuralFieldGen";

type OrbState = "idle" | "thinking" | "speaking";

// Shells démarrent à 0.55 — zone morte autour du réacteur (r < 0.48)
const SHELLS = [0.55, 0.75, 0.98, 1.28, 1.55, 1.78, 1.95];
const R_MAX  = 2.05;
const R_DEAD = 0.48;

// ── Réglages du "grain" et de la géométrie douce (itère à l'œil) ────────────
// Amas    : clusterCount, clusterSigmaMin/Max (taille), clusterFrac (proportion)
// Filaments: lineCount/lineFrac, lineJitter (flou → ligne suggérée), aniso (veines)
// Enveloppe: envFrac (densité), envPatches (nb de plaques → porosité), envSpread
//            (taille des plaques), envDepth (épaisseur sous la surface), envBright
// Radiaux  : radialCount, radialFrac, radialJitter, radialBright
// Arcs     : arcCount, arcFrac, arcSpanMin/Max (portion d'anneau), arcJitter, arcBright
// Les *Bright < 1 atténuent la structure (fond additif) → géométrie SUGGÉRÉE.
const FIELD: FieldCfg = {
  shells: SHELLS, rMax: R_MAX, rDead: R_DEAD,
  n2: 10000, n3: 200,
  // amas : nuage clusterisé (amas + vides). Les seeds sont biaisés vers l'extérieur
  // (genSeeds) → moins de densité au centre.
  clusterCount: 22, clusterSigmaMin: 0.05, clusterSigmaMax: 0.17, clusterFrac: 0.55,
  lineCount: 8, lineFrac: 0.15, lineJitter: 0.07, aniso: 1.0,
  // Enveloppe / radiaux / arcs désormais gérés par des COMPOSANTS DÉDIÉS
  // (SurfaceField.tsx, CoreRays.tsx) → désactivés ici pour ne pas toucher le nuage.
  envFrac: 0, envPatches: 12, envSpread: 0.34, envDepth: 0.09, envBright: 0.85,
  radialFrac: 0, radialCount: 16, radialJitter: 0.03, radialBright: 0.55,
  arcFrac: 0, arcCount: 5, arcSpanMin: 1.4, arcSpanMax: 3.4, arcJitter: 0.03, arcBright: 0.75,
};
// ─────────────────────────────────────────────────────────────────────────────

export default function NeuralField({ state }: { state: OrbState }) {
  const ambRef  = useRef<THREE.Points>(null);
  const shRef   = useRef<THREE.Points>(null);
  const nodeRef = useRef<THREE.Points>(null);
  const tRef    = useRef(0);

  const geos = useMemo(() => {
    // Couche 1 — poussière ambiante éparse (uniforme : profondeur). Réduite pour
    // atténuer l'effet "champ d'étoiles" et laisser ressortir la structure.
    const N1 = 1700;
    const p1 = new Float32Array(N1 * 3), c1 = new Float32Array(N1 * 3);
    for (let i = 0; i < N1; i++) {
      const r = R_DEAD + Math.pow(Math.random(), 0.42) * (R_MAX - R_DEAD);
      const phi = Math.acos(2 * Math.random() - 1), th = Math.random() * Math.PI * 2;
      p1[i*3]=r*Math.sin(phi)*Math.cos(th); p1[i*3+1]=r*Math.cos(phi); p1[i*3+2]=r*Math.sin(phi)*Math.sin(th);
      const t = (r - R_DEAD) / (R_MAX - R_DEAD);
      c1[i*3]=0.02+(1-t)*0.05; c1[i*3+1]=0.06+(1-t)*0.12; c1[i*3+2]=0.32+(1-t)*0.38;
    }
    const g1 = new THREE.BufferGeometry();
    g1.setAttribute("position", new THREE.BufferAttribute(p1, 3));
    g1.setAttribute("color",    new THREE.BufferAttribute(c1, 3));

    // Graines d'amas partagées → couche shells (amas + traits + diffus) ET nœuds
    // (cœurs lumineux au centre des amas) restent cohérents.
    const seeds = genSeeds(FIELD);

    const s2 = genShellLayer(FIELD, seeds);
    const g2 = new THREE.BufferGeometry();
    g2.setAttribute("position", new THREE.BufferAttribute(s2.pos, 3));
    g2.setAttribute("color",    new THREE.BufferAttribute(s2.col, 3));

    const s3 = genNodeLayer(FIELD, seeds);
    const g3 = new THREE.BufferGeometry();
    g3.setAttribute("position", new THREE.BufferAttribute(s3.pos, 3));
    g3.setAttribute("color",    new THREE.BufferAttribute(s3.col, 3));

    return { g1, g2, g3 };
  }, []);

  useFrame((_, dt) => {
    tRef.current += dt;
    const t   = tRef.current;
    const spd = state === "speaking" ? 1.8 : state === "thinking" ? 1.1 : 0.55;
    if (ambRef.current)  ambRef.current.scale.setScalar(1 + 0.020 * Math.sin(t * spd * 0.65));
    if (shRef.current)   shRef.current.scale.setScalar(1  + 0.013 * Math.sin(t * spd * 0.85 + 0.9));
    if (nodeRef.current)
      (nodeRef.current.material as THREE.PointsMaterial).opacity = 0.62 + 0.38 * Math.sin(t * spd * 1.7 + 0.5);
  });

  return (
    <>
      {/* Poussière ambiante — éparse, sombre, donne la profondeur */}
      <points ref={ambRef} geometry={geos.g1}>
        <pointsMaterial size={0.008} vertexColors sizeAttenuation
          blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={0.5} />
      </points>
      {/* Shell particles — densité organique : amas + vides + filaments doux */}
      <points ref={shRef} geometry={geos.g2}>
        <pointsMaterial size={0.018} vertexColors sizeAttenuation
          blending={THREE.AdditiveBlending} depthWrite={false} transparent />
      </points>
      {/* Nœuds brillants — grands, rares, pulsants (cœurs d'amas) */}
      <points ref={nodeRef} geometry={geos.g3}>
        <pointsMaterial size={0.055} vertexColors sizeAttenuation
          blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={0.82} />
      </points>
    </>
  );
}
