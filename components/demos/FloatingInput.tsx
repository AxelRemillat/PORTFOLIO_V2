"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { Prefill } from "./SuggestionTicker";
import HudInput from "./HudInput";
import SuggestionTicker from "./SuggestionTicker";
import ThinkingIndicator from "./ThinkingIndicator";
import SpeakingControls from "./SpeakingControls";
import { ALL_QUESTIONS } from "./questionsData";

type OrbState = "idle" | "thinking" | "speaking";

interface Props {
  state: OrbState;
  onSubmit: (text: string) => void;
  // Contrôles affichés uniquement pendant "speaking"
  paused: boolean;
  speed: number;
  onTogglePause: () => void;
  onCycleSpeed: () => void;
  onDeleteConversation: () => void;
}

// ── Constantes réglables ──────────────────────────────────────────────────
// Le ticker affiche les 50 questions du catalogue (source unique :
// questionsData.ts), mélangées au montage → ordre aléatoire, sans répétition
// avant d'avoir fait le tour.
const THINKING_TEXT = "recherche dans la base vectorielle";
const TRANSITION_MS = 320; // durée du fade/blur entre états
// ──────────────────────────────────────────────────────────────────────────

export default function FloatingInput({
  state, onSubmit,
  paused, speed, onTogglePause, onCycleSpeed, onDeleteConversation,
}: Props) {
  // Suggestion cliquée → pré-remplit la barre (l'utilisateur valide lui-même)
  const [prefill, setPrefill] = useState<Prefill>(null);
  const pick = (s: string) => setPrefill((p) => ({ text: s, key: (p?.key ?? 0) + 1 }));

  // Mélange des 50 questions APRÈS le montage (pas au rendu initial → pas de
  // mismatch d'hydratation SSR/client avec un ordre aléatoire).
  const [suggestions, setSuggestions] = useState<string[]>(ALL_QUESTIONS);
  useEffect(() => {
    setSuggestions([...ALL_QUESTIONS].sort(() => Math.random() - 0.5));
  }, []);

  // Respect de prefers-reduced-motion (coupe typewriter/blur)
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(m.matches);
    apply();
    m.addEventListener("change", apply);
    return () => m.removeEventListener("change", apply);
  }, []);

  // Source de vérité unique : un seul calque visible à la fois (jamais de
  // chevauchement). "speaking" → aucun calque (seule la réponse cinétique reste).
  const layer = (visible: boolean): CSSProperties => ({
    position: "fixed",
    bottom: "5vh",
    left: "50%",
    transform: `translateX(-50%) translateY(${visible ? 0 : 8}px)`,
    zIndex: 30,
    width: "min(620px, 90vw)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    opacity: visible ? 1 : 0,
    filter: visible || reduced ? "none" : "blur(6px)",
    pointerEvents: visible ? "auto" : "none",
    transition: reduced
      ? "opacity 0.2s ease"
      : `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease, filter ${TRANSITION_MS}ms ease`,
  });

  return (
    <>
      {/* idle : cockpit d'accueil — suggestions qui défilent + ligne de saisie.
          inert quand masqué → sort du focus clavier et des lecteurs d'écran. */}
      <div style={layer(state === "idle")} aria-hidden={state !== "idle"} inert={state !== "idle"}>
        <SuggestionTicker items={suggestions} onPick={pick} reduced={reduced} />
        <HudInput disabled={state !== "idle"} onSubmit={onSubmit} prefill={prefill} />
      </div>

      {/* thinking : indicateur d'activité, aucune saisie attendue */}
      <div style={layer(state === "thinking")} aria-hidden={state !== "thinking"} inert={state !== "thinking"}>
        <ThinkingIndicator text={THINKING_TEXT} reduced={reduced} />
      </div>

      {/* speaking : cluster de contrôles (pause / supprimer / vitesse) à la place de la saisie */}
      <div style={layer(state === "speaking")} aria-hidden={state !== "speaking"} inert={state !== "speaking"}>
        <SpeakingControls
          paused={paused}
          speed={speed}
          onTogglePause={onTogglePause}
          onCycleSpeed={onCycleSpeed}
          onDelete={onDeleteConversation}
        />
      </div>
    </>
  );
}
