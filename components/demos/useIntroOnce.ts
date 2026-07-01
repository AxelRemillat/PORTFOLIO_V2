"use client";

// Intro VEGA jouée UNE SEULE FOIS par session de navigation.
// sessionStorage (≠ localStorage) : l'intro se rejoue sur une NOUVELLE session
// (nouvel onglet / navigateur relancé) mais pas lors des allers-retours dans la
// session courante.
export const INTRO_SESSION_KEY = "vega_intro_played"; // clé sessionStorage (réglable)

export function hasIntroPlayed(): boolean {
  if (typeof window === "undefined") return false;
  try { return window.sessionStorage.getItem(INTRO_SESSION_KEY) === "1"; } catch { return false; }
}

export function markIntroPlayed(): void {
  if (typeof window === "undefined") return;
  try { window.sessionStorage.setItem(INTRO_SESSION_KEY, "1"); } catch { /* stockage indispo */ }
}

// Hook fin (API nommée) — les helpers ci-dessus restent utilisables directement
// (ex. dans un gestionnaire d'événement, hors cycle de rendu).
export function useIntroOnce() {
  return { hasIntroPlayed, markIntroPlayed, INTRO_SESSION_KEY };
}
