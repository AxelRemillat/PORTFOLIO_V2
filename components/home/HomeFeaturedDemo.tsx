import Link from "next/link";
import SectionLabel from "@/components/parcours/SectionLabel";
import { getMetier } from "@/lib/metiers";
import { calculer_devis } from "@/lib/agent/tools";
import type { Locale } from "@/lib/i18n/config";
import { section, h2, lead, card, btnMain } from "./homeStyles";
import { getLocale } from "@/lib/i18n/server";
import { localizedHref } from "@/lib/i18n/paths";
import { homeCopy } from "./copy";

// Démo phare : aperçu d'un devis RÉELLEMENT calculé par le moteur de l'agent
// (au build, sans IA ni appel réseau), puis bouton vers /agent. En anglais, la
// fiche menuiserie jumelle (mêmes références, mêmes prix) donne le même devis.
function sampleQuote(locale: Locale) {
  const metier = getMetier("menuiserie", locale)!;
  return {
    demande: metier.exemples[0].texte,
    devis: calculer_devis(metier, {
      lignes: [{ ref: "FEN-PVC-100", quantite: 4 }, { ref: "PF-PVC-240", quantite: 1 }, { ref: "POSE-FEN", quantite: 4 }, { ref: "POSE-PF", quantite: 1 }],
      ville: "Tours",
    }),
  };
}
// Montants : « 1 234,56 € » en français, « €1,234.56 » en anglais (glossaire).
const money = (locale: Locale) => (n: number) =>
  locale === "en"
    ? `€${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `${n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
const row = { display: "flex", justifyContent: "space-between", gap: "1rem", fontSize: "0.88rem", padding: "0.35rem 0", color: "#cbd5e1" } as const;

export default async function HomeFeaturedDemo({ origine = "home" }: { origine?: string }) {
  const locale = await getLocale();
  const c = homeCopy(locale).featured;
  const { demande: DEMANDE, devis: DEVIS } = sampleQuote(locale);
  const eur = money(locale);
  return (
    <section id="demo-devis" style={section()}>
      <div className="rv">
        <SectionLabel>{c.label}</SectionLabel>
        <h2 style={h2}>{c.title}</h2>
        <p style={lead}>{c.lead}</p>
      </div>
      <div style={{ ...card, display: "grid", gap: "1.2rem", maxWidth: 760 }}>
        <p style={{ margin: 0, fontSize: "0.92rem", lineHeight: 1.55, color: "#e2e8f0", fontStyle: "italic" }}>{locale === "en" ? <>&ldquo;{DEMANDE}&rdquo;</> : <>« {DEMANDE} »</>}</p>
        <div>
          {DEVIS.lignes.map((l) => (
            <div key={l.ref} style={{ ...row, borderBottom: "1px solid var(--color-border)" }}>
              <span>{l.quantite} × {l.designation}</span><span className="font-mono">{eur(l.montant)}</span>
            </div>
          ))}
          <div style={row}><span>{c.totalExcl}</span><span className="font-mono">{eur(DEVIS.total_ht)}</span></div>
          <div style={row}><span>{c.vat}</span><span className="font-mono">{eur(DEVIS.tva_montant)}</span></div>
          <div style={{ ...row, fontWeight: 800, color: "#fff", fontSize: "1rem" }}><span>{c.totalIncl}</span><span className="font-mono">{eur(DEVIS.total_ttc)}</span></div>
          <p style={{ margin: "0.6rem 0 0", fontSize: "0.82rem", color: "#9a9ab0" }}>
            {c.delay(DEVIS.delai_jours)}
          </p>
        </div>
        <div>
          <Link href={localizedHref("/agent", locale)} style={btnMain} data-ax-event="demo_start" data-ax-demo="agent" data-ax-page={`${origine}-demo-phare`}>
            {c.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
