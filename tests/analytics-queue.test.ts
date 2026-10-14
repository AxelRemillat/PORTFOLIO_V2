// File d'attente des événements Umami (Cowork #36) : un événement émis avant le
// chargement du script n'est plus perdu.
import { test } from "node:test";
import assert from "node:assert/strict";
import { flushQueue, pendingEvents, track } from "@/lib/analytics";

type Call = [string, Record<string, string | number> | undefined];
const win = { location: { hostname: "axelremillat.com" } } as Record<string, unknown>;
(globalThis as { window?: unknown }).window = win;

test("script pas encore chargé : l'événement attend au lieu d'être perdu", () => {
  delete win.umami;
  track("arrivee", { canal: "orion", demo: "email", v: "1" });
  assert.equal(pendingEvents().length, 1);
  assert.equal(pendingEvents()[0][0], "arrivee");
});

test("onLoad du script : la file est rejouée dans l'ordre, une seule fois", () => {
  const calls: Call[] = [];
  track("demo_start", { demo: "email", canal: "orion" });
  win.umami = { track: (event: string, data?: Record<string, string | number>) => calls.push([event, data]) };
  flushQueue();
  assert.deepEqual(calls.map((call) => call[0]), ["arrivee", "demo_start"]);
  assert.equal(calls[0][1]?.v, "1");
  assert.equal(calls[0][1]?.lang, "fr");
  assert.equal(pendingEvents().length, 0);
  flushQueue();
  assert.equal(calls.length, 2);
});

test("script chargé : envoi immédiat, rien en attente", () => {
  const calls: Call[] = [];
  win.umami = { track: (event: string, data?: Record<string, string | number>) => calls.push([event, data]) };
  track("cta_rdv", { page: "contact" });
  assert.equal(calls.length, 1);
  assert.equal(pendingEvents().length, 0);
});

test("un script qui jette ne casse jamais la page", () => {
  win.umami = { track: () => { throw new Error("boom"); } };
  assert.doesNotThrow(() => track("sortie", { cible: "linkedin" }));
});

test("la file est bornée (20) : rien ne s'accumule sans script", () => {
  delete win.umami;
  for (let i = 0; i < 50; i += 1) track("sortie", { cible: `x${i}` });
  assert.equal(pendingEvents().length, 20);
});
