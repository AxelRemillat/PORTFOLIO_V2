// Cohérence des chiffres affichés sur la home avec les données du site.
import { test } from "node:test";
import assert from "node:assert/strict";
import { AUTOMATIONS } from "@/components/preuves/demo/automations-data";
import { NB_AUTOMATISATIONS, PROOFS } from "@/components/home/proofs-data";
import { PROOF_STATS } from "@/components/ui/StatCounter";

test("nombre de démos d'automatisation = onglets de /automatisations", () => {
  assert.equal(NB_AUTOMATISATIONS, AUTOMATIONS.length);
});

test("RISE : même nombre de podiums que /parcours", () => {
  const podiums = PROOF_STATS.find((s) => s.label.includes("podiums"))?.value;
  assert.ok(PROOFS.find((p) => p.t === "RISE")?.d.includes(`${podiums} podiums`));
});

test("aucune mention d'alternance ni de jargon dans les preuves", () => {
  const t = JSON.stringify(PROOFS);
  for (const mot of ["alternan", "Docker", "CI/CD", "RAG", "LLM"]) assert.ok(!t.includes(mot), mot);
});
