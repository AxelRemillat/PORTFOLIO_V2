import * as THREE from "three";

// ── Planet geometry ───────────────────────────────────────────────────────────
export const A_XZ = 7;
export const A_Y  = 7;
export const SURFACE_Y = 7;

// ── Player movement ───────────────────────────────────────────────────────────
export const SPEED         = 6;
export const PORTAL_RADIUS = 1.2;
export const JUMP_HEIGHT   = 1.5;
export const JUMP_DURATION = 0.6;
export const SPAWN_COOLDOWN = 2.0;

// ── Camera ────────────────────────────────────────────────────────────────────
export const CAM_BACK      = 10.0;
export const CAM_HEIGHT    = 6.0;
export const CAM_LERP      = 0.05;
export const CAM_FACE_LERP = 0.025;

// ── Decoration palettes ───────────────────────────────────────────────────────
export const ROCK_COLORS  = ["#4a4a5a", "#5a5a6a", "#6a6070", "#3a3a4a"] as const;
export const GRASS_COLORS = ["#1a3d0c", "#2d5a1b", "#3a6b22", "#1e4a12", "#0f2a08"] as const;
export const BUSH_COLORS  = ["#1a3d0c", "#1e4a12", "#243d12", "#0d2607"] as const;

// ── Ellipsoid math ────────────────────────────────────────────────────────────

export function ellipsoidProject(p: THREE.Vector3, out: THREE.Vector3): THREE.Vector3 {
  const t = 1 / Math.sqrt(
    (p.x * p.x) / (A_XZ * A_XZ) +
    (p.y * p.y) / (A_Y  * A_Y ) +
    (p.z * p.z) / (A_XZ * A_XZ),
  );
  return out.set(p.x * t, p.y * t, p.z * t);
}

export function ellipsoidNormal(p: THREE.Vector3, out: THREE.Vector3): THREE.Vector3 {
  return out.set(
    p.x / (A_XZ * A_XZ),
    p.y / (A_Y  * A_Y ),
    p.z / (A_XZ * A_XZ),
  ).normalize();
}

// ── Portal data ───────────────────────────────────────────────────────────────

function dirToPortalPos(nx: number, ny: number, nz: number): [number, number, number] {
  const r = A_XZ + 0.9;
  return [nx * r, ny * r, nz * r];
}

export const PORTALS = [
  { id: "rag",   position: dirToPortalPos( 0.62,  0.55,  0.56), color: "#FF8C00", label: "CV Interactif RAG",  href: "/demos/rag"     },
  { id: "rise",  position: dirToPortalPos(-0.71,  0.38, -0.59), color: "#FFFFFF", label: "RISE",               href: "/projets/rise/site" },
  { id: "seaco", position: dirToPortalPos(-0.48, -0.52,  0.71), color: "#00BFFF", label: "SEACO Pipeline",     href: "/projets/seaco" },
  { id: "n8n",   position: dirToPortalPos( 0.35, -0.78, -0.52), color: "#CC44FF", label: "Automatisations N8N",href: "/projets/n8n"   },
  { id: "music", position: dirToPortalPos( 0.80,  0.42, -0.43), color: "#FFD700", label: "Planète qui Chante", href: "/projets/music" },
] as const;

export type PortalData = typeof PORTALS[number];
