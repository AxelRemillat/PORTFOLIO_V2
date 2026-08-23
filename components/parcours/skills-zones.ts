// Zones de thème du graphe /parcours : une enveloppe souple par catégorie,
// calculée à partir des positions des nœuds (100 % data-driven). Aucune dépendance.

import { NODES, W, H, type Cat } from "./skills-graph-data";

export type Pt = [number, number];

export const ZONE_PAD = 30; // marge autour du groupe (coords viewBox) — filet d'espace entre territoires

// Catégorie → ids des nœuds membres (dérivé de NODES → data-driven).
export const CAT_MEMBERS: Record<string, string[]> = (() => {
  const m: Record<string, string[]> = {};
  for (const n of NODES) (m[n.cat] ??= []).push(n.id);
  return m;
})();

// Catégories réellement présentes : une future catégorie (nœuds + couleur)
// apparaît automatiquement, sans forme codée en dur.
export const ZONE_CATS = Object.keys(CAT_MEMBERS) as Cat[];

// Positions "home" d'une catégorie (rendu initial / au repos).
export function homePoints(cat: string): Pt[] {
  return CAT_MEMBERS[cat].map((id) => {
    const n = NODES.find((x) => x.id === id)!;
    return [n.x * W, n.y * H];
  });
}

// Enveloppe convexe (monotone chain d'Andrew).
function hull(points: Pt[]): Pt[] {
  const pts = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: Pt, a: Pt, b: Pt) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: Pt[] = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper: Pt[] = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  lower.pop(); upper.pop();
  return lower.concat(upper);
}

// Dilate les sommets vers l'extérieur (depuis le centroïde) d'une marge `pad`.
function expand(pts: Pt[], pad: number): Pt[] {
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return pts.map(([x, y]) => {
    const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy) || 1;
    return [x + (dx / d) * pad, y + (dy / d) * pad] as Pt;
  });
}

// Chemin fermé lissé (quadratiques par les milieux d'arêtes) → blob organique.
function smooth(pts: Pt[]): string {
  const n = pts.length;
  const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const m0 = mid(pts[n - 1], pts[0]);
  let d = `M ${m0[0].toFixed(1)} ${m0[1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const c = pts[i], m = mid(c, pts[(i + 1) % n]);
    d += ` Q ${c[0].toFixed(1)} ${c[1].toFixed(1)} ${m[0].toFixed(1)} ${m[1].toFixed(1)}`;
  }
  return d + " Z";
}

// Ancre de l'étiquette : centrée en x, près du sommet (haut) de la zone.
export function zoneLabelAnchor(points: Pt[], pad = ZONE_PAD): Pt {
  const cx = points.reduce((s, p) => s + p[0], 0) / points.length;
  const minY = Math.min(...points.map((p) => p[1]));
  return [cx, minY - pad + 13];
}

// Path d'une zone à partir des positions courantes de ses membres.
export function zonePath(points: Pt[], pad = ZONE_PAD): string {
  if (!points.length) return "";
  if (points.length < 3) {
    const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
    const x0 = Math.min(...xs) - pad, x1 = Math.max(...xs) + pad;
    const y0 = Math.min(...ys) - pad, y1 = Math.max(...ys) + pad;
    return smooth([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
  }
  return smooth(expand(hull(points), pad));
}
