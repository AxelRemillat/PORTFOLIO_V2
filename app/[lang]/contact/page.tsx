import StarField from "@/components/contact/StarField";
import FreqRow from "@/components/contact/FreqRow";
import ContactForm from "@/components/contact/ContactForm";
import ContactPrefill from "@/components/contact/ContactPrefill";
import ContactHero from "@/components/contact/ContactHero";
import { CALENDAR_URL } from "@/lib/site-config";
import { pageMetadata } from "@/lib/i18n/seo";
import { getLocale } from "@/lib/i18n/server";
import { contactCopy } from "@/components/contact/contact-copy";

// Server component : conserve le SEO (metadata). StarField & ContactForm sont
// 'use client', FreqRow est statique.
export const generateMetadata = pageMetadata("/contact", (locale) => contactCopy(locale).meta);

const PAD = "clamp(1.5rem, 4vw, 3rem)";

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const c = contactCopy(await getLocale(params));
  return (
    <main style={{ background: "var(--color-bg)", position: "relative", minHeight: "100vh" }}>
      <StarField />
      <ContactPrefill />

      <ContactHero c={c} />

      {/* COORDONNÉES */}
      <section style={{ padding: `0 ${PAD}`, borderTop: "1px solid var(--color-border)" }}>
        <FreqRow num="01" type={c.rows.email} value="axel@axelremillat.com" href="mailto:axel@axelremillat.com" />
        {/* FreqRow ajoute déjà ↗ + target _blank / rel noopener sur les liens http */}
        <FreqRow num="02" type={c.rows.linkedin} value={c.rows.linkedinValue} href="https://linkedin.com/in/axel-remillatesmelyon" cible="linkedin" />
        <FreqRow num="03" type={c.rows.phone} value="+33 7 49 72 71 92" href="tel:+33749727192" />
        <FreqRow num="04" type={c.rows.cv} value={c.rows.cvValue} href="/CV-Axel-Remillat-2026.pdf" download badge={c.rows.cvBadge} />
        <FreqRow num="05" type={c.rows.meeting} value={c.rows.meetingValue} href={CALENDAR_URL} />
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
