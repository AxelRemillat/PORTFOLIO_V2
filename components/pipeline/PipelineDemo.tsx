"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { DATASETS, blankLead, type Lead } from "./leads-data";
import { score, bucket } from "./model";
import { buildSteps, type Scored, type StepData } from "./pipeline-steps";
import EditableLead from "./EditableLead";
import PipelineLive from "./PipelineLive";
import PredictionsTable from "./PredictionsTable";
import PipelineCharts from "./PipelineCharts";
import { PIPELINE_CSS } from "./pipelineCss";

type Phase = "idle" | "running" | "done";
const scoreAll = (leads: Lead[]): Scored[] =>
  leads.map((l) => { const p = score(l); return { ...l, proba: p, label: bucket(p) }; });

export default function PipelineDemo() {
  const [dsId, setDsId] = useState(DATASETS[0].id);
  const [userLead, setUserLead] = useState<Lead>(blankLead());
  const [phase, setPhase] = useState<Phase>("idle");
  const [run, setRun] = useState<{ steps: StepData[]; scored: Scored[] } | null>(null);
  const dataset = useMemo(() => DATASETS.find((d) => d.id === dsId) ?? DATASETS[0], [dsId]);

  const launch = () => {
    if (phase === "running") return;
    setPhase("running"); setRun(null);
    // Calcul instantané (client) ; petit délai pour l'effet « pipeline qui démarre ».
    window.setTimeout(() => {
      const leads = [userLead, ...dataset.leads];
      const scored = scoreAll(leads);
      setRun({ steps: buildSteps(dataset.label, leads, scored), scored });
      setPhase("done");
    }, 350);
  };

  const accent = { "--wc-accent": "#0891b2", "--wc-accent-weak": "#0891b21a" } as CSSProperties;
  const running = phase === "running";
  const chaud = run ? run.scored.filter((s) => s.label === "chaud").length : 0;
  const pctChaud = run ? Math.round((chaud / run.scored.length) * 100) : 0;
  const topLead = run ? [...run.scored].sort((a, b) => b.proba - a.proba)[0] : null;

  return (
    <div className="wc-card pl-demo" style={accent}>
      <style>{PIPELINE_CSS}</style>

      <p className="wc-label">Dataset d&apos;exemple</p>
      <div className="pl-tools">
        {DATASETS.map((d) => (
          <button key={d.id} type="button" className={`pl-tool${d.id === dsId ? " on" : ""}`}
            onClick={() => setDsId(d.id)} disabled={running}>
            {d.label} · {d.leads.length}
          </button>
        ))}
      </div>

      <EditableLead lead={userLead} onChange={setUserLead} />

      <div className="wc-actions">
        <button type="button" className="wc-btn wc-primary" onClick={launch} disabled={running}>
          {running ? "Pipeline en cours…" : "Lancer le pipeline →"}
        </button>
      </div>

      {phase !== "idle" && (
        <>
          <p className="ag-seclabel">Pipeline live</p>
          {running
            ? <div className="ag-think ag-think-solo" aria-live="polite">démarrage<span /><span /><span /></div>
            : run && <PipelineLive key={dsId + "-" + userLead.pages_vues + "-" + userLead.budget_estime} steps={run.steps} />}
        </>
      )}

      {phase === "done" && run && (
        <div>
          <div className="pl-insight" role="status">
            <span className="pl-insight-n">{pctChaud}%</span>
            <p className="pl-insight-t">
              de leads <b>chauds</b> ({chaud}/{run.scored.length}). Lead au plus fort potentiel :{" "}
              <b>{topLead?.entreprise}</b> — {Math.round((topLead?.proba ?? 0) * 100)}%.
            </p>
          </div>
          <p className="pl-seclabel">Prédictions</p>
          <PredictionsTable rows={run.scored} />
          <p className="pl-seclabel">Analyse</p>
          <PipelineCharts rows={run.scored} />
        </div>
      )}
    </div>
  );
}
