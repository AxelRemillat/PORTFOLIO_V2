"use client";

import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import SectionLabel from "./SectionLabel";

// Intro personnelle : photo circulaire (même traitement que /contact) + texte.
// Desktop : photo à gauche, texte à droite. Mobile : photo au-dessus, centrée
// (flexWrap + justifyContent center).
export default function IntroSection() {
  return (
    <section style={{ padding: "15vh 6vw 10vh", maxWidth: "1100px", margin: "0 auto" }}>
      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--color-border)",
          opacity: 0.4,
          marginBottom: "8vh",
        }}
      />

      <ScrollReveal>
        <SectionLabel>01 // QUI SUIS-JE</SectionLabel>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(2rem, 5vw, 3.5rem)",
            marginTop: "2rem",
          }}
        >
          <Image
            src="/contact/axel-portrait.jpg"
            alt="Axel Remillat"
            width={400}
            height={400}
            style={{
              width: "clamp(160px, 16vw, 200px)",
              height: "clamp(160px, 16vw, 200px)",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid rgba(249,115,22,0.55)",
              boxShadow: "0 0 28px rgba(249,115,22,0.22)",
              flexShrink: 0,
            }}
          />

          <p
            style={{
              flex: "1 1 420px",
              minWidth: "min(100%, 320px)",
              margin: 0,
              fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)",
              lineHeight: 1.65,
              color: "var(--color-text)",
            }}
          >
            Ingénieur Data &amp; IA en formation à l&apos;ESME Paris, profil hybride
            tech × produit × business. Cofondateur de RISE, startup EdTech primée
            3 fois et incubée. Alternant Ingénieur IA Agentic dans une startup
            EdTech à Station F. Je construis des produits IA complets — de l&apos;idée au
            déploiement — et tout ce que je fais se teste en vrai sur ce site.
            Aujourd&apos;hui, j&apos;accompagne aussi PME et startups en freelance :
            mise en production et fiabilisation de systèmes IA.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
