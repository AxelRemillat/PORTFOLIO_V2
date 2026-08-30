"use client";

import { useEffect, useState } from "react";
import TraceStep from "./TraceStep";

export interface TraceItem {
  type: "reflexion" | "outil" | "final";
  icon?: string;
  title: string;
  detail?: string;
  args?: string;
  result?: string;
  fn?: string;          // outil/final → détail technique dépliable
  rawArgs?: unknown;    // arguments bruts
  rawResult?: unknown;  // données retournées par l'outil
}

// Trace de l'agent révélée séquentiellement (effet « il agit sous mes yeux »).
// Chaque étape à outil est dépliable (TraceStep). prefers-reduced-motion → tout
// d'un coup. role=log + aria-live.
export default function TraceLive({ items }: { items: TraceItem[] }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = setTimeout(() => setVisible(items.length), 0);
      return () => clearTimeout(t);
    }
    const timers: number[] = [];
    for (let i = 1; i <= items.length; i++) timers.push(window.setTimeout(() => setVisible(i), i * 520));
    return () => timers.forEach(clearTimeout);
  }, [items]);

  return (
    <div className="ag-trace" role="log" aria-live="polite" aria-label="Trace de l'agent">
      {items.slice(0, visible).map((it, i) => <TraceStep key={i} item={it} />)}
      {visible < items.length && (
        <div className="ag-think" aria-hidden>l&apos;agent réfléchit<span /><span /><span /></div>
      )}
    </div>
  );
}
