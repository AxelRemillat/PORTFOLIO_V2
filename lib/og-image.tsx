import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site-config";
import type { Locale } from "@/lib/i18n/config";

// Image de partage par défaut (1200×630) : sobre, nom + promesse générique.
// Aucune donnée client, aucun chiffre. Mêmes couleurs que le site.
// Une version par langue : la promesse et le texte alternatif suivent la page.
export const OG_SIZE = { width: 1200, height: 630 };

const TAGLINE: Record<Locale, string> = { fr: SITE_TAGLINE, en: "Automation & AI for small businesses" };

export const ogAlt = (locale: Locale) => `${SITE_NAME} — ${TAGLINE[locale]}`;

export function renderOgImage(locale: Locale = "fr") {
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
        <div style={{ marginTop: 28, fontSize: 48, color: "#f97316", fontWeight: 600 }}>{TAGLINE[locale]}</div>
        <div style={{ marginTop: 56, fontSize: 28, color: "#94a3b8" }}>axelremillat.com</div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
