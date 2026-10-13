// English twin of ops-data.ts: same metrics, same ids, values still unwired (null).
import type { OpsMetric, OpsText } from "./ops-data";

export const OPS_TEXT: OpsText = {
  title: "Ops | Axel Remillat: the engine room",
  description: "This site's monitoring, in public: uptime, VEGA latency, requests and cost per answer.",
  kicker: "OPS // ENGINE ROOM",
  intro: "This site's monitoring, in public. An engineer who sells you monitoring should show his own.",
  wiring: "being wired up",
};

export const OPS_METRICS: OpsMetric[] = [
  { id: "uptime", label: "Site uptime", value: null, detail: "last 30 days" },
  { id: "vega-latency", label: "VEGA median latency", value: null, detail: "full answer, p50" },
  { id: "requests-today", label: "Requests today", value: null, detail: "all API routes" },
  { id: "cost-per-answer", label: "Cost per answer", value: null, detail: "LLM + TTS, average" },
];
