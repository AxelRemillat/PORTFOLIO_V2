import Link from "next/link";
import SectionLabel from "@/components/parcours/SectionLabel";
import { CALENDAR_URL } from "@/lib/site-config";
import { section, h2, btnMain } from "./homeStyles";
import { getLocale } from "@/lib/i18n/server";
import { localizedHref } from "@/lib/i18n/paths";
import { homeCopy } from "./copy";

// À propos (court) + CTA final vers la prise de rendez-vous.
export default async function HomeCta({ origine = "home", about = true }: { origine?: string; about?: boolean }) {
  const locale = await getLocale();
  const c = homeCopy(locale).cta;
  return (
    <section style={{ ...section(820), paddingBottom: "16vh" }}>
      {about && (
        <div className="rv">
          <SectionLabel>{c.label}</SectionLabel>
          <h2 style={h2}>{c.title}</h2>
          <p style={{ margin: "0 0 3rem", fontSize: "1rem", lineHeight: 1.65, color: "#cbd5e1" }}>
            {c.about} <Link href={localizedHref("/parcours", locale)} style={{ color: "#fb923c" }}>{c.journey}</Link>
          </p>
        </div>
      )}
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "clamp(1.5rem, 4vw, 2.3rem)", fontWeight: 800, color: "var(--color-text)", margin: "0 0 1.5rem" }}>
          {c.question}
        </p>
        <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" style={btnMain}
          data-ax-event="cta_rdv" data-ax-page={`${origine}-final`}>
          {c.button}
        </a>
      </div>
    </section>
  );
}
