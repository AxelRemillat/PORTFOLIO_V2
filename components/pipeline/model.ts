// Modèle de scoring de leads — régression logistique LÉGÈRE et DÉTERMINISTE.
// Poids fixés en dur (entraînés hors-ligne sur les datasets de démo). Scoring
// 100 % client-side : gratuit, instantané, pas d'API, pas de secret.
import type { Lead } from "./leads-data";

export interface Feature { key: string; label: string; value: (l: Lead) => number }

// Feature engineering : one-hot (secteur via taille/source), ratios, normalisations.
export const FEATURES: Feature[] = [
  { key: "essai",    label: "Essai gratuit activé", value: (l) => (l.essai_gratuit ? 1 : 0) },
  { key: "emails",   label: "Emails ouverts",       value: (l) => Math.min(l.emails_ouverts, 30) / 20 },
  { key: "pages",    label: "Pages vues",           value: (l) => Math.min(l.pages_vues, 60) / 30 },
  { key: "budget",   label: "Budget estimé",        value: (l) => Math.min(l.budget_estime, 40000) / 20000 },
  { key: "ancien",   label: "Ancienneté du lead",   value: (l) => Math.min(l.anciennete_jours, 360) / 180 },
  { key: "referral", label: "Source : referral",    value: (l) => (l.source === "referral" ? 1 : 0) },
  { key: "organic",  label: "Source : organic",     value: (l) => (l.source === "organic" ? 1 : 0) },
  { key: "eti",      label: "Taille : ETI",          value: (l) => (l.taille === "ETI" ? 1 : 0) },
  { key: "pme",      label: "Taille : PME",          value: (l) => (l.taille === "PME" ? 1 : 0) },
  { key: "engage",   label: "Ratio d'engagement",   value: (l) => l.emails_ouverts / (l.pages_vues + 1) },
];

// Poids de la régression logistique (fixés hors-ligne).
export const BIAS = -2.15;
export const WEIGHTS: Record<string, number> = {
  essai: 1.65, emails: 1.30, pages: 0.85, budget: 1.05, ancien: -1.35,
  referral: 0.95, organic: 0.35, eti: 0.80, pme: 0.42, engage: 0.90,
};

export const logistic = (z: number) => 1 / (1 + Math.exp(-z));

export function logit(l: Lead): number {
  let z = BIAS;
  for (const f of FEATURES) z += (WEIGHTS[f.key] ?? 0) * f.value(l);
  return z;
}
export function score(l: Lead): number { return logistic(logit(l)); }

export type Bucket = "chaud" | "tiède" | "froid";
export function bucket(p: number): Bucket {
  return p >= 0.66 ? "chaud" : p >= 0.33 ? "tiède" : "froid";
}

// Explicabilité d'UNE ligne : contribution (poids × valeur) de chaque feature.
export function contributions(l: Lead) {
  return FEATURES
    .map((f) => ({ key: f.key, label: f.label, contrib: (WEIGHTS[f.key] ?? 0) * f.value(l) }))
    .sort((a, b) => b.contrib - a.contrib);
}

// Importance GLOBALE des features = |poids| normalisé (0–1).
export function importance() {
  const arr = FEATURES.map((f) => ({ label: f.label, w: Math.abs(WEIGHTS[f.key] ?? 0) }));
  const max = Math.max(...arr.map((a) => a.w)) || 1;
  return arr.map((a) => ({ label: a.label, v: a.w / max })).sort((a, b) => b.v - a.v);
}
