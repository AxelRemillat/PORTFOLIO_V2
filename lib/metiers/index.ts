import type { Metier } from "./types";
import type { DemoLocale } from "@/lib/demo-locale";
import { MENUISERIE } from "./menuiserie";
import { BTP } from "./btp";
import { NEGOCE } from "./negoce";
import { BOULANGERIE } from "./boulangerie";
import { SERVICES } from "./services";
import { MENUISERIE as MENUISERIE_EN } from "./menuiserie.en";
import { BTP as BTP_EN } from "./btp.en";
import { NEGOCE as NEGOCE_EN } from "./negoce.en";
import { BOULANGERIE as BOULANGERIE_EN } from "./boulangerie.en";
import { SERVICES as SERVICES_EN } from "./services.en";

export type { Metier, MetierId, Article, FaqSav } from "./types";

// Ordre d'affichage du sélecteur de métier (agent devis et SAV). Les fiches
// anglaises (*.en.ts) gardent les mêmes ids, réfs, prix et délais.
export const METIERS: Metier[] = [MENUISERIE, BTP, NEGOCE, BOULANGERIE, SERVICES];
export const METIERS_EN: Metier[] = [MENUISERIE_EN, BTP_EN, NEGOCE_EN, BOULANGERIE_EN, SERVICES_EN];

export const METIER_IDS = METIERS.map((m) => m.id);

export const metiersFor = (locale: DemoLocale = "fr"): Metier[] => (locale === "en" ? METIERS_EN : METIERS);

export function getMetier(id: unknown, locale: DemoLocale = "fr"): Metier | null {
  return metiersFor(locale).find((m) => m.id === id) ?? null;
}
