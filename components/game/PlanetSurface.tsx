"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { PORTALS, ROCK_COLORS, GRASS_COLORS, BUSH_COLORS } from "./constants/game";
import { Planet } from "./Planet";

export function PlanetSurface({ onSurfaceClick }: { onSurfaceClick: (p: THREE.Vector3) => void }) {
  const groupRef = useRef<THREE.Group>(null);

  const { rocks, grasses, bushes } = useMemo(() => {
    const h = (n: number) => Math.abs(Math.sin(n * 127.1) * 43758.5453) % 1;
    const localUp = new THREE.Vector3(0, 1, 0);

    function tooClose(x: number, y: number, z: number) {
      for (const p of PORTALS) {
        const [px, py, pz] = p.position;
        if ((x - px) ** 2 + (y - py) ** 2 + (z - pz) ** 2 < 1.44) return true;
      }
      return false;
    }

    function spherePt(seed: number, radius: number) {
      const theta = h(seed * 13 + 0) * Math.PI * 2;
      const phi   = Math.acos(2 * h(seed * 13 + 1) - 1);
      const nx = Math.sin(phi) * Math.cos(theta);
      const ny = Math.cos(phi);
      const nz = Math.sin(phi) * Math.sin(theta);
      return { x: nx * radius, y: ny * radius, z: nz * radius, nx, ny, nz };
    }

    type Rock = { pos:[number,number,number]; rx:number; ry:number; rz:number; scale:number; color:string; geo:"dodec"|"ico" };
    const rocks: Rock[] = [];
    let ri = 0;
    while (rocks.length < 30 && ri < 300) {
      const { x, y, z } = spherePt(ri, 7.05);
      if (!tooClose(x, y, z)) rocks.push({
        pos: [x, y, z],
        rx: h(ri*13+2)*Math.PI*2, ry: h(ri*13+3)*Math.PI*2, rz: h(ri*13+4)*Math.PI*2,
        scale: 0.15 + h(ri*13+5)*0.55,
        color: ROCK_COLORS[Math.floor(h(ri*13+6)*ROCK_COLORS.length)],
        geo: h(ri*13+7) > 0.5 ? "dodec" : "ico",
      });
      ri++;
    }

    type Cone  = { ox:number; oz:number; tilt:number; tiltDir:number; height:number; colorIdx:number };
    type Grass = { pos:[number,number,number]; quat:THREE.Quaternion; scale:number; cones:Cone[] };
    const grasses: Grass[] = [];
    let gi = 0;
    while (grasses.length < 55 && gi < 500) {
      const seed = gi + 500;
      const { x, y, z, nx, ny, nz } = spherePt(seed, 7.03);
      if (!tooClose(x, y, z)) {
        const quat = new THREE.Quaternion().setFromUnitVectors(localUp, new THREE.Vector3(nx, ny, nz));
        const cCount = 5 + Math.floor(h(seed*13+8)*4);
        grasses.push({ pos: [x, y, z], quat, scale: 1.5 + h(seed*13+9)*3.0,
          cones: Array.from({ length: cCount }, (_, c) => ({
            ox: (h(seed*13+10+c*5)-0.5)*0.18, oz: (h(seed*13+11+c*5)-0.5)*0.18,
            tilt: h(seed*13+12+c*5)*0.3,       tiltDir: h(seed*13+13+c*5)*Math.PI*2,
            height: 0.3 + h(seed*13+14+c*5)*0.4,
            colorIdx: Math.floor(h(seed*13+15+c*5)*GRASS_COLORS.length),
          })),
        });
      }
      gi++;
    }

    type Cluster = { ox:number; oy:number; oz:number; r:number; colorIdx:number };
    type Bush    = { pos:[number,number,number]; quat:THREE.Quaternion; scale:number; clusters:Cluster[] };
    const bushes: Bush[] = [];
    let bi = 0;
    while (bushes.length < 10 && bi < 200) {
      const seed = bi + 1000;
      const { x, y, z, nx, ny, nz } = spherePt(seed, 7.06);
      if (!tooClose(x, y, z)) {
        const quat = new THREE.Quaternion().setFromUnitVectors(localUp, new THREE.Vector3(nx, ny, nz));
        const cCount = 2 + Math.floor(h(seed*17+0)*2);
        bushes.push({ pos: [x, y, z], quat, scale: 0.8 + h(seed*17+1)*1.0,
          clusters: Array.from({ length: cCount }, (_, c) => ({
            ox: (h(seed*17+2+c*4)-0.5)*0.5, oy: 0.45 + h(seed*17+3+c*4)*0.45,
            oz: (h(seed*17+4+c*4)-0.5)*0.5, r: 0.28 + h(seed*17+5+c*4)*0.28,
            colorIdx: Math.floor(h(seed*17+6+c*4)*BUSH_COLORS.length),
          })),
        });
      }
      bi++;
    }

    return { rocks, grasses, bushes };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.0003;
    groupRef.current.position.y  = Math.sin(state.clock.elapsedTime * 0.4) * 0.04;
  });

  return (
    <group ref={groupRef}>
      <Planet onPointerDown={(e: ThreeEvent<PointerEvent>) => { if (e.button !== 0) return; onSurfaceClick(e.point); }} />

      {rocks.map((r, i) => (
        <mesh key={`r${i}`} position={r.pos} rotation={[r.rx, r.ry, r.rz]} scale={r.scale}>
          {r.geo === "dodec" ? <dodecahedronGeometry args={[1, 0]} /> : <icosahedronGeometry args={[1, 0]} />}
          <meshStandardMaterial color={r.color} roughness={0.9} metalness={0.1} />
        </mesh>
      ))}

      {grasses.map((g, i) => (
        <group key={`g${i}`} position={g.pos} quaternion={g.quat} scale={g.scale}>
          {g.cones.map((c, j) => (
            <mesh key={j} position={[c.ox, c.height*0.5, c.oz]} rotation={[Math.sin(c.tiltDir)*c.tilt, 0, Math.cos(c.tiltDir)*c.tilt]}>
              <coneGeometry args={[0.035, c.height, 4]} />
              <meshStandardMaterial color={GRASS_COLORS[c.colorIdx]} roughness={0.95} flatShading />
            </mesh>
          ))}
        </group>
      ))}

      {bushes.map((b, i) => (
        <group key={`b${i}`} position={b.pos} quaternion={b.quat} scale={b.scale}>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.06, 0.13, 0.6, 5]} />
            <meshStandardMaterial color="#2a1a0e" roughness={0.97} />
          </mesh>
          {b.clusters.map((c, j) => (
            <mesh key={j} position={[c.ox, c.oy, c.oz]}>
              <icosahedronGeometry args={[c.r, 1]} />
              <meshStandardMaterial color={BUSH_COLORS[c.colorIdx]} roughness={0.9} flatShading />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
