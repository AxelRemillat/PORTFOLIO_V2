// Cohérence des chiffres affichés sur la home avec les données du site.
import { test } from "node:test";
import assert from "node:assert/strict";
import { AUTOMATIONS } from "@/components/preuves/demo/automations-data";
import { NB_AUTOMATISATIONS, PROOFS } from "@/components/home/proofs-data";
import { PROOFS_EN } from "@/components/home/proofs-data.en";

test("nombre de démos d'automatisation = onglets de /automatisations", () => {
  assert.equal(NB_AUTOMATISATIONS, AUTOMATIONS.length);
});

test("RISE : même nombre de podiums en FR et en EN", () => {
  const fr = PROOFS.find((p) => p.t === "RISE")?.d.match(/(\d+) podiums/)?.[1];
  const en = PROOFS_EN.find((p) => p.t === "RISE")?.d.match(/(\d+) competition podiums/)?.[1];
  assert.ok(fr && fr === en, `${fr} / ${en}`);
});

test("aucune mention d'alternance ni de jargon dans les preuves", () => {
  const t = JSON.stringify(PROOFS);
  for (const mot of ["alternan", "Docker", "CI/CD", "RAG", "LLM"]) assert.ok(!t.includes(mot), mot);
});
