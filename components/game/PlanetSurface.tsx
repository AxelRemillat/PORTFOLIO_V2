"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { PORTALS, ROCK_COLORS, GRASS_COLORS, BUSH_COLORS } from "./constants/game";
import { Planet } from "./Planet";

// Couleurs de pétales pour les petites fleurs du sol
const FLOWER_COLORS = ["#FF6B8A", "#FFD24A", "#C77DFF", "#7DBBFF", "#FF9F4A", "#FF5C8A"] as const;

// ── Lame d'herbe : géométrie unique (hauteur 1), réutilisée et juste mise à l'échelle ──
// Strip effilé, légèrement courbé vers l'avant, avec un dégradé de luminosité base→pointe.
function makeBladeGeometry() {
  const segs = 4, halfBase = 0.05, bend = 0.22;
  const pos: number[] = [], col: number[] = [], idx: number[] = [];
  for (let s = 0; s <= segs; s++) {
    const t = s / segs;
    const w = halfBase * (1 - t * 0.95);  // s'affine vers la pointe
    const z = bend * t * t;               // courbure douce vers l'avant
    pos.push(-w, t, z, w, t, z);
    const b = 0.5 + 0.5 * t;              // sombre à la base → clair à la pointe
    col.push(b, b, b, b, b, b);
  }
  for (let s = 0; s < segs; s++) {
    const a = s * 2;
    idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}
const BLADE_GEO = makeBladeGeometry();
// Un matériau par teinte d'herbe : la couleur de sommet (dégradé) module la teinte.
const BLADE_MATS = GRASS_COLORS.map((c) =>
  new THREE.MeshStandardMaterial({ color: c, vertexColors: true, roughness: 0.9, metalness: 0, side: THREE.DoubleSide }),
);
// Direction du vent (repère local de la planète).
const WIND_DIR = new THREE.Vector3(1, 0, 0.3).normalize();

export function PlanetSurface({ onSurfaceClick }: { onSurfaceClick: (p: THREE.Vector3) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const windRefs = useRef<(THREE.Group | null)[]>([]);

  const { rocks, grasses, tufts, bushes, flowers, water } = useMemo(() => {
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
    type Grass = { pos:[number,number,number]; quat:THREE.Quaternion; scale:number; cones:Cone[]; windAxis?:THREE.Vector3; phase?:number };

    // Axe (local) autour duquel coucher l'herbe pour qu'elle se penche vers WIND_DIR.
    function windAxisFor(nx:number, ny:number, nz:number, quat:THREE.Quaternion) {
      const n = new THREE.Vector3(nx, ny, nz);
      const wTan = WIND_DIR.clone().addScaledVector(n, -WIND_DIR.dot(n));
      if (wTan.lengthSq() < 1e-6) return new THREE.Vector3(1, 0, 0);
      wTan.normalize();
      return n.cross(wTan).normalize().applyQuaternion(quat.clone().invert());
    }

    const grasses: Grass[] = [];
    let gi = 0;
    while (grasses.length < 80 && gi < 700) {
      const seed = gi + 500;
      const { x, y, z, nx, ny, nz } = spherePt(seed, 7.03);
      if (!tooClose(x, y, z)) {
        const quat = new THREE.Quaternion().setFromUnitVectors(localUp, new THREE.Vector3(nx, ny, nz));
        const cCount = 10 + Math.floor(h(seed*13+8)*8);
        grasses.push({ pos: [x, y, z], quat, scale: 1.5 + h(seed*13+9)*3.0,
          windAxis: windAxisFor(nx, ny, nz, quat), phase: h(seed*13+16)*Math.PI*2,
          cones: Array.from({ length: cCount }, (_, c) => ({
            ox: (h(seed*13+10+c*5)-0.5)*0.24, oz: (h(seed*13+11+c*5)-0.5)*0.24,
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

    // Petites touffes d'herbe basses (plus courtes que l'herbe principale)
    const tufts: Grass[] = [];
    let ti = 0;
    while (tufts.length < 75 && ti < 700) {
      const seed = ti + 2000;
      const { x, y, z, nx, ny, nz } = spherePt(seed, 7.03);
      if (!tooClose(x, y, z)) {
        const quat = new THREE.Quaternion().setFromUnitVectors(localUp, new THREE.Vector3(nx, ny, nz));
        const cCount = 5 + Math.floor(h(seed*23+8)*4);
        tufts.push({ pos: [x, y, z], quat, scale: 0.8 + h(seed*23+9)*0.6,
          cones: Array.from({ length: cCount }, (_, c) => ({
            ox: (h(seed*23+10+c*5)-0.5)*0.12, oz: (h(seed*23+11+c*5)-0.5)*0.12,
            tilt: h(seed*23+12+c*5)*0.35,      tiltDir: h(seed*23+13+c*5)*Math.PI*2,
            height: 0.12 + h(seed*23+14+c*5)*0.10,
            colorIdx: Math.floor(h(seed*23+15+c*5)*GRASS_COLORS.length),
          })),
        });
      }
      ti++;
    }

    type Flower = { pos:[number,number,number]; quat:THREE.Quaternion; scale:number; height:number; color:string };
    const flowers: Flower[] = [];
    let fi = 0;
    while (flowers.length < 28 && fi < 400) {
      const seed = fi + 1500;
      const { x, y, z, nx, ny, nz } = spherePt(seed, 7.04);
      if (!tooClose(x, y, z)) {
        const quat = new THREE.Quaternion().setFromUnitVectors(localUp, new THREE.Vector3(nx, ny, nz));
        flowers.push({
          pos: [x, y, z], quat,
          scale: 0.7 + h(seed*19+1)*0.7,
          height: 0.14 + h(seed*19+2)*0.12,
          color: FLOWER_COLORS[Math.floor(h(seed*19+3)*FLOWER_COLORS.length)],
        });
      }
      fi++;
    }

    // Zones d'eau : disques posés à plat sur la surface, perpendiculaires à la normale
    const planetRadius = 7;
    const water = [
      new THREE.Vector3(0.3, -0.6, 0.7),
      new THREE.Vector3(-0.7, -0.4, -0.5),
    ].map((v) => {
      const n = v.clone().normalize();
      const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
      const p = n.clone().multiplyScalar(planetRadius + 0.02); // légèrement au-dessus de la surface
      return { pos: [p.x, p.y, p.z] as [number, number, number], quat };
    });

    return { rocks, grasses, tufts, bushes, flowers, water };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0003;
      groupRef.current.position.y  = Math.sin(t * 0.4) * 0.04;
    }
    // Vent : léger balancement permanent + rafales occasionnelles qui couchent
    // toutes les herbes dans la même direction (WIND_DIR).
    const gust = Math.max(0, Math.sin(t * 0.4) - 0.5) / 0.5; // 0 la plupart du temps, monte par à-coups
    for (let i = 0; i < grasses.length; i++) {
      const ref = windRefs.current[i];
      const g = grasses[i];
      if (!ref || !g.windAxis) continue;
      const sway = Math.sin(t * 1.6 + (g.phase ?? 0)) * 0.07;
      ref.quaternion.setFromAxisAngle(g.windAxis, sway + gust * 0.6);
    }
  });

  return (
    <group ref={groupRef}>
      <Planet onPointerDown={(e: ThreeEvent<PointerEvent>) => { if (e.button !== 0) return; onSurfaceClick(e.point); }} />

      {water.map((w, i) => (
        <mesh key={`w${i}`} position={w.pos} quaternion={w.quat}>
          <circleGeometry args={[0.45, 8]} />
          <meshStandardMaterial color="#1a3a6a" metalness={0.8} roughness={0.1} transparent opacity={0.85} />
        </mesh>
      ))}

      {rocks.map((r, i) => (
        <mesh key={`r${i}`} position={r.pos} rotation={[r.rx, r.ry, r.rz]} scale={r.scale}>
          {r.geo === "dodec" ? <dodecahedronGeometry args={[1, 0]} /> : <icosahedronGeometry args={[1, 0]} />}
          <meshStandardMaterial color={r.color} roughness={0.9} metalness={0.1} />
        </mesh>
      ))}

      {grasses.map((g, i) => (
        <group key={`g${i}`} position={g.pos} quaternion={g.quat} scale={g.scale}>
          {/* groupe animé par le vent (couche les brins) */}
          <group ref={(el) => { windRefs.current[i] = el; }}>
            {g.cones.map((c, j) => (
              <mesh
                key={j}
                geometry={BLADE_GEO}
                material={BLADE_MATS[c.colorIdx]}
                dispose={null}
                position={[c.ox, 0, c.oz]}
                rotation={[Math.sin(c.tiltDir)*c.tilt, c.tiltDir, Math.cos(c.tiltDir)*c.tilt]}
                scale={[c.height, c.height * 0.8, c.height]}
              />
            ))}
          </group>
        </group>
      ))}

      {tufts.map((g, i) => (
        <group key={`t${i}`} position={g.pos} quaternion={g.quat} scale={g.scale}>
          {g.cones.map((c, j) => (
            <mesh key={j} position={[c.ox, c.height*0.5, c.oz]} rotation={[Math.sin(c.tiltDir)*c.tilt, 0, Math.cos(c.tiltDir)*c.tilt]}>
              <coneGeometry args={[0.025, c.height, 4]} />
              <meshStandardMaterial color={GRASS_COLORS[c.colorIdx]} roughness={0.95} flatShading />
            </mesh>
          ))}
        </group>
      ))}

      {flowers.map((f, i) => (
        <group key={`f${i}`} position={f.pos} quaternion={f.quat} scale={f.scale}>
          {/* tige */}
          <mesh position={[0, f.height / 2, 0]}>
            <cylinderGeometry args={[0.015, 0.02, f.height, 5]} />
            <meshStandardMaterial color="#2d5a1b" roughness={0.9} />
          </mesh>
          {/* tête : pétales + cœur */}
          <group position={[0, f.height, 0]}>
            {Array.from({ length: 5 }).map((_, j) => {
              const a = (j / 5) * Math.PI * 2;
              return (
                <mesh key={j} position={[Math.cos(a) * 0.06, 0, Math.sin(a) * 0.06]} scale={[1, 0.4, 1]}>
                  <sphereGeometry args={[0.045, 6, 6]} />
                  <meshStandardMaterial color={f.color} roughness={0.7} flatShading />
                </mesh>
              );
            })}
            <mesh>
              <sphereGeometry args={[0.04, 6, 6]} />
              <meshStandardMaterial color="#FFE08A" roughness={0.6} emissive="#FFE08A" emissiveIntensity={0.2} />
            </mesh>
          </group>
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
