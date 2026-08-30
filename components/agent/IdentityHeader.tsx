// En-tête d'identité : logotype d'entreprise crédible (Mobibureau) bien visible, puis
// le bot OSCAR (accent rose). Logos en SVG/CSS, aucune image externe.
export default function IdentityHeader() {
  return (
    <div className="ag-id">
      <div className="ag-brand-block">
        <div className="ag-brand">
          <span className="ag-brand-mark" aria-hidden>
            <svg viewBox="0 0 40 40" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="7" y="9" width="26" height="15" rx="2" />
              <path d="M7 24h26M14 31h12M20 24v7" />
            </svg>
          </span>
          <span className="ag-brand-word">Mobi<span>bureau</span></span>
        </div>
        <p className="ag-brand-line">Fournisseur de mobilier de bureau B2B — catalogue, stocks et livraison partout en France.</p>
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
          <p className="ag-bot-name">OSCAR <span className="ag-bot-tag">agent IA</span></p>
          <p className="ag-bot-desc">
            L&apos;agent IA de Mobibureau. Connecté au catalogue, aux stocks, aux zones de livraison et au calendrier,
            il traite une demande client de A à Z : <b>devis chiffré</b>, <b>email personnalisé</b> et <b>créneau de
            rendez-vous</b> — en autonomie.
          </p>
        </div>
      </div>
    </div>
  );
}
