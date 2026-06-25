import { useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const L = THREE.MathUtils.lerp;
const clamp = THREE.MathUtils.clamp;

export interface AnimRefs {
  rootRef:      MutableRefObject<THREE.Group | null>;
  bodyGroupRef: MutableRefObject<THREE.Group | null>;
  headRef:      MutableRefObject<THREE.Mesh | null>;
  leftArmRef:   MutableRefObject<THREE.Group | null>;
  rightArmRef:  MutableRefObject<THREE.Group | null>;
  leftLegRef:   MutableRefObject<THREE.Group | null>;
  rightLegRef:  MutableRefObject<THREE.Group | null>;
  posRef:       MutableRefObject<THREE.Vector3>;
  movingRef:    MutableRefObject<boolean>;
  quatRef:      MutableRefObject<THREE.Quaternion>;
  scaleRef?:    MutableRefObject<number>;
  jumpRef?:     MutableRefObject<{ active: boolean; t: number }>;
  velRef:       MutableRefObject<THREE.Vector3>;
}

// Lerp one Euler axis toward a target — never snaps
function lerpRot(o: THREE.Object3D, axis: "x" | "y" | "z", target: number, f: number) {
  o.rotation[axis] = L(o.rotation[axis], target, f);
}

export function useLittlePrinceAnimation(r: AnimRefs) {
  const prevPos = useRef(new THREE.Vector3());
  const st = useRef({ phase: "idle" as "idle" | "walk" | "jump", walkCycle: 0, landingImpact: 0, speed: 0 });
  const wasJumping = useRef(false);

  useFrame((state, delta) => {
    if (!r.rootRef.current) return;
    const t  = state.clock.elapsedTime;
    const dt = Math.min(delta, 1 / 30);

    // Per-frame displacement → velocity for scarf physics
    r.velRef.current.subVectors(r.posRef.current, prevPos.current);
    prevPos.current.copy(r.posRef.current);

    // World transform
    r.rootRef.current.position.copy(r.posRef.current);
    r.rootRef.current.quaternion.copy(r.quatRef.current);
    r.rootRef.current.scale.setScalar(r.scaleRef?.current ?? 1);

    const bg = r.bodyGroupRef.current;
    const hd = r.headRef.current;
    const la = r.leftArmRef.current;
    const ra = r.rightArmRef.current;
    const ll = r.leftLegRef.current;
    const rl = r.rightLegRef.current;
    if (!bg || !hd || !la || !ra || !ll || !rl) return;

    // ── Derive state (isMoving / isJumping / speed 0..1) from the existing refs ──
    const isJumping = r.jumpRef?.current.active ?? false;
    const isMoving  = r.movingRef.current && !isJumping;
    const velLen    = r.velRef.current.length();
    const s = st.current;

    // smoothed normalised speed; defaults toward 1 while moving
    const tgtSpeed = isMoving ? clamp(velLen / 0.03, 0.45, 1) : 0;
    s.speed = L(s.speed, tgtSpeed, 0.12);
    s.walkCycle += dt * 8 * s.speed;

    // Landing detection → trigger squash impact
    if (wasJumping.current && !isJumping) s.landingImpact = 1;
    wasJumping.current = isJumping;
    s.landingImpact = L(s.landingImpact, 0, 0.2);

    // ── Per-state targets (everything reached via lerp) ──────────────────────────
    let posY = 0, bodyX = 0, bodyZ = 0;
    let lArmX = 0, rArmX = 0, lArmZ = 0, rArmZ = 0;
    let lLegX = 0, rLegX = 0;
    let headX = 0, headY = 0, headZ = 0;
    let scaleY = 1, scaleXZ = 1, limbF = 0.15;

    if (isJumping) {
      s.phase = "jump";
      const rising = (r.jumpRef?.current.t ?? 0) < 0.5;
      if (rising) {
        lArmX = rArmX = -1.2;      // arms up
        lLegX = rLegX = 0.6;       // knees tucked
        bodyX = -0.15; headX = -0.1;
        scaleY = 1.2; scaleXZ = 0.92;
      } else {
        lArmX = rArmX = 0;         // arms neutral
        lLegX = rLegX = -0.2;      // legs extend to land
        bodyX = 0.1; headX = 0;
        scaleY = 0.95; scaleXZ = 1.04;
      }
    } else if (isMoving) {
      s.phase = "walk";
      limbF = 0.3;                 // keep visible swing amplitude
      const sw = Math.sin(s.walkCycle);
      const op = Math.sin(s.walkCycle + Math.PI);
      lLegX =  sw * 0.5;  rLegX = op * 0.5;
      lArmX =  op * 0.4;  rArmX = sw * 0.4;         // arms oppose legs
      lArmZ =  Math.cos(s.walkCycle) * 0.1;
      rArmZ = -Math.cos(s.walkCycle) * 0.1;
      bodyZ = sw * 0.03;                            // lateral sway
      bodyX = 0.08;                                 // slight forward lean
      posY  = Math.abs(sw) * 0.02;
      headZ = -bodyZ;                               // counter-rotate, head stays up
    } else {
      s.phase = "idle";
      limbF = 0.1;
      posY  = Math.sin(t * 1.2) * 0.008;            // breathing
      const ao = Math.sin(t * 0.8) * 0.05;
      lArmZ =  ao;  rArmZ = -ao;                    // gentle symmetric sway
      const lo = Math.sin(t * 0.6) * 0.02;
      lLegX = lo;  rLegX = lo;
      headY = Math.sin(t * 0.4) * 0.04;             // wandering gaze
    }

    // ── Apply, all via lerp ──────────────────────────────────────────────────────
    bg.position.y = L(bg.position.y, posY - s.landingImpact * 0.05, 0.2);
    lerpRot(bg, "x", bodyX, 0.15);
    lerpRot(bg, "z", bodyZ, 0.15);
    bg.scale.y = L(bg.scale.y, scaleY, 0.18);
    bg.scale.x = L(bg.scale.x, scaleXZ, 0.18);
    bg.scale.z = L(bg.scale.z, scaleXZ, 0.18);

    lerpRot(la, "x", lArmX, limbF); lerpRot(ra, "x", rArmX, limbF);
    lerpRot(la, "z", lArmZ, 0.15);  lerpRot(ra, "z", rArmZ, 0.15);
    lerpRot(ll, "x", lLegX, limbF); lerpRot(rl, "x", rLegX, limbF);

    lerpRot(hd, "x", headX, 0.12);
    lerpRot(hd, "y", headY, 0.12);
    lerpRot(hd, "z", headZ, 0.12);
  });
}
