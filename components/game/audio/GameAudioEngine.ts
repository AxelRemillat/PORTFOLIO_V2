// Moteur audio du jeu — 100 % fichiers .wav joués via Howler.js.
// Singleton. Les Howl sont créés dans init() (1er geste utilisateur = client only)
// pour rester SSR-safe : le module est évalué côté serveur, mais `new Howl()` non.

import { Howl, Howler } from "howler";

type SoundKey =
  | "footstep" | "jump" | "portalEnter" | "portalConfirm" | "interaction"
  | "ambience" | "questComplete";

class GameAudioEngine {
  private initialized = false;
  private footstepPlaying = false;
  private sounds: Record<SoundKey, Howl> | null = null;

  // Appelé au premier geste utilisateur (click/keydown). Howler gère l'AudioContext.
  init() {
    if (this.initialized) return;
    this.sounds = {
      footstep:      new Howl({ src: ["/sounds/footstep.wav"], loop: true, volume: 0.12, rate: 1.1 }),
      jump:          new Howl({ src: ["/sounds/350906__cabled_mess__jump_c_04.wav"], volume: 0.55, rate: 1.3 }),
      portalEnter:   new Howl({ src: ["/sounds/portal-enter.wav"], volume: 0.65 }),
      portalConfirm: new Howl({ src: ["/sounds/portal-confirm.wav"], volume: 0.70 }),
      interaction:   new Howl({ src: ["/sounds/interaction.wav"], volume: 0.55 }),
      ambience:      new Howl({ src: ["/sounds/ambience.mp3"], loop: true, volume: 0, autoplay: false }),
      questComplete: new Howl({ src: ["/sounds/quest-complete.mp3"], volume: 0.65 }),
    };
    Howler.volume(1.0);
    this.initialized = true;

    // Musique d'ambiance en boucle, fade in 3s vers un volume discret (0.28)
    this.sounds.ambience.play();
    this.sounds.ambience.fade(0, 0.28, 3000);
  }

  playJump() {
    this.sounds?.jump.play();
  }

  // Boucle de pas (idempotent : ne relance pas si déjà en cours).
  startFootsteps() {
    if (!this.sounds || this.footstepPlaying) return;
    this.sounds.footstep.volume(0.12);
    this.sounds.footstep.play();
    this.footstepPlaying = true;
  }

  // Arrêt avec fondu 150ms → pas de coupure brutale.
  stopFootsteps() {
    if (!this.sounds || !this.footstepPlaying) return;
    this.footstepPlaying = false;
    const f = this.sounds.footstep;
    f.fade(0.12, 0, 150);
    setTimeout(() => { if (!this.footstepPlaying) f.stop(); }, 150);
  }

  // Point d'appel existant (chaque frame) : 2e param (delta) conservé pour compat.
  footstep(isMoving: boolean, _dt?: number) {
    if (isMoving) this.startFootsteps();
    else this.stopFootsteps();
  }

  playPortalEnter(_color?: string) {
    this.sounds?.portalEnter.play();
  }

  playPortalConfirm() {
    this.sounds?.portalConfirm.play();
  }

  playInteraction() {
    this.sounds?.interaction.play();
  }

  // Fanfare de quête : on baisse brièvement l'ambiance pour la laisser ressortir.
  playQuestComplete() {
    if (!this.sounds) return;
    const amb = this.sounds.ambience;
    amb.fade(0.28, 0.10, 300);
    this.sounds.questComplete.play();
    setTimeout(() => amb.fade(0.10, 0.28, 800), 2000);
  }

  setMasterVolume(v: number) {
    Howler.volume(Math.max(0, Math.min(1, v)));
  }

  dispose() {
    this.sounds?.ambience.fade(0.28, 0, 1000);
    this.footstepPlaying = false;
    this.initialized = false;
    setTimeout(() => { Howler.unload(); this.sounds = null; }, 1000);
  }
}

export const gameAudio = new GameAudioEngine();
