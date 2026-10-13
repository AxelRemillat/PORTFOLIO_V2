import Link from "next/link";
import { useLocale, useMessages } from "@/lib/i18n/client";
import { localizedHref } from "@/lib/i18n/paths";

// Mêmes liens que la navbar + LinkedIn + mentions légales. /ops n'est plus
// listée : ses tuiles affichent « câblage en cours » (page noindex).
// Rendu côté client (importé par ConditionalFooter) : langue via useLocale().
export default function Footer() {
  const locale = useLocale();
  const t = useMessages().footer;
  const links = [
    { href: localizedHref("/offres", locale), label: t.offers },
    { href: localizedHref("/projets", locale), label: t.projects },
    { href: localizedHref("/demos", locale), label: "VEGA 1.0" },
    { href: localizedHref("/parcours", locale), label: t.journey },
    { href: localizedHref("/contact", locale), label: t.contact },
    { href: localizedHref("/mentions-legales", locale), label: t.legal },
    { href: "https://www.linkedin.com/in/axel-remillatesmelyon", label: "LinkedIn", cible: "linkedin" },
  ];
  return (
    <footer className="border-t border-border/50 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} Axel Remillat — {t.signature}
        </p>
        <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              data-ax-event={"cible" in link ? "sortie" : undefined}
              data-ax-cible={"cible" in link ? link.cible : undefined}
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
