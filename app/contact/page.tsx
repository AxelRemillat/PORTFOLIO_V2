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

        <h1
          style={{
            margin: 0,
            fontSize: "clamp(3rem, 9vw, 7rem)",
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            color: "var(--color-text)",
          }}
        >
          Construisons{" "}
          <em style={{ color: "var(--color-orange)", fontStyle: "italic" }}>
            quelque chose.
          </em>
        </h1>

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
        <FreqRow num="02" type="LinkedIn" value="axel-remillatesmelyon" href="https://linkedin.com/in/axel-remillatesmelyon" />
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
