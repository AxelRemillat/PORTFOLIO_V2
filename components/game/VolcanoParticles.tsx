"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const LAVA_N = 35;
const SMOKE_N = 20;
const CRATER = new THREE.Vector3(0, 1.15, 0);
const SUMMIT = new THREE.Vector3(0, 1.25, 0);
const GRAV = -0.0025; // gravité locale vers le centre de la planète (≈ -Y)

const LAVA_HOT = new THREE.Color("#FF6600");
const LAVA_COLD = new THREE.Color("#FF2200");
const _c = new THREE.Color();

function makeGeo(n: number) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  return g;
}

// Fontaine de lave + fumée. Tout en coordonnées locales du volcan (+Y = haut).
export function VolcanoParticles() {
  const lavaGeo = useMemo(() => makeGeo(LAVA_N), []);
  const smokeGeo = useMemo(() => makeGeo(SMOKE_N), []);
  const s = useMemo(() => ({
    lavaVel: Array.from({ length: LAVA_N }, () => new THREE.Vector3()),
    lavaAge: new Float32Array(LAVA_N).fill(99),
    lavaLife: new Float32Array(LAVA_N).fill(1),
    smokeVel: Array.from({ length: SMOKE_N }, () => new THREE.Vector3()),
    smokeAge: new Float32Array(SMOKE_N).fill(99),
    smokeLife: new Float32Array(SMOKE_N).fill(1),
    smokeTimer: 0,
  }), []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const lp = lavaGeo.attributes.position.array as Float32Array;
    const lc = lavaGeo.attributes.color.array as Float32Array;

    // Spawn lave : 2–3 par frame
    let spawn = 2 + (Math.random() < 0.5 ? 1 : 0);
    for (let i = 0; i < LAVA_N && spawn > 0; i++) {
      if (s.lavaAge[i] < s.lavaLife[i]) continue;
      const a = Math.random() * Math.PI * 2, rr = Math.random() * 0.08;
      lp[i*3] = CRATER.x + Math.cos(a) * rr;
      lp[i*3+1] = CRATER.y + (Math.random() - 0.5) * 0.04;
      lp[i*3+2] = CRATER.z + Math.sin(a) * rr;
      s.lavaVel[i].set((Math.random()-0.5)*0.04, 0.04 + Math.random()*0.05, (Math.random()-0.5)*0.04);
      s.lavaAge[i] = 0;
      s.lavaLife[i] = 1.5 + Math.random() * 1.3;
      spawn--;
    }
    // Update lave (fontaine : monte puis retombe sous la gravité)
    for (let i = 0; i < LAVA_N; i++) {
      if (s.lavaAge[i] >= s.lavaLife[i]) { lc[i*3] = lc[i*3+1] = lc[i*3+2] = 0; continue; }
      s.lavaAge[i] += dt;
      const v = s.lavaVel[i];
      v.y += GRAV;
      lp[i*3] += v.x; lp[i*3+1] += v.y; lp[i*3+2] += v.z;
      if (lp[i*3+1] < 0) { s.lavaAge[i] = s.lavaLife[i]; lc[i*3]=lc[i*3+1]=lc[i*3+2]=0; continue; }
      const f = s.lavaAge[i] / s.lavaLife[i];
      const op = Math.sin(Math.min(f, 1) * Math.PI) * 0.9;
      _c.copy(LAVA_HOT).lerp(LAVA_COLD, f).multiplyScalar(op);
      lc[i*3] = _c.r; lc[i*3+1] = _c.g; lc[i*3+2] = _c.b;
    }
    lavaGeo.attributes.position.needsUpdate = true;
    lavaGeo.attributes.color.needsUpdate = true;

    // Fumée
    const sp = smokeGeo.attributes.position.array as Float32Array;
    const scl = smokeGeo.attributes.color.array as Float32Array;
    s.smokeTimer += dt;
    let puff = s.smokeTimer > 0.12;
    for (let i = 0; i < SMOKE_N; i++) {
      if (s.smokeAge[i] < s.smokeLife[i]) continue;
      if (!puff) continue;
      sp[i*3] = SUMMIT.x + (Math.random()-0.5)*0.06;
      sp[i*3+1] = SUMMIT.y;
      sp[i*3+2] = SUMMIT.z + (Math.random()-0.5)*0.06;
      s.smokeVel[i].set((Math.random()-0.5)*0.004, 0.01 + Math.random()*0.006, (Math.random()-0.5)*0.004);
      s.smokeAge[i] = 0;
      s.smokeLife[i] = 2 + Math.random() * 2;
      puff = false; s.smokeTimer = 0;
    }
    for (let i = 0; i < SMOKE_N; i++) {
      if (s.smokeAge[i] >= s.smokeLife[i]) { scl[i*3]=scl[i*3+1]=scl[i*3+2]=0; continue; }
      s.smokeAge[i] += dt;
      const v = s.smokeVel[i];
      v.x = (v.x + (Math.random()-0.5)*0.008) * 0.92; // drift horizontal amorti
      v.z = (v.z + (Math.random()-0.5)*0.008) * 0.92;
      sp[i*3] += v.x; sp[i*3+1] += v.y; sp[i*3+2] += v.z;
      const op = Math.sin(Math.min(s.smokeAge[i]/s.smokeLife[i], 1) * Math.PI);
      scl[i*3] = 0.53*op; scl[i*3+1] = 0.47*op; scl[i*3+2] = 0.40*op; // #887766 fondu
    }
    smokeGeo.attributes.position.needsUpdate = true;
    smokeGeo.attributes.color.needsUpdate = true;
  });

  return (
    <>
      <points geometry={lavaGeo}>
        <pointsMaterial size={0.08} sizeAttenuation vertexColors transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <points geometry={smokeGeo}>
        <pointsMaterial size={0.18} sizeAttenuation vertexColors transparent opacity={0.25} depthWrite={false} />
      </points>
    </>
  );
}
