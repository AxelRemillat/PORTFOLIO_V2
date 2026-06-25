"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const _oq1 = new THREE.Quaternion();
const _oq2 = new THREE.Quaternion();
const _ov1 = new THREE.Vector3();
const _ov2 = new THREE.Vector3();
const _ov3 = new THREE.Vector3();
const _oYA = new THREE.Vector3(0, 1, 0);

type ObjType = "asteroid" | "satellite" | "debris" | "rocket" | "crystal";
type Param = {
  type: ObjType;
  radius: number; speed: number; angle0: number;
  axis: THREE.Vector3; color: string; size: number;
  sx: number; sy: number; sz: number;
  tumbleAxis: THREE.Vector3; tumbleSpd: number;
};

function buildParams(): Param[] {
  const h = (n: number) => Math.abs(Math.sin(n * 127.1) * 43758.5453) % 1;
  const rndAxis = (s: number) => {
    const theta = h(s * 3.1) * Math.PI * 2;
    const phi   = Math.acos(2 * h(s * 3.1 + 1) - 1);
    return new THREE.Vector3(Math.sin(phi)*Math.cos(theta), Math.cos(phi), Math.sin(phi)*Math.sin(theta)).normalize();
  };
  const ASTEROID_COLORS = ["#5a5060", "#6a6040", "#4a4850"];
  const DEBRIS_COLORS   = ["#8a7a6a", "#9a8a70"];
  const CRYSTAL_COLORS  = ["#7070ff", "#aa44ff"];
  const out: Param[] = [];

  for (let i = 0; i < 5; i++) {
    const s = i * 17 + 1;
    out.push({ type: "asteroid",
      radius: 8 + h(s)*8,      speed: 0.0003 + h(s+1)*0.0009,
      angle0: h(s+2)*Math.PI*2, axis: rndAxis(s*5),
      color: ASTEROID_COLORS[Math.floor(h(s+3)*3)],
      size: 0.15 + h(s+4)*0.40, sx: 1, sy: 0.6+h(s+5)*0.4, sz: 0.7+h(s+6)*0.5,
      tumbleAxis: rndAxis(s*9), tumbleSpd: 0.003 + h(s+7)*0.005,
    });
  }
  for (let i = 0; i < 3; i++) {
    const s = i * 17 + 200;
    out.push({ type: "satellite",
      radius: 10 + h(s)*3,     speed: 0.0003 + h(s+1)*0.0009,
      angle0: h(s+2)*Math.PI*2, axis: rndAxis(s*5),
      color: "#b0b8c0", size: 1, sx: 1, sy: 1, sz: 1,
      tumbleAxis: new THREE.Vector3(0,1,0), tumbleSpd: 0.002 + h(s+3)*0.003,
    });
  }
  for (let i = 0; i < 3; i++) {
    const s = i * 17 + 400;
    out.push({ type: "debris",
      radius: 8 + h(s)*3,      speed: 0.0003 + h(s+1)*0.0009,
      angle0: h(s+2)*Math.PI*2, axis: rndAxis(s*5),
      color: DEBRIS_COLORS[Math.floor(h(s+3)*2)],
      size: 0.08 + h(s+4)*0.10, sx: 1, sy: 0.5+h(s+5)*0.5, sz: 0.5+h(s+6)*0.5,
      tumbleAxis: rndAxis(s*9), tumbleSpd: 0.01 + h(s+7)*0.02,
    });
  }
  for (let i = 0; i < 2; i++) {
    const s = i * 17 + 600;
    out.push({ type: "rocket",
      radius: 12 + h(s)*4,     speed: 0.0003 + h(s+1)*0.0009,
      angle0: h(s+2)*Math.PI*2, axis: rndAxis(s*5),
      color: "#e8e0d0", size: 1, sx: 1, sy: 1, sz: 1,
      tumbleAxis: new THREE.Vector3(0,1,0), tumbleSpd: 0,
    });
  }
  for (let i = 0; i < 2; i++) {
    const s = i * 17 + 800;
    out.push({ type: "crystal",
      radius: 8 + h(s)*8,      speed: 0.0003 + h(s+1)*0.0009,
      angle0: h(s+2)*Math.PI*2, axis: rndAxis(s*5),
      color: CRYSTAL_COLORS[i], size: 0.1 + h(s+3)*0.10,
      sx: 1, sy: 2.0, sz: 1,
      tumbleAxis: new THREE.Vector3(0,1,0), tumbleSpd: 0.003 + h(s+4)*0.005,
    });
  }
  return out;
}

export function OrbitalObjects() {
  const outerRefs   = useRef<(THREE.Group | null)[]>(Array(15).fill(null));
  const satBodyRefs = useRef<(THREE.Group | null)[]>(Array(3).fill(null));
  const params = useMemo(buildParams, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    for (let i = 0; i < params.length; i++) {
      const g = outerRefs.current[i];
      if (!g) continue;
      const p = params[i];
      _oq1.setFromAxisAngle(p.axis, p.angle0 + t * p.speed * 60);
      _ov1.set(p.radius, 0, 0).applyQuaternion(_oq1);
      g.position.copy(_ov1);

      if (p.type === "asteroid" || p.type === "debris") {
        _oq2.setFromAxisAngle(p.tumbleAxis, t * p.tumbleSpd * 60);
        g.quaternion.copy(_oq2);
      } else if (p.type === "crystal") {
        _oq2.setFromAxisAngle(_oYA, t * p.tumbleSpd * 60);
        g.quaternion.copy(_oq2);
      } else if (p.type === "satellite") {
        const sg = satBodyRefs.current[i - 5];
        if (sg) sg.rotation.y = t * p.tumbleSpd * 60;
      } else if (p.type === "rocket") {
        _ov2.copy(_ov1).normalize();
        _ov3.crossVectors(p.axis, _ov2).normalize();
        _oq2.setFromUnitVectors(_oYA, _ov3);
        g.quaternion.copy(_oq2);
      }
    }
  });

  const p = params;
  return (
    <>
      {p.slice(0,5).map((obj,i) => (
        <group key={`ast${i}`} ref={(el) => { outerRefs.current[i] = el; }}>
          <mesh scale={[obj.sx, obj.sy, obj.sz]}>
            <dodecahedronGeometry args={[obj.size, 0]} />
            <meshStandardMaterial color={obj.color} roughness={1} metalness={0} />
          </mesh>
        </group>
      ))}

      {p.slice(5,8).map((_obj,i) => (
        <group key={`sat${i}`} ref={(el) => { outerRefs.current[i+5] = el; }}>
          <group ref={(el) => { satBodyRefs.current[i] = el; }}>
            <mesh><boxGeometry args={[0.12,0.08,0.08]} /><meshStandardMaterial color="#b0b8c0" metalness={0.8} roughness={0.2} /></mesh>
            <mesh position={[-0.15,0,0]}><boxGeometry args={[0.18,0.03,0.06]} /><meshStandardMaterial color="#1a3a6a" metalness={0.5} roughness={0.3} /></mesh>
            <mesh position={[ 0.15,0,0]}><boxGeometry args={[0.18,0.03,0.06]} /><meshStandardMaterial color="#1a3a6a" metalness={0.5} roughness={0.3} /></mesh>
          </group>
        </group>
      ))}

      {p.slice(8,11).map((obj,i) => (
        <group key={`deb${i}`} ref={(el) => { outerRefs.current[i+8] = el; }}>
          <mesh scale={[obj.sx, obj.sy, obj.sz]}>
            <tetrahedronGeometry args={[obj.size, 0]} />
            <meshStandardMaterial color={obj.color} metalness={0.6} roughness={0.7} />
          </mesh>
        </group>
      ))}

      {p.slice(11,13).map((_obj,i) => (
        <group key={`rkt${i}`} ref={(el) => { outerRefs.current[i+11] = el; }}>
          <mesh><cylinderGeometry args={[0.05,0.07,0.35,6]} /><meshStandardMaterial color="#e8e0d0" roughness={0.6} metalness={0.1} /></mesh>
          <mesh position={[0,0.235,0]}><coneGeometry args={[0.05,0.12,6]} /><meshStandardMaterial color="#e8e0d0" roughness={0.6} metalness={0.1} /></mesh>
          {[0,1,2].map((fi) => { const a=(fi/3)*Math.PI*2; return (
            <mesh key={fi} position={[Math.cos(a)*0.07,-0.175,Math.sin(a)*0.07]} rotation={[0,a,0]} scale={[1,1,0.2]}>
              <coneGeometry args={[0.06,0.1,3]} /><meshStandardMaterial color="#d0c8b8" roughness={0.7} metalness={0.1} />
            </mesh>
          ); })}
          <pointLight position={[0,-0.25,0]} color="#ff6600" intensity={0.4} distance={1} />
        </group>
      ))}

      {p.slice(13,15).map((obj,i) => (
        <group key={`cry${i}`} ref={(el) => { outerRefs.current[i+13] = el; }}>
          <mesh scale={[1,2.0,1]}>
            <octahedronGeometry args={[obj.size, 0]} />
            <meshStandardMaterial color={obj.color} emissive={obj.color} emissiveIntensity={0.4} transparent opacity={0.85} roughness={0.2} metalness={0.1} />
          </mesh>
        </group>
      ))}
    </>
  );
}
