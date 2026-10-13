import type { Metadata } from "next";
import HomeHero from "@/components/home/HomeHero";
import HomeFeaturedDemo from "@/components/home/HomeFeaturedDemo";
import HomeSteps from "@/components/home/HomeSteps";
import HomeCta from "@/components/home/HomeCta";
import { pageMetadata } from "@/lib/i18n/seo";
import { getLocale } from "@/lib/i18n/server";
import { homeCopy } from "@/components/home/copy";

// Page d'atterrissage des mails de prospection (lien de signature) : version
// courte de la home, centrée sur la démo agent devis. Les clics portent
// l'origine « pme » dans Umami. Non indexée : elle double la home.
export const generateMetadata = pageMetadata("/pme", (locale) => ({
  title: homeCopy(locale).pme.metaTitle,
  description: homeCopy(locale).pme.metaDescription,
  robots: { index: false, follow: true },
}));

export default async function PmePage({ params }: { params: Promise<{ lang: string }> }) {
  const c = homeCopy(await getLocale(params)).pme;
  return (
    <main>
      <HomeHero origine="pme" title={c.title} subtitle={c.subtitle} />
      <HomeFeaturedDemo origine="pme" />
      <HomeSteps />
      <HomeCta origine="pme" about={false} />
    </main>
  );
}
