"use client";

import { useState } from "react";
import type { Scored } from "./pipeline-steps";
import { pipelineLabels } from "./labels";
import { useLocale } from "@/lib/i18n/client";

type Key = "proba" | "budget_estime" | "entreprise";
const NUM_MAX = 40; // on affiche les 40 premiers du tri (perf DOM)

export default function PredictionsTable({ rows }: { rows: Scored[] }) {
  const L = pipelineLabels(useLocale());
  const t = L.table;
  const [key, setKey] = useState<Key>("proba");
  const [dir, setDir] = useState<1 | -1>(-1);

  const sorted = [...rows].sort((a, b) => {
    const c = key === "entreprise"
      ? a.entreprise.localeCompare(b.entreprise)
      : a[key as "proba" | "budget_estime"] - b[key as "proba" | "budget_estime"];
    return c * dir;
  });
  const shown = sorted.slice(0, NUM_MAX);
  const sort = (k: Key) => { if (k === key) setDir((d) => (d === 1 ? -1 : 1)); else { setKey(k); setDir(-1); } };
  const arrow = (k: Key) => (key === k ? (dir === 1 ? " ▲" : " ▼") : "");

  return (
    <>
      <div className="pl-tablewrap">
        <table className="pl-table">
          <thead>
            <tr>
              <th className="pl-th-sort" onClick={() => sort("entreprise")}>{t.lead}{arrow("entreprise")}</th>
              <th>{t.size}</th>
              <th>{t.source}</th>
              <th className="pl-th-sort" style={{ textAlign: "right" }} onClick={() => sort("budget_estime")}>{t.budget}{arrow("budget_estime")}</th>
              <th className="pl-th-sort" style={{ textAlign: "right" }} onClick={() => sort("proba")}>{t.score}{arrow("proba")}</th>
              <th>{t.label}</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.entreprise}</strong> <span style={{ color: "var(--wc-muted)", fontFamily: "var(--font-mono)", fontSize: ".72rem" }}>{r.id}</span></td>
                <td>{L.taille[r.taille]}</td>
                <td>{r.source}</td>
                <td className="num">{L.money(r.budget_estime)}</td>
                <td className="num pl-proba">{Math.round(r.proba * 100)}%</td>
                <td><span className={`pl-badge ${r.label}`}>{L.bucket[r.label]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: ".76rem", color: "var(--wc-muted)", margin: ".6rem 0 0" }}>
        {t.footer(NUM_MAX, rows.length)}
      </p>
    </>
  );
}
