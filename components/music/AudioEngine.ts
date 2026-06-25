// AudioEngine.ts — Tone.js singleton, client-side only.
// Imported exclusively from MusicCanvas.tsx (loaded with ssr:false) so no SSR guard needed.

import * as Tone from "tone";

// ── Public types ───────────────────────────────────────────────────────────────

export type InstrumentType = "baobab" | "cristal" | "renard" | "rose" | "mouton" | "etoile";

export interface InstrumentParams {
  // Baobab
  bpm?:      number;
  pattern?:  "standard" | "jazz" | "reggae" | "half-time";
  velocity?: number;
  // Cristal
  rootNote?: string;
  rhythm?:   "quarter" | "eighth" | "half";
  sustain?:  number;
  // Renard
  scale?:   "major" | "minor" | "pentatonic" | "blues";
  speed?:   number;
  octave?:  number;
  // Rose
  vibratoDepth?: number;
  expression?:   "legato" | "staccato";
  note?:         string;
  // Mouton
  style?:   "chord" | "arpeggio" | "sparse";
  density?: number;
  // Étoile
  waveform?:    "sawtooth" | "square" | "sine" | "triangle";
  filterRate?:  "2n" | "4n" | "8n";
  reverbDecay?: number;
}

// ── Internal ───────────────────────────────────────────────────────────────────

interface InstrumentState {
  type:      InstrumentType;
  params:    InstrumentParams;
  nodes:     Tone.ToneAudioNode[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sequences: Tone.Sequence<any>[];
}

// ── Note helpers ───────────────────────────────────────────────────────────────

const ROOT_MIDI: Record<string, number> = {
  C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11,
};

const SCALE_STEPS: Record<string, number[]> = {
  major:      [0, 2, 4, 5, 7, 9, 11],
  minor:      [0, 2, 3, 5, 7, 8, 10],
  pentatonic: [0, 2, 4, 7, 9],
  blues:      [0, 3, 5, 6, 7, 10],
};

function midi2note(midi: number): string {
  return Tone.Frequency(midi, "midi").toNote() as string;
}

function scaleNotes(root: string, scaleName: string, octave: number, count: number): string[] {
  const steps   = SCALE_STEPS[scaleName] ?? SCALE_STEPS.pentatonic;
  const rootOff = ROOT_MIDI[root] ?? 0;
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const step  = steps[i % steps.length];
    const extra = Math.floor(i / steps.length);
    result.push(midi2note(octave * 12 + rootOff + step + extra * 12));
  }
  return result;
}

function bassLine(root: string): string[] {
  const b = 24 + (ROOT_MIDI[root] ?? 0); // root at C2 equivalent
  return [midi2note(b), midi2note(b), midi2note(b + 7), midi2note(b + 10)];
}

function majorTriad(octave: number): string[] {
  const b = octave * 12; // C at given octave
  return [midi2note(b), midi2note(b + 4), midi2note(b + 7)];
}

// ── Drum patterns ─────────────────────────────────────────────────────────────

type DPat = {
  kick:  (string | null)[];
  snare: (boolean | null)[];
  hihat: (boolean | null)[];
};

const DRUM_PATTERNS: Record<string, DPat> = {
  standard: {
    kick:  ["C1", null, null, null, "C1", null, null, null],
    snare: [null, null, true,  null, null, null, true,  null],
    hihat: [true,  true,  true,  true,  true,  true,  true,  true ],
  },
  jazz: {
    kick:  ["C1", null, null, "C1", null, null, "C1", null],
    snare: [null, null, true,  null, null, true,  null, null],
    hihat: [true,  false, true,  false, true,  false, true,  false],
  },
  reggae: {
    kick:  ["C1", null, null, null, "C1", null, null, null],
    snare: [null, null, null, null, true,  null, null, null],
    hihat: [false, true,  false, true,  false, true,  false, true ],
  },
  "half-time": {
    kick:  ["C1", null, null, null, null, null, null, null],
    snare: [null, null, null, null, true,  null, null, null],
    hihat: [true,  false, true,  false, true,  false, true,  false],
  },
};

// ── AudioEngine class ─────────────────────────────────────────────────────────

class AudioEngine {
  private static _inst: AudioEngine | null = null;
  private _instruments = new Map<string, InstrumentState>();
  private _limiter: Tone.Limiter | null = null;
  private _started = false;
  readonly defaultBpm = 90;

  private constructor() {}

  static get instance(): AudioEngine {
    if (!AudioEngine._inst) AudioEngine._inst = new AudioEngine();
    return AudioEngine._inst;
  }

  /** Returns the master limiter → destination, creating it lazily. */
  private get out(): Tone.Limiter {
    if (!this._limiter) this._limiter = new Tone.Limiter(-3).toDestination();
    return this._limiter;
  }

  /** Must be called on a user-gesture to unlock the AudioContext. */
  async start(): Promise<void> {
    if (this._started) return;
    try { await Tone.start(); } catch { /* already running */ }
    Tone.getTransport().bpm.value = this.defaultBpm;
    Tone.getTransport().start();
    this._started = true;
  }

  stop(): void {
    Tone.getTransport().stop();
    this._started = false;
  }

  addInstrument(id: string, type: InstrumentType, params: InstrumentParams = {}): void {
    if (this._instruments.has(id)) this.removeInstrument(id);
    let built: Pick<InstrumentState, "nodes" | "sequences">;
    switch (type) {
      case "baobab":  built = this._baobab(params);  break;
      case "cristal": built = this._cristal(params); break;
      case "renard":  built = this._renard(params);  break;
      case "rose":    built = this._rose(params);    break;
      case "mouton":  built = this._mouton(params);  break;
      case "etoile":  built = this._etoile(params);  break;
      default: return;
    }
    this._instruments.set(id, { type, params, ...built });
  }

  removeInstrument(id: string): void {
    const inst = this._instruments.get(id);
    if (!inst) return;
    for (const seq  of inst.sequences) { try { seq.stop(); seq.dispose(); } catch {} }
    for (const node of inst.nodes)     { try { node.dispose();            } catch {} }
    this._instruments.delete(id);
    if (inst.type === "baobab") {
      const stillHasBaobab = [...this._instruments.values()].some(i => i.type === "baobab");
      if (!stillHasBaobab) Tone.getTransport().bpm.value = this.defaultBpm;
    }
  }

  updateParams(id: string, params: Partial<InstrumentParams>): void {
    const inst = this._instruments.get(id);
    if (!inst) return;
    const merged = { ...inst.params, ...params };
    this.removeInstrument(id);
    this.addInstrument(id, inst.type, merged);
  }

  /** Real-time BPM update — no synth recreation. */
  setBpm(bpm: number): void {
    Tone.getTransport().bpm.value = bpm;
    for (const [, inst] of this._instruments) {
      if (inst.type === "baobab") inst.params = { ...inst.params, bpm };
    }
  }

  /** Returns a copy of the stored params for an instrument. */
  getParams(id: string): InstrumentParams {
    return { ...(this._instruments.get(id)?.params ?? {}) };
  }

  // ── Private factories ───────────────────────────────────────────────────────

  private _baobab(p: InstrumentParams): Pick<InstrumentState, "nodes" | "sequences"> {
    const vel = p.velocity ?? 0.7;
    const pat = DRUM_PATTERNS[p.pattern ?? "standard"];
    Tone.getTransport().bpm.value = p.bpm ?? this.defaultBpm;

    const kick = new Tone.MembraneSynth({
      pitchDecay: 0.05, octaves: 6,
      envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 },
    }).connect(this.out);

    const snare = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.05 },
    }).connect(this.out);
    snare.volume.value = -6;

    const hihat = new Tone.MetalSynth({
      harmonicity: 5.1, modulationIndex: 32,
      resonance: 4000, octaves: 1.5,
      envelope: { attack: 0.001, decay: 0.04, release: 0.01 },
    }).connect(this.out);
    hihat.frequency.value = 400;
    hihat.volume.value = -14;

    const kickSeq = new Tone.Sequence<string | null>(
      (time, note) => { if (note) kick.triggerAttackRelease(note, "8n", time, vel); },
      pat.kick, "8n",
    );
    const snareSeq = new Tone.Sequence<boolean | null>(
      (time, hit) => { if (hit) snare.triggerAttackRelease("16n", time); },
      pat.snare, "8n",
    );
    const hihatSeq = new Tone.Sequence<boolean | null>(
      (time, hit) => { if (hit) hihat.triggerAttackRelease("A5", "32n", time, vel * 0.35); },
      pat.hihat, "8n",
    );

    kickSeq.start(0); snareSeq.start(0); hihatSeq.start(0);
    return { nodes: [kick, snare, hihat], sequences: [kickSeq, snareSeq, hihatSeq] };
  }

  private _cristal(p: InstrumentParams): Pick<InstrumentState, "nodes" | "sequences"> {
    const subdiv = p.rhythm === "eighth" ? "8n" : p.rhythm === "half" ? "2n" : "4n";
    const sus    = p.sustain ?? 0.6;

    const synth = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.05, decay: 0.3, sustain: sus, release: 1 },
    }).connect(this.out);
    synth.volume.value = -4;

    const seq = new Tone.Sequence<string>(
      (time, note) => { synth.triggerAttackRelease(note, subdiv, time); },
      bassLine(p.rootNote ?? "C"), "4n",
    );
    seq.start(0);
    return { nodes: [synth], sequences: [seq] };
  }

  private _renard(p: InstrumentParams): Pick<InstrumentState, "nodes" | "sequences"> {
    const speed  = p.speed ?? 1;
    const oct    = p.octave ?? 4;
    const subdiv = speed >= 1.5 ? "16n" : speed <= 0.6 ? "4n" : "8n";

    const synth = new Tone.Synth({
      oscillator: { type: "sawtooth" },
      envelope: { attack: 0.02, decay: 0.1, sustain: 0.6, release: 0.3 },
    }).connect(this.out);
    synth.volume.value = -8;

    const notes = scaleNotes("C", p.scale ?? "pentatonic", oct, 8);
    const seq   = new Tone.Sequence<string>(
      (time, note) => { synth.triggerAttackRelease(note, "8n", time); },
      notes, subdiv,
    );
    seq.start(0);
    return { nodes: [synth], sequences: [seq] };
  }

  private _rose(p: InstrumentParams): Pick<InstrumentState, "nodes" | "sequences"> {
    const dur = p.expression === "staccato" ? "4n" : "2n";

    const vibrato = new Tone.Vibrato({
      frequency: 5, depth: p.vibratoDepth ?? 0.1, maxDelay: 0.005,
    }).connect(this.out);

    const synth = new Tone.FMSynth({
      harmonicity: 3, modulationIndex: 10,
      oscillator:          { type: "sine" },
      modulation:          { type: "sine" },
      envelope:            { attack: 0.4,  decay: 0.1, sustain: 0.8, release: 1.2 },
      modulationEnvelope:  { attack: 0.5,  decay: 0,   sustain: 1,   release: 0.5 },
    }).connect(vibrato);
    synth.volume.value = -6;

    const noteArr = p.note
      ? [p.note, p.note, p.note, p.note]
      : ["C4", "E4", "G4", "B3"];

    const seq = new Tone.Sequence<string>(
      (time, note) => { synth.triggerAttackRelease(note, dur, time); },
      noteArr, "1m",
    );
    seq.start(0);
    return { nodes: [synth, vibrato], sequences: [seq] };
  }

  private _mouton(p: InstrumentParams): Pick<InstrumentState, "nodes" | "sequences"> {
    const style   = p.style ?? "chord";
    const oct     = p.octave ?? 4;
    const density = Math.min(p.density ?? 3, 3);

    const poly = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope:   { attack: 0.02, decay: 0.5, sustain: 0.3, release: 1.5 },
    }).connect(this.out);
    poly.volume.value = -8;

    const chord = majorTriad(oct).slice(0, density);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let seq: Tone.Sequence<any>;

    if (style === "arpeggio") {
      seq = new Tone.Sequence<string>(
        (time, note) => { poly.triggerAttackRelease(note as string, "8n", time); },
        chord, "4n",
      );
    } else if (style === "sparse") {
      seq = new Tone.Sequence<boolean | null>(
        (time, hit) => { if (hit) poly.triggerAttackRelease(chord, "8n", time); },
        [true, null, null, null, null, null, null, null], "4n",
      );
    } else {
      // chord — play every 2 beats
      seq = new Tone.Sequence<boolean | null>(
        (time, hit) => { if (hit) poly.triggerAttackRelease(chord, "8n", time); },
        [true, null, null, null, true, null, null, null], "4n",
      );
    }

    seq.start(0);
    return { nodes: [poly], sequences: [seq] };
  }

  private _etoile(p: InstrumentParams): Pick<InstrumentState, "nodes" | "sequences"> {
    const wave    = (p.waveform ?? "sawtooth") as "sawtooth" | "square" | "sine" | "triangle";
    const fRate   = p.filterRate  ?? "4n";
    const decay   = p.reverbDecay ?? 4;

    const reverb = new Tone.Reverb({ decay, wet: 0.5 }).connect(this.out);

    const filter = new Tone.AutoFilter({
      frequency: fRate, depth: 0.6, octaves: 3,
    }).connect(reverb);
    filter.start();

    const synth = new Tone.Synth({
      oscillator: { type: wave },
      envelope:   { attack: 0.4, decay: 0.5, sustain: 0.8, release: 2 },
    }).connect(filter);
    synth.volume.value = -10;

    const seq = new Tone.Sequence<string>(
      (time, note) => { synth.triggerAttackRelease(note, "2n", time); },
      ["C3", "G3", "E3", "A3"], "2n",
    );
    seq.start(0);
    return { nodes: [synth, filter, reverb], sequences: [seq] };
  }
}

// ── Singleton export ──────────────────────────────────────────────────────────

export const audioEngine = AudioEngine.instance;
