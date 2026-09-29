import Link from "next/link";
import SectionLabel from "@/components/parcours/SectionLabel";
import { OFFERS } from "@/components/offres/offres-data";
import { section, h2, lead, card, grid } from "./homeStyles";

// Les 4 offres en cartes courtes (source unique : offres-data), détail sur /offres.
export default function OffersTeaser() {
  return (
    <section id="offres" style={section()}>
      <div className="rv">
        <SectionLabel>04 // OFFRES</SectionLabel>
        <h2 style={h2}>Des prix clairs, fixés avant de commencer</h2>
        <p style={lead}>Un périmètre, un prix, un délai. Pas de dépassement surprise.</p>
      </div>
      <div style={grid(240)}>
        {OFFERS.map((o) => (
          <Link key={o.name} href="/offres" style={{ ...card, borderTop: `3px solid ${o.accent}`, display: "flex", flexDirection: "column", gap: "0.5rem", textDecoration: "none" }}
            data-umami-event="offre" data-umami-event-offre={o.name}>
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>{o.name}</h3>
            <p style={{ margin: 0, fontSize: "0.88rem", lineHeight: 1.5, color: "#b6b6c8" }}>{o.pitch}</p>
            <span className="font-mono" style={{ marginTop: "auto", paddingTop: "0.5rem", fontSize: "0.92rem", fontWeight: 700, color: "#fff" }}>{o.price}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
