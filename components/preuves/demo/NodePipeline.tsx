"use client";

import { Fragment } from "react";
import { Icon } from "./nodeIcons";
import type { WorkflowNode } from "./workflow-types";

interface Props {
  nodes: WorkflowNode[];
  activeIndex: number;
  phase: "idle" | "running" | "done" | "error";
}

// Pipeline horizontal de nodes (style n8n). L'état de chaque node/connexion découle
// de activeIndex + phase ; le point lumineux circule quand le flux avance.
export default function NodePipeline({ nodes, activeIndex, phase }: Props) {
  return (
    <div className="wc-pipe" role="list" aria-label="Étapes du workflow">
      {nodes.map((n, i) => {
        const done = i < activeIndex || (i === activeIndex && phase === "done");
        const active = i === activeIndex && phase === "running";
        const cls = done ? "is-done" : active ? "is-active" : "";
        return (
          <Fragment key={n.id}>
            <div className={`wc-node ${cls}`} role="listitem" aria-current={active ? "step" : undefined}>
              <div className="wc-node-box"><Icon name={n.icon} /></div>
              <div className="wc-node-label">{n.label}</div>
              {n.sublabel && <div className="wc-node-sub">{n.sublabel}</div>}
            </div>
            {i < nodes.length - 1 && (
              <div className={`wc-conn ${activeIndex > i ? "is-filled" : ""} ${activeIndex === i + 1 ? "is-flowing" : ""}`}>
                <span className="wc-dot" />
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
