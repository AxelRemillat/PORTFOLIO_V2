"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { MusicUI } from "@/components/music/MusicUI";
import { InstrumentPanel } from "@/components/music/InstrumentPanel";
import type { PanelTarget } from "@/components/music/InstrumentPanel";
import type { InstrumentId } from "@/components/music/MusicCanvas";
import type { InstrumentParams } from "@/components/music/AudioEngine";

const MusicCanvas = dynamic(() => import("@/components/music/MusicCanvas"), { ssr: false });

export default function MusicPage() {
  const [selected, setSelected]       = useState<InstrumentId | null>("baobab");
  const [count, setCount]             = useState(0);
  const [types, setTypes]             = useState<InstrumentId[]>([]);
  const [panelTarget, setPanelTarget] = useState<PanelTarget | null>(null);
  const [clearSignal, setClearSignal] = useState(0);

  const perInstr = useMemo<Partial<Record<InstrumentId, number>>>(() => {
    const c: Partial<Record<InstrumentId, number>> = {};
    for (const t of types) c[t] = (c[t] ?? 0) + 1;
    return c;
  }, [types]);

  const handleElementClick = useCallback((id: string, type: InstrumentId, params: InstrumentParams) => {
    setPanelTarget(prev => (prev?.id === id ? null : { id, type }));
    void params; // params already stored in AudioEngine; panel reads via getParams
  }, []);

  const handleElementRemoved = useCallback((id: string) => {
    setPanelTarget(prev => prev?.id === id ? null : prev);
  }, []);

  const handleClearAll = useCallback(() => {
    setPanelTarget(null);
    setClearSignal(s => s + 1);
  }, []);

  return (
    <div
      style={{
        position:   "relative",
        width:      "100vw",
        height:     "100vh",
        overflow:   "hidden",
        background: "#020210",
      }}
    >
      {/* ── 3D Canvas — bottom layer ── */}
      <div style={{ position: "absolute", inset: 0 }}>
        <MusicCanvas
          selectedInstrument={selected}
          onObjectCountChange={setCount}
          onTypesChange={setTypes}
          onElementClick={handleElementClick}
          onElementRemoved={handleElementRemoved}
          clearSignal={clearSignal}
        />
      </div>

      {/* ── UI overlay — pointer-events none so clicks reach the canvas ── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>

        {/* Top bar */}
        <div
          style={{
            display:        "flex",
            justifyContent: "space-between",
            alignItems:     "center",
            padding:        "20px 24px",
          }}
        >
          <Link
            href="/projets"
            style={{
              pointerEvents:  "auto",
              color:          "#8899bb",
              textDecoration: "none",
              fontSize:       "13px",
              fontFamily:     "monospace",
              letterSpacing:  "0.05em",
              padding:        "6px 14px",
              background:     "rgba(8,8,20,0.65)",
              borderRadius:   "6px",
              border:         "1px solid rgba(100,120,180,0.2)",
              backdropFilter: "blur(6px)",
            }}
          >
            ← Retour
          </Link>

          <h1
            style={{
              position:      "absolute",
              left:          "50%",
              transform:     "translateX(-50%)",
              margin:        0,
              fontSize:      "15px",
              fontWeight:    300,
              fontFamily:    "monospace",
              color:         "#dde6ff",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              pointerEvents: "none",
            }}
          >
            La Planète qui Chante
          </h1>

          {/* Spacer to keep title centered */}
          <div style={{ width: "90px" }} />
        </div>

        {/* MusicUI manages its own pointer-events internally */}
        <MusicUI
          selected={selected}
          onSelect={setSelected}
          count={count}
          perInstr={perInstr}
          onClearAll={handleClearAll}
        />
      </div>

      {/* ── Instrument panel — rendered outside the pointer-events:none overlay ── */}
      {panelTarget && (
        <InstrumentPanel
          target={panelTarget}
          onClose={() => setPanelTarget(null)}
        />
      )}
    </div>
  );
}
