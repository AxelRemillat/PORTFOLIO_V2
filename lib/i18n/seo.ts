import type { Metadata } from "next";
import { EN_PUBLIC, OG_LOCALE, type Locale } from "./config";
import { localizedHref } from "./paths";
import { getLocale } from "./server";

/**
 * SEO bilingue : canonical PAR LANGUE, hreflang fr / en / x-default (= fr).
 *
 * Avant (13/10/2026), chaque page fixait `canonical: "/agent"` en dur : rendue
 * sous /en, elle aurait déclaré la version française comme seule officielle,
 * et Google aurait écarté l'anglaise. Tant que l'anglais n'est pas public
 * (`EN_PUBLIC`), /en est en noindex et les hreflang restent muets.
 */
export function alternatesFor(path: string, locale: Locale): Metadata["alternates"] {
  return {
    canonical: localizedHref(path, locale),
    ...(EN_PUBLIC
      ? { languages: { fr: localizedHref(path, "fr"), en: localizedHref(path, "en"), "x-default": localizedHref(path, "fr") } }
      : {}),
  };
}

type LangParams = { params: Promise<{ lang: string }> };

/**
 * `generateMetadata` d'une page, à la place de `export const metadata` :
 *
 *   export const generateMetadata = pageMetadata("/agent", (locale) => ({
 *     title: locale === "en" ? "…" : "…",
 *   }));
 *
 * Ajoute canonical + hreflang, `og:locale`, et le noindex de /en tant que
 * l'anglais n'est pas ouvert.
 */
export function pageMetadata(path: string, meta: Metadata | ((locale: Locale) => Metadata)) {
  return async ({ params }: LangParams): Promise<Metadata> => {
    const locale = await getLocale(params);
    const base = typeof meta === "function" ? meta(locale) : meta;
    return {
      ...base,
      alternates: alternatesFor(path, locale),
      // Un `openGraph` de page REMPLACE celui du layout (fusion clé par clé) : on n'en crée
      // pas, on complète seulement celui que la page définit déjà. Sinon le layout s'en charge.
      ...(base.openGraph ? { openGraph: { ...base.openGraph, locale: OG_LOCALE[locale] } } : {}),
      ...(locale === "en" && !EN_PUBLIC ? { robots: { index: false, follow: true } } : {}),
    };
  };
}
