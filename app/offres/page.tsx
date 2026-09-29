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
  title: "Offres — Axel Remillat | Mise en production IA",
  description:
    "Trois offres claires pour PME et startups : audit express, déploiement production et run mensuel monitoré. Passez votre IA du prototype à la production, sans surprise.",
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
