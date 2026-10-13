"use client";

import type { DevisCalcule } from "@/lib/agent/tools";
import { useAgentUi } from "./AgentUiContext";

export type AgentDevis = DevisCalcule;

// Devis structuré : lignes chiffrées, lignes « à chiffrer », totaux HT / TVA par
// taux / TTC et délai. Tous les montants viennent du calcul serveur.
export default function DevisTable({ devis: d }: { devis: AgentDevis }) {
  const t = useAgentUi();
  const { eur, pct, table: th, delivery } = t;
  const lead = t.leadTime(d.delai_jours, d.a_chiffrer.length > 0);
  return (
    <>
      <div className="ag-devis">
        <table className="wc-mr-table">
          <thead><tr><th>{th.item}</th><th>{th.qty}</th><th>{th.unit}</th><th>{th.unitPrice}</th><th>{th.amount}</th></tr></thead>
          <tbody>
            {d.lignes.map((l) => (
              <tr key={l.ref}>
                <td>{l.designation}</td><td>{l.quantite}</td><td>{l.unite}</td><td>{eur(l.prix_unitaire)}</td><td>{eur(l.montant)}</td>
              </tr>
            ))}
            {d.a_chiffrer.map((l, i) => (
              <tr key={`todo-${i}`} className="ag-todo">
                <td>{l.designation}</td><td>{l.quantite}</td><td>{l.unite}</td><td colSpan={2}>{th.toPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="ag-tot">
        <div><dt>{th.subtotal}</dt><dd>{eur(d.sous_total_ht)}</dd></div>
        {d.remise?.montant > 0 && (
          <div><dt>{th.discount} −{pct(d.remise.taux)}</dt><dd>−{eur(d.remise.montant)}</dd></div>
        )}
        <div><dt>{delivery.label}</dt><dd>{d.frais_livraison > 0 ? eur(d.frais_livraison) : (d.livraison_offerte ? delivery.free : delivery.included)}</dd></div>
        <div><dt>{th.total}</dt><dd>{eur(d.total_ht)}</dd></div>
        {d.tva.map((v) => (
          <div key={v.taux}><dt>{th.vat} {pct(v.taux)}</dt><dd>{eur(v.montant)}</dd></div>
        ))}
        <div className="ag-ttc"><dt>{th.grand}</dt><dd>{eur(d.total_ttc)}</dd></div>
      </dl>
      <p className="ag-meta">{lead.before}<b>{lead.strong}</b>{lead.after}</p>
    </>
  );
}
