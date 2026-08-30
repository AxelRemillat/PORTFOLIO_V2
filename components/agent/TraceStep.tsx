"use client";

import { useState } from "react";
import { TOOL_META } from "@/lib/agent/tools-meta";
import type { TraceItem } from "./TraceLive";

const compact = (o: unknown) => { try { return JSON.stringify(o ?? {}); } catch { return "{}"; } };
const pretty = (o: unknown) => { try { return JSON.stringify(o, null, 2); } catch { return "—"; } };

// Une carte d'étape de la trace. Résumé lisible visible ; le détail technique
// (fonction, description backend, args/résultat bruts, pseudo-code) se déplie au clic.
export default function TraceStep({ item }: { item: TraceItem }) {
  const [open, setOpen] = useState(false);
  const meta = item.fn ? TOOL_META[item.fn] : undefined;

  return (
    <div className={`ag-step t-${item.type}`}>
      <span className="ag-step-ico" aria-hidden>{item.icon ?? "•"}</span>
      <div className="ag-step-body">
        <p className="ag-step-title">{item.title}{item.args ? <span className="ag-step-arg"> {item.args}</span> : null}</p>
        {item.detail && <p className="ag-step-detail">{item.detail}</p>}
        {item.result && <p className="ag-step-res"><span aria-hidden>✓</span> {item.result}</p>}

        {item.fn && (
          <>
            <button type="button" className="ag-step-more" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
              <span className="ag-chev" aria-hidden>{open ? "▾" : "▸"}</span>
              {open ? "Masquer le détail technique" : "Voir plus — détail technique"}
            </button>
            <div className={`ag-tech-wrap${open ? " open" : ""}`}>
              <div className="ag-tech-inner">
                <div className="ag-tech">
                  <p className="ag-tech-sig"><span className="ag-tech-fn">{item.fn}</span>({compact(item.rawArgs)})</p>
                  {meta && <p className="ag-tech-desc">{meta.description}</p>}
                  <p className="ag-tech-lbl">arguments</p>
                  <pre className="ag-json">{pretty(item.rawArgs)}</pre>
                  {item.rawResult != null && (
                    <>
                      <p className="ag-tech-lbl">données retournées</p>
                      <pre className="ag-json">{pretty(item.rawResult)}</pre>
                    </>
                  )}
                  {meta?.pseudo?.length ? (
                    <>
                      <p className="ag-tech-lbl">logique (extrait)</p>
                      <pre className="ag-pseudo">{meta.pseudo.join("\n")}</pre>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
