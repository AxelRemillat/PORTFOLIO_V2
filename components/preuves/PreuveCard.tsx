"use client";

import Link from "next/link";
import type { CSSProperties, ComponentType } from "react";
import type { Project, PreuveState } from "@/lib/projects-data";
import ScrollReveal from "@/components/parcours/ScrollReveal";
import VegaWindow from "./windows/VegaWindow";
import WorkflowWindow from "./windows/WorkflowWindow";
import InfraWindow from "./windows/InfraWindow";

// Card « preuve » : info à gauche, fenêtre produit + flux à droite. Verre premium,
// thème par projet via variables --pv-*. Fenêtre choisie selon le slug.
const WINDOWS: Record<string, ComponentType> = {
  vega: VegaWindow,
  n8n: WorkflowWindow,
  infra: InfraWindow,
};
const STATE_COLOR: Record<PreuveState, string> = {
  live: "#22c55e",
  wip: "#f59e0b",
  building: "#60a5fa",
};

export default function PreuveCard({ project, index }: { project: Project; index: number }) {
  const { slug, accent, badge, state, title, tagline, stack, primaryCta, detailCta } = project;
  const Win = WINDOWS[slug] ?? VegaWindow;
  const sc = STATE_COLOR[state];

  const vars = {
    "--pv-accent": accent,
    "--pv-accent-glow": `${accent}26`,
    "--pv-accent-weak": `${accent}1e`,
    "--pv-accent-line": `${accent}59`,
    "--pv-state": sc,
    "--pv-state-b": `${sc}66`,
    "--pv-state-bg": `${sc}1a`,
  } as CSSProperties;

  return (
    <ScrollReveal threshold={0.01} rootMargin="0px 0px 12% 0px" respectReducedMotion>
      <article className={`pv-card ${state === "live" ? "pv-live" : ""}`} style={vars}>
        <div className="pv-info">
          <div className="pv-head">
            <span className="pv-status"><span className="pv-dot" />{badge}</span>
            <span className="pv-num">{String(index + 1).padStart(2, "0")} / 03</span>
          </div>
          <h2 className="pv-title">{title}</h2>
          <p className="pv-tag">{tagline}</p>
          <div className="pv-stack">
            {stack.map((t) => <span key={t} className="pv-chip">{t}</span>)}
          </div>
          <div className="pv-ctas">
            {primaryCta && <Link href={primaryCta.href} className="pv-cta1">{primaryCta.label}</Link>}
            <Link href={detailCta.href} className="pv-cta2">{detailCta.label}</Link>
          </div>
        </div>
        <div className="pv-window"><Win /></div>
      </article>
    </ScrollReveal>
  );
}
