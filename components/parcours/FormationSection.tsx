"use client";

import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import SectionLabel from "./SectionLabel";
import { localizedHref } from "@/lib/i18n/paths";
import { useLocale } from "@/lib/i18n/client";
import { parcoursCopy } from "./parcours-copy";

// CTA final orienté client : appel en principal (plein), CV en secondaire
// (outline). Le pont VEGA vit désormais en fin de timeline (TimelineSection).
export default function FormationSection() {
  const locale = useLocale();
  const c = parcoursCopy(locale).closing;
  return (
    <section style={{ padding: "10vh 6vw 18vh", maxWidth: "820px", margin: "0 auto" }}>
      <ScrollReveal delay={0.1}>
        <SectionLabel>{c.label}</SectionLabel>

        <div style={{ textAlign: "center", marginTop: "4vh" }}>
          <p
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              fontWeight: 700,
              color: "var(--color-text)",
              marginBottom: "2rem",
            }}
          >
            {c.question}
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <Link href={localizedHref("/contact", locale)} className="parcours-cta">
              {c.call}
            </Link>
            <a href="/CV-Axel-Remillat-2026.pdf" download className="parcours-cta-outline">
              {c.cv}
            </a>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
