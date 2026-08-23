import type { Metadata } from "next";
import HomeHero from "@/components/home/HomeHero";
import HomeManifesto from "@/components/home/HomeManifesto";
import OffersTeaser from "@/components/home/OffersTeaser";
import ProjectsStrip from "@/components/home/ProjectsStrip";
import VegaTeaser from "@/components/home/VegaTeaser";
import HomeStats from "@/components/home/HomeStats";
import HomeCta from "@/components/home/HomeCta";

// Server component : conserve le SEO. Chaque section est 'use client' et gère
// ses propres animations (reveal au scroll, compteurs, fond vidéo-ready).
export const metadata: Metadata = {
  title: "Axel Remillat — Mise en production IA pour PME & startups",
  description:
    "Ingénieur IA. Je fais passer vos projets IA du prototype à la production : agents, RAG, automatisations — fiables, monitorés, conformes. Preuves testables en ligne.",
};

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <HomeManifesto />
      <OffersTeaser />
      <ProjectsStrip />
      <VegaTeaser />
      <HomeStats />
      <HomeCta />
    </main>
  );
}
