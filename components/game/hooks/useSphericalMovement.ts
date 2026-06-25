import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  SPEED, JUMP_HEIGHT, JUMP_DURATION,
  ellipsoidProject, ellipsoidNormal,
} from "../constants/game";
import { gameAudio } from "../audio/GameAudioEngine";

// Module-level temps — only used inside this hook's useFrame
const _sn  = new THREE.Vector3();
const _sp  = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _ax  = new THREE.Vector3();
const _az  = new THREE.Vector3();
const _m4  = new THREE.Matrix4();
const _lastFwd = new THREE.Vector3(0, 0, 1); // dernière direction forward stable (anti-tremblement)
let _wasJump = false; // détection du front montant du saut (pour le son)

interface Args {
  posRef:        MutableRefObject<THREE.Vector3>;
  faceRef:       MutableRefObject<THREE.Vector3>;
  movingRef:     MutableRefObject<boolean>;
  quatRef:       MutableRefObject<THREE.Quaternion>;
  keysRef:       MutableRefObject<Set<string>>;
  jumpRef:       MutableRefObject<{ active: boolean; t: number }>;
  targetRef:     MutableRefObject<THREE.Vector3 | null>;
  enteredRef:    MutableRefObject<boolean>;
  enterAnim:     MutableRefObject<{ t: number; href: string; pos: THREE.Vector3; color: string } | null>;
  robotScaleRef: MutableRefObject<number>;
  onPortalEnter: (href: string) => void;
}

export function useSphericalMovement({
  posRef, faceRef, movingRef, quatRef,
  keysRef, jumpRef, targetRef,
  enteredRef, enterAnim, robotScaleRef, onPortalEnter,
}: Args) {
  useFrame((state, delta) => {
    if (enteredRef.current) return;

    // 0b. Portal entry animation — shrink robot then redirect
    const ea = enterAnim.current;
    if (ea) {
      ea.t += delta;
      robotScaleRef.current = 1 - Math.min(ea.t / 0.3, 1);
      if (ea.t >= 0.3) {
        enteredRef.current = true;
        onPortalEnter(ea.href);
      }
      return;
    }

    const pos = posRef.current;

    // Son de saut au front montant
    const jumpActive = jumpRef.current.active;
    if (jumpActive && !_wasJump) gameAudio.playJump();
    _wasJump = jumpActive;

    // 1. Snap to ellipsoid surface
    ellipsoidProject(pos, _sp);
    ellipsoidNormal(_sp, _sn);

    // 2. Jump arc
    let jumpOffset = 0;
    if (jumpRef.current.active) {
      jumpRef.current.t += delta / JUMP_DURATION;
      if (jumpRef.current.t >= 1) {
        jumpRef.current = { active: false, t: 0 };
      } else {
        const jt = jumpRef.current.t;
        jumpOffset = JUMP_HEIGHT * 4 * jt * (1 - jt);
      }
    }

    // 3. ZQSD / arrow input → move in tangent plane (camera-relative)
    const k = keysRef.current;
    let dx = 0, dz = 0;
    if (k.has("z") || k.has("Z") || k.has("ArrowUp"))   dz -= 1;
    if (k.has("s") || k.has("S") || k.has("ArrowDown"))  dz += 1;
    if (k.has("q") || k.has("Q") || k.has("ArrowLeft"))  dx -= 1;
    if (k.has("d") || k.has("D") || k.has("ArrowRight")) dx += 1;

    const hasKey = dx !== 0 || dz !== 0;
    if (hasKey) targetRef.current = null;

    if (hasKey) {
      // Axes caméra projetés sur le plan tangent → les touches collent à l'écran.
      state.camera.getWorldDirection(_dir);          // forward = où regarde la caméra
      _dir.addScaledVector(_sn, -_dir.dot(_sn));      // retire la composante normale
      const fwdLen = _dir.length();
      if (fwdLen > 0.15) {
        // Projection fiable → on normalise et on mémorise cette direction stable.
        _dir.multiplyScalar(1 / fwdLen);
        _lastFwd.copy(_dir);
      } else {
        // Caméra quasi alignée avec la normale : la projection devient instable
        // (le perso tremble). On réutilise la dernière direction forward stable.
        _dir.copy(_lastFwd).addScaledVector(_sn, -_lastFwd.dot(_sn));
        if (_dir.lengthSq() < 1e-6) _dir.set(1, 0, 0).addScaledVector(_sn, -_sn.x);
        _dir.normalize();
      }
      _ax.crossVectors(_dir, _sn).normalize();        // right = forward × normale (= droite écran)
      _az.copy(_dir).multiplyScalar(-dz).addScaledVector(_ax, dx);
      if (_az.lengthSq() > 1e-8) {
        _az.normalize();
        _sp.addScaledVector(_az, SPEED * delta);
        ellipsoidProject(_sp, _sp);
        ellipsoidNormal(_sp, _sn);
        faceRef.current.copy(_az);
      }
      movingRef.current = true;

    } else if (targetRef.current) {
      _dir.copy(targetRef.current).sub(_sp);
      const dist = _dir.length();
      if (dist < 0.12) {
        targetRef.current = null;
        movingRef.current = false;
      } else {
        _dir.addScaledVector(_sn, -_dir.dot(_sn));
        if (_dir.lengthSq() > 1e-8) {
          _dir.normalize();
          _sp.addScaledVector(_dir, Math.min(SPEED * delta, dist));
          ellipsoidProject(_sp, _sp);
          ellipsoidNormal(_sp, _sn);
          faceRef.current.copy(_dir);
        }
        movingRef.current = true;
      }
    } else {
      movingRef.current = false;
    }

    // 4. Final position = surface + jump
    pos.copy(_sp).addScaledVector(_sn, jumpOffset);

    // 5. Orientation quaternion (robot Y = surface normal, Z = facing)
    const face = faceRef.current;
    face.addScaledVector(_sn, -face.dot(_sn));
    if (face.lengthSq() < 1e-8) face.set(0, 0, 1);
    else face.normalize();
    _ax.crossVectors(_sn, face).normalize();
    _az.crossVectors(_ax, _sn).normalize();
    quatRef.current.setFromRotationMatrix(_m4.makeBasis(_ax, _sn, _az));

    // Pas (timer interne à 0.32s) — seulement au sol et en mouvement
    gameAudio.footstep(movingRef.current && !jumpRef.current.active, delta);
  });
}
