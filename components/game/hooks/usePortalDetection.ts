import { useRef, useSyncExternalStore } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PORTALS, PORTAL_RADIUS, SPAWN_COOLDOWN } from "../constants/game";
import { markVisited } from "./useVisitedPortals";
import { gameAudio } from "../audio/GameAudioEngine";

// ── Descriptions courtes par portail (id → texte) ──────────────────────────────
const PORTAL_DESCRIPTIONS: Record<string, string> = {
  rag:   "Un CV interactif propulsé par IA — pose-moi n'importe quelle question",
  rise:  "Une plateforme EdTech pour révolutionner l'apprentissage",
  seaco: "Un pipeline de données RAG pour l'analyse documentaire",
  n8n:   "Des automatisations intelligentes pour gagner en productivité",
  music: "Compose ta propre musique dans l'espace",
};

export interface PendingPortal {
  name: string;
  url: string;
  color: string;
  description: string;
}

// ── Store externe ──────────────────────────────────────────────────────────────
// La détection tourne dans le Canvas (useFrame, dans Scene) tandis que l'UI de
// confirmation vit dans la page. Ce petit store relie les deux sans toucher Scene.
let pending: PendingPortal | null = null;
let confirmCb: (() => void) | null = null;
let cancelCb: (() => void) | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const portalStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => { listeners.delete(l); };
  },
  snapshot: () => pending,
  request(p: PendingPortal, onConfirm: () => void, onCancel: () => void) {
    pending = p;
    confirmCb = onConfirm;
    cancelCb = onCancel;
    emit();
  },
  confirm() {
    const cb = confirmCb;
    pending = null; confirmCb = null; cancelCb = null;
    emit();
    cb?.();
  },
  cancel() {
    const cb = cancelCb;
    pending = null; confirmCb = null; cancelCb = null;
    emit();
    cb?.();
  },
};

// Hook destiné à la page : état de confirmation + actions.
export function usePendingPortal() {
  const pendingPortal = useSyncExternalStore(
    portalStore.subscribe,
    portalStore.snapshot,
    () => null,
  );
  return {
    pendingPortal,
    confirmPortal: portalStore.confirm,
    cancelPortal: portalStore.cancel,
  };
}

interface Args {
  posRef:     MutableRefObject<THREE.Vector3>;
  prevPosRef: MutableRefObject<THREE.Vector3>;
  enteredRef: MutableRefObject<boolean>;
  enterAnim:  MutableRefObject<{ t: number; href: string; pos: THREE.Vector3; color: string } | null>;
  flashRef:   MutableRefObject<{ pos: THREE.Vector3; color: string; t: number } | null>;
}

export function usePortalDetection({ posRef, prevPosRef, enteredRef, enterAnim, flashRef }: Args) {
  const spawnCooldown = useRef(SPAWN_COOLDOWN);
  const awaiting = useRef(false); // en attente de la réponse de l'utilisateur

  useFrame((_, delta) => {
    // Gelé pendant l'animation d'entrée OU tant qu'une confirmation est en attente
    if (enteredRef.current || enterAnim.current || awaiting.current) {
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
              // Au lieu de téléporter, on demande confirmation à l'utilisateur.
              awaiting.current = true;
              const at = new THREE.Vector3(px, py, pz);
              const color = portal.color;
              const href = portal.href;
              gameAudio.playPortalEnter(color); // shimmer magique à l'approche
              portalStore.request(
                {
                  name: portal.label,
                  url: href,
                  color,
                  description: PORTAL_DESCRIPTIONS[portal.id] ?? "",
                },
                () => {
                  // OUI → on marque le portail comme visité puis on lance
                  // l'animation d'entrée existante (shrink + redirect)
                  gameAudio.playPortalConfirm(); // montée dramatique de confirmation
                  markVisited(portal.label);
                  enterAnim.current = { t: 0, href, pos: at, color };
                  flashRef.current  = { pos: at.clone(), color, t: 0 };
                  awaiting.current = false;
                },
                () => {
                  // NON → on reprend le jeu, petit délai pour éviter un re-déclenchement
                  spawnCooldown.current = SPAWN_COOLDOWN;
                  awaiting.current = false;
                },
              );
              break;
            }
          }
        }
      }
    }

    prevPosRef.current.copy(pos);
  });
}
