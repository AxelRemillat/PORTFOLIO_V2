import type { Metier } from "@/lib/metiers";

// En-tête d'identité : entreprise fictive du métier choisi + bandeau « catalogue
// d'exemple », puis l'agent OSCAR (accent rose). SVG inline, aucune image externe.
export default function IdentityHeader({ metier }: { metier: Metier }) {
  return (
    <div className="ag-id">
      <p className="ag-sample" role="note">
        <b>Catalogue d&apos;exemple</b> — chez vous, l&apos;agent utilise votre catalogue et vos prix.
      </p>
      <div className="ag-brand-block">
        <div className="ag-brand">
          <span className="ag-brand-mark" aria-hidden>
            <svg viewBox="0 0 40 40" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="8" y="7" width="24" height="26" rx="2" /><path d="M13 14h14M13 20h14M13 26h8" />
            </svg>
          </span>
          <span className="ag-brand-word">{metier.entreprise}</span>
        </div>
        <p className="ag-brand-line">{metier.activite}</p>
      </div>

      <div className="ag-bot">
        <span className="ag-bot-avatar" aria-hidden>
          <svg viewBox="0 0 32 32" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 5v3" /><circle cx="16" cy="4" r="1.4" fill="currentColor" stroke="none" />
            <rect x="6" y="9" width="20" height="15" rx="4" /><circle cx="12" cy="16" r="1.6" fill="currentColor" stroke="none" />
            <circle cx="20" cy="16" r="1.6" fill="currentColor" stroke="none" /><path d="M12 20h8" />
          </svg>
        </span>
        <div className="ag-bot-txt">
          <p className="ag-bot-name">OSCAR <span className="ag-bot-tag">agent devis</span></p>
          <p className="ag-bot-desc">
            Il lit la demande du client, cherche dans le catalogue, puis prépare un <b>devis chiffré</b> (HT, TVA, TTC,
            délai), les <b>questions à poser</b> s&apos;il manque une information, et l&apos;<b>email de réponse</b>.
          </p>
        </div>
      </div>
    </div>
  );
}
