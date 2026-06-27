"use client";

import { useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PORTALS } from "./constants/game";

// Chemin de lucioles guidant le joueur vers le portail ciblé. Les positions sont
// calculées par interpolation SPHÉRIQUE (slerp) entre la direction du joueur et
// celle du portail → les lucioles restent toujours sur la surface (jamais à
// l'intérieur de la planète, contrairement à un lerp cartésien en ligne droite).

const N_FIREFLIES = 14;

const _pdir = new THREE.Vector3();
const _qdir = new THREE.Vector3();
const _dir  = new THREE.Vector3();
const _rel  = new THREE.Vector3();
const _nrm  = new THREE.Vector3();

// Slerp entre deux directions unitaires (THREE.Vector3 n'a pas de .slerp()).
function slerpDir(a: THREE.Vector3, b: THREE.Vector3, t: number, out: THREE.Vector3) {
  const dot = THREE.MathUtils.clamp(a.dot(b), -1, 1);
  if (dot > 0.9999) return out.copy(a);
  const theta = Math.acos(dot) * t;
  _rel.copy(b).addScaledVector(a, -dot).normalize();
  return out.copy(a).multiplyScalar(Math.cos(theta)).addScaledVector(_rel, Math.sin(theta));
}

interface Props {
  playerPosRef: MutableRefObject<THREE.Vector3>;
  targetPortalId: string | null; // id de quête, ex. "visit_rag"
  planetRadius: number;
}

// Wrapper : ne monte le chemin que lorsqu'une cible est active (remontage = reset
// de l'apparition progressive). Aucun hook ici → ordre des hooks stable.
export function FireflyPath({ playerPosRef, targetPortalId, planetRadius }: Props) {
  if (!targetPortalId) return null;
  return (
    <FireflyPathInner
      key={targetPortalId}
      playerPosRef={playerPosRef}
      targetPortalId={targetPortalId}
      planetRadius={planetRadius}
    />
  );
}

function FireflyPathInner({ playerPosRef, targetPortalId, planetRadius }: Props) {
  const portalPos = useMemo(() => {
    const pid = (targetPortalId ?? "").replace("visit_", "");
    const p = PORTALS.find((x) => x.id === pid);
    return p ? new THREE.Vector3(...p.position) : null;
  }, [targetPortalId]);

  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const matRefs  = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const lightRef = useRef<THREE.PointLight>(null);
  const spawn    = useRef(0);

  // Positions de base sur la surface (sans bob), recalculées seulement quand le
  // joueur bouge (ou au remontage si la cible change), pas à chaque frame.
  const basePos    = useRef<THREE.Vector3[]>(Array.from({ length: N_FIREFLIES }, () => new THREE.Vector3()));
  const lastPlayer = useRef(new THREE.Vector3(Infinity, Infinity, Infinity));

  const rebuild = () => {
    if (!portalPos) return;
    _pdir.copy(playerPosRef.current).normalize();
    _qdir.copy(portalPos).normalize();
    for (let i = 0; i < N_FIREFLIES; i++) {
      const t = (i + 1) / (N_FIREFLIES + 1); // ignore les extrémités (joueur/portail)
      slerpDir(_pdir, _qdir, t, _dir);        // direction sur le grand cercle (unitaire)
      const hover = 0.18 + Math.sin(i * 2.3) * 0.08; // hauteur le long de la normale
      basePos.current[i].copy(_dir).multiplyScalar(planetRadius + hover);
    }
  };

  useFrame((state, delta) => {
    if (!portalPos) return;
    const t = state.clock.elapsedTime;
    spawn.current += delta;

    if (lastPlayer.current.distanceToSquared(playerPosRef.current) > 1e-4) {
      rebuild();
      lastPlayer.current.copy(playerPosRef.current);
    }

    for (let i = 0; i < N_FIREFLIES; i++) {
      const mesh = meshRefs.current[i];
      const mat = matRefs.current[i];
      if (!mesh || !mat) continue;

      // Bob le long de la normale locale (= direction depuis le centre), pas en Y monde.
      _nrm.copy(basePos.current[i]).normalize();
      mesh.position.copy(basePos.current[i]).addScaledVector(_nrm, Math.sin(t * 1.8 + i * 0.6) * 0.08);

      // Vague de brillance en cascade (effet "suis-moi" séquentiel).
      const base = i === 0 ? 3.5 : 2.5;
      mat.emissiveIntensity = base + Math.sin(t * 2.5 + i * 0.7) * 1.2;

      // Apparition progressive : délai i × 80 ms, fondu sur 0.4 s, jusqu'à 0.85.
      mat.opacity = THREE.MathUtils.clamp((spawn.current - i * 0.08) / 0.4, 0, 1) * 0.85;
    }

    const head = meshRefs.current[0];
    if (lightRef.current && head) lightRef.current.position.copy(head.position);
  });

  return (
    <group>
      {Array.from({ length: N_FIREFLIES }).map((_, i) => (
        <mesh key={i} ref={(el) => { meshRefs.current[i] = el; }} scale={i === 0 ? 1.45 : 1}>
          <sphereGeometry args={[0.055, 6, 6]} />
          <meshStandardMaterial
            ref={(el) => { matRefs.current[i] = el; }}
            color="#FFE8A0"
            emissive="#FFE8A0"
            emissiveIntensity={2.5}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}
      <pointLight ref={lightRef} color="#FFE8A0" intensity={0.4} distance={1.5} />
    </group>
  );
}
