// /pipeline, /ops et fenêtres « preuves » en anglais : mêmes clés que le français,
// aucun reste de français, le modèle et ses scores inchangés. Aucun réseau.
// Lancer : npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { PIPELINE_LABELS, pipelineLabels } from "@/components/pipeline/labels";
import { PIPELINE_LABELS_EN } from "@/components/pipeline/labels.en";
import { DATASETS, blankLead } from "@/components/pipeline/leads-data";
import { FEATURES, bucket, score } from "@/components/pipeline/model";
import { buildSteps, type Scored } from "@/components/pipeline/pipeline-steps";
import { ARCHI } from "@/components/preuves/archi/archi-data";
import { ARCHI as ARCHI_EN } from "@/components/preuves/archi/archi-data.en";
import { OPS_METRICS, OPS_TEXT } from "@/app/[lang]/ops/ops-data";
import { OPS_METRICS as OPS_METRICS_EN, OPS_TEXT as OPS_TEXT_EN } from "@/app/[lang]/ops/ops-data.en";

// Accents et mots français courants. « Source », « Label », « Score », « SaaS » existent en anglais.
const FRENCH = /[àâçéèêëîïôûùœ]|(^|[^\p{L}])(les|des|une|avec|pour|vous|votre|chauds?|tièdes?|froids?|lignes|colonnes|taille|secteur|essai|ancienneté)(?![\p{L}])/iu;

const shape = (o: object): string[] =>
  Object.entries(o).flatMap(([k, v]) => (v && typeof v === "object" && !Array.isArray(v) ? shape(v).map((s) => `${k}.${s}`) : [k])).sort();
const strings = (o: unknown): string[] =>
  typeof o === "string" ? [o] : typeof o === "function" ? [String((o as (...a: number[]) => unknown)(3, 4, 5))] : o && typeof o === "object" ? Object.values(o).flatMap(strings) : [];

const scoreAll = (leads: ReturnType<typeof blankLead>[]): Scored[] => leads.map((l) => ({ ...l, proba: score(l), label: bucket(score(l)) }));

test("pipeline : mêmes clés en anglais, toutes les features et jeux de données libellés", () => {
  assert.deepEqual(shape(PIPELINE_LABELS_EN), shape(PIPELINE_LABELS));
  for (const f of FEATURES) assert.ok(PIPELINE_LABELS_EN.features[f.key], f.key);
  for (const d of DATASETS) assert.ok(PIPELINE_LABELS_EN.datasets[d.id], d.id);
  assert.equal(pipelineLabels("en"), PIPELINE_LABELS_EN);
  assert.equal(pipelineLabels("fr"), PIPELINE_LABELS);
});

test("pipeline : aucun reste de français dans les textes anglais", () => {
  for (const text of strings(PIPELINE_LABELS_EN).filter((s) => !s.includes('"converti"'))) assert.ok(!FRENCH.test(text), text);
});

test("pipeline : le français reprend le texte d'origine (aucun changement visible)", () => {
  assert.equal(PIPELINE_LABELS.features.essai, FEATURES.find((f) => f.key === "essai")?.label);
  for (const f of FEATURES) assert.equal(PIPELINE_LABELS.features[f.key], f.label, f.key);
  for (const d of DATASETS) assert.equal(PIPELINE_LABELS.datasets[d.id], d.label, d.id);
  assert.equal(PIPELINE_LABELS.money(12000), `${(12000).toLocaleString("fr-FR")} €`);
  assert.deepEqual(blankLead(PIPELINE_LABELS.blank), blankLead());
});

test("pipeline : montants anglais « €12,000 », lead vierge anglais, scores identiques", () => {
  assert.equal(PIPELINE_LABELS_EN.money(12000), "€12,000");
  const en = blankLead(PIPELINE_LABELS_EN.blank);
  assert.equal(en.entreprise, "Your prospect");
  assert.equal(score(en), score(blankLead()), "la langue ne change pas le score");
});

test("pipeline : étapes en anglais, mêmes chiffres qu'en français", () => {
  const leads = [blankLead(PIPELINE_LABELS_EN.blank), ...DATASETS[0].leads];
  const scored = scoreAll(leads);
  const en = buildSteps(PIPELINE_LABELS_EN.datasets.saas, leads, scored, PIPELINE_LABELS_EN);
  const fr = buildSteps(DATASETS[0].label, leads, scored);
  assert.equal(en.length, fr.length);
  for (const step of en) {
    for (const text of [step.title, step.result, step.detail ?? ""]) assert.ok(!FRENCH.test(text), text);
  }
  const digits = (s: string) => s.match(/\d+/g)?.join(",");
  en.forEach((step, i) => assert.equal(digits(step.result), digits(fr[i].result), step.title));
});

test("preuves : schémas d'architecture anglais, mêmes étapes", () => {
  assert.deepEqual(Object.keys(ARCHI_EN).sort(), Object.keys(ARCHI).sort());
  for (const [slug, archi] of Object.entries(ARCHI_EN)) {
    assert.equal(archi.flow.length, ARCHI[slug].flow.length, slug);
    assert.equal(archi.guards?.length ?? 0, ARCHI[slug].guards?.length ?? 0, slug);
    for (const text of strings(archi)) assert.ok(!FRENCH.test(text), `${slug} : ${text}`);
  }
});

test("preuves : textes des fenêtres anglais, mêmes structures", async () => {
  const { WINDOWS_TEXT_FR } = await import("@/components/preuves/windows/windows-text");
  const { WINDOWS_TEXT_EN } = await import("@/components/preuves/windows/windows-text.en");
  assert.deepEqual(shape(WINDOWS_TEXT_EN), shape(WINDOWS_TEXT_FR));
  for (const k of Object.keys(WINDOWS_TEXT_FR) as (keyof typeof WINDOWS_TEXT_FR)[]) {
    assert.equal(WINDOWS_TEXT_EN[k].flow.length, WINDOWS_TEXT_FR[k].flow.length, k);
  }
  for (const text of strings(WINDOWS_TEXT_EN)) assert.ok(!FRENCH.test(text), text);
});

test("ops : métriques et textes anglais, mêmes ids", () => {
  assert.deepEqual(OPS_METRICS_EN.map((m) => m.id), OPS_METRICS.map((m) => m.id));
  assert.deepEqual(Object.keys(OPS_TEXT_EN).sort(), Object.keys(OPS_TEXT).sort());
  for (const text of [...strings(OPS_METRICS_EN.map(({ label, detail }) => ({ label, detail }))), ...strings(OPS_TEXT_EN)]) assert.ok(!FRENCH.test(text), text);
});
