import Link from "next/link";

// Bascule entre les deux pages de démos (thème clair wc-*) : agent devis d'abord,
// automatisations ensuite — même ordre que l'entrée « Démos » du menu.
const CSS = `
.ds { display:flex; flex-wrap:wrap; gap:.5rem; margin:0 0 1.4rem; }
.ds a { font-size:.88rem; font-weight:700; padding:.5rem 1rem; border-radius:999px; text-decoration:none;
  border:1.5px solid var(--wc-border-strong); color:var(--wc-text); background:#fff; }
.ds a[aria-current="page"] { background:var(--wc-text); border-color:var(--wc-text); color:#fff; }
`;

const ITEMS = [
  { href: "/agent", label: "Agent devis" },
  { href: "/automatisations", label: "Automatisations (tri, factures, SAV…)" },
];

export default function DemoSwitch({ current }: { current: "/agent" | "/automatisations" }) {
  return (
    <nav className="ds" aria-label="Démos">
      <style>{CSS}</style>
      {ITEMS.map((it) => (
        <Link key={it.href} href={it.href} aria-current={it.href === current ? "page" : undefined}>{it.label}</Link>
      ))}
    </nav>
  );
}
