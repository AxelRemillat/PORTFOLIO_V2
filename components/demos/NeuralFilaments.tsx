"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type OrbState = "idle" | "thinking" | "speaking";
const SPHERE_R = 1.8;
const N_FIL = 60, PTS = 12, SEG = PTS - 1;
const TOTAL_V = N_FIL * SEG * 2;
const N_IMP = 6; // impulsions simultanées

type Fil = { ctrl: THREE.Vector3[]; birth: number; life: number; pts: Float32Array };
type Imp = { f: number; t: number };

function rnd(r = SPHERE_R) {
  const u = Math.pow(Math.random(), 0.4) * r, t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1);
  return new THREE.Vector3(u * Math.sin(p) * Math.cos(t), u * Math.sin(p) * Math.sin(t), u * Math.cos(p));
}

function computePts(ctrl: THREE.Vector3[]): Float32Array {
  const curve = new THREE.CatmullRomCurve3(ctrl, false, "catmullrom", 0.5);
  const pts3d = curve.getPoints(PTS - 1);
  const arr = new Float32Array(PTS * 3);
  for (let i = 0; i < PTS; i++) { arr[i * 3] = pts3d[i].x; arr[i * 3 + 1] = pts3d[i].y; arr[i * 3 + 2] = pts3d[i].z; }
  return arr;
}

function makeFil(now: number): Fil {
  const origin = rnd(SPHERE_R * 0.65);
  const ctrl = [origin.clone(), origin.clone().add(rnd(0.45)), origin.clone().add(rnd(0.75)), rnd(SPHERE_R * 0.9)];
  return { ctrl, birth: now, life: 1.5 + Math.random() * 2.5, pts: computePts(ctrl) };
}

export default function NeuralFilaments({ state }: { state: OrbState }) {
  const geoRef = useRef<THREE.BufferGeometry>(null);
  const impGeoRef = useRef<THREE.BufferGeometry>(null);
  const timeRef = useRef(0);

  const { posBuf, colBuf, filaments, impulses, impPosBuf, impColBuf } = useMemo(() => ({
    posBuf: new Float32Array(TOTAL_V * 3),
    colBuf: new Float32Array(TOTAL_V * 3),
    impPosBuf: new Float32Array(N_IMP * 3),
    impColBuf: new Float32Array(N_IMP * 3),
    filaments: Array.from({ length: N_FIL }, (_, i) => makeFil(-i * 0.1)) as Fil[],
    impulses: Array.from({ length: N_IMP }, () => ({ f: Math.floor(Math.random() * N_FIL), t: Math.random() })) as Imp[],
  }), []);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const now = timeRef.current;
    const spd = state === "speaking" ? 1.4 : state === "thinking" ? 1.0 : 0.6;
    const impSpd = state === "speaking" ? 0.7 : 0.35;

    for (let i = 0; i < N_IMP; i++) {
      impulses[i].t += delta * impSpd;
      if (impulses[i].t >= 1) { impulses[i].t = 0; impulses[i].f = Math.floor(Math.random() * N_FIL); }
      const imp = impulses[i];
      const fpts = filaments[imp.f]?.pts;
      if (fpts) {
        const pi = Math.min(PTS - 2, Math.floor(imp.t * (PTS - 1)));
        const al = imp.t * (PTS - 1) - pi;
        impPosBuf[i * 3] = fpts[pi * 3] + (fpts[(pi + 1) * 3] - fpts[pi * 3]) * al;
        impPosBuf[i * 3 + 1] = fpts[pi * 3 + 1] + (fpts[(pi + 1) * 3 + 1] - fpts[pi * 3 + 1]) * al;
        impPosBuf[i * 3 + 2] = fpts[pi * 3 + 2] + (fpts[(pi + 1) * 3 + 2] - fpts[pi * 3 + 2]) * al;
        impColBuf[i * 3] = 1.0; impColBuf[i * 3 + 1] = 1.0; impColBuf[i * 3 + 2] = 1.0;
      }
    }

    for (let f = 0; f < N_FIL; f++) {
      const fil = filaments[f];
      const age = (now * spd - fil.birth) / fil.life;
      if (age >= 1) { filaments[f] = makeFil(now * spd); continue; }
      let op = age < 0.2 ? age / 0.2 : age > 0.8 ? (1 - age) / 0.2 : 1.0;
      op *= 0.5;

      const hasImp = impulses.some((imp) => imp.f === f);
      if (hasImp) op = Math.min(1, op * 2.2);

      const fpts = fil.pts; // pré-calculé, pas de new CatmullRomCurve3 ici
      const base = f * SEG * 2;
      for (let s = 0; s < SEG; s++) {
        const vi0 = (base + s * 2) * 3, vi1 = vi0 + 3;
        posBuf[vi0] = fpts[s * 3]; posBuf[vi0 + 1] = fpts[s * 3 + 1]; posBuf[vi0 + 2] = fpts[s * 3 + 2];
        posBuf[vi1] = fpts[(s + 1) * 3]; posBuf[vi1 + 1] = fpts[(s + 1) * 3 + 1]; posBuf[vi1 + 2] = fpts[(s + 1) * 3 + 2];
        const d = Math.sqrt(fpts[s * 3] ** 2 + fpts[s * 3 + 1] ** 2 + fpts[s * 3 + 2] ** 2) / SPHERE_R;
        const r = (0.3 + (1 - d) * 0.7) * op, g = (0.8 + (1 - d) * 0.2) * op, b = op;
        colBuf[vi0] = r; colBuf[vi0 + 1] = g; colBuf[vi0 + 2] = b;
        colBuf[vi1] = r; colBuf[vi1 + 1] = g; colBuf[vi1 + 2] = b;
      }
    }

    const geo = geoRef.current;
    if (geo) {
      if (!geo.attributes.position) {
        geo.setAttribute("position", new THREE.BufferAttribute(posBuf, 3));
        geo.setAttribute("color", new THREE.BufferAttribute(colBuf, 3));
      }
      geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true;
    }
    const ig = impGeoRef.current;
    if (ig) {
      if (!ig.attributes.position) {
        ig.setAttribute("position", new THREE.BufferAttribute(impPosBuf, 3));
        ig.setAttribute("color", new THREE.BufferAttribute(impColBuf, 3));
      }
      ig.attributes.position.needsUpdate = true; ig.attributes.color.needsUpdate = true;
    }
  });

  return (
    <>
      <lineSegments>
        <bufferGeometry ref={geoRef} />
        <lineBasicMaterial vertexColors blending={THREE.AdditiveBlending} depthWrite={false} transparent />
      </lineSegments>
      {/* Points d'impulsion voyageant le long des filaments */}
      <points>
        <bufferGeometry ref={impGeoRef} />
        <pointsMaterial size={0.04} vertexColors sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={0.9} />
      </points>
    </>
  );
}
