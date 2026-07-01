"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { setSpeechAudioEl } from "./speechAudioBus";
import { playAudioSynced, speakSynced, revealByTimer } from "./revealSync";
import { getRate, getPaused, setPaused as setCtrlPaused } from "./speechControl";
import { hasIntroPlayed, markIntroPlayed } from "./useIntroOnce";

type OrbState = "idle" | "thinking" | "speaking";
interface Msg { role: "user" | "assistant"; content: string; }

// Mémoire conversationnelle : nb max de messages (≈ tours×2) envoyés au modèle
// pour le contexte multi-tours (réglable). On garde tout l'historique en local
// pour l'historique latéral ; seul l'envoi à l'API est plafonné.
const MEMORY_MAX_MSGS = 12;

const GREETING =
  "Tiens, un visiteur. Moi c'est VEGA, l'IA qui sait à peu près tout sur Axel Remillat. Vas-y, pose-moi une question sur lui.";

// ── Voix de REPLI (navigateur) si l'API OpenAI TTS échoue. Pitch naturel (1.0)
//    pour éviter l'effet robot. Priorité aux voix locales fiables. ──
function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined") return null;
  const vv = window.speechSynthesis.getVoices();
  if (!vv.length) return null;
  const tests: Array<(v: SpeechSynthesisVoice) => boolean> = [
    v => /fr[-_]/i.test(v.lang) && /female|hortense|julie|caroline|amelie|denise|google/i.test(v.name),
    v => /fr[-_]/i.test(v.lang),
    v => /^en/i.test(v.lang),
    v => v.localService,
  ];
  for (const fn of tests) {
    const found = vv.find(fn);
    if (found) return found;
  }
  return vv[0];
}

export function useAXChat() {
  const [orbState, setOrbState]       = useState<OrbState>("idle");
  const [displayText, setDisplayText] = useState("");
  const [fullText, setFullText]       = useState("");        // réponse complète (pour le fit-text)
  const [isStreaming, setIsStreaming]  = useState(false);
  const [showText, setShowText]       = useState(false);
  const [isVoiceOn, setIsVoiceOn]     = useState(true);      // voix active par défaut
  const [started, setStarted]         = useState(false);
  const [introDone, setIntroDone]     = useState(false);     // intro terminée OU sautée (session) → banter autorisé
  const [conversation, setConversation] = useState<Msg[]>([]); // tours courants (exposés pour la persistance)

  const history    = useRef<Msg[]>([]);
  const isVoiceRef = useRef(true);
  const voiceRef   = useRef<SpeechSynthesisVoice | null>(null);
  const spokenIdx  = useRef(0);
  const greetedRef = useRef(false);
  const orbStateRef = useRef<OrbState>("idle"); // lecture fraîche de l'état (guard de speak)
  orbStateRef.current = orbState;

  // File audio ordonnée + contrôle d'interruption
  const ttsChain      = useRef<Promise<void>>(Promise.resolve());
  const audioElRef    = useRef<HTMLAudioElement | null>(null); // UN SEUL élément, débloqué 1× puis réutilisé
  const epoch         = useRef(0); // incrémenté à chaque stop → annule les phrases en attente

  // ── Révélation du texte calée sur la voix ──────────────────────────────
  // revealedPrefix = phrases déjà entièrement affichées ; on y ajoute la portion
  // en cours de la phrase active. firstSpoke = le texte ne s'affiche qu'au tout
  // premier instant où la voix démarre réellement (supprime la latence de 2s).
  const revealedPrefix = useRef("");
  const firstSpoke     = useRef(false);
  const onFirstSpeak = () => {
    if (firstSpoke.current) return;
    firstSpoke.current = true;
    setShowText(true);
    setOrbState("speaking");
  };
  // emit(partiel) = préfixe accumulé + portion révélée de la phrase courante
  const emit = (seg: string) =>
    setDisplayText(revealedPrefix.current ? revealedPrefix.current + " " + seg : seg);
  const commitSegment = (clean: string) => {
    revealedPrefix.current = revealedPrefix.current ? revealedPrefix.current + " " + clean : clean;
  };
  const resetReveal = () => { revealedPrefix.current = ""; firstSpoke.current = false; };

  // Un unique <audio> réutilisé : une fois débloqué par un geste (la salutation),
  // tous les play() suivants sont autorisés. Créer un new Audio() par phrase
  // déclenchait au contraire le blocage autoplay (→ repli voix navigateur).
  function getAudioEl(): HTMLAudioElement | null {
    if (typeof Audio === "undefined") return null;
    if (!audioElRef.current) { audioElRef.current = new Audio(); setSpeechAudioEl(audioElRef.current); }
    return audioElRef.current;
  }

  // Charger la voix de repli (asynchrone côté navigateur)
  useEffect(() => {
    const load = () => { voiceRef.current = pickVoice(); };
    load();
    window.speechSynthesis?.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", load);
  }, []);

  // Stoppe tout l'audio en cours (OpenAI + navigateur) et vide la file
  function stopAudio() {
    epoch.current += 1;
    setCtrlPaused(false); // un arrêt dur réinitialise la pause (prochain monologue net)
    if (audioElRef.current) {
      try { audioElRef.current.pause(); } catch {}
    }
    ttsChain.current = Promise.resolve();
    window.speechSynthesis?.cancel();
  }

  // Repli navigateur (Web Speech) — révèle le texte calé sur la parole (onboundary
  // si dispo, sinon timer lisible). Démarre le texte sur l'event onstart.
  function speakFallback(text: string, myEpoch: number): Promise<void> {
    const cancelled = () => epoch.current !== myEpoch;
    const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
    if (!synth || !isVoiceRef.current || cancelled()) {
      // pas de synthèse / coupé : on fait quand même défiler le texte au timer
      onFirstSpeak();
      return revealByTimer(text, emit, cancelled, getPaused);
    }
    if (!voiceRef.current) voiceRef.current = pickVoice();
    const u = new SpeechSynthesisUtterance(text);
    if (voiceRef.current) u.voice = voiceRef.current;
    u.lang = voiceRef.current?.lang ?? "fr-FR";
    u.rate = getRate(); u.pitch = 1.0; u.volume = 1.0; // vitesse courante, pitch naturel
    return speakSynced(u, text, emit, onFirstSpeak, cancelled, getPaused);
  }

  // Met une phrase en file. Les segments sont SÉRIALISÉS (un à la fois) → texte et
  // voix avancent ensemble, phrase après phrase. La révélation du texte est pilotée
  // par l'audio réel (départ sur "playing", étalement sur audio.duration). Si la voix
  // est coupée, le texte défile quand même au timer. Repli Web Speech si TTS KO.
  function ttsEnqueue(text: string) {
    const clean = text.replace(/\*\*/g, "").replace(/\*/g, "").trim();
    if (!clean) return;
    const myEpoch = epoch.current;
    const cancelled = () => epoch.current !== myEpoch;

    ttsChain.current = ttsChain.current.then(async () => {
      if (cancelled()) return;

      // Voix coupée : pas d'audio, on révèle le texte au rythme lisible (timer).
      // getPaused → le texte se fige aussi quand on met en pause.
      if (!isVoiceRef.current) {
        onFirstSpeak();
        await revealByTimer(clean, emit, cancelled, getPaused);
        commitSegment(clean);
        return;
      }

      let blob: Blob | null = null;
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: clean }),
        });
        if (res.ok) blob = await res.blob();
      } catch { /* réseau KO → repli plus bas */ }

      if (cancelled()) return;

      const el = getAudioEl();
      if (!blob || !el) { await speakFallback(clean, myEpoch); commitSegment(clean); return; }

      // Voix OpenAI : le texte démarre sur "playing" et suit currentTime/duration.
      // getRate() = vitesse courante (playbackRate) → texte et voix accélèrent ensemble.
      const url = URL.createObjectURL(blob);
      await playAudioSynced(el, url, clean, emit, onFirstSpeak, cancelled, getRate());
      commitSegment(clean);
    });
  }

  // Détecte les phrases complètes et les met en file au fur et à mesure du stream.
  // (Même sans voix : sert à révéler le texte segment par segment au rythme lisible.)
  function streamSpeak(fullText: string) {
    const slice = fullText.slice(spokenIdx.current);
    const re = /[.!?][\s\n]/g;
    let lastEnd = -1, m;
    while ((m = re.exec(slice)) !== null) lastEnd = m.index + 1;
    if (lastEnd < 0) return;
    const sentence = slice.slice(0, lastEnd + 1).trim();
    if (sentence) {
      ttsEnqueue(sentence);
      spokenIdx.current += lastEnd + 1;
    }
  }

  // Fait dire une réplique autonome à VEGA via LE MÊME pipeline (orbe + texte
  // synchronisé + TTS/repli). Utilisé par l'intro et par les répliques d'inactivité.
  // Si la voix est coupée, le texte défile quand même (géré par ttsEnqueue).
  function sayLine(text: string) {
    resetReveal();
    setDisplayText("");
    setFullText(text); // taille de police calculée sur le texte complet
    ttsEnqueue(text);
    // Retour idle = retour au "cockpit" HUD (ne coexiste jamais avec l'input).
    ttsChain.current.then(() => { setOrbState("idle"); setShowText(false); });
  }

  // Exposé : ne parle que si l'orbe est LIBRE (ne coupe jamais thinking/speaking).
  const speak = useCallback((text: string) => {
    if (orbStateRef.current !== "idle") return;
    sayLine(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Intro au PREMIER geste utilisateur (le navigateur interdit l'audio auto sans
  // interaction). Jouée UNE SEULE FOIS par session : si le flag sessionStorage est
  // déjà là (retour dans la même session), on saute l'intro → idle direct.
  useEffect(() => {
    if (hasIntroPlayed()) { setIntroDone(true); return; } // déjà présentée cette session
    const greet = () => {
      cleanup();
      if (greetedRef.current) return;
      greetedRef.current = true;
      markIntroPlayed();                 // marque le flag de session
      sayLine(GREETING);
      ttsChain.current.then(() => setIntroDone(true)); // intro terminée → banter autorisé
    };
    const cleanup = () => {
      window.removeEventListener("pointerdown", greet);
      window.removeEventListener("keydown", greet);
    };
    window.addEventListener("pointerdown", greet);
    window.addEventListener("keydown", greet);
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(input: string) {
    if (!input.trim() || orbState !== "idle") return;
    setStarted(true);
    setShowText(false);
    setOrbState("thinking");
    stopAudio();           // coupe la salutation / réponse précédente
    spokenIdx.current = 0;
    resetReveal();         // repart d'un texte vide, masqué jusqu'au départ de la voix

    const msgs: Msg[] = [...history.current, { role: "user", content: input }];
    history.current = msgs;
    await new Promise(r => setTimeout(r, 300));
    setDisplayText("");
    setFullText("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Mémoire multi-tours : on envoie les N derniers messages (contexte de suivi).
        body: JSON.stringify({ messages: msgs.slice(-MEMORY_MAX_MSGS) }),
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
          // Curseur uniquement. L'affichage du texte + l'état "speaking" sont
          // déclenchés par onFirstSpeak quand la VOIX démarre (≠ arrivée réseau).
          setIsStreaming(true);
          first = false;
        }
        full += chunk;
        setFullText(full);   // texte complet connu au fil du stream → fit-text stable
        // NE PAS afficher le texte (displayText) ici : révélé en sync avec l'audio.
        streamSpeak(full);   // découpe en phrases → file audio + révélation synchronisée
      }

      // Dernière phrase non ponctuée
      const tail = full.slice(spokenIdx.current).trim();
      if (tail) ttsEnqueue(tail);

      // L'orbe reste en "speaking" jusqu'à la fin de l'audio (qui suit le texte)
      // Retour idle = retour au "cockpit" HUD : on masque la réponse pour qu'elle
      // ne coexiste jamais avec l'input/suggestions (le cas d'erreur garde showText).
      ttsChain.current.then(() => { setOrbState("idle"); setShowText(false); });

      history.current = [...msgs, { role: "assistant", content: full }];
      setConversation(history.current); // expose les tours → persistance (historique latéral)
    } catch {
      const errMsg = "Erreur — VEGA est momentanément indisponible. Réessaie.";
      setDisplayText(errMsg);
      setFullText(errMsg);
      setShowText(true);
      setOrbState("idle");
    } finally {
      setIsStreaming(false);
    }
  }

  const toggleVoice = useCallback(() => {
    setIsVoiceOn(v => {
      const next = !v;
      isVoiceRef.current = next;
      // MUTE RÉEL : on coupe seulement la SORTIE audio, on NE stoppe PAS le monologue.
      // OpenAI → audio.muted (le texte continue, piloté par currentTime ; re-clic → son revient).
      // Les segments suivants pendant le mute se révèlent au timer (silencieux), sans appel TTS.
      if (audioElRef.current) audioElRef.current.muted = !next;
      return next;
    });
  }, []);

  // Recharge une conversation passée : restaure le contexte (pour les suivis) sans
  // afficher la réponse sous l'orbe (le transcript est lu dans le panneau latéral,
  // l'orbe reste en "cockpit" → pas de coexistence texte/HUD).
  const loadConversation = useCallback((msgs: Msg[]) => {
    stopAudio();
    history.current = msgs;
    setConversation(msgs);
    setStarted(true);
    setDisplayText(""); setFullText(""); setShowText(false);
    setOrbState("idle");
  }, []);

  // Repart à zéro (bouton "Nouvelle conversation").
  const newConversation = useCallback(() => {
    stopAudio();
    history.current = [];
    setConversation([]);
    setStarted(false);
    setDisplayText(""); setFullText(""); setShowText(false);
    setOrbState("idle");
  }, []);

  return {
    orbState, displayText, fullText, isStreaming, showText, isVoiceOn, started,
    introDone, conversation, submit, speak, toggleVoice, loadConversation, newConversation,
  };
}
