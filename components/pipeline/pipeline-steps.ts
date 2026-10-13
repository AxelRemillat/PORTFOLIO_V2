// Construit les 5 étapes du pipeline (label + résultat concis + détail technique
// dépliable) à partir d'un run. Pur (déterministe), consommé par PipelineLive.
import type { Lead } from "./leads-data";
import { COLUMNS } from "./leads-data";
import { FEATURES, WEIGHTS, BIAS, importance, type Bucket } from "./model";
import { PIPELINE_LABELS, type PipelineLabels } from "./labels";

export interface Scored extends Lead { proba: number; label: Bucket }
export interface StepData { icon: string; title: string; result: string; detail?: string; tech: string }

export function buildSteps(datasetLabel: string, leads: Lead[], scored: Scored[], L: PipelineLabels = PIPELINE_LABELS): StepData[] {
  const t = L.steps;
  const n = leads.length;
  const seen = new Set<string>();
  let dup = 0;
  for (const l of leads) { if (seen.has(l.id)) dup++; else seen.add(l.id); }
  const chaud = scored.filter((s) => s.label === "chaud").length;
  const tiede = scored.filter((s) => s.label === "tiède").length;
  const froid = scored.filter((s) => s.label === "froid").length;
  const top = importance().slice(0, 3).map((i) => L.features[i.key] ?? i.label).join(" · ");

  return [
    {
      icon: "📥", title: t.ingest.title,
      result: t.ingest.result(n, COLUMNS.length),
      detail: datasetLabel,
      tech: t.ingest.tech(COLUMNS.join(", ")),
    },
    {
      icon: "🧹", title: t.clean.title,
      result: t.clean.result(dup),
      detail: t.clean.detail,
      tech: `pages_vues     = clamp(x, 0, 60)\nemails_ouverts = clamp(x, 0, 30)\nbudget_estime  = clamp(x, 0, 40000)\nrows           = uniq(rows, "id")`,
    },
    {
      icon: "🧬", title: t.features.title,
      result: t.features.result(FEATURES.length),
      detail: t.features.detail,
      tech: FEATURES.map((f) => `${f.key.padEnd(9)}→ ${L.features[f.key] ?? f.label}`).join("\n"),
    },
    {
      icon: "📈", title: t.model.title,
      result: t.model.result(n),
      detail: "z = biais + Σ (poids · feature) ; proba = 1 / (1 + e^−z)",
      tech: `biais = ${BIAS}\n` + FEATURES.map((f) => `w[${f.key}]${" ".repeat(Math.max(0, 9 - f.key.length))}= ${WEIGHTS[f.key]}`).join("\n"),
    },
    {
      icon: "🎯", title: t.predict.title,
      result: t.predict.result(chaud, tiede, froid),
      detail: t.predict.detail(top),
      tech: t.predict.tech,
    },
  ];
}
