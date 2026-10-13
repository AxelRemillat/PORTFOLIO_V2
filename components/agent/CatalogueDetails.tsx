"use client";

import type { Metier } from "@/lib/metiers";
import { useAgentUi } from "./AgentUiContext";

// Catalogue d'exemple du métier, repliable : le visiteur voit d'où viennent les prix.
export default function CatalogueDetails({ metier }: { metier: Metier }) {
  const t = useAgentUi();
  const h = t.catalogueHead;
  return (
    <details className="ag-cat">
      <summary>{t.catalogueSummary(metier.catalogue.length)}</summary>
      <div className="ag-devis">
        <table className="wc-mr-table">
          <thead><tr><th>{h.ref}</th><th>{h.item}</th><th>{h.unit}</th><th>{h.price}</th></tr></thead>
          <tbody>
            {metier.catalogue.map((a) => (
              <tr key={a.ref}><td>{a.ref}</td><td>{a.nom}</td><td>{a.unite}</td><td>{t.eur(a.prix_unitaire)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
