import Link from "next/link";
import SectionLabel from "@/components/parcours/SectionLabel";
import { section, h2, lead, card, grid } from "./homeStyles";

// « Ce que j'automatise » : un problème = une tuile = une démo testable.
const TILES = [
  { t: "Demandes & devis", d: "Une demande arrive par email : le devis chiffré et la réponse sont prêts en une minute, vous relisez et vous envoyez.", href: "/agent", demo: "agent" },
  { t: "Tri des emails et demandes", d: "Chaque email est classé, priorisé et reçoit un brouillon de réponse : plus rien ne se perd dans la boîte.", href: "/automatisations?demo=email", demo: "email" },
  { t: "Factures & documents", d: "Les factures fournisseurs sont lues, les montants vérifiés et reportés dans votre tableau, sans ressaisie.", href: "/automatisations?demo=invoice", demo: "invoice" },
  { t: "Comptes rendus", d: "Après une réunion ou un rendez-vous de chantier, le compte rendu avec décisions et actions est rédigé pour vous.", href: "/automatisations?demo=meeting", demo: "meeting" },
  { t: "Fichiers clients & doublons", d: "Votre fichier clients est remis au propre : formats harmonisés, doublons fusionnés, erreurs signalées.", href: "/automatisations?demo=dataclean", demo: "dataclean" },
  { t: "Service client", d: "Les questions fréquentes (délais, garanties, commandes) reçoivent une réponse juste, tirée de vos documents.", href: "/automatisations?demo=sav", demo: "sav" },
];

export default function HomeProblems() {
  return (
    <section id="automatisations" style={section()}>
      <div className="rv">
        <SectionLabel>01 // CE QUE J&apos;AUTOMATISE</SectionLabel>
        <h2 style={h2}>Ce que j&apos;automatise</h2>
        <p style={lead}>Six tâches qui reviennent chaque semaine dans une PME. Chacune a sa démo : essayez-la avec un exemple.</p>
      </div>
      <div style={grid(290)}>
        {TILES.map((x) => (
          <Link key={x.t} href={x.href} className="hp-tile" style={{ ...card, display: "flex", flexDirection: "column", gap: "0.6rem", textDecoration: "none" }}
            data-ax-event="demo_start" data-ax-demo={x.demo}>
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>{x.t}</h3>
            <p style={{ margin: 0, fontSize: "0.92rem", lineHeight: 1.55, color: "#b6b6c8" }}>{x.d}</p>
            <span style={{ marginTop: "auto", paddingTop: "0.4rem", fontSize: "0.9rem", fontWeight: 700, color: "#fb923c" }}>Voir la démo →</span>
          </Link>
        ))}
      </div>
      <style>{`.hp-tile { transition: border-color .2s ease, transform .2s ease; } .hp-tile:hover { border-color: rgba(249,115,22,0.55) !important; transform: translateY(-2px); }
        @media (prefers-reduced-motion: reduce) { .hp-tile, .hp-tile:hover { transition: none; transform: none; } }`}</style>
    </section>
  );
}
