"use client";

import { useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const CAMERA_HEIGHT = 8.5;  // hauteur au-dessus du perso, TOUJOURS le long de la normale
const BEHIND_OFFSET = 5.0;  // recul tangentiel → donne l'inclinaison/perspective
const BEHIND_LERP   = 0.02; // très lent → quasi-fixe, mouvement imperceptible
const POS_LERP      = 0.06; // douceur du suivi de position
const ROT_LERP      = 0.05; // douceur de l'orientation

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

  useFrame(() => {
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

    // 4. Suivi de position lissé
    if (smoothedPos.current.lengthSq() < 1e-6) smoothedPos.current.copy(_target);
    else smoothedPos.current.lerp(_target, POS_LERP);
    camera.position.copy(smoothedPos.current);

    // 5. Regarde le perso (légèrement au-dessus de ses pieds)
    _look.copy(pos).addScaledVector(_normal, 0.8);

    // 6. Orientation : up = normale surface (suit la courbure de la planète)
    _m4.lookAt(camera.position, _look, _normal);
    _quat.setFromRotationMatrix(_m4);
    camera.quaternion.slerp(_quat, ROT_LERP);
  });

  return null;
}
