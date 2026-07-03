"use client";

import { useCallback, useEffect, useRef } from "react";

type OrbState = "idle" | "thinking" | "speaking";

// ── Constantes réglables ──────────────────────────────────────────────────────
export const IDLE_DELAY_MS = 20000;   // inactivité avant la 1ʳᵉ réplique
export const BANTER_MIN_MS = 25000;   // intervalle mini entre deux répliques
export const BANTER_MAX_MS = 45000;   // intervalle maxi entre deux répliques

// Pool de répliques (ton sarcastique/humoristique de VEGA) — éditable.
export const BANTER_LINES = [
  "Toujours là ? Je commençais à parler toute seule...",
  "Tu peux me poser une question, tu sais. Je ne mords pas — je n'ai même pas de dents.",
  "Petit indice : la barre en bas, c'est fait pour écrire dedans.",
  "Je connais Axel par cœur. Enfin, par vecteurs. Vas-y, teste-moi.",
  "Silence radio. J'en profite pour recompter les étoiles.",
  "Un portfolio avec une IA qui parle, et personne ne lui parle. L'ironie.",
  "Tu sais que je tourne sur de vrais tokens, là ? Enfin... c'est Axel qui paie.",
  "Je viens de réindexer ma base de connaissances. Trois fois. Distrais-moi.",
  "L'orbe tourne, les particules brillent, et toi tu ne dis rien. Du grand art.",
  "Pose-moi une question sur RISE, SEACO, N8N... ou sur moi. Surtout sur moi.",
  "Une IA avec une mémoire vectorielle et zéro conversation en cours. Cherche l'erreur.",
  "Les questions à gauche, l'historique à droite, moi au milieu. Tout est prêt, il ne manque que toi.",
];

// Répliques d'inactivité. Le timer se (ré)arme à chaque action utilisateur ; il ne
// démarre qu'APRÈS la première action (donc après un geste → audio débloqué). Une
// réplique n'est jamais déclenchée pendant thinking/speaking ou pendant la saisie.
export function useIdleBanter({ enabled, orbState, speak }: {
  enabled: boolean;
  orbState: OrbState;
  speak: (text: string) => void;
}) {
  const timer = useRef<number | null>(null);
  const lastLine = useRef<string | null>(null);
  const typing = useRef(false);
  const speakRef = useRef(speak);
  speakRef.current = speak;
  // État frais lu dans le timeout (évite les closures périmées).
  const stateRef = useRef({ enabled, orbState });
  stateRef.current = { enabled, orbState };

  const pickLine = () => {
    if (BANTER_LINES.length <= 1) return BANTER_LINES[0];
    let l: string;
    do { l = BANTER_LINES[Math.floor(Math.random() * BANTER_LINES.length)]; }
    while (l === lastLine.current); // évite de répéter la même deux fois d'affilée
    return l;
  };

  const clear = () => { if (timer.current) { clearTimeout(timer.current); timer.current = null; } };

  const schedule = useCallback((delay: number) => {
    clear();
    timer.current = window.setTimeout(function fire() {
      const { enabled, orbState } = stateRef.current;
      // Garde-fous : jamais si désactivé (intro pas finie), pendant que VEGA parle/
      // réfléchit, ou pendant la saisie → on ré-essaie plus tard.
      if (!enabled || orbState !== "idle" || typing.current) { schedule(IDLE_DELAY_MS); return; }
      const line = pickLine();
      lastLine.current = line;
      speakRef.current(line);
      // Après une réplique : intervalle aléatoire plus long avant la suivante.
      schedule(BANTER_MIN_MS + Math.random() * (BANTER_MAX_MS - BANTER_MIN_MS));
    }, delay);
  }, []);

  // Toute action réelle réarme le cycle (input, focus, clic, envoi, ouverture panneau).
  const notify = useCallback(() => { schedule(IDLE_DELAY_MS); }, [schedule]);

  useEffect(() => {
    if (!enabled) { clear(); return; }
    const onActivity = () => notify();
    const isField = (t: EventTarget | null) => {
      const el = t as HTMLElement | null;
      return !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
    };
    const onFocusIn = (e: FocusEvent) => { if (isField(e.target)) typing.current = true; notify(); };
    const onFocusOut = (e: FocusEvent) => { if (isField(e.target)) typing.current = false; };

    window.addEventListener("pointerdown", onActivity);
    window.addEventListener("keydown", onActivity);
    window.addEventListener("input", onActivity, true);
    window.addEventListener("focusin", onFocusIn);
    window.addEventListener("focusout", onFocusOut);
    schedule(IDLE_DELAY_MS); // arme le 1ᵉʳ cycle dès que l'intro est terminée
    return () => {
      clear();
      window.removeEventListener("pointerdown", onActivity);
      window.removeEventListener("keydown", onActivity);
      window.removeEventListener("input", onActivity, true);
      window.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("focusout", onFocusOut);
    };
  }, [enabled, notify, schedule]);
}
