"use client";

import { forwardRef } from "react";
import type { CSSProperties } from "react";

export interface TimelineEvent {
  year: string;
  type: string;
  color: "orange" | "blue" | "muted";
  company: string;
  role: string;
  period: string;
  description: string;
  achievements?: string[];
  skills: string[];
  current: boolean;
}

const badgeColor = (c: string) => (c === "orange" ? "#f97316" : c === "blue" ? "#3a6fa8" : "#444");
const roleColor = (c: string) => (c === "orange" ? "#f97316" : c === "blue" ? "#60a5fa" : "#94a3b8");

interface Props {
  event: TimelineEvent;
  side: "left" | "right";
  isVisible: boolean;
  delay: number;
}

const TimelineItem = forwardRef<HTMLDivElement, Props>(function TimelineItem(
  { event, side, isVisible, delay },
  ref,
) {
  const hiddenX = side === "right" ? "translateX(40px)" : "translateX(-40px)";
  const nodeOrange = event.current && event.color === "orange";

  const rowStyle: CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateX(0)" : hiddenX,
    transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    willChange: "opacity, transform",
  };

  return (
    <div className="tl-row" style={rowStyle} ref={ref}>
      <div
        className="tl-card"
        style={{
          gridColumn: side === "left" ? 1 : 3,
          textAlign: side === "left" ? "right" : "left",
        }}
      >
        <div className="tl-card-inner" style={{ display: "inline-block", textAlign: "left", maxWidth: "100%" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              textTransform: "uppercase",
              border: `1px solid ${badgeColor(event.color)}`,
              color: badgeColor(event.color),
              borderRadius: 3,
              padding: "2px 6px",
            }}
          >
            {event.type}
          </span>
          <p style={{ margin: "6px 0 0", fontWeight: 700, fontSize: 15, color: "#ffffff" }}>{event.company}</p>
          <p style={{ margin: 0, fontSize: 13, color: roleColor(event.color) }}>{event.role}</p>
          <p style={{ margin: "4px 0 0", fontFamily: "var(--font-mono)", fontSize: 11, color: "#64748b" }}>
            {event.period}
          </p>
          <p style={{ margin: "8px 0 0", fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{event.description}</p>

          {event.achievements?.map((a) => (
            <div
              key={a}
              style={{
                marginTop: 8,
                background: "rgba(249,115,22,0.06)",
                borderLeft: "2px solid #f97316",
                padding: "4px 8px",
                fontSize: 12,
                color: "#e2e8f0",
              }}
            >
              {a}
            </div>
          ))}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            {event.skills.map((s) => (
              <span
                key={s}
                style={{
                  background: "#1a1a2e",
                  border: "1px solid #2a2a42",
                  color: "#94a3b8",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 4,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="tl-node-cell">
        <span
          style={{
            width: 12,
            height: 12,
            marginTop: 4,
            borderRadius: "50%",
            border: "2px solid",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderColor: nodeOrange ? "#f97316" : "#2a2a42",
            background: nodeOrange ? "rgba(249,115,22,0.2)" : "#080810",
            boxShadow: nodeOrange ? "0 0 12px rgba(249,115,22,0.5)" : "none",
          }}
        >
          {nodeOrange && <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#f97316" }} />}
        </span>
      </div>
    </div>
  );
});

TimelineItem.displayName = "TimelineItem";

export default TimelineItem;
