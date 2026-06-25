"use client";

import { useEffect } from "react";
import { gameAudio } from "./GameAudioEngine";

// Initialise l'AudioContext au premier geste utilisateur (autoplay policy),
// démarre l'ambiance spatiale, et la coupe au démontage.
export function useGameAudio() {
  useEffect(() => {
    const start = () => {
      gameAudio.init();
      gameAudio.startAmbience();
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
    window.addEventListener("pointerdown", start);
    window.addEventListener("keydown", start);

    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      gameAudio.stopAmbience();
    };
  }, []);

  // Méthodes exposées (délèguent au singleton) pour les composants UI/hors-Canvas.
  return {
    triggerJump:          () => gameAudio.playJump(),
    triggerFootstep:      (isMoving: boolean, dt: number) => gameAudio.footstep(isMoving, dt),
    triggerPortalEnter:   (color: string) => gameAudio.playPortalEnter(color),
    triggerPortalConfirm: () => gameAudio.playPortalConfirm(),
    triggerInteraction:   () => gameAudio.playInteraction(),
    triggerQuestComplete: () => gameAudio.playQuestComplete(),
  };
}
