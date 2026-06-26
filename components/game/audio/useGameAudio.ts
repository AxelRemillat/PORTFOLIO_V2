"use client";

import { useEffect } from "react";
import { gameAudio } from "./GameAudioEngine";

// Initialise Howler au premier geste utilisateur (autoplay policy).
// Le déclenchement réel des sons (pas, saut, portails…) se fait via le singleton
// gameAudio depuis les hooks de jeu (useSphericalMovement, usePortalDetection…).
export function useGameAudio() {
  useEffect(() => {
    const start = () => {
      gameAudio.init();
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
    window.addEventListener("pointerdown", start);
    window.addEventListener("keydown", start);

    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      // Le joueur quitte le jeu → on coupe la musique et tous les sons.
      gameAudio.dispose();
    };
  }, []);

  // Méthodes exposées (délèguent au singleton) pour les composants UI/hors-Canvas.
  return {
    triggerJump:          () => gameAudio.playJump(),
    startFootsteps:       () => gameAudio.startFootsteps(),
    stopFootsteps:        () => gameAudio.stopFootsteps(),
    triggerFootstep:      (isMoving: boolean) => gameAudio.footstep(isMoving),
    triggerPortalEnter:   () => gameAudio.playPortalEnter(),
    triggerPortalConfirm: () => gameAudio.playPortalConfirm(),
    triggerInteraction:   () => gameAudio.playInteraction(),
    triggerQuestComplete: () => gameAudio.playQuestComplete(),
  };
}
