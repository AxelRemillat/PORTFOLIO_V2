// Moteur audio 100 % procédural (Web Audio API natif — aucun fichier externe).
// Singleton : un seul AudioContext partagé pour tout le jeu.

const C4 = 261.63, D4 = 293.66, E4 = 329.63, G4 = 392.0, A4 = 440.0, C5 = 523.25;
const PENTA = [C4, D4, E4, G4, A4, C5, E4 * 2, G4 * 2];

class GameAudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private reverb: GainNode | null = null;       // bus d'écho/réverb (delay feedback)
  private noiseBuf: AudioBuffer | null = null;

  private ambGain: GainNode | null = null;
  private ambSources: OscillatorNode[] = [];
  private ambTimer: ReturnType<typeof setTimeout> | null = null;
  private footAcc = 0;

  // Crée l'AudioContext au premier geste utilisateur (autoplay policy).
  init() {
    if (this.ctx) { if (this.ctx.state === "suspended") this.ctx.resume(); return; }
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0.8;
    this.master.connect(ctx.destination);

    // Bus réverb simple : delay 0.18s avec feedback 0.3 → master
    this.reverb = ctx.createGain();
    const delay = ctx.createDelay(1.0); delay.delayTime.value = 0.18;
    const fb = ctx.createGain(); fb.gain.value = 0.3;
    this.reverb.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(this.master);

    // Buffer de bruit blanc réutilisable (pas de pas)
    const len = ctx.sampleRate * 0.3;
    this.noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  }

  dispose() {
    this.stopAmbience();
    this.ctx?.close();
    this.ctx = null; this.master = null; this.reverb = null;
  }

  setMasterVolume(v: number) {
    if (this.master) this.master.gain.value = Math.max(0, Math.min(1, v));
  }

  // Voix sinusoïdale enveloppée. wet>0 → envoi vers la réverb.
  private voice(freq: number, type: OscillatorType, when: number, attack: number, decay: number, peak: number, wet = 0) {
    const ctx = this.ctx; if (!ctx || !this.master) return null;
    const t = ctx.currentTime + when;
    const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(freq, t);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
    o.connect(g); g.connect(this.master);
    if (wet > 0 && this.reverb) { const w = ctx.createGain(); w.gain.value = wet; g.connect(w); w.connect(this.reverb); }
    o.start(t); o.stop(t + attack + decay + 0.05);
    return o;
  }

  playJump() {
    const ctx = this.ctx; if (!ctx || !this.master) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = "sine";
    o.frequency.setValueAtTime(180, t);
    o.frequency.linearRampToValueAtTime(320, t + 0.12);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.4, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    o.connect(g); g.connect(this.master);
    if (this.reverb) { const w = ctx.createGain(); w.gain.value = 0.2; g.connect(w); w.connect(this.reverb); }
    o.start(t); o.stop(t + 0.2);
  }

  // Timer interne : un "thud" sourd toutes les ~0.32s pendant le déplacement.
  footstep(isMoving: boolean, dt: number) {
    if (!this.ctx || !this.noiseBuf || !this.master) return;
    if (!isMoving) { this.footAcc = 0.32; return; }
    this.footAcc -= dt;
    if (this.footAcc > 0) return;
    this.footAcc = 0.32;
    const ctx = this.ctx, t = ctx.currentTime;
    const src = ctx.createBufferSource(); src.buffer = this.noiseBuf;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 200;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.15, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    src.connect(lp); lp.connect(g); g.connect(this.master);
    src.start(t); src.stop(t + 0.09);
  }

  // Shimmer magique : accord Do-Mi-Sol avec vibrato + réverb/écho.
  playPortalEnter(_color: string) {
    const ctx = this.ctx, master = this.master, reverb = this.reverb;
    if (!ctx || !master) return;
    const t = ctx.currentTime;
    [440, 554, 659].forEach((freq) => {
      const o = ctx.createOscillator(); o.type = "sine"; o.frequency.setValueAtTime(freq, t);
      const lfo = ctx.createOscillator(); lfo.frequency.value = 5;
      const lfoGain = ctx.createGain(); lfoGain.gain.value = 8;
      lfo.connect(lfoGain); lfoGain.connect(o.frequency);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.5 / 3, t + 0.1);
      g.gain.setValueAtTime(0.5 / 3, t + 0.4);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.0);
      o.connect(g); g.connect(master);
      if (reverb) { const w = ctx.createGain(); w.gain.value = 0.4; g.connect(w); w.connect(reverb); }
      o.start(t); lfo.start(t); o.stop(t + 1.05); lfo.stop(t + 1.05);
    });
  }

  // Montée dramatique : arpège Do-Mi-Sol-Do puis tenue finale avec réverb.
  playPortalConfirm() {
    if (!this.ctx) return;
    const arp = [C4, E4, G4, C5];
    arp.forEach((f, i) => this.voice(f, "triangle", i * 0.08, 0.01, i === 3 ? 1.2 : 0.12, 0.32, i === 3 ? 0.6 : 0.2));
  }

  // "Ding" doux pour clic sur rose/baobab/renard/mouton.
  playInteraction() {
    this.voice(880, "sine", 0, 0.01, 0.4, 0.3, 0.15);
  }

  // Fanfare courte : arpège Do-Mi-Sol + accord final tenu, chaleureux.
  playQuestComplete() {
    if (!this.ctx) return;
    [C5, E4 * 2, G4 * 2].forEach((f, i) => this.voice(f, "triangle", i * 0.1, 0.02, 0.18, 0.28, 0.25));
    [C5, E4 * 2, G4 * 2].forEach((f) => this.voice(f, "sine", 0.3, 0.05, 1.4, 0.16, 0.4));
  }

  // Ambiance spatiale en boucle (drone + pad respirant + tintements aléatoires).
  startAmbience() {
    const ctx = this.ctx, master = this.master;
    if (!ctx || !master || this.ambGain) return;
    const ambGain = ctx.createGain(); ambGain.gain.value = 0.4; ambGain.connect(master);
    this.ambGain = ambGain;
    const t = ctx.currentTime;

    // Couche 1 — drone (battement lent entre 55 et 55.5 Hz), filtré passe-bas.
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 400; lp.connect(ambGain);
    [55, 55.5].forEach((f) => {
      const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = f;
      const g = ctx.createGain(); g.gain.value = 0.06; o.connect(g); g.connect(lp);
      o.start(t); this.ambSources.push(o);
    });

    // Couche 2 — pad 220 Hz, LFO 0.08 Hz sur le gain → "respiration" de l'espace.
    const pad = ctx.createOscillator(); pad.type = "sine"; pad.frequency.value = 220;
    const padG = ctx.createGain(); padG.gain.value = 0.05;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.08;
    const lfoG = ctx.createGain(); lfoG.gain.value = 0.03;
    lfo.connect(lfoG); lfoG.connect(padG.gain);
    pad.connect(padG); padG.connect(ambGain);
    pad.start(t); lfo.start(t); this.ambSources.push(pad, lfo);

    // Couche 3 — notes pentatoniques espacées (étoiles qui "tintent").
    const tick = () => {
      this.voice(PENTA[(Math.random() * PENTA.length) | 0], "sine", 0, 0.3, 1.5, 0.12, 0.3);
      this.ambTimer = setTimeout(tick, 4000 + Math.random() * 4000);
    };
    this.ambTimer = setTimeout(tick, 3000);
  }

  stopAmbience() {
    if (this.ambTimer) { clearTimeout(this.ambTimer); this.ambTimer = null; }
    this.ambSources.forEach((o) => { try { o.stop(); } catch { /* déjà arrêté */ } });
    this.ambSources = [];
    this.ambGain?.disconnect(); this.ambGain = null;
  }
}

export const gameAudio = new GameAudioEngine();
