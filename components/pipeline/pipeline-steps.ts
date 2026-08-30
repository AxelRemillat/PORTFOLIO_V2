// Construit les 5 étapes du pipeline (label + résultat concis + détail technique
// dépliable) à partir d'un run. Pur (déterministe), consommé par PipelineLive.
import type { Lead } from "./leads-data";
import { COLUMNS } from "./leads-data";
import { FEATURES, WEIGHTS, BIAS, importance, type Bucket } from "./model";

export interface Scored extends Lead { proba: number; label: Bucket }
export interface StepData { icon: string; title: string; result: string; detail?: string; tech: string }

export function buildSteps(datasetLabel: string, leads: Lead[], scored: Scored[]): StepData[] {
  const n = leads.length;
  const seen = new Set<string>();
  let dup = 0;
  for (const l of leads) { if (seen.has(l.id)) dup++; else seen.add(l.id); }
  const chaud = scored.filter((s) => s.label === "chaud").length;
  const tiede = scored.filter((s) => s.label === "tiède").length;
  const froid = scored.filter((s) => s.label === "froid").length;
  const top = importance().slice(0, 3).map((i) => i.label).join(" · ");

  return [
    {
      icon: "📥", title: "Ingestion",
      result: `${n} lignes chargées · ${COLUMNS.length} colonnes détectées`,
      detail: datasetLabel,
      tech: `colonnes = [${COLUMNS.join(", ")}]\ncible historique = "converti" (0/1)`,
    },
    {
      icon: "🧹", title: "Nettoyage & validation",
      result: `types normalisés · ${dup} doublon(s) retiré(s) · valeurs bornées`,
      detail: "imputation des manquants, clamp des valeurs aberrantes, déduplication par id",
      tech: `pages_vues     = clamp(x, 0, 60)\nemails_ouverts = clamp(x, 0, 30)\nbudget_estime  = clamp(x, 0, 40000)\nrows           = uniq(rows, "id")`,
    },
    {
      icon: "🧬", title: "Feature engineering",
      result: `${FEATURES.length} features dérivées`,
      detail: "one-hot (taille / source), ratios et normalisations",
      tech: FEATURES.map((f) => `${f.key.padEnd(9)}→ ${f.label}`).join("\n"),
    },
    {
      icon: "📈", title: "Modèle — régression logistique",
      result: `${n} probabilités calculées · poids fixés hors-ligne`,
      detail: "z = biais + Σ (poids · feature) ; proba = 1 / (1 + e^−z)",
      tech: `biais = ${BIAS}\n` + FEATURES.map((f) => `w[${f.key}]${" ".repeat(Math.max(0, 9 - f.key.length))}= ${WEIGHTS[f.key]}`).join("\n"),
    },
    {
      icon: "🎯", title: "Prédictions & explicabilité",
      result: `${chaud} chauds · ${tiede} tièdes · ${froid} froids`,
      detail: `features les plus décisives : ${top}`,
      tech: `label = proba ≥ 0.66 ? "chaud" : proba ≥ 0.33 ? "tiède" : "froid"\nexplicabilité(ligne) = tri décroissant des (poids × valeur)`,
    },
  ];
}
