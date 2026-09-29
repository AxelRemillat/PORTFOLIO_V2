import type { Metadata } from "next";
import HomeHero from "@/components/home/HomeHero";
import HomeProblems from "@/components/home/HomeProblems";
import HomeFeaturedDemo from "@/components/home/HomeFeaturedDemo";
import HomeSteps from "@/components/home/HomeSteps";
import OffersTeaser from "@/components/home/OffersTeaser";
import ProjectsStrip from "@/components/home/ProjectsStrip";
import HomeCta from "@/components/home/HomeCta";

// Server component. Ordre : promesse → problèmes (1 démo chacun) → démo phare →
// méthode → offres → preuves → à propos + CTA final.
export const metadata: Metadata = {
  title: "Axel Remillat — J'automatise les tâches répétitives de votre PME",
  description:
    "Devis, commandes, relances, documents : moins de ressaisie, des réponses plus rapides. Démos testables sur votre métier avant de signer.",
};

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <HomeProblems />
      <HomeFeaturedDemo />
      <HomeSteps />
      <OffersTeaser />
      <ProjectsStrip />
      <HomeCta />
    </main>
  );
}
