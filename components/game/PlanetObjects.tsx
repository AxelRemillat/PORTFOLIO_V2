"use client";

import { useState, useMemo } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { SURFACE_Y } from "./constants/game";
import { Rose } from "./Rose";
import { Baobab } from "./Baobab";
import { Volcano } from "./Volcano";
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
// Volcan — région dégagée (> 55° de tous les portails/objets).
const VOLCANO_DIR = new THREE.Vector3(-0.6, 0.45, 0.66);
const VOLCANO_SCALE = 2.5;

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
    "Je suis unique en mon genre. Enfin... à quelques millions de roses près.",
};

const BAOBAB_INFO: ActiveObject = {
  type: "baobab",
  name: "Le Baobab",
  emoji: "🌳",
  quote:
    "On m'a dit d'arracher les baobabs quand ils sont petits. Comme tu peux le voir, personne n'a écouté.",
};

const VOLCANO_INFO: ActiveObject = {
  type: "volcano",
  name: "Le Volcan",
  emoji: "🌋",
  quote:
    "Félicitations. Tu t'es approché d'un volcan en activité. Darwin a pris note.",
};

export function PlanetObjects() {
  const [active, setActive] = useState<ActiveObject | null>(null);

  const rose    = useMemo(() => placement(ROSE_DIR), []);
  const baobab  = useMemo(() => placement(BAOBAB_DIR), []);
  const volcano = useMemo(() => placement(VOLCANO_DIR), []);

  // Empêche le clic sur l'objet de déclencher le déplacement (onPointerDown du sol)
  const stop = (e: ThreeEvent<PointerEvent>) => e.stopPropagation();
  const open = (info: ActiveObject) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    gameAudio.playInteraction(); // "ding" doux au clic
    // Quêtes secrètes : révélées + complétées au contact.
    if (info.type === "rose")    { discoverQuest("touch_rose");    completeQuest("touch_rose"); }
    if (info.type === "baobab")  { discoverQuest("touch_baobab");  completeQuest("touch_baobab"); }
    if (info.type === "volcano") { discoverQuest("touch_volcano"); completeQuest("touch_volcano"); }
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

      <group position={volcano.position} quaternion={volcano.quaternion} scale={VOLCANO_SCALE}>
        <Volcano onClick={open(VOLCANO_INFO)} />
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
