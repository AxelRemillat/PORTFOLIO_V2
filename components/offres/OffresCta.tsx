"use client";

import Link from "next/link";
import ScrollReveal from "@/components/parcours/ScrollReveal";
import { CALENDAR_URL } from "@/lib/site-config";
import { btnMain, btnAlt } from "@/components/home/homeStyles";
import { useLocale } from "@/lib/i18n/client";
import { localizedHref } from "@/lib/i18n/paths";
import { offresCopy } from "./offres-copy";

// CTA final de /offres : réserver 15 min (Google Agenda) ou écrire via /contact.
export default function OffresCta() {
  const locale = useLocale();
  const c = offresCopy(locale).cta;
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
          {c.question}
        </p>
        <p style={{ color: "var(--color-muted)", fontSize: "1rem", marginBottom: "2rem" }}>
          {c.lead}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.9rem", justifyContent: "center" }}>
          <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" style={btnMain}
            data-ax-event="cta_rdv" data-ax-page="offres">
            {c.call}
          </a>
          <Link href={localizedHref(`/contact?sujet=${encodeURIComponent(c.subject)}`, locale)} style={btnAlt}
            data-ax-event="sortie" data-ax-cible="contact" data-ax-page="offres">
            {c.write}
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
