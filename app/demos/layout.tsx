// Layout server-only : conserve le metadata SEO alors que la page est 'use client'.
export const metadata = {
  title: "Démos — VEGA, l'IA de présentation d'Axel Remillat",
  description:
    "Démo live : pose n'importe quelle question sur Axel à VEGA, son IA connectée à une base de connaissances RAG.",
};

export default function DemosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
