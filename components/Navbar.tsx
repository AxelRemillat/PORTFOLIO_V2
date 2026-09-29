"use client";

import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVBAR_CSS } from "./navbarCss";

// « Démos » ouvre l'agent devis ; /automatisations est à un clic (DemoSwitch).
const LINKS = [
  { href: "/agent", label: "Démos", key: "demos", match: (p: string) => p.startsWith("/agent") || p.startsWith("/automatisations") },
  { href: "/offres", label: "Offres", key: "offres", match: (p: string) => p.startsWith("/offres") },
  { href: "/projets", label: "Projets", key: "preuves", match: (p: string) => p.startsWith("/projets") },
  { href: "/parcours", label: "Parcours", key: "parcours", match: (p: string) => p.startsWith("/parcours") },
  { href: "/contact", label: "Contact", key: "contact", match: (p: string) => p.startsWith("/contact") },
];

// Index après lequel la pill VEGA est insérée (entre Projets et Parcours)
const VEGA_AFTER = 2;

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
      <style>{NAVBAR_CSS}</style>

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
                  {/* Pill VEGA insérée entre Projets et Parcours */}
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
