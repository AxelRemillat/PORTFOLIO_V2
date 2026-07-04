"use client";

import Link from "next/link";
import ScrollReveal from "@/components/parcours/ScrollReveal";

// CTA final de la home.
export default function HomeCta() {
  return (
    <section style={{ padding: "8vh 6vw 18vh", textAlign: "center" }}>
      <ScrollReveal>
        <p
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            fontWeight: 700,
            color: "var(--color-text)",
            marginBottom: "2rem",
          }}
        >
          Une question ? Un projet ?
        </p>
        <Link href="/contact" className="parcours-cta">
          Me contacter →
        </Link>
      </ScrollReveal>
    </section>
  );
}
