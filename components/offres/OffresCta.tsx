"use client";

import Link from "next/link";
import ScrollReveal from "@/components/parcours/ScrollReveal";

// CTA final de /offres → /contact.
export default function OffresCta() {
  return (
    <section style={{ padding: "6vh 6vw 18vh", textAlign: "center" }}>
      <ScrollReveal>
        <p
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            fontWeight: 700,
            color: "var(--color-text)",
            marginBottom: "0.75rem",
          }}
        >
          Prêt à passer en production ?
        </p>
        <p style={{ color: "var(--color-muted)", fontSize: "1rem", marginBottom: "2rem" }}>
          Un appel de 30 minutes, gratuit, pour cadrer votre besoin.
        </p>
        <Link href="/contact" className="parcours-cta">
          Parlons-en →
        </Link>
      </ScrollReveal>
    </section>
  );
}
