import { isLocale, type Locale } from "@/lib/i18n/config";

// Langue d'une route de démo : le corps (ou le formulaire) porte `locale`,
// 'fr' par défaut. Toute autre valeur retombe sur le français.
export type DemoLocale = Locale;

export const demoLocale = (value: unknown): DemoLocale => (isLocale(value) ? value : "fr");
