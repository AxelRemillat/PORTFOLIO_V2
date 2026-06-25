"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { audioEngine } from "./AudioEngine";
import type { InstrumentParams } from "./AudioEngine";

// ── Types ──────────────────────────────────────────────────────────────────────

export type InstrumentId = "baobab" | "cristal" | "renard" | "rose" | "mouton" | "etoile";

export const INSTRUMENT_COLOR: Record<InstrumentId, string> = {
  baobab: "#8B4513",
  cristal: "#00CED1",
  renard:  "#FF6B35",
  rose:    "#FF69B4",
  mouton:  "#F5F5F5",
  etoile:  "#FFD700",
};

const PLANET_R      = 3.5;
const MAX_OBJECTS   = 8;
const MAX_PER_INSTR = 2;

interface PlacedEl {
  id:         number;
  instrument: InstrumentId;
  pos:        THREE.Vector3;
  quat:       THREE.Quaternion;
}

// ── Instrument meshes ─────────────────────────────────────────────────────────
// Each mesh: origin at sphere surface (local y=0), extends upward in local +Y.
// emissiveIntensity 0.3 default; PlacedElement raises it to 0.7 on hover.

function BaobabMesh() {
  return (
    <group>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.1, 0.18, 0.6, 7]} />
        <meshStandardMaterial color="#8B4513" emissive="#8B4513" emissiveIntensity={0.3} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <sphereGeometry args={[0.22, 6, 6]} />
        <meshStandardMaterial color="#2d6020" emissive="#2d6020" emissiveIntensity={0.3} roughness={0.85} />
      </mesh>
    </group>
  );
}

function CristalMesh() {
  return (
    // OctahedronGeometry(0.25) has vertices at ±0.25. scaleY 1.8 → ±0.45.
    // Positioned at y=0.48 so bottom edge (0.48-0.45=0.03) clears sphere surface.
    <mesh position={[0, 0.48, 0]} scale={[1, 1.8, 1]}>
      <octahedronGeometry args={[0.25, 0]} />
      <meshStandardMaterial
        color="#00CED1"
        emissive="#00CED1"
        emissiveIntensity={0.3}
        roughness={0.1}
        metalness={0.8}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

function RenarMesh() {
  return (
    <group>
      <mesh position={[0, 0.2, 0]}>
        <coneGeometry args={[0.15, 0.4, 4]} />
        <meshStandardMaterial color="#FF6B35" emissive="#FF6B35" emissiveIntensity={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[-0.07, 0.44, 0]}>
        <sphereGeometry args={[0.05, 5, 5]} />
        <meshStandardMaterial color="#FF6B35" emissive="#FF6B35" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.07, 0.44, 0]}>
        <sphereGeometry args={[0.05, 5, 5]} />
        <meshStandardMaterial color="#FF6B35" emissive="#FF6B35" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function RoseMesh() {
  return (
    <group>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 5]} />
        <meshStandardMaterial color="#3a8c3a" emissive="#3a8c3a" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 0.36, 0]}>
        <sphereGeometry args={[0.1, 6, 6]} />
        <meshStandardMaterial color="#FF69B4" emissive="#FF69B4" emissiveIntensity={0.3} roughness={0.5} />
      </mesh>
    </group>
  );
}

function MoutonMesh() {
  return (
    <group>
      <mesh position={[0, 0.11, 0]}>
        <boxGeometry args={[0.28, 0.22, 0.22]} />
        <meshStandardMaterial color="#F5F5F5" emissive="#F5F5F5" emissiveIntensity={0.15} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.31, 0.08]}>
        <sphereGeometry args={[0.14, 6, 6]} />
        <meshStandardMaterial color="#F5F5F5" emissive="#F5F5F5" emissiveIntensity={0.15} roughness={0.8} />
      </mesh>
    </group>
  );
}

function EtoileMesh() {
  return (
    <mesh position={[0, 0.11, 0]} scale={[1, 0.5, 1]}>
      <octahedronGeometry args={[0.22]} />
      <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} roughness={0.2} metalness={0.7} />
    </mesh>
  );
}

const MESH_RENDERERS: Record<InstrumentId, React.FC> = {
  baobab: BaobabMesh,
  cristal: CristalMesh,
  renard:  RenarMesh,
  rose:    RoseMesh,
  mouton:  MoutonMesh,
  etoile:  EtoileMesh,
};

// ── PlacedElement ─────────────────────────────────────────────────────────────

function PlacedElement({
  el, isHovered, onHoverEnter, onHoverLeave, onSingleClick, onDblClick,
}: {
  el:            PlacedEl;
  isHovered:     boolean;
  onHoverEnter:  () => void;
  onHoverLeave:  () => void;
  onSingleClick: () => void;
  onDblClick:    (e: ThreeEvent<MouseEvent>) => void;
}) {
  const groupRef   = useRef<THREE.Group>(null);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const Mesh       = MESH_RENDERERS[el.instrument];

  useEffect(() => {
    groupRef.current?.traverse(child => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (mat?.emissive) mat.emissiveIntensity = isHovered ? 0.7 : 0.3;
      }
    });
  }, [isHovered]);

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (clickTimer.current) return; // 2nd click → dblclick is coming
    clickTimer.current = setTimeout(() => {
      clickTimer.current = null;
      onSingleClick();
    }, 250);
  }, [onSingleClick]);

  const handleDblClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (clickTimer.current) { clearTimeout(clickTimer.current); clickTimer.current = null; }
    onDblClick(e);
  }, [onDblClick]);

  return (
    <group
      ref={groupRef}
      position={el.pos}
      quaternion={el.quat}
      onPointerDown={(e) => e.stopPropagation()} // prevent planet placement
      onPointerOver={(e) => { e.stopPropagation(); onHoverEnter(); }}
      onPointerOut={(e)  => { e.stopPropagation(); onHoverLeave(); }}
      onClick={handleClick}
      onDoubleClick={handleDblClick}
    >
      <Mesh />
    </group>
  );
}

// ── Stars ─────────────────────────────────────────────────────────────────────

function Stars() {
  const positions = useMemo(() => {
    const arr = new Float32Array(700 * 3);
    for (let i = 0; i < 700; i++) {
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const r  = 40 + Math.random() * 20;
      arr[i*3]     = r * Math.sin(ph) * Math.cos(th);
      arr[i*3 + 1] = r * Math.sin(ph) * Math.sin(th);
      arr[i*3 + 2] = r * Math.cos(ph);
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.15} color="#ffffff" transparent opacity={0.82} sizeAttenuation fog={false} />
    </points>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────

const _up = new THREE.Vector3(0, 1, 0);

function Scene({
  selectedRef,
  onObjectCountChange,
  onTypesChange,
  onElementClick,
  onElementRemoved,
  clearSignal,
}: {
  selectedRef:         React.MutableRefObject<InstrumentId | null>;
  onObjectCountChange: (n: number) => void;
  onTypesChange:       (types: InstrumentId[]) => void;
  onElementClick:      (id: string, type: InstrumentId, params: InstrumentParams) => void;
  onElementRemoved?:   (id: string) => void;
  clearSignal:         number;
}) {
  const planetGroupRef = useRef<THREE.Group>(null);
  const [placedEls, setPlacedEls] = useState<PlacedEl[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const placedElsRef = useRef<PlacedEl[]>([]);

  useEffect(() => {
    placedElsRef.current = placedEls;
    onObjectCountChange(placedEls.length);
    onTypesChange(placedEls.map(el => el.instrument));
  }, [placedEls, onObjectCountChange, onTypesChange]);

  // Cleanup all instruments when the music page is left
  useEffect(() => {
    return () => {
      placedElsRef.current.forEach(el => audioEngine.removeInstrument(el.id.toString()));
      audioEngine.stop();
    };
  }, []);

  // Clear all when parent sends signal
  useEffect(() => {
    if (clearSignal === 0) return;
    placedElsRef.current.forEach(el => audioEngine.removeInstrument(el.id.toString()));
    setPlacedEls([]);
    setHoveredId(null);
  }, [clearSignal]);

  useFrame(() => {
    if (planetGroupRef.current) planetGroupRef.current.rotation.y += 0.0008;
  });

  const handlePlanetClick = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const selected = selectedRef.current;
    if (!selected || !planetGroupRef.current) return;
    const els = placedElsRef.current;
    if (els.length >= MAX_OBJECTS) return;
    if (els.filter(el => el.instrument === selected).length >= MAX_PER_INSTR) return;

    // Unlock AudioContext on first user gesture (no-op if already started)
    audioEngine.start().catch(() => {});

    const localPt = planetGroupRef.current.worldToLocal(e.point.clone());
    localPt.normalize().multiplyScalar(PLANET_R);
    const q = new THREE.Quaternion().setFromUnitVectors(_up, localPt.clone().normalize());

    const newEl: PlacedEl = {
      id:         Date.now(),
      instrument: selected,
      pos:        localPt.clone(),
      quat:       q,
    };
    audioEngine.addInstrument(newEl.id.toString(), newEl.instrument);
    setPlacedEls(prev => [...prev, newEl]);
  }, [selectedRef]);

  const removeEl = useCallback((id: number, e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    audioEngine.removeInstrument(id.toString());
    setPlacedEls(prev => prev.filter(el => el.id !== id));
    setHoveredId(prev => prev === id ? null : prev);
    onElementRemoved?.(id.toString());
  }, [onElementRemoved]);

  return (
    <>
      <Stars />
      <ambientLight intensity={1.5} />
      <directionalLight position={[8,  10,  6]} intensity={1.2} />
      <directionalLight position={[-6, -5, -4]} intensity={0.5} color="#aabbff" />

      <group ref={planetGroupRef}>
        <mesh onPointerDown={handlePlanetClick}>
          <sphereGeometry args={[PLANET_R, 10, 10]} />
          <meshStandardMaterial
            color="#1a1a3e"
            emissive="#0a0a24"
            emissiveIntensity={0.15}
            roughness={0.9}
            flatShading
          />
        </mesh>

        {placedEls.map(el => (
          <PlacedElement
            key={el.id}
            el={el}
            isHovered={hoveredId === el.id}
            onHoverEnter={() => setHoveredId(el.id)}
            onHoverLeave={() => setHoveredId(prev => prev === el.id ? null : prev)}
            onSingleClick={() => onElementClick(el.id.toString(), el.instrument, audioEngine.getParams(el.id.toString()))}
            onDblClick={(e) => removeEl(el.id, e)}
          />
        ))}
      </group>
    </>
  );
}

// ── MusicCanvas ───────────────────────────────────────────────────────────────

export default function MusicCanvas({
  selectedInstrument,
  onObjectCountChange,
  onTypesChange,
  onElementClick,
  onElementRemoved,
  clearSignal = 0,
}: {
  selectedInstrument:  InstrumentId | null;
  onObjectCountChange: (n: number) => void;
  onTypesChange:       (types: InstrumentId[]) => void;
  onElementClick:      (id: string, type: InstrumentId, params: InstrumentParams) => void;
  onElementRemoved?:   (id: string) => void;
  clearSignal?:        number;
}) {
  const selectedRef = useRef<InstrumentId | null>(selectedInstrument);
  useEffect(() => { selectedRef.current = selectedInstrument; }, [selectedInstrument]);

  return (
    <Canvas
      camera={{ position: [0, 2, 11], fov: 50 }}
      gl={{ antialias: true }}
      style={{ width: "100%", height: "100%", background: "#020210" }}
    >
      <Scene
        selectedRef={selectedRef}
        onObjectCountChange={onObjectCountChange}
        onTypesChange={onTypesChange}
        onElementClick={onElementClick}
        onElementRemoved={onElementRemoved}
        clearSignal={clearSignal}
      />
    </Canvas>
  );
}
