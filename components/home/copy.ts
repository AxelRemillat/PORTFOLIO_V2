import type { Locale } from "@/lib/i18n/config";
import { HOME_FR, type HomeCopy } from "./home-copy";
import { HOME_EN } from "./home-copy.en";
import { PROOFS } from "./proofs-data";
import { PROOFS_EN } from "./proofs-data.en";

/** Textes de l'accueil dans la langue de la page. */
export const homeCopy = (locale: Locale): HomeCopy => (locale === "en" ? HOME_EN : HOME_FR);

/** Preuves de l'accueil dans la langue de la page. */
export const proofsFor = (locale: Locale): typeof PROOFS => (locale === "en" ? PROOFS_EN : PROOFS);
