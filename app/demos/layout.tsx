// Layout server-only : conserve le metadata SEO alors que la page est 'use client'.
export const metadata = {
  alternates: { canonical: "/demos" },
  title: "Démos — VEGA, l'IA de présentation d'Axel Remillat",
  description:
    "Démo live : pose n'importe quelle question sur Axel à VEGA, son IA connectée à une base de connaissances RAG.",
};

export default function DemosLayout({ children }: { children: React.ReactNode }) {
  // Cette page cliente n'a pas de <main> propre : on le pose ici.
  return <main>{children}</main>;
}
