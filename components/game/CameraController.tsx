"use client";

import { useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CAM_BACK, CAM_HEIGHT, CAM_LERP, CAM_FACE_LERP, ellipsoidNormal } from "./constants/game";

const _cn  = new THREE.Vector3();
const _cd  = new THREE.Vector3();
const _m4c = new THREE.Matrix4();

interface Props {
  posRef:  MutableRefObject<THREE.Vector3>;
  faceRef: MutableRefObject<THREE.Vector3>;
}

export function CameraController({ posRef, faceRef }: Props) {
  const { camera } = useThree();
  const camFaceRef = useRef(new THREE.Vector3(0, 0, 1));

  useFrame(() => {
    const robotPos = posRef.current;
    const face     = faceRef.current;
    ellipsoidNormal(robotPos, _cn);

    const cf = camFaceRef.current;
    cf.addScaledVector(_cn, -cf.dot(_cn));
    if (cf.lengthSq() < 1e-6) cf.copy(face);
    else cf.normalize();
    cf.lerp(face, CAM_FACE_LERP).normalize();

    _cd.copy(robotPos)
      .addScaledVector(_cn, CAM_HEIGHT)
      .addScaledVector(cf, -CAM_BACK);

    camera.position.lerp(_cd, CAM_LERP);
    _m4c.lookAt(camera.position, robotPos, _cn);
    camera.quaternion.setFromRotationMatrix(_m4c);
  });

  return null;
}
