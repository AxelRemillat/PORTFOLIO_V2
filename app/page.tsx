import type { Metadata } from "next";
import HomeHero from "@/components/home/HomeHero";
import HomeManifesto from "@/components/home/HomeManifesto";
import ProjectsStrip from "@/components/home/ProjectsStrip";
import VegaTeaser from "@/components/home/VegaTeaser";
import HomeStats from "@/components/home/HomeStats";
import HomeCta from "@/components/home/HomeCta";

// Server component : conserve le SEO. Chaque section est 'use client' et gère
// ses propres animations (reveal au scroll, compteurs, fond vidéo-ready).
export const metadata: Metadata = {
  title: "Axel Remillat — Ingénieur Data & IA",
  description:
    "Portfolio & lab de démos d'Axel Remillat. Projets Data & IA testables en vrai : chatbot RAG, automatisations N8N, pipelines ML.",
};

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <HomeManifesto />
      <ProjectsStrip />
      <VegaTeaser />
      <HomeStats />
      <HomeCta />
    </main>
  );
}
