"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { InstrumentId } from "./MusicCanvas";
import type { InstrumentParams } from "./AudioEngine";
import { audioEngine } from "./AudioEngine";

// ── Public interface ──────────────────────────────────────────────────────────

export interface PanelTarget {
  id:   string;
  type: InstrumentId;
}

// ── Display metadata ──────────────────────────────────────────────────────────

const LABEL: Record<InstrumentId, string> = {
  baobab: "Baobab", cristal: "Cristal", renard: "Renard",
  rose:   "Rose",   mouton:  "Mouton",  etoile: "Étoile",
};
const ROLE: Record<InstrumentId, string> = {
  baobab: "Batterie", cristal: "Basse",   renard: "Mélodie",
  rose:   "Violon",   mouton:  "Piano",   etoile: "Synthé",
};
const COLOR: Record<InstrumentId, string> = {
  baobab: "#8B4513", cristal: "#00CED1", renard: "#FF6B35",
  rose:   "#FF69B4", mouton:  "#F5F5F5", etoile: "#FFD700",
};
const DEFAULTS: Record<InstrumentId, InstrumentParams> = {
  baobab:  { bpm: 90, pattern: "standard", velocity: 0.7 },
  cristal: { rootNote: "C", rhythm: "quarter", sustain: 0.6 },
  renard:  { scale: "pentatonic", speed: 1, octave: 4 },
  rose:    { vibratoDepth: 0.1, expression: "legato" },
  mouton:  { style: "chord", octave: 4, density: 3 },
  etoile:  { waveform: "sawtooth", filterRate: "4n", reverbDecay: 4 },
};

// ── Shared sub-components ──────────────────────────────────────────────────────

const labelSt: React.CSSProperties = {
  fontSize: "10px", color: "rgba(150,170,220,0.65)", fontFamily: "monospace",
  letterSpacing: "0.08em", textTransform: "uppercase",
};
const valSt: React.CSSProperties = {
  fontSize: "12px", color: "rgba(210,225,255,0.9)", fontFamily: "monospace",
};

function SLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ ...labelSt, marginBottom: "6px" }}>{children}</div>;
}

function BtnGroup({ opts, value, onChange, color }: {
  opts:     { v: string; l: string }[];
  value:    string | number | undefined;
  onChange: (v: string) => void;
  color:    string;
}) {
  const cur = String(value ?? "");
  return (
    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "12px" }}>
      {opts.map(o => {
        const sel = cur === o.v;
        return (
          <button
            key={o.v}
            onClick={() => onChange(o.v)}
            style={{
              flex: "1 1 auto", padding: "5px 8px", fontSize: "11px",
              fontFamily: "monospace", cursor: "pointer",
              background:   sel ? `${color}22` : "rgba(255,255,255,0.04)",
              border:       `1px solid ${sel ? color : "rgba(255,255,255,0.1)"}`,
              borderRadius: "6px",
              color:        sel ? color : "rgba(180,200,255,0.7)",
              transition:   "all 0.12s",
            }}
          >
            {o.l}
          </button>
        );
      })}
    </div>
  );
}

function SliderRow({ label, min, max, step = 0.01, value, fmt, color, onChange, onCommit }: {
  label:    string;
  min:      number;
  max:      number;
  step?:    number;
  value:    number;
  fmt:      (v: number) => string;
  color:    string;
  onChange: (v: number) => void;
  onCommit: () => void;
}) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "5px" }}>
        <span style={labelSt}>{label}</span>
        <span style={valSt}>{fmt(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        onPointerUp={onCommit}
        style={{ width: "100%", accentColor: color, cursor: "pointer" }}
      />
    </div>
  );
}

// ── Per-instrument control panels ──────────────────────────────────────────────

type CtrlProps = {
  params:   InstrumentParams;
  color:    string;
  onSlider: (p: Partial<InstrumentParams>) => void;
  onCommit: () => void;
  onBpm:    (bpm: number) => void;
  onButton: (p: Partial<InstrumentParams>) => void;
};

function BaobabPanel({ params, color, onBpm, onSlider, onCommit, onButton }: CtrlProps) {
  return (
    <>
      <div style={{ marginBottom: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "5px" }}>
          <span style={labelSt}>BPM</span>
          <span style={valSt}>{Math.round(params.bpm ?? 90)}</span>
        </div>
        <input
          type="range" min={60} max={160} step={1} value={params.bpm ?? 90}
          onChange={e => onBpm(parseInt(e.target.value))}
          style={{ width: "100%", accentColor: color, cursor: "pointer" }}
        />
      </div>

      <SLabel>Pattern</SLabel>
      <BtnGroup
        value={params.pattern ?? "standard"} color={color}
        opts={[
          { v: "standard",  l: "Standard"  },
          { v: "jazz",      l: "Jazz"       },
          { v: "reggae",    l: "Reggae"     },
          { v: "half-time", l: "Half-time"  },
        ]}
        onChange={v => onButton({ pattern: v as InstrumentParams["pattern"] })}
      />

      <SliderRow
        label="Vélocité" min={0.2} max={1} step={0.01} color={color}
        value={params.velocity ?? 0.7}
        fmt={v => `${Math.round(v * 100)}%`}
        onChange={v => onSlider({ velocity: v })}
        onCommit={onCommit}
      />
    </>
  );
}

function CristalPanel({ params, color, onSlider, onCommit, onButton }: CtrlProps) {
  return (
    <>
      <SLabel>Note fondamentale</SLabel>
      <BtnGroup
        value={params.rootNote ?? "C"} color={color}
        opts={["C","D","E","F","G","A","B"].map(n => ({ v: n, l: n }))}
        onChange={v => onButton({ rootNote: v })}
      />

      <SLabel>Rythme</SLabel>
      <BtnGroup
        value={params.rhythm ?? "quarter"} color={color}
        opts={[
          { v: "half",    l: "Lente"   },
          { v: "quarter", l: "Normale" },
          { v: "eighth",  l: "Rapide"  },
        ]}
        onChange={v => onButton({ rhythm: v as InstrumentParams["rhythm"] })}
      />

      <SliderRow
        label="Sustain" min={0.2} max={0.9} step={0.01} color={color}
        value={params.sustain ?? 0.6}
        fmt={v => `${Math.round(v * 100)}%`}
        onChange={v => onSlider({ sustain: v })}
        onCommit={onCommit}
      />
    </>
  );
}

function RenardPanel({ params, color, onSlider, onCommit, onButton }: CtrlProps) {
  return (
    <>
      <SLabel>Gamme</SLabel>
      <BtnGroup
        value={params.scale ?? "pentatonic"} color={color}
        opts={[
          { v: "major",      l: "Majeur"      },
          { v: "minor",      l: "Mineur"      },
          { v: "pentatonic", l: "Pentatonique"},
          { v: "blues",      l: "Blues"       },
        ]}
        onChange={v => onButton({ scale: v as InstrumentParams["scale"] })}
      />

      <SliderRow
        label="Vitesse" min={0.5} max={2} step={0.05} color={color}
        value={params.speed ?? 1}
        fmt={v => `${v.toFixed(1)}×`}
        onChange={v => onSlider({ speed: v })}
        onCommit={onCommit}
      />

      <SLabel>Octave</SLabel>
      <BtnGroup
        value={params.octave ?? 4} color={color}
        opts={[{ v: "3", l: "3" }, { v: "4", l: "4" }, { v: "5", l: "5" }]}
        onChange={v => onButton({ octave: parseInt(v) })}
      />
    </>
  );
}

function RosePanel({ params, color, onSlider, onCommit, onButton }: CtrlProps) {
  const autoNote = !params.note;

  return (
    <>
      <SliderRow
        label="Vibrato" min={0} max={1} step={0.01} color={color}
        value={params.vibratoDepth ?? 0.1}
        fmt={v => `${Math.round(v * 100)}%`}
        onChange={v => onSlider({ vibratoDepth: v })}
        onCommit={onCommit}
      />

      <SLabel>Expression</SLabel>
      <BtnGroup
        value={params.expression ?? "legato"} color={color}
        opts={[{ v: "legato", l: "Legato" }, { v: "staccato", l: "Staccato" }]}
        onChange={v => onButton({ expression: v as "legato" | "staccato" })}
      />

      <div style={{ marginBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={labelSt}>Note</span>
          <button
            onClick={() => autoNote
              ? onButton({ note: "C4" })
              : onButton({ note: undefined })
            }
            style={{
              fontSize: "10px", fontFamily: "monospace", padding: "3px 8px",
              background:   autoNote ? `${color}22` : "rgba(255,255,255,0.04)",
              border:       `1px solid ${autoNote ? color : "rgba(255,255,255,0.1)"}`,
              borderRadius: "5px",
              color:        autoNote ? color : "rgba(180,200,255,0.7)",
              cursor:       "pointer",
            }}
          >
            {autoNote ? "Auto ✓" : "Auto"}
          </button>
        </div>
        {!autoNote && (
          <BtnGroup
            value={params.note ?? "C4"} color={color}
            opts={["C4","D4","E4","F4","G4","A4","B4"].map(n => ({ v: n, l: n }))}
            onChange={v => onButton({ note: v })}
          />
        )}
      </div>
    </>
  );
}

function MoutonPanel({ params, color, onSlider, onCommit, onButton }: CtrlProps) {
  return (
    <>
      <SLabel>Style</SLabel>
      <BtnGroup
        value={params.style ?? "chord"} color={color}
        opts={[
          { v: "chord",    l: "Accords" },
          { v: "arpeggio", l: "Arpège"  },
          { v: "sparse",   l: "Épars"   },
        ]}
        onChange={v => onButton({ style: v as InstrumentParams["style"] })}
      />

      <SLabel>Octave</SLabel>
      <BtnGroup
        value={params.octave ?? 4} color={color}
        opts={[{ v: "3", l: "3" }, { v: "4", l: "4" }]}
        onChange={v => onButton({ octave: parseInt(v) })}
      />

      <SliderRow
        label="Densité" min={1} max={3} step={1} color={color}
        value={params.density ?? 3}
        fmt={v => `${Math.round(v)} notes`}
        onChange={v => onSlider({ density: Math.round(v) })}
        onCommit={onCommit}
      />
    </>
  );
}

function EtoilePanel({ params, color, onSlider, onCommit, onButton }: CtrlProps) {
  return (
    <>
      <SLabel>Forme d&apos;onde</SLabel>
      <BtnGroup
        value={params.waveform ?? "sawtooth"} color={color}
        opts={[
          { v: "sine",     l: "∿ Sine"     },
          { v: "square",   l: "⊓ Square"   },
          { v: "sawtooth", l: "⋀ Sawtooth" },
          { v: "triangle", l: "△ Triangle" },
        ]}
        onChange={v => onButton({ waveform: v as InstrumentParams["waveform"] })}
      />

      <SLabel>Vitesse filtre</SLabel>
      <BtnGroup
        value={params.filterRate ?? "4n"} color={color}
        opts={[
          { v: "8n", l: "Rapide" },
          { v: "4n", l: "Médium" },
          { v: "2n", l: "Lent"   },
        ]}
        onChange={v => onButton({ filterRate: v as InstrumentParams["filterRate"] })}
      />

      <SliderRow
        label="Reverb" min={1} max={8} step={0.5} color={color}
        value={params.reverbDecay ?? 4}
        fmt={v => `${v.toFixed(1)} s`}
        onChange={v => onSlider({ reverbDecay: v })}
        onCommit={onCommit}
      />
    </>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function InstrumentPanel({ target, onClose }: {
  target:  PanelTarget;
  onClose: () => void;
}) {
  const [params, setParams] = useState<InstrumentParams>(() => ({
    ...DEFAULTS[target.type],
    ...audioEngine.getParams(target.id),
  }));
  const [visible, setVisible] = useState(false);
  const pendingRef = useRef<Partial<InstrumentParams>>({});

  // Slide-in on mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Re-sync when switching to a different element
  useEffect(() => {
    setParams({ ...DEFAULTS[target.type], ...audioEngine.getParams(target.id) });
  }, [target.id, target.type]);

  const color = COLOR[target.type];

  // Slider: update UI only, accumulate
  const onSlider = useCallback((p: Partial<InstrumentParams>) => {
    setParams(prev => ({ ...prev, ...p }));
    pendingRef.current = { ...pendingRef.current, ...p };
  }, []);

  // Slider release: apply pending to AudioEngine
  const onCommit = useCallback(() => {
    if (Object.keys(pendingRef.current).length === 0) return;
    audioEngine.updateParams(target.id, pendingRef.current);
    pendingRef.current = {};
  }, [target.id]);

  // BPM: real-time (no synth recreation)
  const onBpm = useCallback((bpm: number) => {
    setParams(prev => ({ ...prev, bpm }));
    audioEngine.setBpm(bpm);
  }, []);

  // Button: immediate apply
  const onButton = useCallback((p: Partial<InstrumentParams>) => {
    setParams(prev => ({ ...prev, ...p }));
    audioEngine.updateParams(target.id, p);
  }, [target.id]);

  const ctrlProps: CtrlProps = { params, color, onSlider, onCommit, onBpm, onButton };

  return (
    <div
      style={{
        position:      "fixed",
        bottom:        "110px",
        right:         "20px",
        width:         "280px",
        background:    "rgba(10,10,30,0.93)",
        border:        "1px solid rgba(255,255,255,0.15)",
        borderRadius:  "12px",
        padding:       "16px",
        zIndex:        200,
        transform:     visible ? "translateX(0)" : "translateX(calc(100% + 28px))",
        transition:    "transform 200ms ease",
        pointerEvents: "auto",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display:       "flex",
          alignItems:    "center",
          gap:           "8px",
          marginBottom:  "14px",
          paddingBottom: "12px",
          borderBottom:  "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <span
          style={{
            display:      "inline-block",
            width:        "10px",
            height:       "10px",
            borderRadius: "50%",
            background:   color,
            boxShadow:    `0 0 8px ${color}`,
            flexShrink:   0,
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "13px", fontFamily: "monospace", color: "rgba(220,230,255,0.95)", fontWeight: 500 }}>
            {LABEL[target.type]}
          </div>
          <div style={{ fontSize: "10px", color: "rgba(130,150,200,0.65)", fontFamily: "monospace" }}>
            {ROLE[target.type]}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "transparent", border: "none",
            color: "rgba(150,170,220,0.65)", fontSize: "20px",
            cursor: "pointer", padding: "2px 6px", lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      {/* Instrument-specific controls */}
      {target.type === "baobab"  && <BaobabPanel  {...ctrlProps} />}
      {target.type === "cristal" && <CristalPanel {...ctrlProps} />}
      {target.type === "renard"  && <RenardPanel  {...ctrlProps} />}
      {target.type === "rose"    && <RosePanel    {...ctrlProps} />}
      {target.type === "mouton"  && <MoutonPanel  {...ctrlProps} />}
      {target.type === "etoile"  && <EtoilePanel  {...ctrlProps} />}
    </div>
  );
}
