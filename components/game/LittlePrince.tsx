"use client";

import { useRef } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";
import { useLittlePrinceAnimation } from "./hooks/useLittlePrinceAnimation";
import { ScarfPhysics } from "./ScarfPhysics";
import { MAT, Hair, Collar, Belt, LegLimb } from "./LittlePrinceGeometry";
import { Eyes } from "./LittlePrinceEyes";

interface LittlePrinceProps {
  posRef:    MutableRefObject<THREE.Vector3>;
  movingRef: MutableRefObject<boolean>;
  quatRef:   MutableRefObject<THREE.Quaternion>;
  scaleRef?: MutableRefObject<number>;
  jumpRef?:  MutableRefObject<{ active: boolean; t: number }>;
}

// Rounded "baggy" arm: oval upper arm + forearm + hand (pivot at shoulder)
function Arm() {
  return (
    <group>
      <mesh position={[0, -0.11, 0]} scale={[1, 1.8, 1]}>
        <sphereGeometry args={[0.09, 7, 7]} />
        <meshStandardMaterial color="#2d7a2d" {...MAT} />
      </mesh>
      <mesh position={[0, -0.26, 0]}>
        <cylinderGeometry args={[0.065, 0.055, 0.14, 6]} />
        <meshStandardMaterial color="#2d7a2d" {...MAT} />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshStandardMaterial color="#F0C080" {...MAT} />
      </mesh>
    </group>
  );
}

// Bulky garment torso: wide boxes + front bulge + round shoulders + buttons
function TorsoBody() {
  return (
    <group>
      <mesh position={[0, 0.71, 0]}>
        <boxGeometry args={[0.32, 0.18, 0.20]} />
        <meshStandardMaterial color="#2d7a2d" {...MAT} />
      </mesh>
      <mesh position={[0, 0.54, 0]}>
        <boxGeometry args={[0.34, 0.16, 0.21]} />
        <meshStandardMaterial color="#2d7a2d" {...MAT} />
      </mesh>
      {/* Front bulge — clothing thickness */}
      <mesh position={[0, 0.60, 0.06]}>
        <sphereGeometry args={[0.16, 8, 8]} />
        <meshStandardMaterial color="#2d7a2d" {...MAT} />
      </mesh>
      {/* Round shoulders */}
      <mesh position={[-0.16, 0.80, 0]} scale={[1.3, 1, 1]}>
        <sphereGeometry args={[0.1, 7, 7]} />
        <meshStandardMaterial color="#2d7a2d" {...MAT} />
      </mesh>
      <mesh position={[0.16, 0.80, 0]} scale={[1.3, 1, 1]}>
        <sphereGeometry args={[0.1, 7, 7]} />
        <meshStandardMaterial color="#2d7a2d" {...MAT} />
      </mesh>
      {/* Golden buttons on the bulge front */}
      <mesh position={[0, 0.70, 0.185]}><sphereGeometry args={[0.018, 5, 5]} /><meshStandardMaterial color="#FFD700" {...MAT} /></mesh>
      <mesh position={[0, 0.62, 0.215]}><sphereGeometry args={[0.018, 5, 5]} /><meshStandardMaterial color="#FFD700" {...MAT} /></mesh>
      <mesh position={[0, 0.54, 0.205]}><sphereGeometry args={[0.018, 5, 5]} /><meshStandardMaterial color="#FFD700" {...MAT} /></mesh>
    </group>
  );
}

export function LittlePrince({ posRef, movingRef, quatRef, scaleRef, jumpRef }: LittlePrinceProps) {
  const rootRef        = useRef<THREE.Group>(null);
  const bodyGroupRef   = useRef<THREE.Group>(null);
  const headRef        = useRef<THREE.Mesh>(null);
  const leftArmRef     = useRef<THREE.Group>(null);
  const rightArmRef    = useRef<THREE.Group>(null);
  const leftLegRef     = useRef<THREE.Group>(null);
  const rightLegRef    = useRef<THREE.Group>(null);
  const scarfAnchorRef = useRef<THREE.Object3D>(null);
  const velRef         = useRef(new THREE.Vector3());

  useLittlePrinceAnimation({
    rootRef, bodyGroupRef, headRef,
    leftArmRef, rightArmRef, leftLegRef, rightLegRef,
    posRef, movingRef, quatRef, scaleRef, jumpRef, velRef,
  });

  return (
    <>
    <group ref={rootRef}>
      <group ref={bodyGroupRef}>
        {/* Static forward lean (−0.05). The animation hook drives bodyGroup.rotation.x
            each frame, so the lean lives on this inner wrapper and is layered under it. */}
        <group rotation={[-0.05, 0, 0]}>

          {/* Neck anchor — at the collar; ScarfPhysics reads its WORLD position. */}
          <object3D ref={scarfAnchorRef} position={[0, 0.80, 0.04]} />

          {/* Big round head — larger radius for a more childish/cartoon ratio */}
          <mesh ref={headRef} position={[0, 1.0, 0]}>
            <sphereGeometry args={[0.26, 10, 10]} />
            <meshStandardMaterial color="#F0C080" {...MAT} />
          </mesh>

          <Hair />
          <Eyes />

          {/* Nose */}
          <mesh position={[0, 0.99, 0.255]}>
            <sphereGeometry args={[0.018, 5, 5]} />
            <meshStandardMaterial color="#E0A060" {...MAT} />
          </mesh>
          {/* Cheeks — childish blush */}
          <mesh position={[-0.15, 0.965, 0.185]}>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial color="#FFB0A0" transparent opacity={0.6} {...MAT} />
          </mesh>
          <mesh position={[0.15, 0.965, 0.185]}>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial color="#FFB0A0" transparent opacity={0.6} {...MAT} />
          </mesh>

          <Collar />
          <TorsoBody />
          <Belt />

          {/* Arms — rest posture (+8° fwd, ±12° out) on the parent group, swing on the ref */}
          <group position={[-0.18, 0.78, 0]} rotation={[0.14, 0, 0.21]}>
            <group ref={leftArmRef}><Arm /></group>
          </group>
          <group position={[0.18, 0.78, 0]} rotation={[0.14, 0, -0.21]}>
            <group ref={rightArmRef}><Arm /></group>
          </group>

          {/* Legs — pivot at hips */}
          <group ref={leftLegRef} position={[-0.07, 0.46, 0]}>
            <LegLimb />
          </group>
          <group ref={rightLegRef} position={[0.07, 0.46, 0]}>
            <LegLimb />
          </group>

        </group>
      </group>
    </group>

    {/* Scarf in world space (sibling of the transformed root group). */}
    <ScarfPhysics
      anchorRef={scarfAnchorRef}
      velRef={velRef}
      jumpRef={jumpRef}
      movingRef={movingRef}
    />
    </>
  );
}
