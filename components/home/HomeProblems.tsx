import Link from "next/link";
import SectionLabel from "@/components/parcours/SectionLabel";
import { section, h2, lead, card, grid } from "./homeStyles";
import { getLocale } from "@/lib/i18n/server";
import { localizedHref } from "@/lib/i18n/paths";
import { homeCopy } from "./copy";

// « Ce que j'automatise » : un problème = une tuile = une démo testable.
// Liens et démos ici ; titres et textes dans home-copy (même ordre).
const TILES = [
  { href: "/agent", demo: "agent" },
  { href: "/automatisations?demo=email", demo: "email" },
  { href: "/automatisations?demo=invoice", demo: "invoice" },
  { href: "/automatisations?demo=meeting", demo: "meeting" },
  { href: "/automatisations?demo=dataclean", demo: "dataclean" },
  { href: "/automatisations?demo=sav", demo: "sav" },
];

export default async function HomeProblems() {
  const locale = await getLocale();
  const c = homeCopy(locale).problems;
  const tiles = TILES.map((tile, index) => ({ ...tile, ...c.tiles[index] }));
  return (
    <section id="automatisations" style={section()}>
      <div className="rv">
        <SectionLabel>{c.label}</SectionLabel>
        <h2 style={h2}>{c.title}</h2>
        <p style={lead}>{c.lead}</p>
      </div>
      <div style={grid(290)}>
        {tiles.map((x) => (
          <Link key={x.demo} href={localizedHref(x.href, locale)} className="hp-tile" style={{ ...card, display: "flex", flexDirection: "column", gap: "0.6rem", textDecoration: "none" }}
            data-ax-event="demo_start" data-ax-demo={x.demo}>
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>{x.t}</h3>
            <p style={{ margin: 0, fontSize: "0.92rem", lineHeight: 1.55, color: "#b6b6c8" }}>{x.d}</p>
            <span style={{ marginTop: "auto", paddingTop: "0.4rem", fontSize: "0.9rem", fontWeight: 700, color: "#fb923c" }}>{c.seeDemo}</span>
          </Link>
        ))}
      </div>
      <style>{`.hp-tile { transition: border-color .2s ease, transform .2s ease; } .hp-tile:hover { border-color: rgba(249,115,22,0.55) !important; transform: translateY(-2px); }
        @media (prefers-reduced-motion: reduce) { .hp-tile, .hp-tile:hover { transition: none; transform: none; } }`}</style>
    </section>
  );
}
