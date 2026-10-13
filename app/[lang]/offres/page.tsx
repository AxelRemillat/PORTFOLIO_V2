import type { Metadata } from "next";
import OffresHero from "@/components/offres/OffresHero";
import OffresList from "@/components/offres/OffresList";
import OffresBanners from "@/components/offres/OffresBanners";
import OffresFaq from "@/components/offres/OffresFaq";
import OffresCta from "@/components/offres/OffresCta";
import { pageMetadata } from "@/lib/i18n/seo";
import { getLocale } from "@/lib/i18n/server";
import { offresCopy } from "@/components/offres/offres-copy";

// Server component : conserve le SEO. Chaque section est 'use client' et gère
// ses propres animations (reveal au scroll).
export const generateMetadata = pageMetadata("/offres", (locale) => offresCopy(locale).meta);

export default async function OffresPage({ params }: { params: Promise<{ lang: string }> }) {
  await getLocale(params);
  return (
    <main style={{ background: "var(--color-bg)" }}>
      <OffresHero />
      <OffresList />
      <OffresBanners />
      <OffresFaq />
      <OffresCta />
    </main>
  );
}
