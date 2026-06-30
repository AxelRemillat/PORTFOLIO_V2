"use client";
// Bus minimal partagé. La voix OpenAI joue sur un <audio> interne à useAXChat
// (créé via new Audio(), hors DOM donc introuvable par querySelector). Le hook
// publie ici cet élément pour que l'orbe puisse y brancher un AnalyserNode.
// LECTURE SEULE de l'audio — aucune logique TTS n'est modifiée.
let el: HTMLAudioElement | null = null;

export function setSpeechAudioEl(e: HTMLAudioElement | null) { el = e; }
export function getSpeechAudioEl(): HTMLAudioElement | null { return el; }
