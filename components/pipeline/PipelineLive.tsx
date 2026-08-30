"use client";

import { useEffect, useState } from "react";
import type { StepData } from "./pipeline-steps";

// Une étape (réutilise le style ag-step de la démo agent) avec détail technique
// dépliable au clic — même pattern « Voir plus » que la trace de l'agent.
function Step({ s }: { s: StepData }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ag-step t-outil">
      <span className="ag-step-ico" aria-hidden>{s.icon}</span>
      <div className="ag-step-body">
        <p className="ag-step-title">{s.title}</p>
        {s.detail && <p className="ag-step-detail">{s.detail}</p>}
        <p className="ag-step-res"><span aria-hidden>✓</span> {s.result}</p>
        <button type="button" className="ag-step-more" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span className="ag-chev" aria-hidden>{open ? "▾" : "▸"}</span>
          {open ? "Masquer le détail technique" : "Voir plus — détail technique"}
        </button>
        <div className={`ag-tech-wrap${open ? " open" : ""}`}>
          <div className="ag-tech-inner">
            <div className="ag-tech"><pre className="ag-pseudo">{s.tech}</pre></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Étapes révélées une par une (effet « le pipeline tourne sous mes yeux »).
// prefers-reduced-motion → tout affiché d'un coup. role=log + aria-live.
export default function PipelineLive({ steps }: { steps: StepData[] }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(steps.length);
      return;
    }
    setVisible(0);
    const timers: number[] = [];
    for (let i = 1; i <= steps.length; i++) timers.push(window.setTimeout(() => setVisible(i), i * 560));
    return () => timers.forEach(clearTimeout);
  }, [steps]);

  return (
    <div className="ag-trace" role="log" aria-live="polite" aria-label="Étapes du pipeline">
      {steps.slice(0, visible).map((s, i) => <Step key={i} s={s} />)}
      {visible < steps.length && <div className="ag-think" aria-hidden>calcul<span /><span /><span /></div>}
    </div>
  );
}
