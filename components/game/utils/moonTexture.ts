import * as THREE from "three";

const SIZE = 512;

// PRNG déterministe basé sur l'index (seed fixe -> même Lune à chaque rendu)
function seeded(i: number) {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// Cratère réaliste : ombre portée + intérieur enfoncé sombre + bord lumineux + reflet
function drawCrater(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  // 1. OMBRE EXTÉRIEURE — halo sombre autour du cratère
  const outerShadow = ctx.createRadialGradient(x, y, r * 0.7, x, y, r * 1.4);
  outerShadow.addColorStop(0, "rgba(0,0,0,0)");
  outerShadow.addColorStop(1, "rgba(0,0,0,0.35)");
  ctx.beginPath();
  ctx.arc(x, y, r * 1.4, 0, Math.PI * 2);
  ctx.fillStyle = outerShadow;
  ctx.fill();

  // 2. INTÉRIEUR — dégradé radial sombre au centre, plus clair vers le bord
  const interior = ctx.createRadialGradient(
    x - r * 0.2, y - r * 0.2, 0, // centre décalé (lumière haut-gauche)
    x, y, r * 0.95,
  );
  interior.addColorStop(0, "rgba(30, 28, 22, 0.85)");
  interior.addColorStop(0.6, "rgba(55, 50, 40, 0.70)");
  interior.addColorStop(1, "rgba(80, 72, 58, 0.40)");
  ctx.beginPath();
  ctx.arc(x, y, r * 0.95, 0, Math.PI * 2);
  ctx.fillStyle = interior;
  ctx.fill();

  // 3. BORD DU CRATÈRE — anneau lumineux (rim) côté éclairé
  const rim = ctx.createRadialGradient(x, y, r * 0.8, x, y, r * 1.05);
  rim.addColorStop(0, "rgba(0,0,0,0)");
  rim.addColorStop(0.5, "rgba(180, 165, 130, 0.55)");
  rim.addColorStop(1, "rgba(0,0,0,0)");
  ctx.beginPath();
  ctx.arc(x, y, r * 1.05, 0, Math.PI * 2);
  ctx.fillStyle = rim;
  ctx.fill();

  // 4. REFLET — arc lumineux en haut-gauche du bord (source lumière)
  ctx.beginPath();
  ctx.arc(x, y, r * 0.92, Math.PI * 1.1, Math.PI * 1.7);
  ctx.strokeStyle = "rgba(220, 200, 160, 0.45)";
  ctx.lineWidth = r * 0.12;
  ctx.stroke();

  // 5. POINT CENTRAL — légère surbrillance au fond du cratère (albedo)
  const centralGlow = ctx.createRadialGradient(x, y, 0, x, y, r * 0.25);
  centralGlow.addColorStop(0, "rgba(100, 92, 75, 0.30)");
  centralGlow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.beginPath();
  ctx.arc(x, y, r * 0.25, 0, Math.PI * 2);
  ctx.fillStyle = centralGlow;
  ctx.fill();
}

// Même cratère en niveaux de gris pour la roughnessMap (centre lisse, bord rugueux)
function drawCraterRough(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  const center = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  center.addColorStop(0, "rgba(120,120,120,0.6)");
  center.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = center;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(235,235,235,0.5)";
  ctx.lineWidth = Math.max(1, r * 0.12);
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.92, 0, Math.PI * 2);
  ctx.stroke();
}

export function generateMoonTextures(): {
  map: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
} {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;

  const rCanvas = document.createElement("canvas");
  rCanvas.width = SIZE;
  rCanvas.height = SIZE;
  const rctx = rCanvas.getContext("2d")!;

  // 1. Base : gradient radial gris-beige lunaire (#8a8070 ±15% de luminosité)
  const base = ctx.createRadialGradient(
    SIZE * 0.42, SIZE * 0.4, SIZE * 0.1,
    SIZE * 0.5, SIZE * 0.5, SIZE * 0.75
  );
  base.addColorStop(0, "#9f9381"); // +~15%
  base.addColorStop(1, "#756d5f"); // -~15%
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // roughnessMap : base claire (surface globalement très rugueuse)
  rctx.fillStyle = "#c8c8c8";
  rctx.fillRect(0, 0, SIZE, SIZE);

  // Variations de luminosité douces par zone
  for (let i = 0; i < 6; i++) {
    const zx = seeded(i * 3 + 1) * SIZE;
    const zy = seeded(i * 3 + 2) * SIZE;
    const zr = 80 + seeded(i * 3 + 3) * 140;
    const lighter = seeded(i * 3 + 4) > 0.5;
    const zg = ctx.createRadialGradient(zx, zy, 0, zx, zy, zr);
    zg.addColorStop(0, lighter ? "rgba(170,160,140,0.22)" : "rgba(100,93,80,0.22)");
    zg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = zg;
    ctx.fillRect(0, 0, SIZE, SIZE);
  }

  // 2. Mers lunaires : ellipses irrégulières sombres aux bords flous
  ctx.save();
  ctx.filter = "blur(12px)";
  ctx.fillStyle = "#4a4840";
  for (let i = 0; i < 4; i++) {
    const mx = seeded(i * 7 + 10) * SIZE;
    const my = seeded(i * 7 + 11) * SIZE;
    const rx = 60 + seeded(i * 7 + 12) * 90;
    const ry = 50 + seeded(i * 7 + 13) * 80;
    const rot = seeded(i * 7 + 14) * Math.PI;
    ctx.globalAlpha = 0.5 + seeded(i * 7 + 15) * 0.2;
    ctx.beginPath();
    ctx.ellipse(mx, my, rx, ry, rot, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  ctx.globalAlpha = 1;

  // 3. Cratères réalistes : tailles variées (18–55px), positions seedées (sin/cos)
  const craterCount = 22;
  for (let i = 0; i < craterCount; i++) {
    const cx = (Math.sin(i * 12.9898) * 0.5 + 0.5) * SIZE;
    const cy = (Math.cos(i * 78.233) * 0.5 + 0.5) * SIZE;
    const r = 18 + (Math.sin(i * 3.7) * 0.5 + 0.5) * 37; // 18 → 55
    drawCrater(ctx, cx, cy, r);
    drawCraterRough(rctx, cx, cy, r);
  }

  // 4. Grain de poussière : bruit sur ~15% des pixels (±8 sur RGB)
  const img = ctx.getImageData(0, 0, SIZE, SIZE);
  const d = img.data;
  for (let p = 0; p < d.length; p += 4) {
    if (Math.random() < 0.15) {
      const n = (Math.random() * 2 - 1) * 8;
      d[p] += n;
      d[p + 1] += n;
      d[p + 2] += n;
    }
  }
  ctx.putImageData(img, 0, 0);

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  const roughnessMap = new THREE.CanvasTexture(rCanvas);

  return { map, roughnessMap };
}
