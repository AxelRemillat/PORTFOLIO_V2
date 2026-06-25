"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Rocket() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime * 0.04;
    const r = 34;
    groupRef.current.position.set(Math.cos(t)*r, 10+Math.sin(t*2)*5, Math.sin(t)*r);
    groupRef.current.rotation.y = Math.atan2(-Math.sin(t), Math.cos(t));
  });
  const trailColors = ["#ff8800","#ff8800","#ffdd00","#ffee88","#ffffff"];
  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[0.07,0.14,0.65,8]} /><meshStandardMaterial color="#d0d0d0" roughness={0.3} metalness={0.7} /></mesh>
      <mesh position={[0,0,0.48]} rotation={[Math.PI/2,0,0]}><coneGeometry args={[0.07,0.28,8]} /><meshStandardMaterial color="#ff3333" roughness={0.4} metalness={0.5} /></mesh>
      <mesh position={[ 0.18,0,-0.18]}><boxGeometry args={[0.22,0.02,0.2]} /><meshStandardMaterial color="#bb2222" roughness={0.6} metalness={0.3} /></mesh>
      <mesh position={[-0.18,0,-0.18]}><boxGeometry args={[0.22,0.02,0.2]} /><meshStandardMaterial color="#bb2222" roughness={0.6} metalness={0.3} /></mesh>
      <mesh position={[0,0.06,0.2]}><sphereGeometry args={[0.055,6,6]} /><meshBasicMaterial color="#88ccff" /></mesh>
      {trailColors.map((col,i) => (
        <mesh key={i} position={[0,0,-0.38-i*0.14]}>
          <sphereGeometry args={[0.06-i*0.008,4,4]} />
          <meshBasicMaterial color={col} transparent opacity={0.9-i*0.17} fog={false} />
        </mesh>
      ))}
    </group>
  );
}

function LaserBeams() {
  const g0 = useRef<THREE.Group>(null);
  const g1 = useRef<THREE.Group>(null);
  const g2 = useRef<THREE.Group>(null);
  const g3 = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (g0.current) { const p=(t*3.8)%120-60;      g0.current.position.set(p,7,-36); }
    if (g1.current) { const p=(t*2.9+40)%120-60;   g1.current.position.set(-36,3,p); }
    if (g2.current) { const p=(t*5.1+80)%120-60;   g2.current.position.set(p*0.8,14,p*-0.4); }
    if (g3.current) { const p=(t*4.3+20)%120-60;   g3.current.position.set(-p*0.6,-3,p*0.9); }
  });
  return (
    <>
      <group ref={g0}><mesh><boxGeometry args={[5,0.022,0.022]} /><meshBasicMaterial color="#00ffee" transparent opacity={0.55} depthWrite={false} fog={false} /></mesh></group>
      <group ref={g1} rotation={[0,Math.PI/2,0]}><mesh><boxGeometry args={[4.5,0.018,0.018]} /><meshBasicMaterial color="#ff00ff" transparent opacity={0.50} depthWrite={false} fog={false} /></mesh></group>
      <group ref={g2} rotation={[0.08,0.25,0]}><mesh><boxGeometry args={[6,0.028,0.028]} /><meshBasicMaterial color="#88ff00" transparent opacity={0.52} depthWrite={false} fog={false} /></mesh></group>
      <group ref={g3} rotation={[0.12,-0.4,0.05]}><mesh><boxGeometry args={[4,0.020,0.020]} /><meshBasicMaterial color="#ff8844" transparent opacity={0.48} depthWrite={false} fog={false} /></mesh></group>
    </>
  );
}

function SunObject() {
  return (
    <group position={[35,18,28]}>
      <mesh><sphereGeometry args={[3.2,24,24]} /><meshBasicMaterial color="#fffbe0" fog={false} /></mesh>
      <mesh><sphereGeometry args={[3.9,16,16]} /><meshBasicMaterial color="#ffcc00" transparent opacity={0.45} depthWrite={false} fog={false} /></mesh>
      <mesh><sphereGeometry args={[5.0,16,16]} /><meshBasicMaterial color="#ff8800" transparent opacity={0.15} depthWrite={false} fog={false} /></mesh>
    </group>
  );
}

function MoonObject() {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.absarc(0, 0, 2.2, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0.58, 0, 1.96, 0, Math.PI * 2, true);
    s.holes.push(hole);
    return s;
  }, []);
  return (
    <>
      <mesh position={[-28,6,-22]}>
        <sphereGeometry args={[4.2,10,10]} />
        <meshBasicMaterial color="#3355bb" transparent opacity={0.09} depthWrite={false} fog={false} />
      </mesh>
      <group position={[-28,6,-22]} rotation={[0.12,-0.18,0.56]}>
        <mesh>
          <shapeGeometry args={[shape, 64]} />
          <meshBasicMaterial color="#ddeeff" side={THREE.DoubleSide} fog={false} />
        </mesh>
      </group>
    </>
  );
}

export function SpaceObjects() {
  return (
    <>
      <Rocket />
      <LaserBeams />
      <SunObject />
      <MoonObject />
    </>
  );
}
