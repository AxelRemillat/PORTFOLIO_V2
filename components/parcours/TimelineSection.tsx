"use client";

import { useEffect, useRef } from "react";
import ScrollReveal, { useScrollReveal } from "./ScrollReveal";
import TimelineItem from "./TimelineItem";
import ParcoursSnake from "./ParcoursSnake";
import SectionLabel from "./SectionLabel";
import { TIMELINE_EVENTS } from "./timeline-data";
import type { TimelineEvent } from "./TimelineItem";

function groupByYear(list: TimelineEvent[]) {
  const groups: { year: string; events: TimelineEvent[] }[] = [];
  for (const ev of list) {
    const g = groups.find((x) => x.year === ev.year);
    if (g) g.events.push(ev);
    else groups.push({ year: ev.year, events: [ev] });
  }
  return groups;
}

// Parallaxe légère des watermarks d'années : translateY lié à la position dans
// le viewport (amplitude ±20 px), rAF-throttlé. Inactif si reduced-motion.
function useWatermarkParallax(containerRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = containerRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const vh = window.innerHeight;
        el.querySelectorAll<HTMLElement>(".timeline-watermark-inner").forEach((wm) => {
          const r = wm.getBoundingClientRect();
          const t = (r.top + r.height / 2 - vh / 2) / vh; // -0.5 → 0.5 env.
          wm.style.transform = `translateY(${(t * 40).toFixed(1)}px)`;
        });
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [containerRef]);
}

type RevealProps = { event: TimelineEvent; side: "left" | "right"; delay: number };

// Wrapper : un observer par item, transmet isVisible à la card.
function Reveal({ event, side, delay }: RevealProps) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref}>
      <TimelineItem event={event} side={side} isVisible={isVisible} delay={delay} />
    </div>
  );
}

export default function TimelineSection() {
  const groups = groupByYear(TIMELINE_EVENTS);
  const containerRef = useRef<HTMLDivElement>(null);
  useWatermarkParallax(containerRef);
  let sideIndex = 0;

  return (
    <section style={{ padding: "4rem clamp(1rem, 4vw, 3rem)", maxWidth: 900, margin: "0 auto" }}>
      <ScrollReveal>
        <SectionLabel>03 // PARCOURS</SectionLabel>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--color-text)", margin: "0 0 2.5rem" }}>
          Parcours
        </h2>
      </ScrollReveal>

      <div ref={containerRef} className="timeline-track" style={{ overflow: "visible" }}>
        <ParcoursSnake containerRef={containerRef} />
        {groups.map((group, gi) => (
          <div
            key={`${group.year}-${gi}`}
            className="timeline-group"
            style={{ position: "relative", zIndex: 1, marginTop: gi === 0 ? 0 : "3rem", paddingTop: "3.5rem" }}
          >
            <div
              className="timeline-year-label"
              style={{ position: "relative", zIndex: 1, fontFamily: "var(--font-mono)", fontSize: 11, color: "#3a3a5c", textAlign: "center" }}
            >
              {group.year}
            </div>
            <div
              className="timeline-watermark"
              aria-hidden
              style={{
                position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                fontSize: "clamp(4rem, 10vw, 7rem)", fontWeight: 800, lineHeight: 1,
                color: "rgba(255,255,255,0.12)", letterSpacing: "-0.05em",
                pointerEvents: "none", userSelect: "none",
              }}
            >
              {/* Span interne : porte la parallaxe sans toucher au translateX du parent */}
              <span className="timeline-watermark-inner" style={{ display: "inline-block", willChange: "transform" }}>
                {group.year}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 2, position: "relative" }}>
              {group.events.map((ev, ei) => {
                const side: "left" | "right" = sideIndex % 2 === 0 ? "right" : "left";
                sideIndex++;
                return <Reveal key={`${ev.company}-${ev.period}`} event={ev} side={side} delay={ei * 0.08} />;
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
