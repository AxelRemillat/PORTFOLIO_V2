import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/paths";
import { demoPages } from "./demo-pages";

// Bascule entre les deux pages de démos (thème clair wc-*) : agent devis d'abord,
// automatisations ensuite — même ordre que l'entrée « Démos » du menu.
const CSS = `
.ds { display:flex; flex-wrap:wrap; gap:.5rem; margin:0 0 1.4rem; }
.ds a { font-size:.88rem; font-weight:700; padding:.5rem 1rem; border-radius:999px; text-decoration:none;
  border:1.5px solid var(--wc-border-strong); color:var(--wc-text); background:#fff; }
.ds a[aria-current="page"] { background:var(--wc-text); border-color:var(--wc-text); color:#fff; }
`;

export default function DemoSwitch({ current, locale = "fr" }: { current: "/agent" | "/automatisations"; locale?: Locale }) {
  const t = demoPages(locale);
  const ITEMS = [
    { href: "/agent", label: t.switchAgent },
    { href: "/automatisations", label: t.switchAuto },
  ];
  return (
    <nav className="ds" aria-label={t.switchAria}>
      <style>{CSS}</style>
      {ITEMS.map((it) => (
        <Link key={it.href} href={localizedHref(it.href, locale)} aria-current={it.href === current ? "page" : undefined}>{it.label}</Link>
      ))}
    </nav>
  );
}
