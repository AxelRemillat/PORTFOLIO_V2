import Link from "next/link";

// Mêmes liens que la navbar + LinkedIn. /ops volontairement discret (mono,
// petit) : la salle des machines se découvre, elle ne se met pas en avant.
const links = [
  { href: "/offres", label: "Offres" },
  { href: "/preuves", label: "Preuves" },
  { href: "/demos", label: "VEGA 1.0" },
  { href: "/parcours", label: "Parcours" },
  { href: "/contact", label: "Contact" },
  { href: "https://www.linkedin.com/in/axel-remillatesmelyon", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/50 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} Axel Remillat — Ingénieur IA · Mise en production
        </p>
        <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-sm text-muted hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/ops"
            className="text-xs font-mono text-muted/70 hover:text-orange transition-colors"
          >
            /ops
          </Link>
        </div>
      </div>
    </footer>
  );
}
