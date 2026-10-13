import { defaultLocale, type Locale } from "./config";

/**
 * Chemins localisés. Module pur (proxy, serveur, client, tests).
 *
 * Le français vit sans préfixe (« /agent »), l'anglais sous « /en » avec le
 * MÊME slug (« /en/agent »). Query string et ancre sont conservées telles quelles.
 */

/** Sépare « /en/agent?ref=upwork#x » en langue + chemin nu + suffixe (query, ancre). */
export function splitPath(href: string): { locale: Locale; path: string; suffix: string } {
  const cut = href.search(/[?#]/);
  const pathname = cut === -1 ? href : href.slice(0, cut);
  const suffix = cut === -1 ? "" : href.slice(cut);
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return { locale: "en", path: pathname.slice(3) || "/", suffix };
  }
  return { locale: defaultLocale, path: pathname || "/", suffix };
}

/**
 * Lien vers la version `locale` d'un chemin, préfixé ou non : `localizedHref("/agent?demo=email", "en")`
 * → « /en/agent?demo=email » ; `localizedHref("/en", "fr")` → « / ». Les liens absolus
 * (http, mailto, tel) et les ancres seules sont rendus tels quels.
 */
export function localizedHref(href: string, locale: Locale): string {
  if (!href.startsWith("/")) return href;
  const { path, suffix } = splitPath(href);
  if (locale === defaultLocale) return `${path}${suffix}`;
  return `${path === "/" ? `/${locale}` : `/${locale}${path}`}${suffix}`;
}
