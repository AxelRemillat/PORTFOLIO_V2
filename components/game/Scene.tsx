"use client";

import { useRef, useCallback } from "react";
import * as THREE from "three";
import { SURFACE_Y, ellipsoidProject } from "./constants/game";
import { useKeyboardControls }   from "./hooks/useKeyboardControls";
import { useSphericalMovement }  from "./hooks/useSphericalMovement";
import { usePortalDetection }    from "./hooks/usePortalDetection";
import { useQuestSystem }        from "./hooks/useQuestSystem";
import { FireflyPath }           from "./FireflyPath";
import { Background }        from "./Background";
import { SpaceObjects }      from "./SpaceObjects";
import { ShootingStars }     from "./ShootingStars";
import { Lighting }          from "./Lighting";
import { SunMoon }           from "./SunMoon";
import { PlanetSurface }     from "./PlanetSurface";
import { WindParticles }     from "./WindParticles";
import { PlanetObjects }     from "./PlanetObjects";
import { NPCs }              from "./NPCs";
import { Portals }           from "./Portals";
import { PortalHUD }         from "./PortalHUD";
import { OrbitalObjects }    from "./OrbitalObjects";
import { ClickIndicator }    from "./ClickIndicator";
import { PortalFlash }       from "./PortalFlash";
import { CameraController }  from "./CameraController";
import { LittlePrince }      from "./LittlePrince";

// Spawn beside the Rose (south pole), offset tangentially so the Prince is next
// to it rather than on top of the Baobab (which sits at the north pole = old spawn).
const SPAWN = new THREE.Vector3(0.38, -0.925, 0).normalize().multiplyScalar(SURFACE_Y);

export function Scene({ onPortalEnter }: { onPortalEnter: (href: string) => void }) {
  // ── Shared refs ──────────────────────────────────────────────────────────────
  const posRef        = useRef(SPAWN.clone());
  const prevPosRef    = useRef(SPAWN.clone());
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
  const { guidedPortalId } = useQuestSystem();

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
      <ShootingStars />
      <SunMoon />
      <Lighting />
      <PlanetSurface onSurfaceClick={handleSurfaceClick} />
      <WindParticles />
      <PlanetObjects />
      <NPCs playerPosRef={posRef} />
      <OrbitalObjects />
      <Portals />
      <FireflyPath playerPosRef={posRef} targetPortalId={guidedPortalId} planetRadius={SURFACE_Y} />
      <PortalHUD />
      <ClickIndicator infoRef={clickIndicRef} />
      <PortalFlash    infoRef={flashRef} />
      <LittlePrince posRef={posRef} movingRef={movingRef} quatRef={quatRef} scaleRef={robotScaleRef} jumpRef={jumpRef} />
      <CameraController posRef={posRef} faceRef={faceRef} />
    </>
  );
}
