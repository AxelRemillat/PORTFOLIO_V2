// Socle bilingue : détection de la langue, chemins localisés, parité des
// textes fr / en. Code pur, éprouvé sans navigateur ni serveur.
// Lancer : npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { detectLocale, primaryLanguage } from "@/lib/i18n/detect";
import { localizedHref, splitPath } from "@/lib/i18n/paths";
import { fr } from "@/messages/fr";
import { en } from "@/messages/en";

const visit = (acceptLanguage: string | null, country: string | null = null, cookie: string | null = null) =>
  detectLocale({ acceptLanguage, country, cookie });

test("navigateur français → fr, anglais → en", () => {
  assert.equal(visit("fr-FR,fr;q=0.9,en;q=0.8"), "fr");
  assert.equal(visit("fr"), "fr");
  assert.equal(visit("en-US,en;q=0.9"), "en");
});

test("toute autre langue principale → en (le site n'a que fr et en)", () => {
  assert.equal(visit("de-DE,de;q=0.9"), "en");
  assert.equal(visit("es"), "en");
});

test("navigateur anglais EN FRANCE : la langue décide, pas le pays", () => {
  assert.equal(visit("en-GB,en;q=0.9", "FR"), "en");
  // Et l'inverse : un francophone à l'étranger garde le français.
  assert.equal(visit("fr-CA", "US"), "fr");
});

test("c'est la langue PRINCIPALE qui compte, pas une langue secondaire mieux notée", () => {
  assert.equal(primaryLanguage("en-US,fr;q=0.9"), "en");
  assert.equal(visit("en-US,fr;q=0.9"), "en");
});

test("aucun en-tête Accept-Language (robots, aperçus) → aucune redirection", () => {
  assert.equal(visit(null), null);
  assert.equal(visit(null, "US"), null);
});

test("langue inexploitable : le pays départage (FR, BE, CH, LU, MC → fr)", () => {
  for (const country of ["FR", "BE", "CH", "LU", "MC", "fr"]) assert.equal(visit("*", country), "fr", country);
  assert.equal(visit("*", "US"), "en");
  assert.equal(visit("", "DE"), "en");
  // Ni langue ni pays : on ne décide rien.
  assert.equal(visit("*", null), null);
});

test("cookie `lang` présent → plus aucune redirection automatique, quelle que soit sa valeur", () => {
  assert.equal(visit("en-US", "US", "fr"), null);
  assert.equal(visit("fr-FR", "FR", "en"), null);
  assert.equal(visit("en-US", null, "valeur-inconnue"), null);
});

test("localizedHref : français sans préfixe, anglais sous /en, même slug", () => {
  assert.equal(localizedHref("/", "en"), "/en");
  assert.equal(localizedHref("/agent", "en"), "/en/agent");
  assert.equal(localizedHref("/en/agent", "fr"), "/agent");
  assert.equal(localizedHref("/en", "fr"), "/");
  assert.equal(localizedHref("/agent", "fr"), "/agent");
  // Idempotent : déjà en anglais, on ne double pas le préfixe.
  assert.equal(localizedHref("/en/agent", "en"), "/en/agent");
});

test("la query string et l'ancre sont conservées (?ref, ?demo, ?v, ?moi)", () => {
  assert.equal(localizedHref("/agent?ref=upwork", "en"), "/en/agent?ref=upwork");
  assert.equal(localizedHref("/automatisations?demo=email&v=2#essai", "en"), "/en/automatisations?demo=email&v=2#essai");
  assert.equal(localizedHref("/en/automatisations?demo=email&moi=1", "fr"), "/automatisations?demo=email&moi=1");
  assert.equal(localizedHref("/?ref=cv", "en"), "/en?ref=cv");
  assert.equal(localizedHref("/en?ref=cv", "fr"), "/?ref=cv");
});

test("liens externes et ancres seules : rendus tels quels", () => {
  assert.equal(localizedHref("https://calendar.app.google/x", "en"), "https://calendar.app.google/x");
  assert.equal(localizedHref("mailto:hello@example.com", "en"), "mailto:hello@example.com");
  assert.equal(localizedHref("#contact", "en"), "#contact");
});

test("splitPath : un chemin qui commence par « en » n'est pas pris pour /en", () => {
  assert.deepEqual(splitPath("/entreprise"), { locale: "fr", path: "/entreprise", suffix: "" });
  assert.deepEqual(splitPath("/en/projets/vega?x=1"), { locale: "en", path: "/projets/vega", suffix: "?x=1" });
});

test("messages : en a EXACTEMENT les clés de fr (aussi vérifié par tsc)", () => {
  const keys = (value: unknown, prefix = ""): string[] =>
    Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
      typeof child === "object" && child !== null ? keys(child, `${prefix}${key}.`) : [`${prefix}${key}`],
    );
  assert.deepEqual(keys(en).sort(), keys(fr).sort());
});

test("messages : aucune valeur anglaise vide", () => {
  const values = (value: unknown): string[] =>
    Object.values(value as Record<string, unknown>).flatMap((child) => (typeof child === "string" ? [child] : values(child)));
  assert.ok(values(en).every((text) => text.trim().length > 0));
});
