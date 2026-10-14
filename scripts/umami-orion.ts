// Relevé Umami des visites venues des mails ORION (Cowork #32) — LECTURE SEULE.
//
//   npx tsx scripts/umami-orion.ts                         # depuis le 09/10/2026, jusqu'à aujourd'hui
//   npx tsx scripts/umami-orion.ts --depuis 2026-10-12 --jusqua 2026-10-20
//
// Lit UMAMI_API_KEY et UMAMI_WEBSITE_ID dans .env.local ; s'ils manquent, explique
// où les créer et s'arrête. Sort, par jour (heure de Paris) : les arrivées
// canal=orion, leur ventilation par v et par demo, puis demo_start et
// demo_result canal=orion. Aucune donnée personnelle : seulement des totaux.
import { existsSync, readFileSync } from "node:fs";
import { daysBetween, fetchDay, formatReport, MISSING_KEY_HELP, SINCE_DEFAULT, type Fetcher } from "./umami-orion-core";

for (const line of existsSync(".env.local") ? readFileSync(".env.local", "utf8").split(/\r?\n/) : []) {
  const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
  if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
}

const arg = (name: string) => (process.argv.includes(name) ? process.argv[process.argv.indexOf(name) + 1] : undefined);
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date());

async function main(): Promise<void> {
  const apiKey = process.env.UMAMI_API_KEY?.trim();
  const websiteId = (process.env.UMAMI_WEBSITE_ID ?? process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID)?.trim();
  if (!apiKey || !websiteId) {
    console.log(MISSING_KEY_HELP);
    process.exitCode = 2;
    return;
  }
  const since = arg("--depuis") ?? SINCE_DEFAULT;
  const until = arg("--jusqua") ?? today;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(since) || !/^\d{4}-\d{2}-\d{2}$/.test(until)) throw new Error("Dates attendues au format AAAA-MM-JJ.");
  const reports = [];
  for (const range of daysBetween(since, until)) {
    reports.push(await fetchDay(fetch as unknown as Fetcher, { apiKey, websiteId, base: process.env.UMAMI_API_URL?.trim() || undefined }, range));
    // Umami Cloud limite le débit : un jour à la fois, sans rafale.
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  console.log(`Visites venues des mails ORION, du ${since} au ${until} (heure de Paris)\n`);
  console.log(formatReport(reports));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
