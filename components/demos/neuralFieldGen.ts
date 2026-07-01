import * as THREE from "three";

// Génération (à l'init) du nuage de l'orbe. Densité NON uniforme : amas gaussiens
// + directrices douces + fond diffus, PLUS des structures géométriques SUGGÉRÉES
// (enveloppe partielle de surface, radiaux, arcs orbitaux) — toutes floutées et
// atténuées (brightness < 1 sur fond additif) pour rester organiques, jamais nettes.
// Pur calcul, aucune update par particule.

export interface FieldCfg {
  shells: number[];
  rMax: number;
  rDead: number;
  n2: number; n3: number;
  // amas
  clusterCount: number; clusterSigmaMin: number; clusterSigmaMax: number; clusterFrac: number;
  // directrices (filaments diffus)
  lineCount: number; lineFrac: number; lineJitter: number; aniso: number;
  // enveloppe partielle de surface (membrane poreuse)
  envFrac: number; envPatches: number; envSpread: number; envDepth: number; envBright: number;
  // radiaux (rayons depuis le centre)
  radialFrac: number; radialCount: number; radialJitter: number; radialBright: number;
  // arcs orbitaux / de surface (anneaux partiels dans des plans variés)
  arcFrac: number; arcCount: number; arcSpanMin: number; arcSpanMax: number; arcJitter: number; arcBright: number;
}

export interface Seed { c: THREE.Vector3; sigma: number; axis: THREE.Vector3; }

const gauss = () => { const u = Math.random() || 1e-9, v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
const randDir = () => { const phi = Math.acos(2 * Math.random() - 1), th = Math.random() * Math.PI * 2; return new THREE.Vector3(Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th)); };
const pickShell = (s: number[]) => s[Math.floor(Math.random() * s.length)];
// Deux axes perpendiculaires à d (pour jitter latéral / plans d'arcs).
function perp(d: THREE.Vector3): [THREE.Vector3, THREE.Vector3] {
  const t = Math.abs(d.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
  const p1 = new THREE.Vector3().crossVectors(d, t).normalize();
  const p2 = new THREE.Vector3().crossVectors(d, p1).normalize();
  return [p1, p2];
}

// Palette cohérente (bleus/cyans + rares éclats), atténuée par `bright` (0..1).
function shellColor(r: number, rMax: number, out: Float32Array, i: number, bright = 1) {
  const t = r / rMax, rnd = Math.random();
  if (rnd < 0.06) { out[i] = bright; out[i + 1] = bright; out[i + 2] = bright; }
  else if (rnd < 0.28) { out[i] = (0.2 + (1 - t) * 0.6) * bright; out[i + 1] = 0.85 * bright; out[i + 2] = bright; }
  else { out[i] = 0.03 * bright; out[i + 1] = (0.20 + (1 - t) * 0.33) * bright; out[i + 2] = (0.72 + (1 - t) * 0.22) * bright; }
}

function clampR(p: THREE.Vector3, rDead: number, rMax: number) {
  const r = p.length() || 1e-9;
  if (r < rDead + 0.02) p.multiplyScalar((rDead + 0.02) / r);
  else if (r > rMax) p.multiplyScalar(rMax / r);
}

export function genSeeds(cfg: FieldCfg): Seed[] {
  // Seeds biaisés vers les shells EXTÉRIEURS (on saute les 2 plus internes) →
  // moins d'amas/de densité au centre de l'orbe.
  const s = cfg.shells;
  const outer = s.length > 2 ? s.slice(2) : s;
  return Array.from({ length: cfg.clusterCount }, () => ({
    c: randDir().multiplyScalar(pickShell(outer)),
    sigma: cfg.clusterSigmaMin + Math.random() * (cfg.clusterSigmaMax - cfg.clusterSigmaMin),
    axis: randDir(),
  }));
}

export function genShellLayer(cfg: FieldCfg, seeds: Seed[]) {
  const N = cfg.n2;
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  // Répartition cumulée des populations (le reste = fond diffus).
  const nLine = Math.floor(N * cfg.lineFrac);
  const nClust = Math.floor(N * cfg.clusterFrac);
  const nEnv = Math.floor(N * cfg.envFrac);
  const nRad = Math.floor(N * cfg.radialFrac);
  const nArc = Math.floor(N * cfg.arcFrac);
  const T = [nLine, nLine + nClust, nLine + nClust + nEnv, nLine + nClust + nEnv + nRad, nLine + nClust + nEnv + nRad + nArc];

  // Pré-calcul des structures
  const lines = Array.from({ length: cfg.lineCount }, () => ({
    a: randDir().multiplyScalar(pickShell(cfg.shells)),
    b: randDir().multiplyScalar(pickShell(cfg.shells)),
    ctrl: randDir().multiplyScalar(pickShell(cfg.shells) * (0.9 + Math.random() * 0.3)),
  }));
  const patches = Array.from({ length: cfg.envPatches }, () => randDir()); // plaques d'enveloppe
  const radials = Array.from({ length: cfg.radialCount }, () => {
    // Rayons qui partent du noyau et atteignent (presque) la surface : 72–100 %
    // du rayon → impression de structure noyau→coque, longueurs variées (naturel).
    const dir = randDir(); return { dir, ax: perp(dir), len: cfg.rDead + (0.72 + Math.random() * 0.28) * (cfg.rMax - cfg.rDead) };
  });
  const arcs = Array.from({ length: cfg.arcCount }, () => {
    const n = randDir(), [u, w] = perp(n);
    return { u, w, radius: 0.6 + Math.random() * (cfg.rMax * 0.98 - 0.6), a0: Math.random() * Math.PI * 2, span: cfg.arcSpanMin + Math.random() * (cfg.arcSpanMax - cfg.arcSpanMin) };
  });

  const v = new THREE.Vector3(), off = new THREE.Vector3();
  for (let i = 0; i < N; i++) {
    let bright = 1;
    if (i < T[0] && lines.length) {
      const L = lines[i % lines.length], t = Math.random();
      v.copy(L.a).multiplyScalar((1 - t) * (1 - t)).addScaledVector(L.ctrl, 2 * (1 - t) * t).addScaledVector(L.b, t * t);
      v.add(off.set(gauss(), gauss(), gauss()).multiplyScalar(cfg.lineJitter));
    } else if (i < T[1] && seeds.length) {
      const s = seeds[Math.floor(Math.random() * seeds.length)];
      off.set(gauss(), gauss(), gauss()).multiplyScalar(s.sigma).addScaledVector(s.axis, gauss() * s.sigma * cfg.aniso);
      v.copy(s.c).add(off);
    } else if (i < T[2] && patches.length) {
      // Enveloppe : direction près d'une plaque (→ poreuse) au rayon ~ max.
      const p = patches[Math.floor(Math.random() * patches.length)];
      v.copy(p).addScaledVector(off.set(gauss(), gauss(), gauss()), cfg.envSpread).normalize()
        .multiplyScalar(cfg.rMax * (1 - Math.random() * cfg.envDepth));
      bright = cfg.envBright;
    } else if (i < T[3] && radials.length) {
      // Radial : le long d'un rayon irrégulier + jitter latéral.
      const R = radials[Math.floor(Math.random() * radials.length)], t = Math.random();
      const r = cfg.rDead + 0.05 + t * (R.len - cfg.rDead);
      v.copy(R.dir).multiplyScalar(r)
        .addScaledVector(R.ax[0], gauss() * cfg.radialJitter).addScaledVector(R.ax[1], gauss() * cfg.radialJitter);
      bright = cfg.radialBright;
    } else if (i < T[4] && arcs.length) {
      // Arc : anneau partiel dans un plan varié + dispersion.
      const A = arcs[Math.floor(Math.random() * arcs.length)], ang = A.a0 + Math.random() * A.span;
      v.copy(A.u).multiplyScalar(Math.cos(ang) * A.radius).addScaledVector(A.w, Math.sin(ang) * A.radius)
        .add(off.set(gauss(), gauss(), gauss()).multiplyScalar(cfg.arcJitter));
      bright = cfg.arcBright;
    } else {
      // Fond diffus fortement biaisé vers les shells EXTÉRIEURS → centre bien dégagé.
      const sh = cfg.shells[Math.floor(Math.pow(Math.random(), 0.42) * cfg.shells.length)];
      v.copy(randDir()).multiplyScalar(sh + (Math.random() - 0.5) * 0.05);
    }
    clampR(v, cfg.rDead, cfg.rMax);
    pos[i * 3] = v.x; pos[i * 3 + 1] = v.y; pos[i * 3 + 2] = v.z;
    shellColor(v.length(), cfg.rMax, col, i * 3, bright);
  }
  return { pos, col };
}

export function genNodeLayer(cfg: FieldCfg, seeds: Seed[]) {
  const N = cfg.n3;
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  const v = new THREE.Vector3();
  for (let i = 0; i < N; i++) {
    if (Math.random() < 0.7 && seeds.length) {
      const s = seeds[Math.floor(Math.random() * seeds.length)];
      v.set(gauss(), gauss(), gauss()).multiplyScalar(s.sigma * 0.5).add(s.c);
    } else {
      v.copy(randDir()).multiplyScalar(pickShell(cfg.shells));
    }
    clampR(v, cfg.rDead, cfg.rMax);
    const t = v.length() / cfg.rMax;
    pos[i * 3] = v.x; pos[i * 3 + 1] = v.y; pos[i * 3 + 2] = v.z;
    col[i * 3] = 0.85 + (1 - t) * 0.15; col[i * 3 + 1] = 0.95; col[i * 3 + 2] = 1;
  }
  return { pos, col };
}
