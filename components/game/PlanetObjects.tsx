"use client";

import { useState, useMemo } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { SURFACE_Y } from "./constants/game";
import { Rose } from "./Rose";
import { Baobab } from "./Baobab";
import { ObjectInteraction, type ActiveObject } from "./ObjectInteraction";
import { discoverQuest, completeQuest } from "./hooks/useQuestSystem";
import { gameAudio } from "./audio/GameAudioEngine";

const UP = new THREE.Vector3(0, 1, 0);

// Place un objet sur la surface (rayon réel = SURFACE_Y) et l'oriente
// perpendiculairement à la normale de surface (Y local = normale).
function placement(dir: THREE.Vector3) {
  const d = dir.clone().normalize();
  return {
    position: d.clone().multiplyScalar(SURFACE_Y),
    quaternion: new THREE.Quaternion().setFromUnitVectors(UP, d),
  };
}

// Pôles — loin de tous les portails.
const ROSE_DIR   = new THREE.Vector3(0, -1, 0); // pôle sud
const BAOBAB_DIR = new THREE.Vector3(0, 1, 0);  // pôle nord

// Échelles relatives à la taille du Petit Prince (~1.3 unité, pieds → sommet tête).
// La base des objets est à y=0 (= point de placement), donc l'échelle les fait
// grandir vers l'extérieur sans décoller de la surface.
const CHAR_HEIGHT   = 1.3;
const ROSE_HEIGHT   = 0.48; // hauteur intrinsèque de la Rose
const BAOBAB_HEIGHT = 1.35; // hauteur intrinsèque du Baobab
const ROSE_SCALE    = (1.4 * CHAR_HEIGHT) / ROSE_HEIGHT;   // → 140 % du perso (~3.8×)
const BAOBAB_SCALE  = (3.0 * CHAR_HEIGHT) / BAOBAB_HEIGHT; // → 300 % du perso (~2.9×)

const ROSE_INFO: ActiveObject = {
  type: "rose",
  name: "La Rose",
  emoji: "🌹",
  quote:
    "Il faut que j'endure la présence de deux ou trois chenilles si je veux connaître les papillons…",
};

const BAOBAB_INFO: ActiveObject = {
  type: "baobab",
  name: "Le Baobab",
  emoji: "🌳",
  quote:
    "C'est une question de discipline. Quand on a terminé sa toilette du matin, il faut faire soigneusement la toilette de la planète.",
};

export function PlanetObjects() {
  const [active, setActive] = useState<ActiveObject | null>(null);

  const rose   = useMemo(() => placement(ROSE_DIR), []);
  const baobab = useMemo(() => placement(BAOBAB_DIR), []);

  // Empêche le clic sur l'objet de déclencher le déplacement (onPointerDown du sol)
  const stop = (e: ThreeEvent<PointerEvent>) => e.stopPropagation();
  const open = (info: ActiveObject) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    gameAudio.playInteraction(); // "ding" doux au clic
    // Quêtes secrètes : révélées + complétées au contact.
    if (info.type === "rose")   { discoverQuest("touch_rose");   completeQuest("touch_rose"); }
    if (info.type === "baobab") { discoverQuest("touch_baobab"); completeQuest("touch_baobab"); }
    setActive(info);
  };

  return (
    <>
      <group position={rose.position} quaternion={rose.quaternion} scale={ROSE_SCALE} onPointerDown={stop} onClick={open(ROSE_INFO)}>
        <Rose />
      </group>

      <group position={baobab.position} quaternion={baobab.quaternion} scale={BAOBAB_SCALE} onPointerDown={stop} onClick={open(BAOBAB_INFO)}>
        <Baobab />
      </group>

      {/* Html sert de pont R3F → DOM ; ObjectInteraction se portale ensuite sur <body> */}
      {active && (
        <Html>
          <ObjectInteraction object={active} onClose={() => setActive(null)} />
        </Html>
      )}
    </>
  );
}
