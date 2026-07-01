"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type OrbState = "idle" | "thinking" | "speaking";

// Ondes "électromagnétiques" colorées à CERTAINS endroits de la surface : quelques
// foyers, chacun émet des ondulations concentriques dont la couleur cycle dans le
// spectre (cyan → violet → magenta). Positions fixes (init) ; seule la COULEUR est
// animée par frame (ripple qui se propage) — léger, comme NeuralFilaments.
// ── Constantes réglables ──
const SPOTS   = 4;     // nb de foyers (partiel → pas partout)
const COUNT   = 1600;  // particules totales
const SPREAD  = 0.5;   // étendue angulaire d'un foyer
const R_MAX   = 2.05;  // surface
const BAND    = 0.10;  // épaisseur
const FREQ    = 7.0;   // nb d'ondulations concentriques
const SPEED   = 1.6;   // vitesse de propagation
const AMP     = 0.9;   // intensité max

const randDir = () => {
  const phi = Math.acos(2 * Math.random() - 1), th = Math.random() * Math.PI * 2;
  return new THREE.Vector3(Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th));
};
const gauss = () => { const u = Math.random() || 1e-9, v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
// HSL→RGB (h,s,l ∈ [0,1]) écrit dans out à l'index i, multiplié par mul.
function hsl(h: number, s: number, l: number, out: Float32Array, i: number, mul: number) {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => { const k = (n + h * 12) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); };
  out[i] = f(0) * mul; out[i + 1] = f(8) * mul; out[i + 2] = f(4) * mul;
}

export default function SurfaceWaves({ state }: { state: OrbState }) {
  const geoRef = useRef<THREE.BufferGeometry>(null);
  const tRef = useRef(0);

  const { pos, col, phase, hue } = useMemo(() => {
    const spots = Array.from({ length: SPOTS }, () => ({ c: randDir(), hue: 0.5 + Math.random() * 0.35 })); // cyan→magenta
    const p = new Float32Array(COUNT * 3), c = new Float32Array(COUNT * 3);
    const ph = new Float32Array(COUNT), hu = new Float32Array(COUNT);
    const v = new THREE.Vector3(), j = new THREE.Vector3();
    for (let i = 0; i < COUNT; i++) {
      const s = spots[Math.floor(Math.random() * spots.length)];
      v.copy(s.c).addScaledVector(j.set(gauss(), gauss(), gauss()), SPREAD).normalize();
      ph[i] = Math.acos(Math.max(-1, Math.min(1, v.dot(s.c)))); // distance angulaire au foyer → rings
      hu[i] = s.hue;
      v.multiplyScalar(R_MAX - Math.random() * BAND);
      p[i * 3] = v.x; p[i * 3 + 1] = v.y; p[i * 3 + 2] = v.z;
    }
    return { pos: p, col: c, phase: ph, hue: hu };
  }, []);

  useFrame((_, dt) => {
    tRef.current += dt;
    const t = tRef.current;
    const spd = state === "speaking" ? 1.7 : state === "thinking" ? 1.2 : 1.0;
    for (let i = 0; i < COUNT; i++) {
      const w = 0.5 + 0.5 * Math.sin(t * SPEED * spd - phase[i] * FREQ); // onde propagée
      hsl((hue[i] + 0.06 * Math.sin(t * 0.3)) % 1, 0.9, 0.55, col, i * 3, w * w * AMP);
    }
    const g = geoRef.current;
    if (g) (g.attributes.color as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-color" args={[col, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.026} vertexColors sizeAttenuation transparent
        blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}
