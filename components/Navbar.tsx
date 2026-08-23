"use client";

import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/offres", label: "Offres", key: "offres", match: (p: string) => p.startsWith("/offres") },
  { href: "/projets", label: "Projets", key: "preuves", match: (p: string) => p.startsWith("/projets") },
  { href: "/parcours", label: "Parcours", key: "parcours", match: (p: string) => p.startsWith("/parcours") },
  { href: "/contact", label: "Contact", key: "contact", match: (p: string) => p.startsWith("/contact") },
];

// Index après lequel la pill VEGA est insérée (entre Preuves et Parcours)
const VEGA_AFTER = 1;

export default function Navbar() {
  const pathname = usePathname() || "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const vegaActive = pathname.startsWith("/demos");

  return (
    <>
      <style>{`
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
          gap: 36px; flex: 1;
        }
        .nv-link {
          position: relative;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 6px 0;
          color: rgba(255,255,255,0.3);
          transition: color 0.25s ease;
        }
        .nv-link:hover { color: rgba(255,255,255,0.9); }

        /* Couleur signature par page */
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

        @media (max-width: 768px) {
          .nv-center { display: none; }
          .nv-burger { display: flex; }
        }
      `}</style>

      <header className={`nv${scrolled ? " nv-scrolled" : ""}`}>
        <div className="nv-inner">
          <Link href="/" className="nv-brand">
            Axel <span>Remillat</span>
          </Link>

          <nav className="nv-center">
            {LINKS.map((l, idx) => {
              const active = l.match(pathname);
              return (
                <Fragment key={l.href}>
                  <Link href={l.href} className={`nv-link nv-link-${l.key}${active ? " nv-active" : ""}`}>
                    {l.label}
                    {active && <span className="nv-underline" />}
                  </Link>
                  {/* Pill VEGA insérée entre Preuves et Parcours */}
                  {idx === VEGA_AFTER && (
                    <Link href="/demos" className={`nv-vega${vegaActive ? " nv-vega-active" : ""}`}>
                      VEGA 1.0 <span className="nv-dot" />
                    </Link>
                  )}
                </Fragment>
              );
            })}
          </nav>

          <div className="nv-right">
            <button
              className="nv-burger"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {open ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {open && (
          <div className="nv-mobile">
            {LINKS.map((l, idx) => (
              <Fragment key={l.href}>
                <Link
                  href={l.href}
                  className={l.match(pathname) ? "nv-active" : ""}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
                {idx === VEGA_AFTER && (
                  <Link href="/demos" className={vegaActive ? "nv-active" : ""} onClick={() => setOpen(false)}>
                    VEGA 1.0
                  </Link>
                )}
              </Fragment>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
