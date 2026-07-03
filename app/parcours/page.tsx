import HeroSection from "@/components/parcours/HeroSection";
import ManifestoSection from "@/components/parcours/ManifestoSection";
import StatsSection from "@/components/parcours/StatsSection";
import SkillsSection from "@/components/parcours/SkillsSection";
import TimelineSection from "@/components/parcours/TimelineSection";
import HorsEcranSection from "@/components/parcours/HorsEcranSection";
import FormationSection from "@/components/parcours/FormationSection";

// Server component : conserve le SEO (metadata). Chaque section est 'use client'
// et gère ses propres animations (IntersectionObserver / keyframes CSS).
export const metadata = {
  title: "Parcours — Axel Remillat",
  description:
    "Profil, compétences et expériences d'Axel Remillat, ingénieur Data & IA — ESME Paris.",
};

export default function ParcoursPage() {
  return (
    <main style={{ background: "var(--color-bg)" }}>
      <HeroSection />
      <ManifestoSection />
      <StatsSection />
      <SkillsSection />
      <TimelineSection />
      <HorsEcranSection />
      <FormationSection />
    </main>
  );
}
