// English twin of ops-data.ts: same metrics, same ids, values still unwired (null).
import type { OpsMetric } from "./ops-data";

export const OPS_METRICS: OpsMetric[] = [
  { id: "uptime", label: "Site uptime", value: null, detail: "last 30 days" },
  { id: "vega-latency", label: "VEGA median latency", value: null, detail: "full answer, p50" },
  { id: "requests-today", label: "Requests today", value: null, detail: "all API routes" },
  { id: "cost-per-answer", label: "Cost per answer", value: null, detail: "LLM + TTS, average" },
];
