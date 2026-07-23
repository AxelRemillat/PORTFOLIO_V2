"use client";

import ScrollReveal from "@/components/parcours/ScrollReveal";

// Deux bandeaux transverses : option conformité AI Act + tarifs de lancement.
export default function OffresBanners() {
  return (
    <section style={{ padding: "4vh 6vw", maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Option transverse — conformité AI Act */}
      <ScrollReveal>
        <div
          style={{
            border: "1px solid rgba(249,115,22,0.3)",
            background: "rgba(249,115,22,0.05)",
            borderRadius: 14,
            padding: "1.75rem",
          }}
        >
          <p style={{ margin: "0 0 0.6rem", fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-orange)" }}>
            Option transverse
          </p>
          <p style={{ margin: "0 0 0.75rem", fontSize: "1rem", lineHeight: 1.6, color: "var(--color-text)", fontWeight: 600 }}>
            Journalisation &amp; traçabilité AI Act — mise en conformité technique de
            vos systèmes (logs, horodatage, archivage).{" "}
            <span style={{ color: "var(--color-orange)" }}>L&apos;IA Act s&apos;applique : soyez prêts.</span>
          </p>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--color-muted)", fontStyle: "italic" }}>
            * Accompagnement technique — ne constitue pas un conseil juridique.
          </p>
        </div>
      </ScrollReveal>

      {/* Tarifs de lancement */}
      <ScrollReveal delay={0.08}>
        <div
          style={{
            border: "1px dashed var(--color-border)",
            borderRadius: 14,
            padding: "1.5rem 1.75rem",
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.6, color: "var(--color-text)" }}>
            <span style={{ fontWeight: 700, color: "var(--color-orange)" }}>Tarifs de lancement</span> — ils
            augmenteront avec le carnet de références. Les premiers clients sont les mieux servis.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
