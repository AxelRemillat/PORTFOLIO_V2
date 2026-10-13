// Agent devis en anglais (/en/agent), sans OpenAI : fiches jumelles fidèles aux
// fiches françaises, prompt et textes en anglais, aucun reste de français.
// Lancer : npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import type OpenAI from "openai";
import { METIERS, METIERS_EN, getMetier } from "@/lib/metiers";
import { calculer_devis, rechercher_articles } from "@/lib/agent/tools";
import { runAgent, type Llm } from "@/lib/agent/run";
import { systemPrompt } from "@/lib/agent/schemas";
import { agentText } from "@/lib/agent/text-locale";
import { AGENT_TEXT_EN } from "@/lib/agent/text.en";
import { AGENT_TEXT_FR } from "@/lib/agent/text";

const EN = agentText("en");
// Mots français courants qui trahiraient un reste non traduit.
const FRENCH = /\b(devis|bonjour|merci|livraison|chiffrer|vous|votre|avec|pour|délai|à confirmer|catalogue)\b/i;

test("fiches anglaises : mêmes ids, réfs, prix, délais, TVA et paliers que le français", () => {
  assert.equal(METIERS_EN.length, METIERS.length);
  METIERS.forEach((fr, i) => {
    const en = METIERS_EN[i];
    assert.equal(en.id, fr.id);
    assert.deepEqual(en.catalogue.map((a) => [a.ref, a.prix_unitaire, a.delai_jours, a.tva ?? null]), fr.catalogue.map((a) => [a.ref, a.prix_unitaire, a.delai_jours, a.tva ?? null]), en.id);
    assert.deepEqual([en.tva, en.remises, en.minimum_ht, en.livraison.frais, en.livraison.franco, en.livraison.delai_jours], [fr.tva, fr.remises, fr.minimum_ht, fr.livraison.frais, fr.livraison.franco, fr.livraison.delai_jours], en.id);
    assert.deepEqual(Object.keys(en.politique), Object.keys(fr.politique), `${en.id} : clés de politique`);
    assert.deepEqual(en.sav.map((s) => s.id), fr.sav.map((s) => s.id), `${en.id} : ids SAV`);
    assert.equal(en.exemples.length, 3);
    assert.equal(en.savExemples.length, 3);
    const texts = [en.label, en.entreprise, en.activite, ...en.exemples.flatMap((e) => [e.label, e.texte]), ...en.catalogue.flatMap((a) => [a.nom, a.description]), ...Object.values(en.politique), ...en.sav.flatMap((s) => [s.question, s.reponse]), ...en.savExemples];
    for (const t of texts) assert.ok(!FRENCH.test(t), `${en.id} : reste de français « ${t} »`);
  });
});

test("getMetier choisit la langue, le français reste le défaut", () => {
  assert.equal(getMetier("btp"), METIERS[1]);
  assert.equal(getMetier("btp", "en"), METIERS_EN[1]);
  assert.equal(getMetier("inconnu", "en"), null);
});

test("la recherche anglaise trouve des articles pour les 2 premiers exemples de chaque métier", () => {
  for (const m of METIERS_EN) {
    for (const ex of m.exemples.slice(0, 2)) {
      const { articles } = rechercher_articles(m, { requete: ex.texte }, EN);
      assert.ok(articles.length > 0, `${m.id} : « ${ex.label} »`);
    }
  }
});

test("prompt système et outils en anglais ; le français reste inchangé par défaut", () => {
  const m = METIERS_EN[0];
  assert.match(systemPrompt(m, EN), /Write in English/);
  assert.ok(!FRENCH.test(systemPrompt(m, EN).replace(/rechercher_articles|verifier_livraison|calculer_devis|infos_entreprise|finaliser|hors_catalogue/g, "")));
  assert.match(systemPrompt(METIERS[0]), /en français, vouvoiement/);
  assert.equal(AGENT_TEXT_FR.trace.ready, "Livrable prêt");
});

test("questions générées en anglais, montants au format €1,750", () => {
  const m = getMetier("negoce", "en")!;
  const d = calculer_devis(m, { lignes: [{ ref: m.catalogue[0].ref, quantite: 1 }], hors_catalogue: [{ designation: "Custom item" }], ville: "Corsica" }, EN);
  assert.ok(d.questions.some((q) => q.includes("“Custom item” is not in our standard catalog")));
  assert.ok(d.questions.some((q) => q.startsWith("Corsica is outside our usual area")));
  assert.equal(AGENT_TEXT_EN.questions.minimum(1750), "Our minimum order is €1,750 excl. VAT: would you like to add to your order?");
  for (const q of d.questions) assert.ok(!FRENCH.test(q), q);
});

test("boucle complète en anglais : trace, résumé et email de repli en anglais", async () => {
  const m = getMetier("btp", "en")!;
  let step = 0;
  const call = (name: string, args: unknown): OpenAI.Chat.ChatCompletionMessage => ({
    role: "assistant", content: "Looking up the catalog.", refusal: null,
    tool_calls: [{ id: `c${step}`, type: "function", function: { name, arguments: JSON.stringify(args) } }],
  });
  const llm: Llm = async () => {
    step++;
    if (step === 1) return call("rechercher_articles", { requete: m.exemples[0].texte });
    if (step === 2) return call("calculer_devis", { lignes: [{ ref: m.catalogue[0].ref, quantite: 20 }], ville: "Lyon" });
    return call("finaliser", { complet: true, email: "", creneaux: [{ jour: "Tuesday", heure: "10am" }] });
  };
  const { trace, result } = await runAgent(m, m.exemples[0].texte, llm, EN);
  const titles = trace.map((t) => t.title);
  assert.deepEqual(titles, ["Reasoning", "Catalog search", "Reasoning", "Quote calculation", "Reasoning", "Deliverable ready"]);
  assert.match(String(trace[1].result), /item\(s\) found/);
  assert.match(String(trace[3].result), /^€[\d,.]+ incl\. VAT/);
  assert.match(result.email, /^Hello,/);
  assert.ok(!FRENCH.test(result.email), result.email);
});
