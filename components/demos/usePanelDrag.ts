"use client";
import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

// Logique d'ouverture par CLIC ou DRAG d'une poignée latérale, souris + tactile
// (pointer events). Pendant le drag, on expose une fraction 0..1 (le panneau suit
// le doigt) ; au relâché, snap : > SNAP → ouvert, sinon fermé. Un mouvement quasi
// nul est traité comme un simple clic (toggle).
interface Opts {
  side: "left" | "right";
  width: number; // largeur du panneau (px) — base du calcul de fraction
  open: boolean;
  setOpen: (v: boolean) => void;
  snap?: number; // seuil de snap (def. 0.4)
  clickPx?: number; // déplacement en deçà duquel c'est un clic (def. 5)
}

export function usePanelDrag({ side, width, open, setOpen, snap = 0.4, clickPx = 5 }: Opts) {
  const [dragFrac, setDragFrac] = useState<number | null>(null); // null = pas de drag

  const startX = useRef(0);
  const startOpen = useRef(false);
  const moved = useRef(0);

  const onPointerDown = (e: ReactPointerEvent) => {
    startX.current = e.clientX;
    startOpen.current = open;
    moved.current = 0;
    let frac = open ? 1 : 0;
    setDragFrac(frac);

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - startX.current;
      moved.current = Math.abs(dx);
      // gauche : tirer vers la droite ouvre ; droite : tirer vers la gauche ouvre
      const delta = side === "left" ? dx : -dx;
      const px = Math.max(0, Math.min(width, (startOpen.current ? width : 0) + delta));
      frac = px / width;
      setDragFrac(frac);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      setDragFrac(null);
      if (moved.current < clickPx) setOpen(!startOpen.current); // clic → toggle
      else setOpen(frac > snap); // drag → snap selon seuil
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  return { dragFrac, onPointerDown };
}
