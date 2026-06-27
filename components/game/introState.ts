// Mini-store de l'état "intro" du jeu. Piloté par la page (app/game/page.tsx),
// lu chaque frame par CameraController. Évite de faire du prop-drilling à travers
// Scene.tsx (qu'on ne doit pas modifier).

let introActive = false;
let onComplete: (() => void) | null = null;

// Active/désactive l'intro. cb (optionnel) est appelé quand la caméra a fini son
// glissé d'entrée (via notifyIntroComplete).
export function setIntroMode(v: boolean, cb?: () => void) {
  introActive = v;
  onComplete = v ? cb ?? null : null;
}

export function isIntroActive() {
  return introActive;
}

// Appelé par CameraController quand l'easing d'intro est terminé.
export function notifyIntroComplete() {
  const cb = onComplete;
  introActive = false;
  onComplete = null;
  cb?.();
}
