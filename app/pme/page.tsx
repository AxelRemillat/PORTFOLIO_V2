import type { Metadata } from "next";
import HomeHero from "@/components/home/HomeHero";
import HomeFeaturedDemo from "@/components/home/HomeFeaturedDemo";
import HomeSteps from "@/components/home/HomeSteps";
import HomeCta from "@/components/home/HomeCta";

// Page d'atterrissage des mails de prospection (lien de signature) : version
// courte de la home, centrée sur la démo agent devis. Les clics portent
// l'origine « pme » dans Umami. Non indexée : elle double la home.
export const metadata: Metadata = {
  title: "Testez l'agent devis sur votre métier — Axel Remillat",
  description: "Envoyez une demande client type : l'agent prépare le devis, les questions à poser et la réponse. 2 minutes, sans inscription.",
  robots: { index: false, follow: true },
};

export default function PmePage() {
  return (
    <main>
      <HomeHero
        origine="pme"
        title="Vos devis prêts en une minute, pas en une soirée"
        subtitle="Testez l'agent devis sur votre métier : il chiffre la demande, liste les questions à poser au client et rédige la réponse. Deux minutes, sans inscription."
      />
      <HomeFeaturedDemo origine="pme" />
      <HomeSteps />
      <HomeCta origine="pme" about={false} />
    </main>
  );
}
