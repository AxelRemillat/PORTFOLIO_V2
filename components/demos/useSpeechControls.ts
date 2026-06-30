"use client";
import { useCallback, useEffect, useState } from "react";
import { getSpeechAudioEl } from "./speechAudioBus";
import { SPEEDS, getRate, getPaused, setRate, setPaused, subscribeControl } from "./speechControl";

// Contrôles du monologue (pause/reprise + vitesse). Opère directement sur
// l'élément <audio> OpenAI (via le bus) et sur speechSynthesis.
export function useSpeechControls() {
  const [paused, setP] = useState(getPaused());
  const [speed, setS] = useState(getRate());
  useEffect(() => subscribeControl(() => { setP(getPaused()); setS(getRate()); }), []);

  // Pause/reprise : voix ET texte figent ensemble. OpenAI → audio.pause()/play()
  // (la révélation suit currentTime, donc elle gèle aussi) ; Web Speech → pause/resume.
  const togglePause = useCallback(() => {
    const next = !getPaused();
    setPaused(next);
    const el = getSpeechAudioEl();
    if (next) { try { el?.pause(); } catch {} try { window.speechSynthesis?.pause(); } catch {} }
    else      { try { el?.play();  } catch {} try { window.speechSynthesis?.resume(); } catch {} }
  }, []);

  // Vitesse : applique playbackRate en direct → le texte (piloté par currentTime)
  // accélère avec la voix et finit en même temps. (Web Speech : pris en compte au
  // prochain segment, son rate ne change pas en cours d'utterance.)
  const cycleSpeed = useCallback(() => {
    const next = SPEEDS[(SPEEDS.indexOf(getRate()) + 1) % SPEEDS.length];
    setRate(next);
    const el = getSpeechAudioEl();
    if (el) el.playbackRate = next;
  }, []);

  return { paused, speed, togglePause, cycleSpeed };
}
