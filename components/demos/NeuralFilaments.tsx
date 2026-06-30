"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type OrbState = "idle" | "thinking" | "speaking";

const SHELLS   = [0.08, 0.22, 0.42, 0.68, 0.98, 1.28, 1.55, 1.78];
const N_ACT    = 140;
const C_PTS    = 8;
const SEG      = C_PTS - 1;
const TOTAL_V  = N_ACT * SEG * 2;
const MAX_DIST = 0.54;

type Fil = { pts: Float32Array; birth: number; life: number; maxOp: number };

function sphPt(r: number): THREE.Vector3 {
  const phi = Math.acos(2 * Math.random() - 1), th = Math.random() * Math.PI * 2;
  return new THREE.Vector3(r*Math.sin(phi)*Math.cos(th), r*Math.cos(phi), r*Math.sin(phi)*Math.sin(th));
}

function makeFil(now: number, spd = 0.55, attempt = 0): Fil | null {
  if (attempt > 18) return null;
  const ia = Math.floor(Math.random() * SHELLS.length);
  const ib = Math.min(SHELLS.length - 1, ia + Math.floor(Math.random() * 3));
  const A  = sphPt(SHELLS[ia]), B = sphPt(SHELLS[ib]);
  const d  = A.distanceTo(B);
  if (d > MAX_DIST || d < 0.06) return makeFil(now, spd, attempt + 1);
  const M    = A.clone().add(B).multiplyScalar(0.5);
  const perp = new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize();
  M.add(perp.multiplyScalar(d * (0.15 + Math.random() * 0.30)));
  const curve = new THREE.QuadraticBezierCurve3(A, M, B);
  const pts   = new Float32Array(C_PTS * 3);
  for (let i = 0; i < C_PTS; i++) {
    const p = curve.getPoint(i / (C_PTS - 1));
    pts[i*3]=p.x; pts[i*3+1]=p.y; pts[i*3+2]=p.z;
  }
  // life divisé par spd : le cycle reste plus rapide en "speaking" sans jamais
  // produire un age négatif quand spd change (birth/age restent en temps réel)
  return { pts, birth: now, life: (1.2 + Math.random() * 2.8) / spd, maxOp: 0.16 + Math.random() * 0.34 };
}

export default function NeuralFilaments({ state }: { state: OrbState }) {
  const geoRef = useRef<THREE.BufferGeometry>(null);
  const tRef   = useRef(0);
  const inited = useRef(false);

  const { posBuf, colBuf, fils } = useMemo(() => ({
    posBuf: new Float32Array(TOTAL_V * 3),
    colBuf: new Float32Array(TOTAL_V * 3),
    fils: Array.from({ length: N_ACT }, (_, i) =>
      makeFil(-i * 0.12, 0.55) ?? { pts: new Float32Array(C_PTS * 3), birth: -999, life: 0.01, maxOp: 0 }
    ),
  }), []);

  useFrame((_, dt) => {
    tRef.current += dt;
    const now  = tRef.current;          // temps réel — JAMAIS multiplié par spd pour birth/age
    const spd  = state === "speaking" ? 1.8 : state === "thinking" ? 1.1 : 0.55;

    for (let f = 0; f < N_ACT; f++) {
      const c    = fils[f];
      const age  = (now - c.birth) / c.life;   // temps réel uniquement
      const base = f * SEG * 2;

      if (age >= 1) {
        // Effacer le slot — sinon les couleurs résiduelles restent visibles (lignes noires)
        for (let k = 0; k < SEG * 2; k++) {
          const v = (base + k) * 3;
          colBuf[v]=0; colBuf[v+1]=0; colBuf[v+2]=0;
        }
        const nf = makeFil(now, spd); if (nf) fils[f] = nf;
        continue;
      }
      const env  = c.maxOp * (age < 0.20 ? age/0.20 : age > 0.75 ? (1-age)/0.25 : 1.0);
      for (let s = 0; s < SEG; s++) {
        const v0 = (base + s * 2) * 3, v1 = v0 + 3;
        const p  = c.pts, t = s / SEG;
        posBuf[v0]=p[s*3]; posBuf[v0+1]=p[s*3+1]; posBuf[v0+2]=p[s*3+2];
        posBuf[v1]=p[(s+1)*3]; posBuf[v1+1]=p[(s+1)*3+1]; posBuf[v1+2]=p[(s+1)*3+2];
        const rc=(1.0-t*0.72)*env, gc=(0.88-t*0.42)*env, bc=env;
        colBuf[v0]=rc; colBuf[v0+1]=gc; colBuf[v0+2]=bc;
        colBuf[v1]=rc; colBuf[v1+1]=gc; colBuf[v1+2]=bc;
      }
    }

    const geo = geoRef.current;
    if (geo) {
      if (!inited.current) {
        geo.setAttribute("position", new THREE.BufferAttribute(posBuf, 3));
        geo.setAttribute("color",    new THREE.BufferAttribute(colBuf, 3));
        inited.current = true;
      }
      (geo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (geo.attributes.color    as THREE.BufferAttribute).needsUpdate = true;
    }
  });

  return (
    <lineSegments>
      <bufferGeometry ref={geoRef} />
      <lineBasicMaterial vertexColors blending={THREE.AdditiveBlending} depthWrite={false} transparent />
    </lineSegments>
  );
}
