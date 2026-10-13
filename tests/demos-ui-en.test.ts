// Libellés anglais des démos /en/agent et /en/automatisations : aucun reste de
// français, mêmes clés que le français (le type le garantit), montants « €1,750.00 ».
// Lancer : npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { AGENT_UI_EN } from "@/components/agent/agent-ui.en";
import { AGENT_UI_FR } from "@/components/agent/agent-ui";
import { DEMO_UI_EN } from "@/components/preuves/demo/demo-ui.en";
import { DEMO_PAGES_EN } from "@/components/demo-kit/demo-pages.en";
import { AUTOMATIONS } from "@/components/preuves/demo/automations-data.en";
import { AUTOMATIONS as AUTOMATIONS_FR } from "@/components/preuves/demo/automations-data";

const FRENCH = /\b(devis|bonjour|merci|démo|démos|réessayez|votre|vous|avec|pour|les|des|une|fichier|facture|envoyer|chiffrer)\b|[éèêàùç]/i;

// Toutes les chaînes d'un objet, fonctions appelées avec des valeurs d'exemple.
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (typeof value === "function") {
    const out = (value as (...a: unknown[]) => unknown)(3, false);
    return typeof out === "string" ? [out] : strings(out);
  }
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

test("libellés anglais de la démo agent : aucun français, montants €1,750.00", () => {
  const { toolMeta, ...ui } = AGENT_UI_EN;
  for (const s of [...strings(ui), ...Object.values(toolMeta).map((m) => m.description)]) assert.ok(!FRENCH.test(s), s);
  assert.equal(AGENT_UI_EN.eur(1750), "€1,750.00");
  assert.match(AGENT_UI_FR.eur(1750), /^1\s750,00\s€$/u); // espaces insécables du format fr-FR
  assert.deepEqual(AGENT_UI_EN.days, ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
});

test("libellés anglais des automatisations et des pages : aucun français", () => {
  const { categories, priorities } = DEMO_UI_EN.email;
  for (const s of [...strings(DEMO_UI_EN), ...strings(DEMO_PAGES_EN)].filter((x) => !Object.keys({ ...categories, ...priorities }).includes(x))) {
    assert.ok(!FRENCH.test(s), s);
  }
  assert.equal(DEMO_UI_EN.email.categories.facturation, "billing");
  assert.equal(DEMO_UI_EN.email.priorities.haute, "high");
});

test("données des 5 démos anglaises : mêmes onglets et routes, textes et exemples anglais", () => {
  assert.deepEqual(AUTOMATIONS.map((a) => [a.id, a.endpoint, a.inputType, a.inputField]), AUTOMATIONS_FR.map((a) => [a.id, a.endpoint, a.inputType, a.inputField]));
  for (const a of AUTOMATIONS) {
    const texts = [a.tabLabel, a.title, a.subtitle, a.inputLabel, a.placeholder ?? "", a.submitLabel ?? "", ...a.nodes.map((n) => n.label), ...Object.values(a.errorMessages ?? {}),
      ...(a.examples?.text ?? []).flatMap((e) => [e.label, e.value]), ...(a.examples?.file ?? []).map((e) => e.label), a.exampleText ?? ""];
    for (const s of texts) assert.ok(!FRENCH.test(s), `${a.id} : ${s}`);
    for (const f of a.examples?.file ?? []) assert.match(f.src, /^\/samples\/en\//, `${a.id} : ${f.src}`);
  }
});
