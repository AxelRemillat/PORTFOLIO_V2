"use client";
import { useEffect, useRef, useState } from "react";

// Dictée vocale via la Web Speech API du navigateur (Chrome/Edge/Safari).
// Gratuit, aucun crédit consommé, transcription en direct (résultats
// intermédiaires). Firefox ne la supporte pas → `supported` reste false et le
// bouton micro n'est pas rendu.

// Types minimaux (SpeechRecognition n'est pas dans lib.dom de TypeScript)
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

export function useSpeechToText({ onText, onEnd }: {
  onText: (transcript: string) => void; // appelé en continu pendant la dictée
  onEnd?: () => void;                   // fin de dictée (silence ou stop)
}) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  // Refs → les callbacks restent frais sans ré-instancier la reco
  const onTextRef = useRef(onText); onTextRef.current = onText;
  const onEndRef = useRef(onEnd);   onEndRef.current = onEnd;

  useEffect(() => {
    const w = window as unknown as Record<string, new () => SpeechRecognitionLike>;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return; // navigateur non supporté → pas de bouton
    setSupported(true);

    const rec = new SR();
    rec.lang = "fr-FR";
    rec.interimResults = true; // le texte s'écrit pendant qu'on parle
    rec.continuous = false;    // s'arrête au silence (façon Insta/Snap)
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      let t = "";
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      onTextRef.current(t.trim());
    };
    rec.onend = () => { setListening(false); onEndRef.current?.(); };
    rec.onerror = () => setListening(false); // micro refusé / pas de parole → off
    recRef.current = rec;
    return () => { try { rec.abort(); } catch {} };
  }, []);

  const toggle = () => {
    const rec = recRef.current;
    if (!rec) return;
    if (listening) { try { rec.stop(); } catch {} setListening(false); return; }
    try { rec.start(); setListening(true); } catch { /* déjà démarrée */ }
  };

  return { supported, listening, toggle };
}
