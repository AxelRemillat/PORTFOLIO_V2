// Attribution des canaux et exclusion d'un navigateur, sans navigateur :
// `resolveArrival` et `readOptOut` sont du code pur, on les éprouve pour de
// vrai au lieu de cliquer une fois et de croire que ça tient.
// Lancer : npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { CHANNELS, readOptOut, resolveArrival } from "@/lib/analytics";

// `resolveArrival` lit `window.location.hostname` pour écarter le referrer
// interne : on le pose, c'est la seule dépendance au navigateur.
(globalThis as { window?: unknown }).window = { location: { hostname: "axelremillat.com" } };

test("?ref= fait foi et gagne sur tout le reste", () => {
  for (const canal of CHANNELS) {
    assert.equal(resolveArrival(`?ref=${canal}`, "https://www.google.com/").canal, canal);
  }
  // Même avec un marqueur ORION et un referrer, le ?ref= posé à la main gagne.
  assert.equal(resolveArrival("?ref=cv&demo=email&v=2", "https://www.linkedin.com/feed/").canal, "cv");
});

test("un ?ref= inconnu devient « autre », jamais une valeur inventée", () => {
  assert.equal(resolveArrival("?ref=tiktok", "").canal, "autre");
  assert.equal(resolveArrival("?ref=", "").canal, "direct");
});

test("le marqueur des mails ORION vaut le canal orion, avec demo et v", () => {
  const arrival = resolveArrival("?demo=invoice&v=2", "");
  assert.equal(arrival.canal, "orion");
  assert.equal(arrival.demo, "invoice");
  assert.equal(arrival.v, "2");
});

test("?demo= seul ne suffit pas : c'est aussi la navigation interne du site", () => {
  assert.equal(resolveArrival("?demo=email", "").canal, "direct");
});

test("le referrer n'est retenu que s'il est clair", () => {
  assert.equal(resolveArrival("", "https://www.linkedin.com/feed/").canal, "linkedin");
  assert.equal(resolveArrival("", "https://www.codeur.com/projects/x").canal, "codeur");
  assert.equal(resolveArrival("", "https://www.bing.com/search?q=x").canal, "autre");
  // Navigation interne : ce n'est pas une arrivée depuis un canal.
  assert.equal(resolveArrival("", "https://axelremillat.com/offres").canal, "direct");
  assert.equal(resolveArrival("", "").canal, "direct");
  assert.equal(resolveArrival("", "pas-une-url").canal, "direct");
});

test("?moi= n'agit que s'il est explicite", () => {
  assert.equal(readOptOut("?moi=1"), true);
  assert.equal(readOptOut("?moi=0"), false);
  assert.equal(readOptOut("?moi=oui"), null);
  assert.equal(readOptOut("?ref=linkedin"), null);
  assert.equal(readOptOut(""), null);
});

test("les paramètres existants du site passent sans être altérés", () => {
  // Un lien de mail ORION : il doit continuer d'ouvrir la bonne démo.
  const arrival = resolveArrival("?demo=dataclean&v=5", "");
  assert.equal(arrival.demo, "dataclean");
  assert.equal(arrival.v, "5");
});
