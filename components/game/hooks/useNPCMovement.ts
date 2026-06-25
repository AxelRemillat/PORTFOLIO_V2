import { useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface NPCMovementOptions {
  groupRef: MutableRefObject<THREE.Group | null>;
  positionRef: MutableRefObject<THREE.Vector3>; // position courante (init par l'appelant = start)
  planetRadius: number;
  speed: number;
  waitTimeRange: [number, number];
  avoidPositions?: THREE.Vector3[];                  // statique (portails)
  avoidRefs?: MutableRefObject<THREE.Vector3>[];     // dynamique (autre NPC)
  pausedRef?: MutableRefObject<boolean>;
  // Mode familier : suit une cible (le joueur) à distance constante.
  followRef?: MutableRefObject<THREE.Vector3>;
  followingRef?: MutableRefObject<boolean>;
  followSpeed?: number;     // rad/s
  followDistance?: number;  // unités world où il s'arrête derrière la cible
}

// Temps module-level (les useFrame des NPC s'exécutent séquentiellement, pas en parallèle)
const _n = new THREE.Vector3();
const _face = new THREE.Vector3();
const _ax = new THREE.Vector3();
const _az = new THREE.Vector3();
const _m4 = new THREE.Matrix4();
const _cur = new THREE.Vector3();
const _tgt = new THREE.Vector3();
const _perp = new THREE.Vector3();
const _res = new THREE.Vector3();
const _cand = new THREE.Vector3();
const _rand = new THREE.Vector3();
const AVOID_DIST = 1.5;

const rand = (r: [number, number]) => r[0] + Math.random() * (r[1] - r[0]);

// Interpolation sur le grand cercle entre deux vecteurs unitaires a→b par t
function slerpUnit(a: THREE.Vector3, b: THREE.Vector3, t: number, out: THREE.Vector3) {
  const dot = THREE.MathUtils.clamp(a.dot(b), -1, 1);
  const theta = Math.acos(dot) * t;
  _perp.copy(b).addScaledVector(a, -dot);
  if (_perp.lengthSq() < 1e-10) return out.copy(a);
  _perp.normalize();
  return out.copy(a).multiplyScalar(Math.cos(theta)).addScaledVector(_perp, Math.sin(theta)).normalize();
}

export function useNPCMovement(opts: NPCMovementOptions) {
  const { planetRadius, speed, waitTimeRange } = opts;
  const target = useRef(opts.positionRef.current.clone());
  const state = useRef<"moving" | "waiting">("waiting");
  const timer = useRef(rand(waitTimeRange));
  const faceRef = useRef(new THREE.Vector3(0, 0, 1));
  const isMovingRef = useRef(false);
  const animPhaseRef = useRef(0);

  function tooClose(p: THREE.Vector3) {
    if (opts.avoidPositions) for (const a of opts.avoidPositions) if (p.distanceTo(a) < AVOID_DIST) return true;
    if (opts.avoidRefs) for (const r of opts.avoidRefs) if (r.current && p.distanceTo(r.current) < AVOID_DIST) return true;
    return false;
  }

  function pickTarget() {
    for (let i = 0; i < 30; i++) {
      _rand.randomDirection();
      _cand.copy(_rand).multiplyScalar(planetRadius);
      if (!tooClose(_cand)) { target.current.copy(_cand); return; }
    }
    target.current.copy(_cand); // fallback
  }

  useFrame((_, delta) => {
    const pos = opts.positionRef.current;
    const d = Math.min(delta, 0.05);

    if (opts.pausedRef?.current) {
      isMovingRef.current = false;
    } else if (opts.followingRef?.current && opts.followRef) {
      // ── Mode familier : avance à vitesse constante vers le joueur, s'arrête à followDistance
      const player = opts.followRef.current;
      _cur.copy(pos).normalize();
      _tgt.copy(player).normalize();
      const ang = Math.acos(THREE.MathUtils.clamp(_cur.dot(_tgt), -1, 1));
      const stopAng = (opts.followDistance ?? 0.9) / planetRadius;
      const stepAng = Math.min((opts.followSpeed ?? 1.5) * d, ang - stopAng);
      if (ang > 1e-6 && stepAng > 1e-4) {
        isMovingRef.current = true;
        animPhaseRef.current += d;
        slerpUnit(_cur, _tgt, stepAng / ang, _res);
        pos.copy(_res).multiplyScalar(planetRadius);
        _n.copy(_res);
        faceRef.current.copy(_tgt).addScaledVector(_n, -_tgt.dot(_n));
        if (faceRef.current.lengthSq() > 1e-8) faceRef.current.normalize();
      } else {
        isMovingRef.current = false;
      }
    } else if (state.current === "waiting") {
      isMovingRef.current = false;
      timer.current -= d;
      if (timer.current <= 0) { pickTarget(); state.current = "moving"; }
    } else {
      isMovingRef.current = true;
      animPhaseRef.current += d;
      _cur.copy(pos).normalize();
      _tgt.copy(target.current).normalize();
      slerpUnit(_cur, _tgt, Math.min(1, speed * d * 60), _res);
      pos.copy(_res).multiplyScalar(planetRadius);
      // face = direction cible projetée sur le plan tangent
      _n.copy(_res);
      faceRef.current.copy(_tgt).addScaledVector(_n, -_tgt.dot(_n));
      if (faceRef.current.lengthSq() > 1e-8) faceRef.current.normalize();
      if (pos.distanceTo(target.current) < 0.12) {
        state.current = "waiting";
        timer.current = rand(waitTimeRange);
      }
    }

    // Orientation : up = normale de surface, forward (+Z local) = face — comme useSphericalMovement
    const g = opts.groupRef.current;
    if (g) {
      _n.copy(pos).normalize();
      _face.copy(faceRef.current).addScaledVector(_n, -faceRef.current.dot(_n));
      if (_face.lengthSq() < 1e-8) _face.set(0, 0, 1).addScaledVector(_n, -_n.z);
      _face.normalize();
      _ax.crossVectors(_n, _face).normalize();
      _az.crossVectors(_ax, _n).normalize();
      _m4.makeBasis(_ax, _n, _az);
      g.quaternion.setFromRotationMatrix(_m4);
      g.position.copy(pos);
    }
  });

  return { isMovingRef, animPhaseRef };
}
