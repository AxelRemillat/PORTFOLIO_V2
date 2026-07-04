import Image from "next/image";
import StarField from "@/components/contact/StarField";
import FreqRow from "@/components/contact/FreqRow";
import ContactForm from "@/components/contact/ContactForm";

// Server component : conserve le SEO (metadata). StarField & ContactForm sont
// 'use client', FreqRow est statique.
export const metadata = {
  title: "Contact — Axel Remillat",
  description: "Contacter Axel Remillat — email, LinkedIn, téléphone, CV et formulaire.",
};

const PAD = "clamp(1.5rem, 4vw, 3rem)";

export default function ContactPage() {
  return (
    <main style={{ background: "var(--color-bg)", position: "relative", minHeight: "100vh" }}>
      <StarField />

      {/* HERO */}
      <section
        style={{
          minHeight: "55vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: PAD,
          paddingBottom: "2.5rem",
          position: "relative",
        }}
      >
        {/* Label HUD en haut du hero — même famille visuelle que /parcours
            (mono, 0.75rem, tracking 0.15em, fade-in via .parcours-fade) */}
        <p
          className="parcours-fade"
          style={{
            position: "absolute",
            top: "9vh",
            left: PAD,
            margin: 0,
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-orange)",
            animationDelay: "0.2s",
          }}
        >
          04 // CONTACT
        </p>

        <p
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#94a3b8",
            marginBottom: "1.5rem",
          }}
        >
          <span className="contact-ring" />
          Disponible — réponse sous 48h
        </p>

        {/* Titre sur UNE ligne (desktop) + photo juste à droite.
            Police calée en vw pour que "Construisons quelque chose." + la photo
            tiennent toujours sur la même ligne ; < 1100px : retour multi-lignes. */}
        <style>{`
          .contact-title { font-size: clamp(2.6rem, 4.6vw, 5.5rem); white-space: nowrap; }
          @media (max-width: 1100px) {
            .contact-title { font-size: clamp(2.4rem, 8vw, 4.5rem); white-space: normal; }
          }
        `}</style>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "clamp(1.75rem, 4vw, 3.5rem)",
            flexWrap: "wrap",
          }}
        >
          <h1
            className="contact-title"
            style={{
              margin: 0,
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              color: "var(--color-text)",
              flex: "0 1 auto",
            }}
          >
            Construisons{" "}
            <em style={{ color: "var(--color-orange)", fontStyle: "italic" }}>
              quelque chose.
            </em>
          </h1>

          <Image
            src="/contact/axel-portrait.jpg"
            alt="Axel Remillat"
            width={264}
            height={264}
            priority
            style={{
              width: "clamp(96px, 11vw, 160px)",
              height: "clamp(96px, 11vw, 160px)",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid rgba(249,115,22,0.55)",
              boxShadow: "0 0 28px rgba(249,115,22,0.22)",
              flexShrink: 0,
            }}
          />
        </div>

        <p
          style={{
            marginTop: "2rem",
            fontFamily: "var(--font-mono)",
            fontSize: 15,
            letterSpacing: "0.08em",
            color: "#8a9aab",
          }}
        >
          ─── COORDONNÉES + FORMULAIRE
        </p>
      </section>

      {/* COORDONNÉES */}
      <section style={{ padding: `0 ${PAD}`, borderTop: "1px solid var(--color-border)" }}>
        <FreqRow num="01" type="Email" value="axelremillat@netcourrier.com" href="mailto:axelremillat@netcourrier.com" />
        {/* FreqRow ajoute déjà ↗ + target _blank / rel noopener sur les liens http */}
        <FreqRow num="02" type="LinkedIn" value="Voir mon profil" href="https://linkedin.com/in/axel-remillatesmelyon" />
        <FreqRow num="03" type="Téléphone" value="+33 7 49 72 71 92" href="tel:+33749727192" />
        <FreqRow num="04" type="CV" value="Télécharger mon CV" href="/cv-axel-remillat.pdf" download badge="PDF 2026" />
      </section>

      {/* FORMULAIRE — fond distinct (surface) + liseré orange pour séparer
          visuellement la page en deux : coordonnées en haut / formulaire en bas */}
      <section
        style={{
          padding: PAD,
          marginTop: "clamp(2.5rem, 6vw, 5rem)",
          background: "var(--color-surface)",
          borderTop: "2px solid var(--color-orange)",
          boxShadow: "inset 0 24px 48px -32px rgba(249,115,22,0.18)",
          position: "relative",
        }}
      >
        <ContactForm />
      </section>
    </main>
  );
}
