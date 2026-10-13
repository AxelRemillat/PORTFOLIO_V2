import type { Locale } from "@/lib/i18n/config";
import { en } from "./en";
import { fr, type Messages } from "./fr";

export type { Messages };

const dictionaries: Record<Locale, Messages> = { fr, en };

/** Textes d'interface d'une langue (serveur ou client). */
export const getMessages = (locale: Locale): Messages => dictionaries[locale];
