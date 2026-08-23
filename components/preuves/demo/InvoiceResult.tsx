"use client";

import { INVOICE_CSS } from "./invoiceCss";

export interface InvoiceLine {
  designation?: string | null; quantite?: number | string | null;
  prix_unitaire?: number | string | null; montant?: number | string | null;
}
export interface InvoiceControl {
  ttc_calcule?: number | string | null; ttc_annonce?: number | string | null;
  ecart?: number | string | null; coherent?: boolean;
}
export interface InvoiceData {
  fournisseur?: string | null; numero_facture?: string | null;
  date?: string | null; date_echeance?: string | null; client?: string | null;
  lignes?: InvoiceLine[]; total_ht?: number | string | null;
  tva_taux?: number | string | null; tva_montant?: number | string | null;
  total_ttc?: number | string | null; devise?: string | null;
  controle?: InvoiceControl;
}

const isEmpty = (v: unknown) => v === null || v === undefined || v === "";
const dash = (v: unknown) => (isEmpty(v) ? "—" : String(v));
const money = (v: unknown, d: string) => (isEmpty(v) ? "—" : `${v} ${d}`.trim());
// Taux : n8n peut renvoyer 20 (nombre) ou "20%" (string) → « 20 % » dans les 2 cas.
const pct = (v: unknown) => (isEmpty(v) ? "—" : `${String(v).replace(/\s*%\s*$/, "")} %`);
// Devise : code ISO → symbole quand connu, sinon la valeur brute.
const CUR: Record<string, string> = { EUR: "€", USD: "$", GBP: "£" };

// Rendu « fiche extraite » d'une facture (thème clair, accent ambre). En haut le
// bandeau CONTRÔLE (signature « l'IA extrait, mon code vérifie »), puis en-tête,
// lignes (scroll interne), totaux. Vignette de l'image analysée si fournie (ctx.fileUrl).
export default function InvoiceResult({
  result, fileUrl, fileType, fileName,
}: { result: InvoiceData; fileUrl?: string | null; fileType?: string | null; fileName?: string | null }) {
  const r = result;
  const dev = (r.devise && CUR[r.devise]) || r.devise || "€";
  const c = r.controle ?? {};
  const ok = c.coherent === true;
  const lignes = r.lignes ?? [];
  const isPdf = fileType === "application/pdf" || !!fileName?.toLowerCase().endsWith(".pdf");

  return (
    <>
      <style>{INVOICE_CSS}</style>

      <div className={`wc-iv-ctrl ${ok ? "is-ok" : "is-warn"}`} role="status">
        <span className="wc-iv-ctrl-ico" aria-hidden>{ok ? "✓" : "⚠"}</span>
        {ok ? (
          <span>Totaux cohérents · HT + TVA = TTC</span>
        ) : (
          <span>
            Écart détecté : <b>{money(c.ecart, dev)}</b> (calculé {money(c.ttc_calcule, dev)} vs annoncé {money(c.ttc_annonce, dev)})
          </span>
        )}
      </div>

      <div className="wc-iv-top">
        {fileUrl && (isPdf ? (
          <figure className="wc-iv-thumb">
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="wc-iv-pdf"
              aria-label={`Ouvrir le PDF analysé${fileName ? " : " + fileName : ""}`}>
              <span className="wc-iv-pdf-ico" aria-hidden>PDF</span>
              <span className="wc-iv-pdf-name">{fileName || "Document PDF"}</span>
              <span className="wc-iv-pdf-open">Ouvrir ↗</span>
            </a>
            <figcaption>Document analysé</figcaption>
          </figure>
        ) : (
          <figure className="wc-iv-thumb">
            {/* eslint-disable-next-line @next/next/no-img-element -- objectURL client, non optimisable par next/image */}
            <img src={fileUrl} alt="Facture analysée" />
            <figcaption>Image analysée</figcaption>
          </figure>
        ))}
        <dl className="wc-iv-head">
          <div><dt>Fournisseur</dt><dd>{dash(r.fournisseur)}</dd></div>
          <div><dt>N° facture</dt><dd>{dash(r.numero_facture)}</dd></div>
          <div><dt>Date</dt><dd>{dash(r.date)}</dd></div>
          <div><dt>Échéance</dt><dd>{dash(r.date_echeance)}</dd></div>
          <div className="wc-iv-head-wide"><dt>Client</dt><dd>{dash(r.client)}</dd></div>
        </dl>
      </div>

      {lignes.length > 0 && (
        <div className="wc-iv-lines" tabIndex={0} role="group" aria-label="Lignes de la facture">
          <table className="wc-mr-table">
            <thead><tr><th>Désignation</th><th>Qté</th><th>P.U.</th><th>Montant</th></tr></thead>
            <tbody>
              {lignes.map((l, i) => (
                <tr key={i}>
                  <td>{dash(l.designation)}</td>
                  <td>{dash(l.quantite)}</td>
                  <td>{money(l.prix_unitaire, dev)}</td>
                  <td>{money(l.montant, dev)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <dl className="wc-iv-totals">
        <div><dt>Total HT</dt><dd>{money(r.total_ht, dev)}</dd></div>
        <div><dt>TVA ({pct(r.tva_taux)})</dt><dd>{money(r.tva_montant, dev)}</dd></div>
        <div className="wc-iv-ttc"><dt>Total TTC</dt><dd>{money(r.total_ttc, dev)}</dd></div>
      </dl>
    </>
  );
}
