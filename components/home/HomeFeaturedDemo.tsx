import Link from "next/link";
import SectionLabel from "@/components/parcours/SectionLabel";
import { MENUISERIE } from "@/lib/metiers/menuiserie";
import { calculer_devis } from "@/lib/agent/tools";
import { section, h2, lead, card, btnMain } from "./homeStyles";

// Démo phare : aperçu d'un devis RÉELLEMENT calculé par le moteur de l'agent
// (au build, sans IA ni appel réseau), puis bouton vers /agent.
const DEMANDE = MENUISERIE.exemples[0].texte;
const DEVIS = calculer_devis(MENUISERIE, {
  lignes: [{ ref: "FEN-PVC-100", quantite: 4 }, { ref: "PF-PVC-240", quantite: 1 }, { ref: "POSE-FEN", quantite: 4 }, { ref: "POSE-PF", quantite: 1 }],
  ville: "Tours",
});
const eur = (n: number) => `${n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
const row = { display: "flex", justifyContent: "space-between", gap: "1rem", fontSize: "0.88rem", padding: "0.35rem 0", color: "#cbd5e1" } as const;

export default function HomeFeaturedDemo({ origine = "home" }: { origine?: string }) {
  return (
    <section id="demo-devis" style={section()}>
      <div className="rv">
        <SectionLabel>02 // DÉMO PHARE</SectionLabel>
        <h2 style={h2}>Une demande client, un devis prêt à envoyer</h2>
        <p style={lead}>
          Choisissez votre métier (menuiserie, BTP, négoce, boulangerie-traiteur, services), envoyez une demande :
          l&apos;agent chiffre, liste les questions à poser au client et rédige la réponse.
        </p>
      </div>
      <div style={{ ...card, display: "grid", gap: "1.2rem", maxWidth: 760 }}>
        <p style={{ margin: 0, fontSize: "0.92rem", lineHeight: 1.55, color: "#e2e8f0", fontStyle: "italic" }}>« {DEMANDE} »</p>
        <div>
          {DEVIS.lignes.map((l) => (
            <div key={l.ref} style={{ ...row, borderBottom: "1px solid var(--color-border)" }}>
              <span>{l.quantite} × {l.designation}</span><span className="font-mono">{eur(l.montant)}</span>
            </div>
          ))}
          <div style={row}><span>Total HT (livraison incluse)</span><span className="font-mono">{eur(DEVIS.total_ht)}</span></div>
          <div style={row}><span>TVA 20 %</span><span className="font-mono">{eur(DEVIS.tva_montant)}</span></div>
          <div style={{ ...row, fontWeight: 800, color: "#fff", fontSize: "1rem" }}><span>Total TTC</span><span className="font-mono">{eur(DEVIS.total_ttc)}</span></div>
          <p style={{ margin: "0.6rem 0 0", fontSize: "0.82rem", color: "#9a9ab0" }}>
            Délai estimé : {DEVIS.delai_jours} jours ouvrés · catalogue d&apos;exemple
          </p>
        </div>
        <div>
          <Link href="/agent" style={btnMain} data-ax-event="demo_start" data-ax-demo="agent" data-ax-page={`${origine}-demo-phare`}>
            Tester sur mon métier
          </Link>
        </div>
      </div>
    </section>
  );
}
