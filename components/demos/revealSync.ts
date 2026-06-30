"use client";
// Révélation progressive du texte VEGA, calée sur l'audio quand il est disponible.
// Le texte ATTEND l'audio (départ sur "playing"/"onstart"), jamais l'inverse.

// ── Constantes réglables ──────────────────────────────────────────────────
export const FALLBACK_CPS = 15;            // caractères/s sans audio (muet / repli sans durée)
export const REVEAL_MODE: "char" | "word" = "char"; // machine à écrire vs mot-à-mot
const SPEECH_START_SAFETY = 400;           // ms : filet si l'event onstart Web Speech ne se déclenche pas
// ──────────────────────────────────────────────────────────────────────────

type Cancelled = () => boolean;
type Paused = () => boolean;

// Coupe `text` à une fraction [0..1] selon le mode (caractères ou mots).
function take(text: string, frac: number): string {
  const f = Math.max(0, Math.min(1, frac));
  if (REVEAL_MODE === "word") {
    const words = text.trim().split(/\s+/);
    return words.slice(0, Math.floor(f * words.length)).join(" ");
  }
  return text.slice(0, Math.floor(f * text.length));
}

// Joue l'audio OpenAI et révèle `text` étalé sur sa durée réelle (currentTime/duration).
// `rate` = playbackRate initial (la vitesse). Comme le texte suit currentTime, accélérer
// l'audio accélère le texte ET le fait finir en même temps. Pause = audio.pause() côté
// contrôle → currentTime gèle → le texte gèle aussi, automatiquement.
export function playAudioSynced(
  el: HTMLAudioElement, url: string, text: string,
  emit: (s: string) => void, onStart: () => void, cancelled: Cancelled, rate = 1,
): Promise<void> {
  return new Promise((resolve) => {
    let raf = 0, done = false, started = false;
    const fireStart = () => { if (!started) { started = true; onStart(); } };
    const finish = () => {
      if (done) return; done = true;
      cancelAnimationFrame(raf);
      el.removeEventListener("playing", fireStart);
      el.removeEventListener("ended", finish);
      el.removeEventListener("error", finish);
      if (!cancelled()) emit(text);          // garantit tout le texte même si l'audio coupe court
      try { URL.revokeObjectURL(url); } catch {}
      resolve();
    };
    const tick = () => {
      if (cancelled()) return finish();
      const d = el.duration;
      // mapping clé : progression texte = currentTime / durée audio
      if (d && isFinite(d) && d > 0) emit(take(text, el.currentTime / d));
      raf = requestAnimationFrame(tick);
    };
    el.addEventListener("playing", fireStart);
    el.addEventListener("ended", finish);
    el.addEventListener("error", finish);
    el.src = url;
    el.playbackRate = rate;                  // applique la vitesse courante
    raf = requestAnimationFrame(tick);
    el.play().then(fireStart).catch(finish);
  });
}

// Repli Web Speech : sync mot-à-mot via onboundary si dispo, sinon timer lisible.
// `isPaused` gèle le timer de secours quand la voix est en pause.
export function speakSynced(
  u: SpeechSynthesisUtterance, text: string,
  emit: (s: string) => void, onStart: () => void, cancelled: Cancelled, isPaused: Paused = () => false,
): Promise<void> {
  return new Promise((resolve) => {
    const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
    if (!synth) { revealByTimer(text, emit, cancelled, isPaused).then(() => { onStart(); resolve(); }); return; }

    let raf = 0, done = false, started = false, boundary = false, maxN = 0;
    let acc = 0, last = performance.now(); // horloge qui se fige pendant la pause
    const fireStart = () => { if (!started) { started = true; clearTimeout(safety); onStart(); } };
    const setN = (n: number) => { if (n > maxN) { maxN = n; emit(text.slice(0, n)); } }; // monotone
    const finish = () => {
      if (done) return; done = true;
      cancelAnimationFrame(raf); clearTimeout(safety);
      if (!cancelled()) emit(text);
      resolve();
    };
    const tick = () => {
      if (cancelled()) return finish();
      const now = performance.now();
      if (!isPaused()) acc += now - last;
      last = now;
      if (!boundary) setN(Math.min(text.length, Math.floor((acc / 1000) * FALLBACK_CPS)));
      raf = requestAnimationFrame(tick);
    };
    const safety = setTimeout(fireStart, SPEECH_START_SAFETY); // filet si onstart muet
    u.onstart = fireStart;
    u.onboundary = (e) => { boundary = true; setN(e.charIndex); };
    u.onend = finish;
    u.onerror = finish;
    synth.resume();
    synth.speak(u);
    raf = requestAnimationFrame(tick);
  });
}

// Révélation à vitesse fixe lisible (aucun audio : voix coupée, ou repli sans durée).
// `isPaused` gèle la progression (texte figé pendant la pause).
export function revealByTimer(
  text: string, emit: (s: string) => void, cancelled: Cancelled,
  isPaused: Paused = () => false, cps = FALLBACK_CPS,
): Promise<void> {
  return new Promise((resolve) => {
    let acc = 0, last = performance.now(), raf = 0;
    const tick = () => {
      if (cancelled()) { cancelAnimationFrame(raf); return resolve(); }
      const now = performance.now();
      if (!isPaused()) acc += now - last;
      last = now;
      const frac = ((acc / 1000) * cps) / Math.max(1, text.length);
      emit(take(text, frac));
      if (frac >= 1) { cancelAnimationFrame(raf); return resolve(); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  });
}
