import Image from "next/image";
import { CALENDAR_URL } from "@/lib/site-config";
import type { ContactCopy } from "./contact-copy";

// Hero de /contact (extrait de la page pour garder chaque fichier sous 150 lignes ;
// rendu inchangé). Composant serveur : reçoit les textes déjà dans la bonne langue.
const PAD = "clamp(1.5rem, 4vw, 3rem)";

export default function ContactHero({ c }: { c: ContactCopy }) {
  return (
    <>
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
            {c.page.label}
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
              {c.page.titleA}{" "}
              <em style={{ color: "var(--color-orange)", fontStyle: "italic" }}>
                {c.page.titleEm}
              </em>
            </h1>

            <Image
              src="/photos/axel-contact.jpg"
              alt="Axel Remillat"
              width={264}
              height={264}
              priority
              style={{
                width: "clamp(96px, 11vw, 160px)",
                height: "clamp(96px, 11vw, 160px)",
                borderRadius: "50%",
                objectFit: "cover",
                objectPosition: "50% 22%",
                border: "2px solid rgba(249,115,22,0.55)",
                boxShadow: "0 0 28px rgba(249,115,22,0.22)",
                flexShrink: 0,
              }}
            />
          </div>

          {/* Ligne de disponibilité freelance, juste sous le titre */}
          <p
            style={{
              marginTop: "1.5rem",
              marginBottom: 0,
              fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
              lineHeight: 1.6,
              color: "#b0bdcc",
            }}
          >
            {c.page.callA}{" "}
            <span style={{ color: "var(--color-orange)" }}>{c.page.callFree}</span>.{" "}
            <a
              href={CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-ax-event="cta_rdv"
              data-ax-page="contact"
              style={{ color: "var(--color-orange)", textDecoration: "none", borderBottom: "1px solid rgba(249,115,22,0.45)", whiteSpace: "nowrap" }}
            >
              {c.page.callLink}
            </a>
          </p>

          <p
            style={{
              marginTop: "2rem",
              fontFamily: "var(--font-mono)",
              fontSize: 15,
              letterSpacing: "0.08em",
              color: "#8a9aab",
            }}
          >
            {c.page.divider}
          </p>
        </section>
    </>
  );
}
