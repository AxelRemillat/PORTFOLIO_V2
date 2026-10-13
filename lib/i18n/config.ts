/**
 * Langues du site. Le français reste aux URL historiques (SEO, liens Codeur,
 * mails ORION) ; l'anglais vit sous /en avec les mêmes slugs.
 *
 * Module pur : importable par le proxy, le serveur, le client et les tests.
 */

export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

/** Cookie posé par le sélecteur FR | EN : dès qu'il existe, plus aucune redirection automatique. */
export const LOCALE_COOKIE = "lang";
/** Un an, en secondes. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Pays où l'on parle français : départage quand la langue du navigateur est inexploitable. */
export const FRENCH_COUNTRIES = ["FR", "BE", "CH", "LU", "MC"] as const;

/** Open Graph : `og:locale` par langue. */
export const OG_LOCALE: Record<Locale, string> = { fr: "fr_FR", en: "en_US" };

/**
 * L'ANGLAIS EST-IL OUVERT AU PUBLIC ?
 *
 * Tant que les pages ne sont pas traduites, une page /en afficherait du
 * français sous une URL anglaise. `false` coupe donc ce qui pousse un visiteur
 * ou un moteur vers /en : redirection automatique, hreflang, entrées /en du
 * sitemap, et indexation (noindex). Les pages /en restent ouvertes en direct,
 * pour que chacun puisse travailler dessus.
 *
 * Passe à `true` en UNE ligne quand les trois lots (socle + pages, démos,
 * VEGA/pipeline) sont livrés.
 */
export const EN_PUBLIC = false;

export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && (locales as readonly string[]).includes(value);
