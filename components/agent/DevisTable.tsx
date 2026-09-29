"use client";

import type { DevisCalcule } from "@/lib/agent/tools";

export type AgentDevis = DevisCalcule;

const eur = (n: number) => `${(n ?? 0).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
const pct = (t: number) => `${(t * 100).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`;

// Devis structuré : lignes chiffrées, lignes « à chiffrer », totaux HT / TVA par
// taux / TTC et délai. Tous les montants viennent du calcul serveur.
export default function DevisTable({ devis: d }: { devis: AgentDevis }) {
  return (
    <>
      <div className="ag-devis">
        <table className="wc-mr-table">
          <thead><tr><th>Désignation</th><th>Qté</th><th>Unité</th><th>P.U. HT</th><th>Montant HT</th></tr></thead>
          <tbody>
            {d.lignes.map((l) => (
              <tr key={l.ref}>
                <td>{l.designation}</td><td>{l.quantite}</td><td>{l.unite}</td><td>{eur(l.prix_unitaire)}</td><td>{eur(l.montant)}</td>
              </tr>
            ))}
            {d.a_chiffrer.map((l, i) => (
              <tr key={`todo-${i}`} className="ag-todo">
                <td>{l.designation}</td><td>{l.quantite}</td><td>{l.unite}</td><td colSpan={2}>à chiffrer</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="ag-tot">
        <div><dt>Sous-total HT</dt><dd>{eur(d.sous_total_ht)}</dd></div>
        {d.remise?.montant > 0 && (
          <div><dt>Remise −{pct(d.remise.taux)}</dt><dd>−{eur(d.remise.montant)}</dd></div>
        )}
        <div><dt>Livraison / déplacement</dt><dd>{d.frais_livraison > 0 ? eur(d.frais_livraison) : (d.livraison_offerte ? "offert" : "inclus")}</dd></div>
        <div><dt>Total HT</dt><dd>{eur(d.total_ht)}</dd></div>
        {d.tva.map((t) => (
          <div key={t.taux}><dt>TVA {pct(t.taux)}</dt><dd>{eur(t.montant)}</dd></div>
        ))}
        <div className="ag-ttc"><dt>Total TTC</dt><dd>{eur(d.total_ttc)}</dd></div>
      </dl>
      <p className="ag-meta">Délai estimé : <b>{d.delai_jours} jours ouvrés</b>{d.a_chiffrer.length > 0 ? " (hors lignes à chiffrer)" : ""}</p>
    </>
  );
}
