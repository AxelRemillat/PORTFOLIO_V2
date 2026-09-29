import type { Metadata } from "next";
import OffresHero from "@/components/offres/OffresHero";
import OffresList from "@/components/offres/OffresList";
import OffresBanners from "@/components/offres/OffresBanners";
import OffresFaq from "@/components/offres/OffresFaq";
import OffresCta from "@/components/offres/OffresCta";

// Server component : conserve le SEO. Chaque section est 'use client' et gère
// ses propres animations (reveal au scroll).
export const metadata: Metadata = {
  alternates: { canonical: "/offres" },
  title: "Offres et tarifs — Axel Remillat | Automatisation pour PME",
  description:
    "Audit dès 290 €, automatisation clé en main dès 1 200 €, suivi dès 190 €/mois, mise en production IA dès 1 900 €. Prix fixés avant de commencer.",
};

export default function OffresPage() {
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
