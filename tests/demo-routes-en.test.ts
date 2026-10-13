// Routes de démo appelées avec `locale: 'en'` : sans réseau ni OpenAI (fetch
// simulé, y compris pour le SDK OpenAI). L'agent répond en anglais ; les
// webhooks n8n reçoivent `locale` et, pour le SAV, la base anglaise.
// Lancer : npm test
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { POST as agent } from "@/app/api/demo/agent/route";
import { POST as email } from "@/app/api/demo/email-triage/route";
import { POST as sav } from "@/app/api/demo/sav/route";
import { POST as meeting } from "@/app/api/demo/meeting-notes/route";
import { POST as dataClean } from "@/app/api/demo/data-clean/route";
import { POST as invoice } from "@/app/api/demo/invoice/route";
import { getMetier } from "@/lib/metiers";

const FRENCH = /\b(devis|bonjour|merci|livraison|chiffrer|vous|votre|délai|à confirmer)\b/i;
const realFetch = globalThis.fetch;
const sent: { url: string; body: unknown }[] = [];
let ip = 0;

const json = (url: string, body: unknown) =>
  new NextRequest(url, { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": `10.0.0.${++ip}` }, body: JSON.stringify(body) });
const form = (url: string, fields: Record<string, string | File>) => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, v);
  return new NextRequest(url, { method: "POST", headers: { "x-forwarded-for": `10.0.1.${++ip}` }, body: fd });
};

// Faux OpenAI : recherche → devis → finaliser (email vide → repli anglais).
let step = 0;
const toolCall = (name: string, args: unknown) => ({
  id: "x", object: "chat.completion", created: 0, model: "fake",
  choices: [{ index: 0, finish_reason: "tool_calls", message: { role: "assistant", content: "Checking the catalog.", tool_calls: [{ id: `c${step}`, type: "function", function: { name, arguments: JSON.stringify(args) } }] } }],
});

before(() => {
  Object.assign(process.env, {
    OPENAI_API_KEY: "test", DEMO_AGENT_ENABLED: "true", DEMO_EMAIL_TRIAGE_ENABLED: "true", DEMO_SAV_ENABLED: "true",
    DEMO_MEETING_ENABLED: "true", DEMO_DATACLEAN_ENABLED: "true", DEMO_INVOICE_ENABLED: "true",
    N8N_EMAIL_TRIAGE_WEBHOOK_URL: "https://n8n.test/email", N8N_SAV_WEBHOOK_URL: "https://n8n.test/sav", N8N_MEETING_WEBHOOK_URL: "https://n8n.test/meeting",
    N8N_DATACLEAN_WEBHOOK_URL: "https://n8n.test/clean", N8N_INVOICE_WEBHOOK_URL: "https://n8n.test/invoice", N8N_DEMO_SECRET: "s",
  });
  delete process.env.UPSTASH_REDIS_REST_URL;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input instanceof Request ? input.url : input);
    const raw = init?.body ?? (input instanceof Request ? await input.text() : undefined);
    const body = typeof raw === "string" ? JSON.parse(raw) : raw instanceof FormData ? Object.fromEntries(raw.entries()) : null;
    sent.push({ url, body });
    if (url.includes("openai")) {
      step++;
      const m = getMetier("btp", "en")!;
      const reply = step === 1 ? toolCall("rechercher_articles", { requete: "wall painting" })
        : step === 2 ? toolCall("calculer_devis", { lignes: [{ ref: m.catalogue[3].ref, quantite: 40 }], ville: "Lyon" })
        : toolCall("finaliser", { complet: true, email: "", creneaux: [{ jour: "Tuesday", heure: "10am" }] });
      return new Response(JSON.stringify(reply), { status: 200, headers: { "content-type": "application/json" } });
    }
    return new Response(JSON.stringify({ ok: true, echo: true }), { status: 200, headers: { "content-type": "application/json" } });
  }) as typeof fetch;
});
after(() => { globalThis.fetch = realFetch; });

const lastTo = (path: string) => [...sent].reverse().find((s) => s.url.endsWith(path))?.body as Record<string, unknown>;

test("/api/demo/agent en anglais : trace, devis et email en anglais, aucun reste de français", async () => {
  const res = await agent(json("http://x/api/demo/agent", { demande: "Please quote painting for 40 m² of walls in Lyon.", metier: "btp", locale: "en" }));
  const data = await res.json();
  assert.equal(data.ok, true, JSON.stringify(data));
  assert.deepEqual(data.trace.map((t: { title: string }) => t.title), ["Reasoning", "Catalog search", "Reasoning", "Quote calculation", "Reasoning", "Deliverable ready"]);
  assert.match(data.result.email, /^Hello,/);
  assert.equal(data.result.devis.lignes[0].designation, getMetier("btp", "en")!.catalogue[3].nom);
  for (const t of [JSON.stringify(data.trace.map((x: { title: string; result?: string }) => [x.title, x.result])), data.result.email, ...data.result.questions]) assert.ok(!FRENCH.test(t), t);
  const system = (lastTo("/chat/completions")?.messages as { role: string; content: string }[])[0].content;
  assert.match(system, /Write in English/);
});

test("/api/demo/agent sans locale : français inchangé", async () => {
  step = 0;
  const res = await agent(json("http://x/api/demo/agent", { demande: "Peinture de 40 m² de murs à Lyon", metier: "btp" }));
  const data = await res.json();
  assert.equal(data.trace[1].title, "Recherche catalogue");
  assert.match(data.result.email, /^Bonjour,/);
});

test("/api/demo/sav en anglais : la base SAV transmise à n8n est l'anglaise, avec locale", async () => {
  await sav(json("http://x/api/demo/sav", { question: "Do you offer a warranty?", metier: "btp", locale: "en" }));
  const body = lastTo("/sav");
  assert.equal(body.locale, "en");
  assert.equal(body.entreprise, getMetier("btp", "en")!.entreprise);
  assert.deepEqual(body.base, getMetier("btp", "en")!.sav);
});

test("routes n8n : `locale` transmis (JSON et formulaires), 'fr' par défaut", async () => {
  await email(json("http://x/api/demo/email-triage", { email_text: "Hi, my order is late.", locale: "en" }));
  assert.equal(lastTo("/email").locale, "en");
  await email(json("http://x/api/demo/email-triage", { email_text: "Bonjour, ma commande est en retard." }));
  assert.equal(lastTo("/email").locale, "fr");
  await meeting(json("http://x/api/demo/meeting-notes", { transcript_text: "Weekly sync. Decision: ship Friday.", locale: "en" }));
  assert.equal(lastTo("/meeting").locale, "en");
  await meeting(form("http://x/api/demo/meeting-notes", { audio: new File([new Uint8Array([1, 2, 3])], "a.mp3", { type: "audio/mpeg" }), locale: "en" }));
  assert.equal(lastTo("/meeting").locale, "en");
  await dataClean(form("http://x/api/demo/data-clean", { file: new File(["name,email\nAnn,ann@example.com\n"], "c.csv", { type: "text/csv" }), locale: "en" }));
  assert.equal(lastTo("/clean").locale, "en");
  await invoice(form("http://x/api/demo/invoice", { file: new File([new Uint8Array([137, 80, 78, 71])], "i.png", { type: "image/png" }), locale: "en" }));
  assert.equal(lastTo("/invoice").locale, "en");
});
