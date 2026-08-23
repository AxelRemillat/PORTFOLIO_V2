// Simulation physique légère de la constellation (/parcours) — aucune dépendance.
// Deux familles de ressorts : rappel de chaque nœud vers sa position d'origine
// (home) + arêtes ramenées vers leur longueur au repos (c'est ce qui entraîne
// les voisins quand on tire un nœud). Intégration Euler semi-implicite amortie,
// normalisée à 60 fps (s = dt/16.7).

import { EDGES, NODES, W, H, CAT_COLOR } from "./skills-graph-data";

// ── Constantes physiques (réglage facile) ────────────────────────────────────
export const K_HOME = 0.015;     // raideur du rappel vers home
export const K_EDGE = 0.03;      // raideur des arêtes (propagation aux voisins)
export const K_CAT  = 0.006;     // cohésion douce vers l'ancre de la catégorie
export const DAMPING = 0.86;     // amortissement / frame : rebond calmé en ~1,5 s
export const SLEEP_ENERGY = 0.1; // somme des |vel| sous laquelle la boucle s'endort
export const SOFT_RADIUS = 90;   // px : au-delà, l'élastique "résiste"
export const SOFT_FACTOR = 0.4;  // fraction du surplus appliquée au-delà de SOFT_RADIUS
export const MAX_RADIUS = 140;   // px : clamp dur autour du home
export const MAX_DT = 32;        // ms : clamp du pas de temps (retour d'onglet inactif)

export interface Body {
  x: number; y: number;   // position courante (coordonnées viewBox)
  vx: number; vy: number; // vitesse
  fx: number; fy: number; // accumulateur de forces du tick courant
  hx: number; hy: number; // home = position d'origine
  ax: number; ay: number; // ancre de la catégorie (cohésion)
}

// Ancres de catégorie : grille 2 colonnes répartie dans le viewBox, dérivée de
// l'ordre des catégories (data-driven) → une future catégorie obtient sa région.
const A_CATS = Object.keys(CAT_COLOR);
const A_COLS: number = 2, A_MX = 0.20, A_MY = 0.26; // marges = centres des régions extrêmes
export const CAT_ANCHOR: Record<string, { x: number; y: number }> = Object.fromEntries(
  A_CATS.map((cat, i) => {
    const rows = Math.ceil(A_CATS.length / A_COLS);
    const col = i % A_COLS, row = Math.floor(i / A_COLS);
    const fx = A_COLS === 1 ? 0.5 : A_MX + (col * (1 - 2 * A_MX)) / (A_COLS - 1);
    const fy = rows === 1 ? 0.5 : A_MY + (row * (1 - 2 * A_MY)) / (rows - 1);
    return [cat, { x: fx * W, y: fy * H }];
  }),
);

// Ressorts d'arêtes précalculés : longueur au repos = distance entre les homes.
export const SPRINGS = EDGES.map((e) => {
  const a = NODES.find((n) => n.id === e.from)!;
  const b = NODES.find((n) => n.id === e.to)!;
  return { a: e.from, b: e.to, rest: Math.hypot((b.x - a.x) * W, (b.y - a.y) * H) };
});

export function createBodies(): Map<string, Body> {
  return new Map(
    NODES.map((n) => {
      const hx = n.x * W, hy = n.y * H;
      const a = CAT_ANCHOR[n.cat];
      return [n.id, { x: hx, y: hy, vx: 0, vy: 0, fx: 0, fy: 0, hx, hy, ax: a.x, ay: a.y }];
    }),
  );
}

// Position cinématique du nœud saisi : suit le curseur, avec résistance
// élastique au-delà de SOFT_RADIUS et clamp dur à MAX_RADIUS. vel = 0 (il
// n'est pas intégré mais exerce ses forces d'arêtes sur les voisins).
export function applyDragPos(b: Body, px: number, py: number) {
  let dx = px - b.hx, dy = py - b.hy;
  const d = Math.hypot(dx, dy);
  if (d > SOFT_RADIUS) {
    const stretched = Math.min(MAX_RADIUS, SOFT_RADIUS + (d - SOFT_RADIUS) * SOFT_FACTOR);
    dx *= stretched / d;
    dy *= stretched / d;
  }
  b.x = b.hx + dx; b.y = b.hy + dy;
  b.vx = 0; b.vy = 0;
}

// Un pas de simulation. `s` = dt normalisé (1 = 16,7 ms). Retourne l'énergie
// totale (somme des |vel|) pour la mise en veille de la boucle.
export function step(bodies: Map<string, Body>, dragId: string | null, s: number): number {
  for (const b of bodies.values()) {
    // rappel vers home + cohésion douce vers l'ancre de la catégorie
    b.fx = (b.hx - b.x) * K_HOME + (b.ax - b.x) * K_CAT;
    b.fy = (b.hy - b.y) * K_HOME + (b.ay - b.y) * K_CAT;
  }
  for (const sp of SPRINGS) {
    const a = bodies.get(sp.a)!, b = bodies.get(sp.b)!;
    let dx = b.x - a.x, dy = b.y - a.y;
    const d = Math.hypot(dx, dy) || 1;
    const f = ((d - sp.rest) * K_EDGE) / d; // force le long de l'axe, aux deux bouts
    dx *= f; dy *= f;
    a.fx += dx; a.fy += dy;
    b.fx -= dx; b.fy -= dy;
  }
  const damp = Math.pow(DAMPING, s);
  let energy = 0;
  for (const [id, b] of bodies) {
    if (id === dragId) continue; // le nœud saisi est cinématique
    b.vx = (b.vx + b.fx * s) * damp;
    b.vy = (b.vy + b.fy * s) * damp;
    b.x += b.vx * s; b.y += b.vy * s;
    const dx = b.x - b.hx, dy = b.y - b.hy;
    const d = Math.hypot(dx, dy);
    if (d > MAX_RADIUS) { // clamp dur de sécurité
      const k = MAX_RADIUS / d;
      b.x = b.hx + dx * k; b.y = b.hy + dy * k;
    }
    energy += Math.abs(b.vx) + Math.abs(b.vy);
  }
  return energy;
}
