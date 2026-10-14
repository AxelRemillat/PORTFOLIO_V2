// Cœur du relevé Umami des visites venues des mails ORION (scripts/umami-orion.ts).
// Fonctions pures + appels API injectables : testé sur des réponses simulées
// (tests/umami-orion.test.ts). LECTURE SEULE, aucune donnée personnelle : Umami
// ne rend que des étiquettes (canal, demo, v) et des totaux.

export const UMAMI_API = "https://api.umami.is/v1";
/** L'événement `arrivee` (avec canal, demo, v) existe depuis la PR #9 du 09/10/2026. */
export const SINCE_DEFAULT = "2026-10-09";

export const MISSING_KEY_HELP = [
  "UMAMI_API_KEY ou UMAMI_WEBSITE_ID absent de .env.local : rien n'est lu.",
  "",
  "  1. Clé : Umami Cloud → Settings → API keys → « Create key ». La copier dans .env.local :",
  "       UMAMI_API_KEY=…",
  "  2. Site : Umami Cloud → Websites → axelremillat.com → Edit → « Website ID »",
  "     (la même valeur que NEXT_PUBLIC_UMAMI_WEBSITE_ID dans Vercel) :",
  "       UMAMI_WEBSITE_ID=…",
  "",
  "La clé reste en local (.env.local n'est pas versionné) : ce n'est pas une variable Vercel.",
].join("\n");

/** Les relevés d'un jour : un appel par (événement, propriété). */
export const QUERIES = [
  { event: "arrivee", property: "canal" },
  { event: "arrivee", property: "v" },
  { event: "arrivee", property: "demo" },
  { event: "demo_start", property: "canal" },
  { event: "demo_result", property: "canal" },
] as const;

export type Values = Record<string, number>;
export interface DayReport {
  day: string;
  arriveeOrion: number;
  byV: Values;
  byDemo: Values;
  demoStartOrion: number;
  demoResultOrion: number;
}

export type Fetcher = (url: string, init: { headers: Record<string, string> }) => Promise<{ ok: boolean; status: number; json: () => Promise<unknown> }>;

/** Jours civils (heure de Paris) de `since` à `until` compris : [jour, début ms, fin ms]. */
export function daysBetween(since: string, until: string): { day: string; startAt: number; endAt: number }[] {
  const out: { day: string; startAt: number; endAt: number }[] = [];
  for (let day = since; day <= until; day = nextDay(day)) {
    const startAt = parisMidnight(day);
    out.push({ day, startAt, endAt: parisMidnight(nextDay(day)) - 1 });
  }
  return out;
}

function nextDay(day: string): string {
  const date = new Date(`${day}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

/** Minuit à Paris, en ms UTC (heure d'été comprise). */
function parisMidnight(day: string): number {
  const utcNoon = new Date(`${day}T12:00:00Z`);
  const parisNoon = new Date(utcNoon.toLocaleString("en-US", { timeZone: "Europe/Paris" }));
  const offset = parisNoon.getTime() - new Date(utcNoon.toLocaleString("en-US", { timeZone: "UTC" })).getTime();
  return Date.parse(`${day}T00:00:00Z`) - offset;
}

/** Réponse de /event-data/values : [{ value, total }] → { valeur: total }. */
export function parseValues(raw: unknown): Values {
  const out: Values = {};
  if (!Array.isArray(raw)) return out;
  for (const item of raw as { value?: unknown; total?: unknown }[]) {
    const key = String(item?.value ?? "").trim();
    const total = Number(item?.total ?? 0);
    if (key && Number.isFinite(total)) out[key] = (out[key] ?? 0) + total;
  }
  return out;
}

export async function fetchDay(
  fetcher: Fetcher,
  config: { apiKey: string; websiteId: string; base?: string },
  range: { day: string; startAt: number; endAt: number },
): Promise<DayReport> {
  const values: Values[] = [];
  for (const query of QUERIES) {
    const params = new URLSearchParams({ startAt: String(range.startAt), endAt: String(range.endAt), eventName: query.event, propertyName: query.property });
    const url = `${config.base ?? UMAMI_API}/websites/${encodeURIComponent(config.websiteId)}/event-data/values?${params}`;
    const response = await fetcher(url, { headers: { "x-umami-api-key": config.apiKey, accept: "application/json" } });
    if (!response.ok) throw new Error(`Umami a répondu ${response.status} (${query.event} / ${query.property}, ${range.day}) — clé ou identifiant de site à vérifier.`);
    values.push(parseValues(await response.json()));
  }
  const [canal, byV, byDemo, start, result] = values;
  return { day: range.day, arriveeOrion: canal.orion ?? 0, byV, byDemo, demoStartOrion: start.orion ?? 0, demoResultOrion: result.orion ?? 0 };
}

const list = (values: Values) =>
  Object.entries(values)
    .sort((a, b) => b[1] - a[1])
    .map(([key, total]) => `${key}:${total}`)
    .join(" ") || "—";

/** Tableau texte, un jour par ligne, puis le total. */
export function formatReport(days: DayReport[]): string {
  const lines = ["jour        | arrivées orion | par v              | par demo                    | demo_start orion | demo_result orion"];
  const total: DayReport = { day: "TOTAL", arriveeOrion: 0, byV: {}, byDemo: {}, demoStartOrion: 0, demoResultOrion: 0 };
  for (const day of days) {
    total.arriveeOrion += day.arriveeOrion;
    total.demoStartOrion += day.demoStartOrion;
    total.demoResultOrion += day.demoResultOrion;
    for (const [key, value] of Object.entries(day.byV)) total.byV[key] = (total.byV[key] ?? 0) + value;
    for (const [key, value] of Object.entries(day.byDemo)) total.byDemo[key] = (total.byDemo[key] ?? 0) + value;
  }
  for (const day of [...days, total]) {
    lines.push(`${day.day.padEnd(11)} | ${String(day.arriveeOrion).padStart(14)} | ${list(day.byV).padEnd(18)} | ${list(day.byDemo).padEnd(27)} | ${String(day.demoStartOrion).padStart(16)} | ${String(day.demoResultOrion).padStart(17)}`);
  }
  lines.push(
    "",
    "Lecture : « par v » ne compte que les arrivées dont l'URL portait v= (les liens des mails ORION).",
    "« par demo » compte toutes les arrivées dont l'URL portait demo=, mails ou non : Umami ne croise pas deux propriétés.",
  );
  return lines.join("\n");
}
