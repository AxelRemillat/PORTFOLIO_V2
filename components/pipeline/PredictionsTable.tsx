"use client";

import { useState } from "react";
import type { Scored } from "./pipeline-steps";

type Key = "proba" | "budget_estime" | "entreprise";
const NUM_MAX = 40; // on affiche les 40 premiers du tri (perf DOM)

export default function PredictionsTable({ rows }: { rows: Scored[] }) {
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
              <th className="pl-th-sort" onClick={() => sort("entreprise")}>Lead{arrow("entreprise")}</th>
              <th>Taille</th>
              <th>Source</th>
              <th className="pl-th-sort" style={{ textAlign: "right" }} onClick={() => sort("budget_estime")}>Budget{arrow("budget_estime")}</th>
              <th className="pl-th-sort" style={{ textAlign: "right" }} onClick={() => sort("proba")}>Score{arrow("proba")}</th>
              <th>Label</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.entreprise}</strong> <span style={{ color: "var(--wc-muted)", fontFamily: "var(--font-mono)", fontSize: ".72rem" }}>{r.id}</span></td>
                <td>{r.taille}</td>
                <td>{r.source}</td>
                <td className="num">{r.budget_estime.toLocaleString("fr-FR")} €</td>
                <td className="num pl-proba">{Math.round(r.proba * 100)}%</td>
                <td><span className={`pl-badge ${r.label}`}>{r.label}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: ".76rem", color: "var(--wc-muted)", margin: ".6rem 0 0" }}>
        {NUM_MAX} lignes affichées sur {rows.length} · cliquez un en-tête pour trier
      </p>
    </>
  );
}
