import type { Metier } from "@/lib/metiers";

const eur = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Catalogue d'exemple du métier, repliable : le visiteur voit d'où viennent les prix.
export default function CatalogueDetails({ metier }: { metier: Metier }) {
  return (
    <details className="ag-cat">
      <summary>Voir le catalogue d&apos;exemple ({metier.catalogue.length} articles)</summary>
      <div className="ag-devis">
        <table className="wc-mr-table">
          <thead><tr><th>Réf.</th><th>Article</th><th>Unité</th><th>Prix HT</th></tr></thead>
          <tbody>
            {metier.catalogue.map((a) => (
              <tr key={a.ref}><td>{a.ref}</td><td>{a.nom}</td><td>{a.unite}</td><td>{eur(a.prix_unitaire)} €</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
