import HeroSection from "@/components/parcours/HeroSection";
import IntroSection from "@/components/parcours/IntroSection";
import SkillsSection from "@/components/parcours/SkillsSection";
import TimelineSection from "@/components/parcours/TimelineSection";
import FormationSection from "@/components/parcours/FormationSection";

// Server component : conserve le SEO (metadata). Chaque section est 'use client'
// et gère ses propres animations (IntersectionObserver / keyframes CSS).
export const metadata = {
  alternates: { canonical: "/parcours" },
  title: "Parcours — Axel Remillat",
  description:
    "Profil, compétences et expériences d'Axel Remillat, ingénieur Data & IA — ESME Paris.",
};

export default function ParcoursPage() {
  return (
    <main style={{ background: "var(--color-bg)" }}>
      <HeroSection />
      <IntroSection />
      <SkillsSection />
      <TimelineSection />
      <FormationSection />
    </main>
  );
}
