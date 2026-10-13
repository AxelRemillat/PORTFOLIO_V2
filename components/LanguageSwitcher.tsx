"use client";

import type { MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, locales, type Locale } from "@/lib/i18n/config";
import { useLocale, useMessages } from "@/lib/i18n/client";
import { localizedHref } from "@/lib/i18n/paths";
import { FlagFr, FlagGb } from "./Flags";

const FLAGS: Record<Locale, () => React.JSX.Element> = { fr: FlagFr, en: FlagGb };

/**
 * « FR | EN », en haut à droite, desktop ET mobile (jamais caché dans le burger).
 *
 * Un clic pose le cookie `lang` pour un an — plus aucune redirection
 * automatique ensuite — et ouvre la page équivalente EN GARDANT la query
 * string (?ref, ?demo, ?v, ?moi).
 *
 * La query est lue au clic dans `window.location` plutôt que par
 * `useSearchParams` : ce hook ferait basculer tout l'arbre au-dessus en rendu
 * côté client et casserait le prérendu des pages.
 */
export default function LanguageSwitcher() {
  const pathname = usePathname() || "/";
  const current = useLocale();
  const t = useMessages().switcher;

  const go = (target: Locale) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.cookie = `${LOCALE_COOKIE}=${target}; Max-Age=${LOCALE_COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
    const { search, hash } = window.location;
    window.location.assign(localizedHref(`${pathname}${search}${hash}`, target));
  };

  return (
    <nav aria-label={t.label} className="nv-lang">
      {locales.map((locale, index) => {
        const Flag = FLAGS[locale];
        return (
        <span key={locale} className="nv-lang-item">
          {index > 0 && <span aria-hidden className="nv-lang-sep">|</span>}
          <a
            href={localizedHref(pathname, locale)}
            hrefLang={locale}
            lang={locale}
            onClick={go(locale)}
            aria-current={locale === current ? "true" : undefined}
            aria-label={locale === "fr" ? t.toFrench : t.toEnglish}
            className={locale === current ? "nv-lang-on" : undefined}
          >
            <Flag />
            {locale.toUpperCase()}
          </a>
        </span>
        );
      })}
    </nav>
  );
}
