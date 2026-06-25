"use client";

import type { InstrumentId } from "./MusicCanvas";

const MAX_OBJECTS   = 8;
const MAX_PER_INSTR = 2;

const INSTRUMENTS: { id: InstrumentId; label: string; role: string; color: string }[] = [
  { id: "baobab", label: "Baobab",  role: "Batterie", color: "#8B4513" },
  { id: "cristal", label: "Cristal", role: "Basse",    color: "#00CED1" },
  { id: "renard",  label: "Renard",  role: "Mélodie",  color: "#FF6B35" },
  { id: "rose",    label: "Rose",    role: "Violon",   color: "#FF69B4" },
  { id: "mouton",  label: "Mouton",  role: "Piano",    color: "#F5F5F5" },
  { id: "etoile",  label: "Étoile",  role: "Synthé",   color: "#FFD700" },
];

export function MusicUI({
  selected,
  onSelect,
  count,
  perInstr,
  onClearAll,
}: {
  selected:   InstrumentId | null;
  onSelect:   (id: InstrumentId) => void;
  count:      number;
  perInstr:   Partial<Record<InstrumentId, number>>;
  onClearAll: () => void;
}) {
  const planetFull = count >= MAX_OBJECTS;

  return (
    <>
      {/* ── Invite message (disappears once something is placed) ── */}
      {count === 0 && (
        <div
          style={{
            position:      "absolute",
            top:           "60%",
            left:          "50%",
            transform:     "translate(-50%, -50%)",
            textAlign:     "center",
            color:         "rgba(200,210,255,0.48)",
            fontSize:      "14px",
            fontFamily:    "monospace",
            letterSpacing: "0.08em",
            pointerEvents: "none",
            whiteSpace:    "nowrap",
          }}
        >
          Choisis un instrument et clique sur la planète
        </div>
      )}

      {/* ── Bottom palette ── */}
      <div
        style={{
          position:       "absolute",
          bottom:         0,
          left:           0,
          right:          0,
          padding:        "14px 24px 22px",
          background:     "rgba(0,0,0,0.7)",
          backdropFilter: "blur(10px)",
          borderTop:      "1px solid rgba(100,120,200,0.15)",
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          gap:            "12px",
          pointerEvents:  "auto",
        }}
      >
        {/* Top row: counter + actions */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: "480px" }}>
          <div
            style={{
              fontSize:      "11px",
              fontFamily:    "monospace",
              letterSpacing: "0.1em",
              color:         planetFull ? "#ff7777" : "rgba(180,200,255,0.6)",
            }}
          >
            {count} / {MAX_OBJECTS} objets
            {planetFull && <span style={{ marginLeft: "8px", opacity: 0.8 }}>— planète complète</span>}
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={onClearAll}
              disabled={count === 0}
              style={{
                padding:      "4px 12px",
                fontSize:     "11px",
                fontFamily:   "monospace",
                background:   count === 0 ? "rgba(255,255,255,0.03)" : "rgba(255,60,60,0.08)",
                border:       `1px solid ${count === 0 ? "rgba(255,255,255,0.06)" : "rgba(255,80,80,0.3)"}`,
                borderRadius: "6px",
                color:        count === 0 ? "rgba(120,100,100,0.4)" : "rgba(255,130,130,0.9)",
                cursor:       count === 0 ? "default" : "pointer",
                transition:   "all 0.15s",
              }}
            >
              Tout effacer
            </button>
            <button
              disabled
              title="Bientôt disponible"
              style={{
                padding:      "4px 12px",
                fontSize:     "11px",
                fontFamily:   "monospace",
                background:   "rgba(255,255,255,0.03)",
                border:       "1px solid rgba(255,255,255,0.07)",
                borderRadius: "6px",
                color:        "rgba(110,130,170,0.38)",
                cursor:       "not-allowed",
              }}
            >
              ♪ Enregistrer
            </button>
          </div>
        </div>

        {/* Instrument buttons */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
          {INSTRUMENTS.map(({ id, label, role, color }) => {
            const isSelected  = selected === id;
            const placed      = perInstr[id] ?? 0;
            const isFull      = placed >= MAX_PER_INSTR;
            const isDisabled  = planetFull || isFull;

            return (
              <button
                key={id}
                onClick={() => !isDisabled && onSelect(id)}
                title={isFull ? `Max ${MAX_PER_INSTR} ${label} atteint` : `${label} — ${role}`}
                style={{
                  display:       "flex",
                  flexDirection: "column",
                  alignItems:    "center",
                  gap:           "5px",
                  padding:       "10px 16px 8px",
                  minWidth:      "70px",
                  background:    isSelected ? `${color}1a` : "rgba(8,8,24,0.65)",
                  border:        `1px solid ${isSelected ? color : "rgba(100,120,180,0.22)"}`,
                  borderRadius:  "10px",
                  cursor:        isDisabled ? "not-allowed" : "pointer",
                  opacity:       isDisabled ? 0.4 : 1,
                  transition:    "all 0.15s ease",
                  outline:       "none",
                  boxShadow:     isSelected ? `0 0 12px ${color}33` : "none",
                }}
              >
                {/* Colored dot */}
                <span
                  style={{
                    display:      "block",
                    width:        "10px",
                    height:       "10px",
                    borderRadius: "50%",
                    background:   color,
                    boxShadow:    isSelected ? `0 0 8px ${color}` : "none",
                    transition:   "box-shadow 0.15s",
                  }}
                />
                {/* Label */}
                <span
                  style={{
                    color:         isSelected ? color : "#8899bb",
                    fontSize:      "12px",
                    fontFamily:    "monospace",
                    letterSpacing: "0.04em",
                    transition:    "color 0.15s",
                  }}
                >
                  {label}
                </span>
                {/* Role */}
                <span
                  style={{
                    color:     "rgba(130,150,190,0.65)",
                    fontSize:  "10px",
                    fontFamily: "monospace",
                  }}
                >
                  {role}
                </span>
                {/* Slot dots: 2 dots, filled = placed */}
                <span style={{ display: "flex", gap: "4px" }}>
                  {[0, 1].map(i => (
                    <span
                      key={i}
                      style={{
                        display:      "block",
                        width:        "5px",
                        height:       "5px",
                        borderRadius: "50%",
                        background:   i < placed ? color : "rgba(100,120,180,0.28)",
                        transition:   "background 0.2s",
                      }}
                    />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
