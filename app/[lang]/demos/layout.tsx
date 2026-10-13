import { pageMetadata } from "@/lib/i18n/seo";
// Layout server-only : conserve le metadata SEO alors que la page est 'use client'.
export const generateMetadata = pageMetadata("/demos", (locale) =>
  locale === "en"
    ? {
        title: "Live demo: VEGA, Axel Remillat's AI assistant",
        description: "Live demo: ask VEGA anything about Axel's work. An AI assistant connected to a RAG knowledge base, with a voice.",
      }
    : {
        title: "Démos — VEGA, l'IA de présentation d'Axel Remillat",
        description:
          "Démo live : pose n'importe quelle question sur Axel à VEGA, son IA connectée à une base de connaissances RAG.",
      },
);

export default function DemosLayout({ children }: { children: React.ReactNode }) {
  // Cette page cliente n'a pas de <main> propre : on le pose ici.
  return <main>{children}</main>;
}
