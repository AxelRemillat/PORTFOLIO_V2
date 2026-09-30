"use client";

import Link from "next/link";
import ScrollReveal from "@/components/parcours/ScrollReveal";
import { CALENDAR_URL } from "@/lib/site-config";
import { btnMain, btnAlt } from "@/components/home/homeStyles";

// CTA final de /offres : réserver 15 min (Google Agenda) ou écrire via /contact.
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
          Une tâche à automatiser ?
        </p>
        <p style={{ color: "var(--color-muted)", fontSize: "1rem", marginBottom: "2rem" }}>
          Un échange de 15 minutes, gratuit, pour regarder votre cas.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.9rem", justifyContent: "center" }}>
          <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" style={btnMain}
            data-umami-event="cta-reserver" data-umami-event-origine="offres">
            Réserver 15 min
          </a>
          <Link href="/contact?sujet=Offres%20%3A%20je%20voudrais%20un%20devis" style={btnAlt}
            data-umami-event="cta-besoin" data-umami-event-origine="offres">
            Me décrire votre besoin
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
