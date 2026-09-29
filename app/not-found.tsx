import Link from "next/link";

export const metadata = { title: "Page introuvable — Axel Remillat", robots: { index: false } };

// 404 en français : deux issues claires (accueil, démos).
export default function NotFound() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-32 text-center">
      <p className="font-mono text-xs tracking-[0.15em] uppercase text-orange mb-4">404 // Page introuvable</p>
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">Cette page n&apos;existe pas (ou plus).</h1>
      <p className="text-lg text-muted mb-10">
        Le lien est peut-être ancien. Repartez de l&apos;accueil, ou testez directement mes démos.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link href="/" className="rounded-full bg-orange px-6 py-3 font-semibold text-bg hover:opacity-90 transition-opacity">
          Retour à l&apos;accueil
        </Link>
        <Link href="/demos" className="rounded-full border border-orange/50 px-6 py-3 font-semibold text-orange hover:border-orange transition-colors">
          Voir les démos
        </Link>
      </div>
    </main>
  );
}
