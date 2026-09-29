// Tests de l'agent devis, sans OpenAI : un faux LLM rejoue une séquence d'appels
// d'outils (recherche → calcul → finaliser) sur chaque métier.
// Lancer : npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import type OpenAI from "openai";
import { METIERS, getMetier } from "@/lib/metiers";
import { calculer_devis, rechercher_articles, type DevisCalcule } from "@/lib/agent/tools";
import { runAgent, type Llm } from "@/lib/agent/run";

// Demande typique par métier : mots-clés de recherche, réf attendue, ville.
const CAS = {
  menuiserie: { requete: "fenêtre PVC 100×125", ref: "FEN-PVC-100", ville: "Tours" },
  btp: { requete: "peinture des murs", ref: "PEINT-MUR", ville: "Lille" },
  negoce: { requete: "plaque BA13", ref: "BA13", ville: "Villeurbanne" },
  boulangerie: { requete: "mini-viennoiseries petit-déjeuner", ref: "VIEN-MINI30", ville: "Lyon" },
  services: { requete: "nettoyage bureaux 300 m²", ref: "NET-300", ville: "Paris" },
} as const;

const near = (a: number, b: number) => Math.abs(a - b) < 0.011;

function assertCoherent(d: DevisCalcule) {
  const somme = d.lignes.reduce((s, l) => s + l.montant, 0);
  assert.ok(near(somme, d.sous_total_ht), "Σ lignes = sous-total HT");
  for (const l of d.lignes) assert.ok(near(l.prix_unitaire * l.quantite, l.montant), `montant ${l.ref}`);
  assert.ok(near(d.sous_total_ht - d.remise.montant + d.frais_livraison, d.total_ht), "total HT");
  assert.ok(near(d.tva.reduce((s, t) => s + t.montant, 0), d.tva_montant), "Σ TVA par taux");
  assert.ok(near(d.total_ht + d.tva_montant, d.total_ttc), "HT + TVA = TTC");
  assert.ok(d.total_ttc > d.total_ht, "TTC > HT");
}

// Faux LLM : 1) recherche 2) devis sur les 2 premiers articles trouvés 3) finaliser.
function scripted(requete: string, ville: string): Llm {
  let step = 0;
  const call = (name: string, args: unknown): OpenAI.Chat.ChatCompletionMessage => ({
    role: "assistant", content: `Étape ${step}`, refusal: null,
    tool_calls: [{ id: `c${step}`, type: "function", function: { name, arguments: JSON.stringify(args) } }],
  });
  return async (messages) => {
    step++;
    if (step === 1) return call("rechercher_articles", { requete });
    if (step === 2) {
      const last = messages[messages.length - 1];
      const { articles } = JSON.parse(String(last.content)) as { articles: { ref: string }[] };
      return call("calculer_devis", { lignes: articles.slice(0, 2).map((a) => ({ ref: a.ref, quantite: 30 })), ville });
    }
    return call("finaliser", { complet: true, email: "Bonjour, voici votre devis.", creneaux: [{ jour: "Mardi", heure: "10h" }] });
  };
}

test("chaque métier a un catalogue de 10 à 20 lignes et 3 exemples", () => {
  assert.equal(METIERS.length, 5);
  for (const m of METIERS) {
    assert.ok(m.catalogue.length >= 10 && m.catalogue.length <= 20, `${m.id} : ${m.catalogue.length} lignes`);
    assert.equal(m.exemples.length, 3, m.id);
    assert.equal(new Set(m.catalogue.map((a) => a.ref)).size, m.catalogue.length, `${m.id} : réfs uniques`);
    assert.ok(m.catalogue.every((a) => a.prix_unitaire > 0 && a.unite), `${m.id} : prix et unités`);
    assert.ok(m.sav.length >= 5 && m.savExemples.length === 3, `${m.id} : base SAV`);
  }
});

for (const m of METIERS) {
  const cas = CAS[m.id];

  test(`${m.label} : la recherche trouve ${cas.ref}`, () => {
    const { articles } = rechercher_articles(m, { requete: cas.requete });
    assert.ok(articles.some((a) => a.ref === cas.ref), JSON.stringify(articles.map((a) => a.ref)));
  });

  test(`${m.label} : demande typique → devis non vide et total cohérent`, async () => {
    const { result, trace } = await runAgent(m, m.exemples[0].texte, scripted(cas.requete, cas.ville));
    assert.ok(result.devis, "devis présent");
    assert.ok(result.devis.lignes.length > 0, "au moins une ligne");
    assertCoherent(result.devis);
    assert.equal(result.complet, true);
    assert.ok(result.email.length > 0);
    assert.ok(trace.some((t) => t.fn === "calculer_devis"));
  });

  test(`${m.label} : hors catalogue → devis partiel + questions, jamais un refus`, () => {
    const d = calculer_devis(m, { lignes: [{ ref: cas.ref, quantite: 2 }], hors_catalogue: [{ designation: "Article spécial", quantite: 1 }], ville: cas.ville });
    assert.equal(d.complet, false);
    assert.equal(d.lignes.length, 1);
    assert.equal(d.a_chiffrer.length, 1);
    assert.ok(d.questions.some((q) => q.includes("Article spécial")));
    assertCoherent(d);
  });
}

test("destination hors zone → question au client, pas de frais inventés", () => {
  const m = getMetier("negoce")!;
  const d = calculer_devis(m, { lignes: [{ ref: "OSB-18", quantite: 30 }], ville: "Ajaccio" });
  assert.equal(d.frais_livraison, 0);
  assert.equal(d.complet, false);
  assert.ok(d.questions.some((q) => q.includes("Ajaccio")));
  assertCoherent(d);
});

test("TVA par taux : boulangerie à 5,5 % et service à 10 %", () => {
  const m = getMetier("boulangerie")!;
  const d = calculer_devis(m, { lignes: [{ ref: "PLATEAU-SALE", quantite: 2 }, { ref: "SERVEUR-H", quantite: 3 }], ville: "Lyon" });
  assert.deepEqual(d.tva.map((t) => t.taux).sort(), [0.055, 0.1]);
  assertCoherent(d);
});

test("remise par palier et franco appliqués (négoce)", () => {
  const m = getMetier("negoce")!;
  const d = calculer_devis(m, { lignes: [{ ref: "SABLE-BB", quantite: 25 }], ville: "Grenoble" });
  assert.equal(d.remise.taux, 0.03);
  assert.equal(d.frais_livraison, 0);
  assertCoherent(d);
});

test("référence inconnue → ligne à chiffrer, pas d'erreur", () => {
  const m = getMetier("btp")!;
  const d = calculer_devis(m, { lignes: [{ ref: "PAC-AIR-EAU", quantite: 1 }, { ref: "SDB-COMPLETE", quantite: 1 }], ville: "Bordeaux" });
  assert.equal(d.lignes.length, 1);
  assert.equal(d.a_chiffrer.length, 1);
  assertCoherent(d);
});
