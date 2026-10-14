// Relevé Umami des visites ORION (scripts/umami-orion.ts) sur des réponses simulées.
import { test } from "node:test";
import assert from "node:assert/strict";
import { daysBetween, fetchDay, formatReport, parseValues, QUERIES, type Fetcher } from "../scripts/umami-orion-core";

test("jours civils à l'heure de Paris, heure d'été comprise", () => {
  const days = daysBetween("2026-10-24", "2026-10-26");
  assert.deepEqual(days.map((d) => d.day), ["2026-10-24", "2026-10-25", "2026-10-26"]);
  assert.equal(new Date(days[0].startAt).toISOString(), "2026-10-23T22:00:00.000Z"); // UTC+2
  assert.equal(new Date(days[2].startAt).toISOString(), "2026-10-25T23:00:00.000Z"); // UTC+1 après le changement d'heure
  assert.equal(days[0].endAt, days[1].startAt - 1);
});

test("réponse event-data/values → totaux par valeur, entrées invalides ignorées", () => {
  assert.deepEqual(parseValues([{ value: "orion", total: 3 }, { value: "direct", total: 5 }, { value: "", total: 2 }, { value: "orion", total: 1 }]), { orion: 4, direct: 5 });
  assert.deepEqual(parseValues({ error: "x" }), {});
});

test("un jour : un appel par événement et propriété, clé en en-tête, jamais dans l'URL", async () => {
  const calls: { url: string; headers: Record<string, string> }[] = [];
  const answers: Record<string, unknown> = {
    "arrivee/canal": [{ value: "orion", total: 4 }, { value: "linkedin", total: 2 }],
    "arrivee/v": [{ value: "1", total: 3 }, { value: "3", total: 1 }],
    "arrivee/demo": [{ value: "email", total: 3 }, { value: "invoice", total: 2 }],
    "demo_start/canal": [{ value: "orion", total: 1 }],
    "demo_result/canal": [],
  };
  const fetcher: Fetcher = async (url, init) => {
    calls.push({ url, headers: init.headers });
    const params = new URL(url).searchParams;
    return { ok: true, status: 200, json: async () => answers[`${params.get("eventName")}/${params.get("propertyName")}`] };
  };
  const [range] = daysBetween("2026-10-13", "2026-10-13");
  const report = await fetchDay(fetcher, { apiKey: "cle-secrete", websiteId: "site-1" }, range);
  assert.equal(calls.length, QUERIES.length);
  assert.ok(calls.every((call) => call.headers["x-umami-api-key"] === "cle-secrete" && !call.url.includes("cle-secrete")));
  assert.ok(calls[0].url.startsWith("https://api.umami.is/v1/websites/site-1/event-data/values?"));
  assert.deepEqual(report, { day: "2026-10-13", arriveeOrion: 4, byV: { "1": 3, "3": 1 }, byDemo: { email: 3, invoice: 2 }, demoStartOrion: 1, demoResultOrion: 0 });

  const table = formatReport([report, { ...report, day: "2026-10-14", arriveeOrion: 1, byV: { "2": 1 }, demoStartOrion: 0 }]);
  assert.match(table, /^TOTAL\s+\|\s+5 \|/m);
  assert.match(table, /TOTAL.*1:3 3:1 2:1|TOTAL.*1:3 2:1 3:1/);
});

test("refus de l'API : message clair, sans la clé", async () => {
  const fetcher: Fetcher = async () => ({ ok: false, status: 401, json: async () => ({}) });
  const [range] = daysBetween("2026-10-13", "2026-10-13");
  await assert.rejects(fetchDay(fetcher, { apiKey: "cle-secrete", websiteId: "site-1" }, range), (error: Error) => /401/.test(error.message) && !error.message.includes("cle-secrete"));
});
