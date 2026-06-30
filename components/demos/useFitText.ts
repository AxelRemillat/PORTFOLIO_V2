"use client";
import { useEffect, useState, type RefObject } from "react";

// Calcule la plus grande taille de police (entre maxPx et minPx) pour laquelle
// le TEXTE COMPLET tient dans maxHeightPx, via recherche dichotomique sur un
// élément mesureur caché. On mesure sur le texte complet (pas le partiel révélé)
// pour que la police ne "saute" pas pendant l'effet machine-à-écrire.
export function useFitText(
  measureRef: RefObject<HTMLElement | null>,
  text: string,
  maxPx: number,
  minPx: number,
  maxHeightPx: number,
): number {
  const [fontPx, setFontPx] = useState(maxPx);

  useEffect(() => {
    const el = measureRef.current;
    if (!el || maxHeightPx <= 0) { setFontPx(maxPx); return; }
    if (!text) { setFontPx(maxPx); return; }

    // Cas court/moyen : tout tient déjà à la taille max → on n'y touche pas.
    el.style.fontSize = maxPx + "px";
    if (el.scrollHeight <= maxHeightPx) { setFontPx(maxPx); return; }

    // Sinon : dichotomie pour trouver la plus grande taille qui rentre.
    let lo = minPx, hi = maxPx, best = minPx;
    for (let i = 0; i < 8; i++) {
      const mid = (lo + hi) / 2;
      el.style.fontSize = mid + "px";
      if (el.scrollHeight <= maxHeightPx) { best = mid; lo = mid; }
      else hi = mid;
    }
    setFontPx(best); // si best == minPx et ça dépasse encore → scroll interne (géré par la box)
  }, [text, maxPx, minPx, maxHeightPx, measureRef]);

  return fontPx;
}
