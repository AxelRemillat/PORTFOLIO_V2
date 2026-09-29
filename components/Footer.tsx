import Link from "next/link";

// Mêmes liens que la navbar + LinkedIn + mentions légales. /ops n'est plus
// listée : ses tuiles affichent « câblage en cours » (page noindex).
const links = [
  { href: "/offres", label: "Offres" },
  { href: "/projets", label: "Projets" },
  { href: "/demos", label: "VEGA 1.0" },
  { href: "/parcours", label: "Parcours" },
  { href: "/contact", label: "Contact" },
  { href: "/mentions-legales", label: "Mentions légales" },
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
        </div>
      </div>
    </footer>
  );
}
