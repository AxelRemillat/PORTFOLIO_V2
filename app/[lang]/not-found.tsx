import Link from "next/link";
import { getLocale } from "@/lib/i18n/server";
import { localizedHref } from "@/lib/i18n/paths";
import { getMessages } from "@/messages";
import LocalizedTitle from "@/components/i18n-title";

// `not-found` ne reçoit pas la langue : titre servi = le français d'origine (inchangé),
// corrigé dans l'onglet par <LocalizedTitle> sur /en. Noindex dans tous les cas.
export const metadata = { title: "Page introuvable — Axel Remillat", robots: { index: false } };

// 404 dans la langue de la page : deux issues claires (accueil, démos).
export default async function NotFound() {
  const locale = await getLocale();
  const t = getMessages(locale).notFound;
  return (
    <main className="max-w-2xl mx-auto px-6 py-32 text-center">
      <LocalizedTitle title={t.metaTitle} />
      <p className="font-mono text-xs tracking-[0.15em] uppercase text-orange mb-4">{t.kicker}</p>
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">{t.title}</h1>
      <p className="text-lg text-muted mb-10">{t.text}</p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link href={localizedHref("/", locale)} className="rounded-full bg-orange px-6 py-3 font-semibold text-bg hover:opacity-90 transition-opacity">
          {t.home}
        </Link>
        <Link href={localizedHref("/demos", locale)} className="rounded-full border border-orange/50 px-6 py-3 font-semibold text-orange hover:border-orange transition-colors">
          {t.demos}
        </Link>
      </div>
    </main>
  );
}
