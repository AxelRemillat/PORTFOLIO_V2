"use client";
// Bus de contrôle de la parole (vitesse + pause), partagé entre le hook des
// contrôles UI (useSpeechControls), useAXChat (applique au TTS) et revealSync
// (gèle la révélation timer). Module singleton, comme speechAudioBus.

export const SPEEDS = [1, 1.25, 1.5, 2]; // paliers de vitesse (cycle), réglable

let rate = 1;
let paused = false;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

export const getRate = () => rate;
export const getPaused = () => paused;
export function setRate(r: number) { rate = r; emit(); }
export function setPaused(p: boolean) { paused = p; emit(); }
export function subscribeControl(fn: () => void) { subs.add(fn); return () => { subs.delete(fn); }; }
