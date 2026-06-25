import { useSyncExternalStore } from "react";

// ── Portails visités, persistés dans localStorage ───────────────────────────────
// "Visité" = le joueur a confirmé la téléportation (markVisited appelé depuis
// usePortalDetection au moment du confirm). Store externe pour que la détection
// (Canvas/useFrame) et l'UI (HUD, Portals) partagent le même état sans prop drilling.
const KEY = "visited_portals";

function load(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : null;
    return Array.isArray(arr) ? new Set(arr) : new Set();
  } catch {
    return new Set();
  }
}

let snapshot: Set<string> = load();
const EMPTY: Set<string> = new Set();
const listeners = new Set<() => void>();

/** Marque un portail comme visité (idempotent) et persiste. */
export function markVisited(portalName: string) {
  if (snapshot.has(portalName)) return;
  const next = new Set(snapshot);
  next.add(portalName);
  snapshot = next; // nouvelle référence → useSyncExternalStore détecte le changement
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...next]));
  } catch {
    /* localStorage indisponible — on garde l'état en mémoire */
  }
  listeners.forEach((l) => l());
}

export function useVisitedPortals() {
  const visitedPortals = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => snapshot,
    () => EMPTY,
  );
  return { visitedPortals, markVisited };
}
