"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SURFACE_Y } from "./constants/game";

const MAX_STREAKS = 8;
const PLANET_RADIUS = SURFACE_Y; // 7 — rayon réel de la planète
const WIND_HEIGHT = 0.8; // hauteur du vent au-dessus de la surface
const N_POINTS = 8;
const COLORS = ["#E8F0FF", "#F0E8FF", "#DDEEFF"]; // neutre / chaud / froid

interface WindStreak {
  mesh: THREE.Mesh;
  age: number;
  lifetime: number;
  radius: number; // épaisseur du tube (pour moduler l'opacité)
  active: boolean;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function createStreak(scene: THREE.Scene): WindStreak {
  // 1. Origine aléatoire sur la sphère
  const origin = new THREE.Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize();

  // 2. Tangente aléatoire (perpendiculaire à la normale)
  const r = new THREE.Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1));
  const tangent = r.sub(origin.clone().multiplyScalar(r.dot(origin))).normalize();
  const axis = origin.clone().cross(tangent).normalize();

  // 3. Longueur : arc plus court (0.3 à 1.0 rad)
  const arcLength = rand(0.3, 1.0);

  // 4. Points le long de l'arc, avec déviation organique
  const points: THREE.Vector3[] = [];
  for (let i = 0; i < N_POINTS; i++) {
    const angle = (i / (N_POINTS - 1)) * arcLength;
    const dir = origin.clone().applyAxisAngle(axis, angle);
    // Déviation latérale plus marquée → tracé sinueux, moins « cylindre »
    const perpAxis = dir.clone().cross(tangent).normalize();
    dir.add(perpAxis.multiplyScalar((Math.random() - 0.5) * 0.22)).normalize();
    // Ondulation verticale : la hauteur varie le long du trait
    const h = WIND_HEIGHT + (Math.random() - 0.5) * 0.5;
    points.push(dir.multiplyScalar(PLANET_RADIUS + h));
  }

  // 5. Courbe → TubeGeometry fine
  const curve = new THREE.CatmullRomCurve3(points);
  const radius = rand(0.025, 0.06); // tubes plus larges
  const geometry = new THREE.TubeGeometry(curve, 20, radius, 6, false);
  const material = new THREE.MeshBasicMaterial({
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  return { mesh, age: 0, lifetime: rand(2.5, 4.5), radius, active: true };
}

function disposeStreak(scene: THREE.Scene, s: WindStreak) {
  scene.remove(s.mesh);
  s.mesh.geometry.dispose();
  (s.mesh.material as THREE.Material).dispose();
}

export function WindParticles() {
  const { scene } = useThree();
  const streaks = useRef<WindStreak[]>([]);
  const spawnTimer = useRef(rand(0.4, 1.2));

  useEffect(() => {
    const pool = streaks.current;
    return () => {
      pool.forEach((s) => disposeStreak(scene, s));
      pool.length = 0;
    };
  }, [scene]);

  useFrame((_state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const pool = streaks.current;

    // 1. Spawn
    spawnTimer.current -= dt;
    if (spawnTimer.current <= 0 && pool.length < MAX_STREAKS) {
      pool.push(createStreak(scene));
      spawnTimer.current = rand(0.4, 1.2);
    }

    // 2-3. Update + mort
    for (let i = pool.length - 1; i >= 0; i--) {
      const s = pool[i];
      s.age += dt;
      const t = s.age / s.lifetime;

      if (t >= 1) {
        disposeStreak(scene, s);
        pool.splice(i, 1);
        continue;
      }

      let opacity: number;
      if (t < 0.25) opacity = t / 0.25; // fade in doux
      else if (t < 0.6) opacity = 1.0; // plateau
      else opacity = (1 - t) / 0.4; // fade out doux

      const maxOpacity = 0.3 + s.radius * 3; // plus transparent : ~0.38 à ~0.48
      (s.mesh.material as THREE.MeshBasicMaterial).opacity = opacity * maxOpacity;
    }
  });

  return null;
}
