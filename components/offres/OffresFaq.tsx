"use client";

import { useEffect, useState } from "react";
import ScrollReveal from "@/components/parcours/ScrollReveal";
import SectionLabel from "@/components/parcours/SectionLabel";
import { FAQ } from "./offres-data";

// Mini-FAQ en accordéon. Une seule question ouverte à la fois. La transition
// d'ouverture est désactivée si prefers-reduced-motion.
export default function OffresFaq() {
  const [open, setOpen] = useState<number | null>(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() =>
      setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches),
    );
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section style={{ padding: "6vh 6vw", maxWidth: "820px", margin: "0 auto" }}>
      <ScrollReveal>
        <SectionLabel>02 // FAQ</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
          {FAQ.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                style={{
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.02)",
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1.1rem 1.25rem",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "var(--color-text)",
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  {f.q}
                  <span
                    aria-hidden
                    style={{
                      color: "var(--color-orange)",
                      fontSize: "1.4rem",
                      lineHeight: 1,
                      flexShrink: 0,
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      transition: reduce ? "none" : "transform 0.25s ease",
                    }}
                  >
                    +
                  </span>
                </button>
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    transition: reduce ? "none" : "grid-template-rows 0.3s ease",
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <p style={{ margin: 0, padding: "0 1.25rem 1.25rem", fontSize: "0.9rem", lineHeight: 1.6, color: "var(--color-muted)" }}>
                      {f.a}
                      {f.link && (
                        <>
                          {" "}
                          <a
                            href={f.link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "var(--color-orange)", textDecoration: "none", borderBottom: "1px solid rgba(249,115,22,0.45)", whiteSpace: "nowrap" }}
                          >
                            {f.link.label}
                          </a>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollReveal>
    </section>
  );
}
