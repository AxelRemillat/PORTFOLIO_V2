"use client";

import { useRef, useCallback } from "react";
import * as THREE from "three";
import { SURFACE_Y, ellipsoidProject } from "./constants/game";
import { useKeyboardControls }   from "./hooks/useKeyboardControls";
import { useSphericalMovement }  from "./hooks/useSphericalMovement";
import { usePortalDetection }    from "./hooks/usePortalDetection";
import { Background }        from "./Background";
import { SpaceObjects }      from "./SpaceObjects";
import { Lighting }          from "./Lighting";
import { PlanetSurface }     from "./PlanetSurface";
import { Portals }           from "./Portals";
import { OrbitalObjects }    from "./OrbitalObjects";
import { ClickIndicator }    from "./ClickIndicator";
import { PortalFlash }       from "./PortalFlash";
import { CameraController }  from "./CameraController";
import { Robot }             from "./Robot";

export function Scene({ onPortalEnter }: { onPortalEnter: (href: string) => void }) {
  // ── Shared refs ──────────────────────────────────────────────────────────────
  const posRef        = useRef(new THREE.Vector3(0, SURFACE_Y, 0));
  const prevPosRef    = useRef(new THREE.Vector3(0, SURFACE_Y, 0));
  const movingRef     = useRef(false);
  const rotRef        = useRef(0);
  const quatRef       = useRef(new THREE.Quaternion());
  const faceRef       = useRef(new THREE.Vector3(0, 0, 1));
  const enteredRef    = useRef(false);
  const targetRef     = useRef<THREE.Vector3 | null>(null);
  const clickIndicRef = useRef<{ pos: THREE.Vector3; t: number } | null>(null);
  const enterAnim     = useRef<{ t: number; href: string; pos: THREE.Vector3; color: string } | null>(null);
  const robotScaleRef = useRef(1.0);
  const flashRef      = useRef<{ pos: THREE.Vector3; color: string; t: number } | null>(null);

  // ── Hooks ─────────────────────────────────────────────────────────────────────
  const { keysRef, jumpRef } = useKeyboardControls();

  useSphericalMovement({
    posRef, faceRef, movingRef, quatRef,
    keysRef, jumpRef, targetRef,
    enteredRef, enterAnim, robotScaleRef, onPortalEnter,
  });

  usePortalDetection({ posRef, prevPosRef, enteredRef, enterAnim, flashRef });

  // ── Click-to-move ─────────────────────────────────────────────────────────────
  const handleSurfaceClick = useCallback((point: THREE.Vector3) => {
    const target = ellipsoidProject(point, new THREE.Vector3());
    targetRef.current     = target;
    clickIndicRef.current = { pos: new THREE.Vector3(point.x, point.y + 0.15, point.z), t: 0 };
  }, []);

  return (
    <>
      <Background />
      <SpaceObjects />
      <Lighting />
      <PlanetSurface onSurfaceClick={handleSurfaceClick} />
      <OrbitalObjects />
      <Portals />
      <ClickIndicator infoRef={clickIndicRef} />
      <PortalFlash    infoRef={flashRef} />
      <Robot posRef={posRef} movingRef={movingRef} rotRef={rotRef} quatRef={quatRef} scaleRef={robotScaleRef} />
      <CameraController posRef={posRef} faceRef={faceRef} />
    </>
  );
}
