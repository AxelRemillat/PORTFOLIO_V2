"use client";

import { useRef, useState, useMemo } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { PORTALS, SURFACE_Y } from "./constants/game";
import { Fox } from "./Fox";
import { Sheep } from "./Sheep";
import { ObjectInteraction, type ActiveObject } from "./ObjectInteraction";
import { discoverQuest, completeQuest } from "./hooks/useQuestSystem";
import { gameAudio } from "./audio/GameAudioEngine";

// Rayon réel de la planète (sphère A_XZ = A_Y = 7).
const PLANET_RADIUS = SURFACE_Y;

// Positions initiales — loin des portails et l'une de l'autre.
const FOX_START   = new THREE.Vector3(-0.3, 0.7, 0.65).normalize().multiplyScalar(PLANET_RADIUS);
const SHEEP_START = new THREE.Vector3(0.7, -0.3, -0.65).normalize().multiplyScalar(PLANET_RADIUS);

const FOX_INFO: ActiveObject = {
  type: "fox",
  name: "Le Renard",
  emoji: "🦊",
  quote:
    "On ne connaît que les choses que l'on apprivoise… Tu es responsable pour toujours de ce que tu as apprivoisé.",
};

const SHEEP_INFO: ActiveObject = {
  type: "sheep",
  name: "Le Mouton",
  emoji: "🐑",
  quote: "S'il vous plaît… dessine-moi un mouton.",
};

export function NPCs({ playerPosRef }: { playerPosRef: React.MutableRefObject<THREE.Vector3> }) {
  const foxPos = useRef(FOX_START.clone());
  const sheepPos = useRef(SHEEP_START.clone());
  const foxPaused = useRef(false);
  const sheepPaused = useRef(false);
  const [active, setActive] = useState<ActiveObject | null>(null);
  const [foxTamed, setFoxTamed] = useState(false); // apprivoisé → suit le joueur

  // Portails projetés sur la surface du NPC (rayon réel) pour la distance d'évitement.
  const portalAvoid = useMemo(
    () => PORTALS.map((p) => new THREE.Vector3(...p.position).normalize().multiplyScalar(PLANET_RADIUS)),
    [],
  );

  const openFox = (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); gameAudio.playInteraction(); discoverQuest("talk_fox"); foxPaused.current = true; setActive(FOX_INFO); };
  const openSheep = (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); gameAudio.playInteraction(); discoverQuest("talk_sheep"); sheepPaused.current = true; setActive(SHEEP_INFO); };
  const close = () => {
    // Quête secrète complétée à la fermeture du dialogue.
    if (active?.type === "fox") { completeQuest("talk_fox"); setFoxTamed(true); } // apprivoisé !
    else if (active?.type === "sheep") completeQuest("talk_sheep");
    foxPaused.current = false; sheepPaused.current = false; setActive(null);
  };

  return (
    <>
      <Fox
        posRef={foxPos}
        planetRadius={PLANET_RADIUS}
        avoidPositions={portalAvoid}
        avoidRefs={[sheepPos]}
        pausedRef={foxPaused}
        isInteracting={active?.type === "fox"}
        onClick={openFox}
        followRef={playerPosRef}
        tamed={foxTamed}
      />
      <Sheep
        posRef={sheepPos}
        planetRadius={PLANET_RADIUS}
        avoidPositions={portalAvoid}
        avoidRefs={[foxPos]}
        pausedRef={sheepPaused}
        isInteracting={active?.type === "sheep"}
        onClick={openSheep}
      />

      {/* Html = pont R3F → DOM ; ObjectInteraction se portale ensuite sur <body> */}
      {active && (
        <Html>
          <ObjectInteraction object={active} onClose={close} />
        </Html>
      )}
    </>
  );
}
