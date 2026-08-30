"use client";

export interface DevisLigne { designation: string; quantite: number; prix_unitaire: number; montant: number }
export interface AgentDevis {
  lignes: DevisLigne[];
  sous_total_ht: number;
  remise: { taux: number; montant: number };
  tva_montant: number;
  total_ttc: number;
  frais_livraison: number;
  franco?: boolean;
  delai_livraison: number;
}

const eur = (n: number) => `${(n ?? 0).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

export default function DevisTable({ devis }: { devis: AgentDevis }) {
  const d = devis;
  return (
    <>
      <div className="ag-devis">
        <table className="wc-mr-table">
          <thead><tr><th>Désignation</th><th>Qté</th><th>P.U. HT</th><th>Montant HT</th></tr></thead>
          <tbody>
            {d.lignes.map((l, i) => (
              <tr key={i}>
                <td>{l.designation}</td><td>{l.quantite}</td><td>{eur(l.prix_unitaire)}</td><td>{eur(l.montant)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="ag-tot">
        <div><dt>Sous-total HT</dt><dd>{eur(d.sous_total_ht)}</dd></div>
        {d.remise?.montant > 0 && (
          <div><dt>Remise −{Math.round(d.remise.taux * 100)} %</dt><dd>−{eur(d.remise.montant)}</dd></div>
        )}
        <div><dt>Frais de livraison</dt><dd>{d.frais_livraison > 0 ? eur(d.frais_livraison) : (d.franco ? "offerts (franco)" : "offerts")}</dd></div>
        <div><dt>TVA 20 %</dt><dd>{eur(d.tva_montant)}</dd></div>
        <div className="ag-ttc"><dt>Total TTC</dt><dd>{eur(d.total_ttc)}</dd></div>
      </dl>
      <p className="ag-meta">Délai de livraison estimé : <b>{d.delai_livraison} jours ouvrés</b></p>
    </>
  );
}
