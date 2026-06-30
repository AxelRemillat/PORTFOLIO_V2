"use client";
import { useEffect, useRef, useState } from "react";

// Cycle machine-à-écrire : tape une suggestion, la tient, l'efface, passe à la
// suivante en boucle. `index` pointe la suggestion complète courante (pour le clic).
interface Opts { typeMs?: number; eraseMs?: number; holdMs?: number; enabled?: boolean; }

export function useRotatingSuggestions(items: string[], opts: Opts = {}) {
  const { typeMs = 45, eraseMs = 22, holdMs = 2600, enabled = true } = opts;
  const [index, setIndex] = useState(0);
  const [text, setText]   = useState("");
  const idxRef = useRef(0);

  useEffect(() => {
    if (!enabled || items.length === 0) { setText(items[0] ?? ""); return; }
    let timer: ReturnType<typeof setTimeout>;
    let phase: "type" | "hold" | "erase" = "type";
    let i = idxRef.current;
    let n = 0;
    const step = () => {
      const s = items[i];
      if (phase === "type") {
        n++; setText(s.slice(0, n));
        if (n >= s.length) { phase = "hold"; timer = setTimeout(step, holdMs); }
        else timer = setTimeout(step, typeMs);
      } else if (phase === "hold") {
        phase = "erase"; timer = setTimeout(step, eraseMs);
      } else {
        n--; setText(s.slice(0, Math.max(0, n)));
        if (n <= 0) {
          i = (i + 1) % items.length; idxRef.current = i; setIndex(i);
          phase = "type"; timer = setTimeout(step, typeMs);
        } else timer = setTimeout(step, eraseMs);
      }
    };
    timer = setTimeout(step, typeMs);
    return () => clearTimeout(timer);
  }, [enabled, items, typeMs, eraseMs, holdMs]);

  return { text, current: items[index] ?? "" };
}
