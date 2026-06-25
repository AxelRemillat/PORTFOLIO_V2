"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { PORTALS } from "./constants/game";
import { useVisitedPortals } from "./hooks/useVisitedPortals";
import { completeQuest, type QuestId } from "./hooks/useQuestSystem";

// HUD écran (HTML) : nom de chaque portail, toujours affiché, projeté 2D au-dessus
// du portail. Deux états : visible direct (plein style) vs à travers la planète
// (atténué). Transition lissée par portail pour éviter tout clignotement.
// Rendu via <Html fullscreen> (accès caméra) ; mis à jour par refs en useFrame.

const FPS_INTERVAL = 1 / 30;

// Suffixes hex d'opacité pour teinter la couleur du portail.
const A80 = "cc", A60 = "99", A40 = "66", A30 = "4d", A25 = "40";

const lerp = THREE.MathUtils.lerp;
const _v  = new THREE.Vector3();
const _pd = new THREE.Vector3();
const _cd = new THREE.Vector3();

export function PortalHUD() {
  const { camera, size } = useThree();
  const { visitedPortals } = useVisitedPortals();

  const portals = useMemo(
    () =>
      PORTALS.map((p) => {
        const pos = new THREE.Vector3(...p.position);
        // Point d'ancrage du label : au-dessus de l'anneau (le long de la normale
        // de surface) pour que le titre soit toujours projeté au-dessus du portail.
        const anchor = pos.clone().setLength(pos.length() + 1.4);
        return { id: p.id, name: p.label, color: p.color, pos, anchor };
      }),
    [],
  );

  // Visiter un portail = compléter la mission principale correspondante.
  useEffect(() => {
    portals.forEach((p) => {
      if (visitedPortals.has(p.name)) completeQuest(`visit_${p.id}` as QuestId);
    });
  }, [visitedPortals, portals]);

  const cRef = useRef<(HTMLDivElement | null)[]>([]);
  const bRef = useRef<(HTMLDivElement | null)[]>([]);
  const chkRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subRef = useRef<(HTMLDivElement | null)[]>([]);
  const vis = useRef<number[]>(portals.map(() => 1)); // visibilité lissée par portail
  const acc = useRef(0);

  useFrame((_, delta) => {
    acc.current += delta;
    if (acc.current < FPS_INTERVAL) return;
    acc.current = 0;

    const w = size.width, h = size.height;
    _cd.copy(camera.position).normalize();

    for (let i = 0; i < portals.length; i++) {
      const p = portals[i];
      const c = cRef.current[i], b = bRef.current[i];
      if (!c || !b) continue;

      _v.copy(p.anchor).project(camera); // on projette le point au-dessus de l'anneau
      const behind = _v.z > 1; // derrière la caméra → hors champ complet
      if (behind) {
        vis.current[i] = lerp(vis.current[i], -1, 0.04);
        c.style.display = "none";
        continue;
      }

      // Occlusion : portail sur la face opposée de la planète ?
      _pd.copy(p.pos).normalize();
      const occluded = _pd.dot(_cd) < 0.15;

      // Cible : 1 = visible direct, 0 = à travers. Lissage lent (anti-clignotement).
      vis.current[i] = lerp(vis.current[i], occluded ? 0 : 1, 0.04);
      const v  = vis.current[i];
      const vc = v < 0 ? 0 : v > 1 ? 1 : v;
      const visMode = v > 0.5;
      const visited = visitedPortals.has(p.name);
      const col = p.color;

      // Position : le label est ancré par son BAS sur ce point (transform
      // translateY(-100%)), donc il s'étend toujours vers le haut → au-dessus du
      // portail. Clamp pour le garder entièrement à l'écran.
      const x = (_v.x * 0.5 + 0.5) * w;
      const y = (-_v.y * 0.5 + 0.5) * h;
      c.style.display = "block";
      c.style.left = `${Math.min(Math.max(x, 80), w - 80)}px`;
      c.style.top  = `${Math.min(Math.max(y, 64), h - 6)}px`;
      c.classList.toggle("pp-pulse", !visited && visMode);

      // Opacité / taille / flou : lissés en continu.
      b.style.opacity  = `${visited ? lerp(0.18, 0.45, vc) : lerp(0.38, 1, vc)}`;
      b.style.fontSize = `${visited ? lerp(12, 13, vc) : lerp(14, 17, vc)}px`;
      const blur = (visited ? 1 : 0.8) * (1 - vc);
      b.style.filter = blur > 0.02 ? `blur(${blur}px)` : "none";
      b.style.color = visited ? col + A60 : col;
      b.style.fontWeight = visited ? "600" : visMode ? "800" : "600";

      if (visited) {
        b.style.background = "rgba(0,0,0,0.40)";
        b.style.border = `1px solid ${col + A30}`;
        b.style.padding = "4px 12px";
        b.style.textShadow = visMode ? `0 0 6px ${col + A40}` : "none";
      } else if (visMode) {
        b.style.background = "rgba(0,0,0,0.65)";
        b.style.border = `1px solid ${col + A80}`;
        b.style.padding = "6px 16px";
        b.style.textShadow = `0 0 16px ${col}, 0 0 30px ${col + A60}, 0 0 2px #000`;
      } else {
        b.style.background = "rgba(0,0,0,0.30)";
        b.style.border = `1px solid ${col + A25}`;
        b.style.padding = "5px 13px";
        b.style.textShadow = `0 0 8px ${col + A40}`;
      }

      const chk = chkRef.current[i], sub = subRef.current[i];
      if (chk) chk.style.display = visited ? "inline" : "none";
      if (sub) sub.style.display = !visited && visMode ? "block" : "none";
    }
  });

  return (
    <Html fullscreen zIndexRange={[10, 10]} style={{ pointerEvents: "none" }}>
      <style>{`
        @keyframes ppPulse {
          0%, 100% { transform: translate(-50%, -100%) scale(1); }
          50%      { transform: translate(-50%, -100%) scale(1.06); }
        }
        .pp-pulse { animation: ppPulse 1.8s ease-in-out infinite; }
      `}</style>

      {portals.map((p, i) => (
        <div
          key={`label-${p.name}`}
          ref={(el) => { cRef.current[i] = el; }}
          style={{
            position: "absolute", display: "none",
            transform: "translate(-50%, -100%)", textAlign: "center",
            whiteSpace: "nowrap", fontFamily: "monospace", pointerEvents: "none",
          }}
        >
          <div ref={(el) => { bRef.current[i] = el; }} style={{ display: "inline-block", borderRadius: 8 }}>
            <span ref={(el) => { chkRef.current[i] = el; }} style={{ display: "none" }}>✓ </span>
            {p.name}
          </div>
          <div ref={(el) => { subRef.current[i] = el; }} style={{ display: "none", fontSize: 11, color: "#AA99CC", marginTop: 2 }}>
            → Appuie sur {p.name} pour visiter
          </div>
        </div>
      ))}
    </Html>
  );
}
