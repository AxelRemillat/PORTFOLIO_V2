"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type OrbState = "idle" | "thinking" | "speaking";
interface Msg { role: "user" | "assistant"; content: string; }

// ── Sélection de voix : priorité male grave français → anglais UK → fallback ──
function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined") return null;
  const vv = window.speechSynthesis.getVoices();
  const tests: Array<(v: SpeechSynthesisVoice) => boolean> = [
    v => /Microsoft (Paul|Henri|Claude)/i.test(v.name),
    v => /Thomas|Nicolas/i.test(v.name),
    v => /fr[-_](FR|BE|CA)/i.test(v.lang) && !/female|zira|amelie/i.test(v.name),
    v => /Google UK English Male/i.test(v.name),
    v => /Microsoft (David|Mark|George|James)/i.test(v.name),
    v => /en[-_]GB/i.test(v.lang) && !/female|zira/i.test(v.name),
    v => /^en/i.test(v.lang),
  ];
  for (const fn of tests) {
    const found = vv.find(fn);
    if (found) return found;
  }
  return vv[0] ?? null;
}

export function useAXChat() {
  const [orbState, setOrbState]       = useState<OrbState>("idle");
  const [displayText, setDisplayText] = useState("");
  const [isStreaming, setIsStreaming]  = useState(false);
  const [showText, setShowText]       = useState(false);
  const [isVoiceOn, setIsVoiceOn]     = useState(false);
  const [started, setStarted]         = useState(false);

  const history    = useRef<Msg[]>([]);
  const isVoiceRef = useRef(false);                          // ref pour closure safe dans l'async
  const voiceRef   = useRef<SpeechSynthesisVoice | null>(null);
  const spokenIdx  = useRef(0);                              // position déjà parlée dans le texte

  // Charger la voix (les navigateurs chargent les voix de façon asynchrone)
  useEffect(() => {
    const load = () => { voiceRef.current = pickVoice(); };
    load();
    window.speechSynthesis?.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", load);
  }, []);

  // Énoncer un fragment en queue (ne cancel pas ce qui est en cours)
  function enqueue(text: string) {
    const clean = text.replace(/\*\*/g, "").replace(/\*/g, "").trim();
    if (!clean || typeof window === "undefined") return;
    const u = new SpeechSynthesisUtterance(clean);
    if (voiceRef.current) u.voice = voiceRef.current;
    u.lang   = voiceRef.current?.lang ?? "fr-FR";
    u.rate   = 1.1;    // légèrement rapide → ton JARVIS
    u.pitch  = 0.72;   // grave → synthétique / autoritaire
    u.volume = 1.0;
    // resume() contourne le bug Chrome où la synthèse se met en pause toute seule
    window.speechSynthesis.resume();
    window.speechSynthesis.speak(u);
  }

  // Détecte les phrases complètes et les parle au fur et à mesure du stream
  function streamSpeak(fullText: string) {
    if (!isVoiceRef.current) return;
    const slice = fullText.slice(spokenIdx.current);
    // Cherche la dernière fin de phrase dans le texte non encore parlé
    const re = /[.!?][\s\n]/g;
    let lastEnd = -1, m;
    while ((m = re.exec(slice)) !== null) lastEnd = m.index + 1;
    if (lastEnd < 0) return;
    const sentence = slice.slice(0, lastEnd + 1).trim();
    if (sentence) {
      enqueue(sentence);
      spokenIdx.current += lastEnd + 1;
    }
  }

  async function submit(input: string) {
    if (!input.trim() || orbState !== "idle") return;
    setStarted(true);
    setShowText(false);
    setOrbState("thinking");
    window.speechSynthesis?.cancel();
    spokenIdx.current = 0;

    const msgs: Msg[] = [...history.current, { role: "user", content: input }];
    history.current = msgs;
    await new Promise(r => setTimeout(r, 300));
    setDisplayText("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: msgs }),
      });
      if (!res.ok || !res.body) throw new Error("stream");

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "", first = true;

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;
        if (first) {
          setIsStreaming(true);
          setShowText(true);
          setOrbState("speaking");
          first = false;
        }
        full += chunk;
        setDisplayText(full);
        streamSpeak(full);   // ← parle les phrases complètes en temps réel
      }

      // Parler le reste non ponctué (dernière phrase sans ".")
      const tail = full.slice(spokenIdx.current).trim();
      if (isVoiceRef.current && tail) enqueue(tail);

      history.current = [...msgs, { role: "assistant", content: full }];
    } catch {
      setDisplayText("Erreur — VEGA est momentanément indisponible. Réessaie.");
      setShowText(true);
    } finally {
      setIsStreaming(false);
      setOrbState("idle");
    }
  }

  const toggleVoice = useCallback(() => {
    setIsVoiceOn(v => {
      const next = !v;
      isVoiceRef.current = next;
      const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
      if (synth) {
        if (next) {
          // Débloque l'audio DANS le geste utilisateur (politique autoplay Chrome) :
          // sans ce warm-up, les speak() lancés plus tard pendant le stream sont
          // bloqués silencieusement. On (re)charge aussi la voix au passage.
          if (!voiceRef.current) voiceRef.current = pickVoice();
          synth.cancel();
          synth.resume();
          const warm = new SpeechSynthesisUtterance(" ");
          warm.volume = 0;
          if (voiceRef.current) warm.voice = voiceRef.current;
          synth.speak(warm);
        } else {
          synth.cancel(); // coupe immédiatement si on désactive
        }
      }
      return next;
    });
  }, []);

  return { orbState, displayText, isStreaming, showText, isVoiceOn, started, submit, toggleVoice };
}
