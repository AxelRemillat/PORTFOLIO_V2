"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type OrbState = "idle" | "thinking" | "speaking";

// Shells démarrent à 0.55 — zone morte autour du réacteur (r < 0.48)
const SHELLS = [0.55, 0.75, 0.98, 1.28, 1.55, 1.78, 1.95];
const R_MAX  = 2.05;
const R_DEAD = 0.48;

// Spread très serré → shells visuellement lisibles (structure sphérique)
function sphPt(r: number, spread = 0.022): THREE.Vector3 {
  const phi = Math.acos(2 * Math.random() - 1), th = Math.random() * Math.PI * 2;
  const rj  = r + (Math.random() - 0.5) * spread;
  return new THREE.Vector3(rj*Math.sin(phi)*Math.cos(th), rj*Math.cos(phi), rj*Math.sin(phi)*Math.sin(th));
}

export default function NeuralField({ state }: { state: OrbState }) {
  const ambRef  = useRef<THREE.Points>(null);
  const shRef   = useRef<THREE.Points>(null);
  const nodeRef = useRef<THREE.Points>(null);
  const tRef    = useRef(0);

  const geos = useMemo(() => {
    // Couche 1 — poussière ambiante éparse (4 000 pts) — donne la profondeur, pas le volume
    const N1 = 4000;
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

    // Couche 2 — particules sur shells (13 000 pts, spread 0.022 = anneaux bien définis)
    const N2 = 13000;
    const p2 = new Float32Array(N2 * 3), c2 = new Float32Array(N2 * 3);
    for (let i = 0; i < N2; i++) {
      const sh = SHELLS[Math.floor(Math.random() * SHELLS.length)];
      const pt = sphPt(sh, 0.022);
      p2[i*3]=pt.x; p2[i*3+1]=pt.y; p2[i*3+2]=pt.z;
      const t = sh / R_MAX, rnd = Math.random();
      if (rnd < 0.06)       { c2[i*3]=1;   c2[i*3+1]=1;   c2[i*3+2]=1;  }
      else if (rnd < 0.28)  { c2[i*3]=0.2+(1-t)*0.6; c2[i*3+1]=0.85; c2[i*3+2]=1; }
      else                  { c2[i*3]=0.03; c2[i*3+1]=0.20+(1-t)*0.33; c2[i*3+2]=0.72+(1-t)*0.22; }
    }
    const g2 = new THREE.BufferGeometry();
    g2.setAttribute("position", new THREE.BufferAttribute(p2, 3));
    g2.setAttribute("color",    new THREE.BufferAttribute(c2, 3));

    // Couche 3 — nœuds brillants rares (400 pts)
    const N3 = 400;
    const p3 = new Float32Array(N3 * 3), c3 = new Float32Array(N3 * 3);
    for (let i = 0; i < N3; i++) {
      const sh = SHELLS[Math.floor(Math.random() * SHELLS.length)];
      const pt = sphPt(sh, 0.010);
      p3[i*3]=pt.x; p3[i*3+1]=pt.y; p3[i*3+2]=pt.z;
      const t = sh / R_MAX;
      c3[i*3]=0.85+(1-t)*0.15; c3[i*3+1]=0.95; c3[i*3+2]=1;
    }
    const g3 = new THREE.BufferGeometry();
    g3.setAttribute("position", new THREE.BufferAttribute(p3, 3));
    g3.setAttribute("color",    new THREE.BufferAttribute(c3, 3));

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
          blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={0.65} />
      </points>
      {/* Shell particles — spread serré = structure sphérique visible */}
      <points ref={shRef} geometry={geos.g2}>
        <pointsMaterial size={0.018} vertexColors sizeAttenuation
          blending={THREE.AdditiveBlending} depthWrite={false} transparent />
      </points>
      {/* Nœuds brillants — grands, rares, pulsants */}
      <points ref={nodeRef} geometry={geos.g3}>
        <pointsMaterial size={0.055} vertexColors sizeAttenuation
          blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={0.82} />
      </points>
    </>
  );
}
