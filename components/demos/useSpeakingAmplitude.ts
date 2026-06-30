"use client";
import { useEffect, useRef } from "react";
import { getSpeechAudioEl } from "./speechAudioBus";

type OrbState = "idle" | "thinking" | "speaking";

// Renvoie une ref d'amplitude lissée [0..1], lue chaque frame par l'orbe.
// - Voix OpenAI (élément <audio>) : AnalyserNode → RMS réel (vrai lip-sync).
// - Repli Web Speech (SpeechSynthesis, pas d'amplitude) : somme de sinus 5-11 Hz.
// - Hors "speaking" : 0 (l'orbe retombe au repos via le lerp côté consommateur).
export function useSpeakingAmplitude(state: OrbState) {
  const ampRef = useRef(0);

  const ctxRef      = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const srcRef      = useRef<MediaElementAudioSourceNode | null>(null);
  const dataRef     = useRef<Uint8Array | null>(null);
  const boundElRef  = useRef<HTMLAudioElement | null>(null);
  const rafRef      = useRef(0);

  useEffect(() => {
    if (state !== "speaking") { ampRef.current = 0; return; }
    let active = true;
    const t0 = performance.now();
    const el = getSpeechAudioEl();

    // Branchement Web Audio sur l'élément OpenAI. createMediaElementSource ne peut
    // être appelé qu'UNE fois par élément/contexte → garde via boundElRef.
    if (el && typeof AudioContext !== "undefined") {
      try {
        if (!ctxRef.current) ctxRef.current = new AudioContext();
        const ctx = ctxRef.current;
        if (ctx.state === "suspended") ctx.resume();
        if (boundElRef.current !== el) {
          srcRef.current = ctx.createMediaElementSource(el);
          analyserRef.current = ctx.createAnalyser();
          analyserRef.current.fftSize = 256;
          srcRef.current.connect(analyserRef.current);
          analyserRef.current.connect(ctx.destination); // garder le son audible
          dataRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
          boundElRef.current = el;
        }
      } catch { /* élément déjà lié / indisponible → repli sinus */ }
    }

    const tick = () => {
      if (!active) return;
      let amp = 0;
      const an = analyserRef.current, data = dataRef.current, a = boundElRef.current;
      const elPlaying = !!a && !a.paused && !a.ended && a.currentTime > 0;
      const synth = typeof window !== "undefined" ? window.speechSynthesis : null;

      if (elPlaying && an && data) {
        // Amplitude réelle (voix OpenAI) — RMS normalisé 0..1
        an.getByteFrequencyData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) { const v = data[i]; sum += v * v; }
        amp = Math.sqrt(sum / data.length) / 255;
      } else if (synth && synth.speaking) {
        // Repli Web Speech — oscillation pseudo-aléatoire (3 sinus rapides)
        const t = (performance.now() - t0) / 1000;
        const s = 0.5 * Math.sin(t * 2 * Math.PI * 7.0)
                + 0.3 * Math.sin(t * 2 * Math.PI * 11.0 + 1.3)
                + 0.2 * Math.sin(t * 2 * Math.PI * 5.0 + 2.1);
        amp = Math.max(0, Math.min(1, 0.5 + 0.5 * s)) * 0.8;
      }
      // sinon (silence entre phrases OpenAI) : amp = 0 → orbe au repos

      ampRef.current = amp;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => { active = false; cancelAnimationFrame(rafRef.current); ampRef.current = 0; };
  }, [state]);

  // Nettoyage total au démontage (pas de fuite, pas de double-contexte)
  useEffect(() => () => {
    try { srcRef.current?.disconnect(); } catch {}
    try { analyserRef.current?.disconnect(); } catch {}
    try { ctxRef.current?.close(); } catch {}
    ctxRef.current = null; analyserRef.current = null; srcRef.current = null;
  }, []);

  return ampRef;
}
