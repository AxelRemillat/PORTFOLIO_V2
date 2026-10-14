// Visites de démo venues des mails ORION (Cowork #34) : rien de personnel ne part,
// la route ne fait rien sans secret, et seul le site peut l'appeler.
import { test } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { arrivalDemo, parseOrionVisit, reportOrionVisit, V_KEY } from "@/lib/orion-visits";
import { POST } from "@/app/api/visite-demo/route";

type Sent = { url: string; init: RequestInit };

function fakeBrowser(session: Record<string, string> = {}, local: Record<string, string> = {}) {
  const sent: Sent[] = [];
  const store = (data: Record<string, string>) => ({ getItem: (key: string) => data[key] ?? null, setItem: (key: string, value: string) => void (data[key] = value) });
  (globalThis as Record<string, unknown>).window = { sessionStorage: store(session), localStorage: store(local), location: { pathname: "/", hostname: "axelremillat.com" } };
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    sent.push({ url: String(url), init });
    return new Response(null, { status: 204 });
  }) as typeof fetch;
  return sent;
}

test("corps : seuls demo, v et type passent", () => {
  assert.deepEqual(parseOrionVisit({ demo: "email", v: "3", type: "arrivee", email: "x@y.fr", ip: "1.2.3.4", id: "p1" }), { demo: "email", v: "3", type: "arrivee" });
  assert.equal(parseOrionVisit({ demo: "email", v: "trois", type: "arrivee" }), null);
  assert.equal(parseOrionVisit({ demo: "email", v: "3", type: "achat" }), null);
});

test("démo d'arrivée : ?demo= sinon l'agent devis sur /agent (FR et EN)", () => {
  assert.equal(arrivalDemo("/automatisations", "invoice"), "invoice");
  assert.equal(arrivalDemo("/agent", undefined), "agent");
  assert.equal(arrivalDemo("/en/agent", undefined), "agent");
  assert.equal(arrivalDemo("/offres", undefined), null);
});

test("navigateur : rien ne part hors session ORION, ni pour un navigateur exclu", () => {
  let sent = fakeBrowser();
  reportOrionVisit("demo_start", "email");
  assert.equal(sent.length, 0);
  sent = fakeBrowser({ [V_KEY]: "2" }, { "umami.disabled": "1" });
  reportOrionVisit("demo_start", "email");
  assert.equal(sent.length, 0);
});

test("navigateur : session ORION → { demo, v, type } vers la route du site, sans cookie", () => {
  const sent = fakeBrowser({ [V_KEY]: "2" });
  reportOrionVisit("demo_result", "agent-menuiserie");
  assert.equal(sent.length, 1);
  assert.equal(sent[0].url, "/api/visite-demo");
  assert.equal(sent[0].init.credentials, "omit");
  assert.deepEqual(JSON.parse(String(sent[0].init.body)), { demo: "agent-menuiserie", v: "2", type: "demo_result" });
});

const call = (body: unknown, origin: string | null = "https://axelremillat.com") =>
  new NextRequest("https://axelremillat.com/api/visite-demo", { method: "POST", headers: { "content-type": "application/json", ...(origin ? { origin } : {}) }, body: JSON.stringify(body) });

test("route : secret absent → 204, rien n'est relayé", async () => {
  const sent = fakeBrowser();
  delete process.env.DEMO_VISITS_SECRET;
  const response = await POST(call({ demo: "email", v: "3", type: "arrivee" }));
  assert.equal(response.status, 204);
  assert.equal(sent.length, 0);
});

test("route : appel d'un autre site ou corps invalide → 204, rien n'est relayé", async () => {
  const sent = fakeBrowser();
  process.env.DEMO_VISITS_SECRET = "secret-de-test";
  assert.equal((await POST(call({ demo: "email", v: "3", type: "arrivee" }, "https://ailleurs.example"))).status, 204);
  assert.equal((await POST(call({ demo: "email", v: "3", type: "arrivee" }, null))).status, 204);
  assert.equal((await POST(call({ demo: "email", v: "x", type: "arrivee" }))).status, 204);
  assert.equal(sent.length, 0);
});

test("route : relaie à ORION avec le secret en en-tête, et seulement demo, v, type", async () => {
  const sent = fakeBrowser();
  process.env.DEMO_VISITS_SECRET = "secret-de-test";
  const response = await POST(call({ demo: "invoice", v: "4", type: "demo_start", email: "x@y.fr" }));
  assert.equal(response.status, 204);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].url, "https://orion.axelremillat.com/api/demo-visits");
  assert.equal((sent[0].init.headers as Record<string, string>)["x-demo-visits-secret"], "secret-de-test");
  assert.deepEqual(JSON.parse(String(sent[0].init.body)), { demo: "invoice", v: "4", type: "demo_start" });
  delete process.env.DEMO_VISITS_SECRET;
});
