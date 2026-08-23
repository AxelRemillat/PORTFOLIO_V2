"use client";

import Script from "next/script";

// Analytics Umami (privacy-first, cookieless → aucune bannière de consentement).
// Chargé UNIQUEMENT en production pour ne pas polluer les stats en dev/local.
// Umami suit automatiquement les vues et les navigations client (SPA App Router).
const UMAMI_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const UMAMI_SRC = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;

export default function Analytics() {
  if (process.env.NODE_ENV !== "production" || !UMAMI_ID || !UMAMI_SRC) return null;
  return (
    <Script src={UMAMI_SRC} data-website-id={UMAMI_ID} strategy="afterInteractive" />
  );
}
