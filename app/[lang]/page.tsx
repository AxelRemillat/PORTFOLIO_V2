import type { Metadata } from "next";
import HomeHero from "@/components/home/HomeHero";
import HomeProblems from "@/components/home/HomeProblems";
import HomeFeaturedDemo from "@/components/home/HomeFeaturedDemo";
import HomeSteps from "@/components/home/HomeSteps";
import OffersTeaser from "@/components/home/OffersTeaser";
import ProjectsStrip from "@/components/home/ProjectsStrip";
import HomeCta from "@/components/home/HomeCta";
import { pageMetadata } from "@/lib/i18n/seo";
import { getLocale } from "@/lib/i18n/server";
import { homeCopy } from "@/components/home/copy";

// Server component. Ordre : promesse → problèmes (1 démo chacun) → démo phare →
// méthode → offres → preuves → à propos + CTA final.
export const generateMetadata = pageMetadata("/", (locale) => ({
  title: homeCopy(locale).meta.title,
  description: homeCopy(locale).meta.description,
}));

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  await getLocale(params);
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
