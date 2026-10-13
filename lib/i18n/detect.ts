import { FRENCH_COUNTRIES, isLocale, type Locale } from "./config";

/**
 * Choix de la langue à la PREMIÈRE visite. Module pur (proxy + tests).
 *
 * Règles (contrat « portfolio bilingue », 13/10/2026) :
 *   1. cookie `lang` présent → c'est le choix du visiteur : aucune redirection ;
 *   2. aucun en-tête Accept-Language (robots, aperçus de liens) → aucune redirection ;
 *   3. la langue PRINCIPALE du navigateur décide : « fr… » → fr, toute autre → en ;
 *   4. le pays (x-vercel-ip-country) ne départage que si la langue est
 *      inexploitable (« * », vide) : FR, BE, CH, LU, MC → fr, sinon en ;
 *      sans pays non plus → aucune redirection.
 *
 * `null` veut dire « ne rien décider » : on sert l'URL demandée telle quelle.
 */
export interface DetectInput {
  acceptLanguage: string | null;
  country: string | null;
  cookie: string | null;
}

/** Première langue listée, sans pondération ni région : « en-US,fr;q=0.8 » → « en ». */
export function primaryLanguage(acceptLanguage: string): string | null {
  const first = acceptLanguage.split(",")[0]?.split(";")[0]?.trim().toLowerCase() ?? "";
  if (!first || first === "*") return null;
  const language = first.split("-")[0];
  return /^[a-z]{2,3}$/.test(language) ? language : null;
}

export function detectLocale(input: DetectInput): Locale | null {
  if (input.cookie !== null && input.cookie !== undefined) return null;
  if (input.acceptLanguage === null || input.acceptLanguage === undefined) return null;

  const language = primaryLanguage(input.acceptLanguage);
  if (language) return language === "fr" ? "fr" : "en";

  const country = input.country?.trim().toUpperCase();
  if (!country) return null;
  return (FRENCH_COUNTRIES as readonly string[]).includes(country) ? "fr" : "en";
}

/** Le cookie ne compte que s'il porte une langue connue ; une valeur farfelue est ignorée. */
export const cookieLocale = (value: string | undefined | null): Locale | null => (isLocale(value) ? value : null);
