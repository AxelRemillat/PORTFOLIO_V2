import { pageMetadata } from "@/lib/i18n/seo";
import { getLocale } from "@/lib/i18n/server";
import LegalFr from "@/components/legal/LegalFr";
import LegalEn from "@/components/legal/LegalEn";

// Mentions légales : le français fait foi (components/legal/LegalFr), l'anglais
// en est une traduction de courtoisie, qui le dit (LegalEn).
export const generateMetadata = pageMetadata("/mentions-legales", (locale) =>
  locale === "en"
    ? {
        title: "Legal notice — Axel Remillat",
        description: "Publisher, hosting provider and personal data processing for axelremillat.com.",
      }
    : {
        title: "Mentions légales — Axel Remillat",
        description: "Éditeur, hébergeur et traitement des données personnelles du site axelremillat.com.",
      },
);

export default async function MentionsLegalesPage({ params }: { params: Promise<{ lang: string }> }) {
  return (await getLocale(params)) === "en" ? <LegalEn /> : <LegalFr />;
}
