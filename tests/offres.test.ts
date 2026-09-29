import { test } from "node:test";
import assert from "node:assert/strict";
import { OFFERS, offersForPrompt } from "@/components/offres/offres-data";

test("4 offres, prix attendus, et les prompts de VEGA reprennent la même source", () => {
  assert.deepEqual(OFFERS.map((o) => o.price), ["À partir de 290 €", "À partir de 1 200 €", "À partir de 190 €/mois", "À partir de 1 900 €"]);
  const prompt = offersForPrompt();
  for (const o of OFFERS) assert.ok(prompt.includes(o.name) && prompt.includes(o.price.toLowerCase()), o.name);
});

test("aucun jargon technique dans les offres", () => {
  const texte = JSON.stringify(OFFERS);
  for (const mot of ["Docker", "CI/CD", "RAG", "LLM", "alternan"]) assert.ok(!texte.includes(mot), mot);
});
