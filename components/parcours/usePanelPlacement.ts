"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";

// Placement du panneau de détail d'une compétence (extrait de NodePanel pour
// garder chaque fichier sous 150 lignes ; logique inchangée).

// ── Constantes réglables ──────────────────────────────────────────────────────
const PANEL_OFFSET = 26;     // écart franc entre le bord du nœud et le panneau (px)
const VIEWPORT_MARGIN = 16;  // marge minimale avec les bords du viewport (px)
const FOCUS_NODE_HALF = 20;  // demi-taille approx. du nœud focalisé (au centre du SVG)

interface Placement {
  left: number; top: number;          // position du panneau (fixed)
  line: { x1: number; y1: number; x2: number; y2: number }; // connecteur nœud→panneau
}

export function usePanelPlacement(
  svgRef: React.RefObject<SVGSVGElement | null>,
  ref: React.RefObject<HTMLDivElement | null>,
  nodeId: string,
): Placement | null {
  const [place, setPlace] = useState<Placement | null>(null);

  // Le zoom centre TOUJOURS le nœud focalisé → sa position finale = centre du <svg>,
  // qui ne bouge pas pendant l'animation. On ancre donc le panneau sur ce centre,
  // calculé une seule fois : le panneau apparaît directement à sa place finale
  // (à droite) sans suivre le nœud → plus de saut gauche→droite.
  const compute = useCallback(() => {
    const svg = svgRef.current, panel = ref.current;
    if (!svg || !panel) return;
    const r = svg.getBoundingClientRect();
    const ax = r.left + r.width / 2;   // X écran du nœud focalisé (centre du SVG)
    const ay = r.top + r.height / 2;   // Y écran du nœud focalisé
    const pw = panel.offsetWidth, ph = panel.offsetHeight;
    const vw = window.innerWidth, vh = window.innerHeight;
    const M = VIEWPORT_MARGIN;

    // Toujours à DROITE ; flip à gauche uniquement si ça ne rentre pas.
    let left = ax + FOCUS_NODE_HALF + PANEL_OFFSET;
    let onRight = true;
    if (left + pw > vw - M) { left = ax - FOCUS_NODE_HALF - PANEL_OFFSET - pw; onRight = false; }
    left = Math.min(Math.max(left, M), vw - pw - M);

    // Vertical : centré sur le nœud puis clampé (jamais hors écran).
    let top = ay - ph / 2;
    top = Math.min(Math.max(top, M), vh - ph - M);

    // Connecteur : du bord du nœud vers le bord du panneau, à hauteur du nœud.
    const x1 = ax + (onRight ? FOCUS_NODE_HALF : -FOCUS_NODE_HALF);
    const x2 = onRight ? left : left + pw;
    const y2 = Math.min(Math.max(ay, top + 12), top + ph - 12);
    setPlace({ left, top, line: { x1, y1: ay, x2, y2 } });
  }, [svgRef, ref]);

  // Mesure avant peinture (position finale immédiate, pas de flash ni de saut)
  // + recalage uniquement au resize / scroll (dimensions réelles).
  useLayoutEffect(() => { compute(); }, [compute, nodeId]);
  useEffect(() => {
    window.addEventListener("resize", compute);
    window.addEventListener("scroll", compute, true);
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute, true);
    };
  }, [compute]);

  return place;
}
