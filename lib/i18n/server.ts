import { cache } from "react";
import { defaultLocale, isLocale, type Locale } from "./config";

/**
 * Langue côté SERVEUR, compatible avec le prérendu (aucune lecture d'en-tête).
 *
 * Les pages vivent sous `app/[lang]` : la langue arrive par `params`. Pour ne
 * pas la faire descendre à la main de composant en composant, on la range dans
 * un emplacement propre au rendu en cours (`React.cache`), le même principe que
 * `setRequestLocale` de next-intl.
 *
 * MODE D'EMPLOI (le seul) :
 *   - en tête de CHAQUE `page.tsx` / `layout.tsx` / `generateMetadata` sous `app/[lang]` :
 *       const locale = await getLocale(params);
 *   - n'importe quel composant serveur plus bas : `const locale = await getLocale();`
 *
 * Pourquoi aussi dans la page, pas seulement le layout : layout et page se
 * rendent en parallèle, l'ordre n'est pas garanti. Appelée sans `params` et
 * sans rien de rangé, la fonction rend le français (la langue par défaut).
 */

const slot = cache((): { locale: Locale | null } => ({ locale: null }));

type LangParams = Promise<{ lang: string }> | { lang: string };

export async function getLocale(params?: LangParams): Promise<Locale> {
  if (params) {
    const { lang } = await params;
    const locale = isLocale(lang) ? lang : defaultLocale;
    slot().locale = locale;
    return locale;
  }
  return slot().locale ?? defaultLocale;
}
