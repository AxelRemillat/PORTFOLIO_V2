import { useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PORTALS, PORTAL_RADIUS, SPAWN_COOLDOWN } from "../constants/game";

interface Args {
  posRef:     MutableRefObject<THREE.Vector3>;
  prevPosRef: MutableRefObject<THREE.Vector3>;
  enteredRef: MutableRefObject<boolean>;
  enterAnim:  MutableRefObject<{ t: number; href: string; pos: THREE.Vector3; color: string } | null>;
  flashRef:   MutableRefObject<{ pos: THREE.Vector3; color: string; t: number } | null>;
}

export function usePortalDetection({ posRef, prevPosRef, enteredRef, enterAnim, flashRef }: Args) {
  const spawnCooldown = useRef(SPAWN_COOLDOWN);

  useFrame((_, delta) => {
    if (enteredRef.current || enterAnim.current) {
      prevPosRef.current.copy(posRef.current);
      return;
    }

    if (spawnCooldown.current > 0) {
      spawnCooldown.current = Math.max(0, spawnCooldown.current - delta);
    }

    const pos = posRef.current;

    if (spawnCooldown.current <= 0) {
      for (const portal of PORTALS) {
        const [px, py, pz] = portal.position;
        const d3 = Math.sqrt((pos.x - px) ** 2 + (pos.y - py) ** 2 + (pos.z - pz) ** 2);
        if (d3 < PORTAL_RADIUS) {
          const vx = pos.x - prevPosRef.current.x;
          const vy = pos.y - prevPosRef.current.y;
          const vz = pos.z - prevPosRef.current.z;
          if (vx * vx + vy * vy + vz * vz > 1e-8) {
            const dot = vx * (px - pos.x) + vy * (py - pos.y) + vz * (pz - pos.z);
            if (dot > 0) {
              enterAnim.current = { t: 0, href: portal.href, pos: new THREE.Vector3(px, py, pz), color: portal.color };
              flashRef.current  = { pos: new THREE.Vector3(px, py, pz), color: portal.color, t: 0 };
              break;
            }
          }
        }
      }
    }

    prevPosRef.current.copy(pos);
  });
}
