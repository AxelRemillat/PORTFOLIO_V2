"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 3, label: "concours remportés" },
  { value: 5, label: "projets déployés" },
  { value: 4, label: "ans à l'ESME" },
];

// Compteur 0 → target sur 1.2s (ease-out cubic) via requestAnimationFrame.
function useCounter(target: number, run: boolean) {
  const [n, setN] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!run || started.current) return;
    started.current = true;
    const duration = 1200;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target]);

  return n;
}

function Stat({ value, label, run }: { value: number; label: string; run: boolean }) {
  const n = useCounter(value, run);
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontWeight: 700,
          fontSize: "clamp(3rem, 7vw, 6rem)",
          color: "var(--color-orange)",
          lineHeight: 1,
        }}
      >
        {n}
      </div>
      <div
        style={{
          marginTop: "0.75rem",
          fontFamily: "var(--font-mono)",
          fontSize: "0.85rem",
          color: "var(--color-muted)",
        }}
      >
        {label}
      </div>
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRun(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{ padding: "12vh 6vw", maxWidth: "1100px", margin: "0 auto" }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "clamp(2rem, 8vw, 6rem)",
        }}
      >
        {STATS.map((s) => (
          <Stat key={s.label} value={s.value} label={s.label} run={run} />
        ))}
      </div>
    </section>
  );
}
