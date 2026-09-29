"use client";

import ScrollReveal from "@/components/parcours/ScrollReveal";

// Bandeau transverse : conformité au règlement européen sur l'IA (AI Act).
export default function OffresBanners() {
  return (
    <section style={{ padding: "4vh 6vw", maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Sceau transversal — Conformité AI Act « by design » (vaut pour toutes les offres) */}
      <ScrollReveal>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "1.1rem",
            border: "1px solid rgba(249,115,22,0.35)",
            background: "linear-gradient(135deg, rgba(249,115,22,0.08), rgba(249,115,22,0.03))",
            borderRadius: 16,
            padding: "1.6rem 1.75rem",
          }}
        >
          {/* Sceau : bouclier + check */}
          <div
            aria-hidden
            style={{
              flexShrink: 0,
              width: 44,
              height: 44,
              borderRadius: 12,
              display: "grid",
              placeItems: "center",
              background: "rgba(249,115,22,0.12)",
              border: "1px solid rgba(249,115,22,0.4)",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>

          <div>
            <span
              style={{
                display: "inline-block",
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--color-orange)",
                border: "1px solid rgba(249,115,22,0.4)",
                background: "rgba(249,115,22,0.1)",
                borderRadius: 999,
                padding: "3px 12px",
                marginBottom: "0.75rem",
              }}
            >
              ✓ Conformité AI Act — by design
            </span>
            <p style={{ margin: "0 0 0.5rem", fontSize: "0.95rem", lineHeight: 1.65, color: "var(--color-text)" }}>
              Chaque automatisation respecte le règlement européen sur l&apos;IA : le niveau de
              risque est évalué, le fonctionnement documenté, et ce que fait l&apos;IA reste
              traçable. Vous l&apos;utilisez en règle, sans mauvaise surprise.
            </p>
            <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--color-muted)", fontStyle: "italic" }}>
              Intégré « by design » — accompagnement technique aligné sur le règlement, pas une certification légale ni un conseil juridique.
            </p>
          </div>
        </div>
      </ScrollReveal>

    </section>
  );
}
