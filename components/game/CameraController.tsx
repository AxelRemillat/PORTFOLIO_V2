"use client";

import { useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { isIntroActive, notifyIntroComplete } from "./introState";

const CAMERA_HEIGHT = 8.5;  // hauteur au-dessus du perso, TOUJOURS le long de la normale
const BEHIND_OFFSET = 5.0;  // recul tangentiel → donne l'inclinaison/perspective
const BEHIND_LERP   = 0.02; // très lent → quasi-fixe, mouvement imperceptible
const POS_LERP      = 0.06; // douceur du suivi de position
const ROT_LERP      = 0.05; // douceur de l'orientation

// Mode intro : la caméra part loin dans l'espace et glisse vers le jeu sur une
// courbe d'easing TEMPORELLE (ease-out-cubic) → décélération nette, zéro saccade.
const INTRO_DIST     = 55;  // distance de départ (le long de la normale)
const INTRO_DURATION = 3.0; // secondes

// Module-level temps — pas d'allocation par frame
const _normal = new THREE.Vector3();
const _behind = new THREE.Vector3();
const _target = new THREE.Vector3();
const _look   = new THREE.Vector3();
const _quat   = new THREE.Quaternion();
const _m4     = new THREE.Matrix4();

interface Props {
  posRef:   MutableRefObject<THREE.Vector3>;  // position monde du perso
  faceRef?: MutableRefObject<THREE.Vector3>;  // direction de déplacement (plan tangent)
}

export function CameraController({ posRef, faceRef }: Props) {
  const { camera } = useThree();
  const smoothedPos    = useRef(new THREE.Vector3());
  const smoothedBehind = useRef(new THREE.Vector3(0, 0, -1));

  // État de l'easing d'intro (capturé une seule fois au démarrage de l'intro).
  const introStarted = useRef(false);
  const introElapsed = useRef(0);
  const introStartPos  = useRef(new THREE.Vector3());
  const introStartQuat = useRef(new THREE.Quaternion());

  useFrame((_state, delta) => {
    const pos = posRef.current;

    // 1. Normale de surface = direction du perso depuis le centre de la planète
    _normal.copy(pos).normalize();

    // 2. Direction "derrière" mise à jour très lentement → caméra quasi-fixe qui
    //    s'oriente paresseusement dans le dos du perso, projetée dans le plan tangent.
    const face = faceRef?.current;
    if (face && face.lengthSq() > 1e-4) {
      _behind.copy(face).negate();
      _behind.addScaledVector(_normal, -_behind.dot(_normal));
      if (_behind.lengthSq() > 1e-6) {
        _behind.normalize();
        smoothedBehind.current.lerp(_behind, BEHIND_LERP).normalize();
      }
    }

    // 3. Position cible = perso + hauteur (le long de la normale) + recul tangentiel.
    //    Toute l'élévation est portée par la normale → hauteur au-dessus du sol
    //    CONSTANTE partout sur la sphère, sans extrêmes. Le recul (tangent) ne fait
    //    qu'incliner la vue, il ne change quasiment pas la distance au sol.
    _target.copy(pos)
      .addScaledVector(_normal, CAMERA_HEIGHT)
      .addScaledVector(smoothedBehind.current, BEHIND_OFFSET);

    // Cible d'orientation (regarde le perso, légèrement au-dessus de ses pieds)
    _look.copy(pos).addScaledVector(_normal, 0.8);
    _m4.lookAt(_target, _look, _normal);
    _quat.setFromRotationMatrix(_m4);

    // ── INTRO : easing temporel ease-out-cubic depuis l'espace vers le jeu ──
    if (isIntroActive()) {
      if (!introStarted.current) {
        // Capture une seule fois la position/orientation de départ (loin dans l'espace).
        introStartPos.current.copy(pos).setLength(INTRO_DIST);
        _m4.lookAt(introStartPos.current, _look, _normal);
        introStartQuat.current.setFromRotationMatrix(_m4);
        introElapsed.current = 0;
        introStarted.current = true;
      }
      introElapsed.current += delta;
      const rawT = Math.min(introElapsed.current / INTRO_DURATION, 1);
      const t = 1 - Math.pow(1 - rawT, 3); // ease-out-cubic

      camera.position.lerpVectors(introStartPos.current, _target, t);
      camera.quaternion.slerpQuaternions(introStartQuat.current, _quat, t);
      smoothedPos.current.copy(camera.position); // continuité quand l'intro se termine

      if (rawT >= 1) { introStarted.current = false; notifyIntroComplete(); }
      return;
    }
    introStarted.current = false;

    // ── JEU NORMAL : suivi lissé par frame ──
    if (smoothedPos.current.lengthSq() < 1e-6) smoothedPos.current.copy(_target);
    else smoothedPos.current.lerp(_target, POS_LERP);
    camera.position.copy(smoothedPos.current);

    // Orientation recalculée depuis la position courante de la caméra
    _m4.lookAt(camera.position, _look, _normal);
    _quat.setFromRotationMatrix(_m4);
    camera.quaternion.slerp(_quat, ROT_LERP);
  });

  return null;
}
