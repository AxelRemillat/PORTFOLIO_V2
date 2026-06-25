"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { discoverQuest, completeQuest } from "./hooks/useQuestSystem";

const MAX     = 6;
const LEN_F   = [1.0, 0.6, 0.3];   // trail segment length factors
const BASE_OP = [1.0, 0.5, 0.2];   // trail segment base opacities

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pickColor = () => {
  const r = Math.random();
  return r < 0.7 ? "#FFFFFF" : r < 0.85 ? "#FFE8CC" : "#CCE0FF";
};

interface Seg { line: THREE.Line; mat: THREE.LineBasicMaterial; geo: THREE.BufferGeometry; }
interface Slot {
  active: boolean;
  pos: THREE.Vector3; dir: THREE.Vector3;
  speed: number; length: number; life: number; lifeSpeed: number;
  segs: Seg[];
}

export function ShootingStars() {
  const spawnTimer = useRef(1.2);
  const seen = useRef(0);

  const pool = useMemo<Slot[]>(() => {
    return Array.from({ length: MAX }, () => {
      const segs: Seg[] = LEN_F.map(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
        const mat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
        const line = new THREE.Line(geo, mat);
        line.frustumCulled = false;
        line.visible = false;
        return { line, mat, geo };
      });
      return {
        active: false, pos: new THREE.Vector3(), dir: new THREE.Vector3(),
        speed: 0, length: 0, life: 0, lifeSpeed: 0, segs,
      };
    });
  }, []);

  const spawn = () => {
    const s = pool.find((p) => !p.active);
    if (!s) return;
    // Start point on a 60–80 unit sphere, in the visible hemisphere (z > 0)
    const dirRand = new THREE.Vector3(rand(-1, 1), rand(-1, 1), rand(0.2, 1)).normalize();
    s.pos.copy(dirRand).multiplyScalar(rand(60, 80));
    // Fly diagonally toward the lower screen
    s.dir.set(rand(-0.6, 0.6), rand(-0.8, -0.3), rand(-0.2, 0.2)).normalize();
    s.speed     = rand(0.3, 0.8);
    s.length    = rand(1.5, 4.0);
    s.lifeSpeed = rand(0.004, 0.010);
    s.life      = 0;
    s.active    = true;
    const color = pickColor();
    s.segs.forEach((seg) => { seg.mat.color.set(color); seg.line.visible = true; });

    // Quête secrète : révélée à la 1re étoile, complétée après en avoir vu 3.
    discoverQuest("watch_shooting_star");
    seen.current += 1;
    if (seen.current >= 3) completeQuest("watch_shooting_star");
  };

  useFrame((_, delta) => {
    const k = Math.min(delta, 1 / 30) * 60; // frame-rate normalisation

    spawnTimer.current -= delta;
    if (spawnTimer.current <= 0) { spawn(); spawnTimer.current = rand(1.5, 5); }

    for (const s of pool) {
      if (!s.active) continue;
      s.pos.addScaledVector(s.dir, s.speed * k);
      s.life += s.lifeSpeed * k;

      if (s.life >= 1) {
        s.active = false;
        s.segs.forEach((seg) => { seg.line.visible = false; });
        continue;
      }

      let op = 1;
      if (s.life < 0.15)      op = s.life / 0.15;
      else if (s.life > 0.75) op = (1 - s.life) / 0.25;
      op = Math.max(0, Math.min(1, op));

      s.segs.forEach((seg, j) => {
        const arr = seg.geo.attributes.position.array as Float32Array;
        const L = s.length * LEN_F[j];
        arr[0] = s.pos.x; arr[1] = s.pos.y; arr[2] = s.pos.z;
        arr[3] = s.pos.x - s.dir.x * L;
        arr[4] = s.pos.y - s.dir.y * L;
        arr[5] = s.pos.z - s.dir.z * L;
        seg.geo.attributes.position.needsUpdate = true;
        seg.mat.opacity = op * BASE_OP[j];
      });
    }
  });

  return (
    <group>
      {pool.flatMap((s) => s.segs).map((seg, i) => (
        <primitive key={i} object={seg.line} />
      ))}
    </group>
  );
}
