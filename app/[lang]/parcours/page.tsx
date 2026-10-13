import HeroSection from "@/components/parcours/HeroSection";
import IntroSection from "@/components/parcours/IntroSection";
import SkillsSection from "@/components/parcours/SkillsSection";
import TimelineSection from "@/components/parcours/TimelineSection";
import FormationSection from "@/components/parcours/FormationSection";
import { pageMetadata } from "@/lib/i18n/seo";
import { getLocale } from "@/lib/i18n/server";
import { parcoursCopy } from "@/components/parcours/parcours-copy";

// Server component : conserve le SEO (metadata). Chaque section est 'use client'
// et gère ses propres animations (IntersectionObserver / keyframes CSS).
export const generateMetadata = pageMetadata("/parcours", (locale) => parcoursCopy(locale).meta);

export default async function ParcoursPage({ params }: { params: Promise<{ lang: string }> }) {
  await getLocale(params);
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
