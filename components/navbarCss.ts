// Styles de la barre de navigation (Navbar.tsx), sortis du composant pour le garder court.
export const NAVBAR_CSS = `
        .nv {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          height: 64px;
          background: transparent;
          border-bottom: 1px solid transparent;
          transition: background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease;
        }
        .nv-scrolled {
          background: rgba(8,8,16,0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid #1e1e32;
        }
        .nv-inner {
          max-width: 72rem; margin: 0 auto; height: 100%;
          padding: 0 24px;
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
        }

        .nv-brand {
          font-weight: 600; color: #ffffff; text-decoration: none;
          letter-spacing: -0.01em; white-space: nowrap;
          transition: opacity 0.2s ease;
        }
        .nv-brand span { color: #f97316; }
        .nv-brand:hover { opacity: 0.8; }

        .nv-center {
          display: flex; align-items: center; justify-content: center;
          gap: 28px; flex: 1;
        }
        .nv-link {
          position: relative;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 6px 0;
          color: rgba(255,255,255,0.62);
          transition: color 0.25s ease;
        }
        .nv-link:hover { color: rgba(255,255,255,0.9); }

        /* Couleur signature par page */
        .nv-link-demos.nv-active    { color: #f472b6; }
        .nv-link-demos:hover        { color: #f472b6; }
        .nv-link-offres.nv-active   { color: #f97316; }
        .nv-link-offres:hover       { color: #f97316; }
        .nv-link-preuves.nv-active  { color: #10b981; }
        .nv-link-preuves:hover      { color: #10b981; }
        .nv-link-parcours.nv-active { color: #a78bfa; }
        .nv-link-parcours:hover     { color: #a78bfa; }
        .nv-link-contact.nv-active  { color: #67e8f9; }
        .nv-link-contact:hover      { color: #67e8f9; }

        .nv-underline {
          position: absolute; left: 0; right: 0; bottom: -3px;
          height: 1.5px;
          transform: scaleX(0); transform-origin: left center;
          animation: nvUnderline 0.35s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        /* Couleur de l'underline selon la page active */
        .nv-link-demos .nv-underline    { background: #f472b6; }
        .nv-link-offres .nv-underline   { background: #f97316; }
        .nv-link-preuves .nv-underline  { background: #10b981; }
        .nv-link-parcours .nv-underline { background: #a78bfa; }
        .nv-link-contact .nv-underline  { background: #67e8f9; }
        @keyframes nvUnderline { from { transform: scaleX(0); } to { transform: scaleX(1); } }

        .nv-right { display: flex; align-items: center; gap: 14px; }

        .nv-vega {
          display: flex; align-items: center; gap: 8px;
          border: 1px solid rgba(249,115,22,0.4);
          border-radius: 40px;
          padding: 8px 18px;
          color: #f97316; font-size: 13px; font-weight: 600;
          letter-spacing: 0.06em; text-decoration: none;
          transition: all 0.25s ease;
          white-space: nowrap;
        }
        .nv-vega:hover, .nv-vega-active {
          background: rgba(249,115,22,0.08);
          border-color: #f97316;
        }
        .nv-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #f97316;
          animation: nvPulse 1.8s ease-in-out infinite;
        }
        @keyframes nvPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.35; transform: scale(0.8); }
        }

        .nv-burger {
          display: none;
          background: none; border: none; cursor: pointer;
          color: #94a3b8; padding: 4px;
          transition: color 0.2s ease;
        }
        .nv-burger:hover { color: #ffffff; }

        .nv-mobile {
          display: flex; flex-direction: column; gap: 4px;
          padding: 8px 24px 16px;
          background: rgba(8,8,16,0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid #1e1e32;
        }
        .nv-mobile a {
          font-size: 14px; color: #94a3b8; letter-spacing: 0.1em;
          font-weight: 700; text-transform: uppercase;
          text-decoration: none; padding: 10px 0;
          transition: color 0.2s ease;
        }
        .nv-mobile a:hover, .nv-mobile a.nv-active { color: #ffffff; }

        @media (max-width: 1000px) { .nv-center { gap: 18px; } .nv-link { letter-spacing: 0.08em; } }
        @media (max-width: 768px) {
          .nv-center { display: none; }
          .nv-burger { display: flex; }
        }
      `;
