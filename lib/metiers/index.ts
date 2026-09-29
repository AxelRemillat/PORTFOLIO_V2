import type { Metier } from "./types";
import { MENUISERIE } from "./menuiserie";
import { BTP } from "./btp";
import { NEGOCE } from "./negoce";
import { BOULANGERIE } from "./boulangerie";
import { SERVICES } from "./services";

export type { Metier, MetierId, Article, FaqSav } from "./types";

// Ordre d'affichage du sélecteur de métier (agent devis et SAV).
export const METIERS: Metier[] = [MENUISERIE, BTP, NEGOCE, BOULANGERIE, SERVICES];

export const METIER_IDS = METIERS.map((m) => m.id);

export function getMetier(id: unknown): Metier | null {
  return METIERS.find((m) => m.id === id) ?? null;
}
