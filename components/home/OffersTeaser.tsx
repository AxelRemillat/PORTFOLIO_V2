import Link from "next/link";
import SectionLabel from "@/components/parcours/SectionLabel";
import { OFFERS, offersFor } from "@/components/offres/offres-data";
import { section, h2, lead, card, grid } from "./homeStyles";
import { getLocale } from "@/lib/i18n/server";
import { localizedHref } from "@/lib/i18n/paths";
import { homeCopy } from "./copy";

// Les 4 offres en cartes courtes (source unique : offres-data), détail sur /offres.
export default async function OffersTeaser() {
  const locale = await getLocale();
  const c = homeCopy(locale).offers;
  return (
    <section id="offres" style={section()}>
      <div className="rv">
        <SectionLabel>{c.label}</SectionLabel>
        <h2 style={h2}>{c.title}</h2>
        <p style={lead}>{c.lead}</p>
      </div>
      <div style={grid(240)}>
        {offersFor(locale).map((o, index) => (
          // Événement Umami : nom FRANÇAIS de l'offre dans les deux langues, pour ne pas scinder les stats.
          <Link key={o.num} href={localizedHref("/offres", locale)} style={{ ...card, borderTop: `3px solid ${o.accent}`, display: "flex", flexDirection: "column", gap: "0.5rem", textDecoration: "none" }}
            data-ax-event="offre_click" data-ax-offre={OFFERS[index].name}>
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>{o.name}</h3>
            <p style={{ margin: 0, fontSize: "0.88rem", lineHeight: 1.5, color: "#b6b6c8" }}>{o.pitch}</p>
            <span className="font-mono" style={{ marginTop: "auto", paddingTop: "0.5rem", fontSize: "0.92rem", fontWeight: 700, color: "#fff" }}>{o.price}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
