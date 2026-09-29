import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site-config";

// Image de partage par défaut (1200×630) : sobre, nom + promesse générique.
// Aucune donnée client, aucun chiffre. Mêmes couleurs que le site.
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = `${SITE_NAME} — ${SITE_TAGLINE}`;

export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#080810",
          color: "#e2e8f0",
          borderLeft: "12px solid #f97316",
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }}>{SITE_NAME}</div>
        <div style={{ marginTop: 28, fontSize: 48, color: "#f97316", fontWeight: 600 }}>{SITE_TAGLINE}</div>
        <div style={{ marginTop: 56, fontSize: 28, color: "#94a3b8" }}>axelremillat.com</div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
