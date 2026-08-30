// Datasets « Leads SaaS » générés de façon DÉTERMINISTE (PRNG à graine) — ~300
// lignes au total, labellisées via le modèle + un léger bruit (cible historique
// `converti`). Aucune API : le bundle est local et reproductible.
import { logit, logistic } from "./model";

export type Taille = "TPE" | "PME" | "ETI";
export type Secteur = "SaaS" | "Industrie" | "Retail" | "Services";
export type Source = "ads" | "organic" | "referral";

export interface Lead {
  id: string;
  entreprise: string;
  taille: Taille;
  secteur: Secteur;
  source: Source;
  pages_vues: number;
  emails_ouverts: number;
  essai_gratuit: boolean;
  anciennete_jours: number;
  budget_estime: number;
  converti: 0 | 1; // cible historique (pour caler le modèle hors-ligne)
}
export interface Dataset { id: string; label: string; leads: Lead[] }

// mulberry32 : PRNG rapide et déterministe (pas de Math.random → stable au rendu).
function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = <T,>(r: () => number, items: T[], w: number[]): T => {
  let x = r() * w.reduce((a, b) => a + b, 0);
  for (let i = 0; i < items.length; i++) { if ((x -= w[i]) < 0) return items[i]; }
  return items[items.length - 1];
};
const PREFIX = ["Nova", "Atlas", "Orbit", "Vela", "Lumen", "Nord", "Kairos", "Zephyr", "Pyxis", "Onde", "Solis", "Cobalt"];
const SUFFIX = ["Labs", "Tech", "Group", "Digital", "Systems", "Studio", "Cloud", "Data", "Works", "Corp"];

function genDataset(id: string, label: string, n: number, seed: number, tilt: number): Dataset {
  const r = rng(seed);
  const leads: Lead[] = [];
  for (let i = 0; i < n; i++) {
    const taille = pick(r, ["TPE", "PME", "ETI"] as Taille[], [0.5, 0.34, 0.16]);
    const secteur = pick(r, ["SaaS", "Industrie", "Retail", "Services"] as Secteur[], [0.34, 0.24, 0.22, 0.20]);
    const source = pick(r, ["ads", "organic", "referral"] as Source[], [0.45, 0.35, 0.20]);
    const pages_vues = Math.round(2 + r() * 46 * tilt);
    const emails_ouverts = Math.round(r() * Math.min(pages_vues, 26));
    const essai_gratuit = r() < 0.33;
    const anciennete_jours = Math.round(1 + r() * 300);
    const budget_estime = Math.round((2 + r() * 38) * 1000);
    const lead: Lead = { id: `${id.toUpperCase()}-${String(i + 1).padStart(3, "0")}`,
      entreprise: `${pick(r, PREFIX, PREFIX.map(() => 1))} ${pick(r, SUFFIX, SUFFIX.map(() => 1))}`,
      taille, secteur, source, pages_vues, emails_ouverts, essai_gratuit, anciennete_jours, budget_estime, converti: 0 };
    // Label historique : proba (modèle + bruit) → tirage binaire déterministe.
    const p = logistic(logit(lead) + (r() - 0.5) * 0.9);
    lead.converti = r() < p ? 1 : 0;
    leads.push(lead);
  }
  return { id, label, leads };
}

export const DATASETS: Dataset[] = [
  genDataset("saas", "Leads SaaS B2B (Q1)", 165, 0x1a2b3c, 1),
  genDataset("agc", "Leads Agence & Services", 138, 0x9f8e7d, 0.82),
];

export const COLUMNS = [
  "id", "entreprise", "taille", "secteur", "source", "pages_vues",
  "emails_ouverts", "essai_gratuit", "anciennete_jours", "budget_estime", "converti",
];

// Un lead « vierge » éditable par l'utilisateur (valeurs médianes plausibles).
export function blankLead(): Lead {
  return { id: "VOTRE-LEAD", entreprise: "Votre prospect", taille: "PME", secteur: "SaaS",
    source: "referral", pages_vues: 18, emails_ouverts: 7, essai_gratuit: true,
    anciennete_jours: 20, budget_estime: 12000, converti: 0 };
}
