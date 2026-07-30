import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import EmailTriageDemo from "@/components/preuves/demo/EmailTriageDemo";

// Page « Tester les automatisations » — route top-level dédié, même convention que
// la page démo de VEGA (/demos). Conteneur des démos d'automatisation n8n (5 à
// terme) ; pour l'instant un seul bloc : la démo tri d'email, réutilisée telle
// quelle. Accent émeraude n8n exposé en --ac pour les composants de démo.
const ACCENT = "#10b981";

export const metadata: Metadata = {
  title: "Tester les automatisations n8n — Axel Remillat",
  description:
    "Testez en direct mes automatisations métier n8n pour PME : aujourd'hui le tri d'email par IA, d'autres démos à venir.",
};

export default function AutomatisationsPage() {
  const vars = { "--ac": ACCENT, "--ac-weak": `${ACCENT}1e` } as CSSProperties;

  return (
    <main className="auto-main" style={vars}>
      <style>{`
        .auto-main { position:relative; min-height:100vh; background:var(--color-bg);
          padding:9vh clamp(1.25rem,5vw,3rem) 14vh; }
        .auto-wrap { max-width:820px; margin:0 auto; }
        /* .ap-seclabel : requis par les composants de démo (labels de section) */
        .ap-seclabel { font-family:var(--font-mono); font-size:.72rem; letter-spacing:.12em;
          text-transform:uppercase; color:var(--ac); margin:0 0 .9rem; }
        .auto-back { font-family:var(--font-mono); font-size:.8rem; color:var(--color-muted);
          text-decoration:none; display:inline-block; margin-bottom:2.5rem; transition:color .2s ease; }
        .auto-back:hover { color:#fff; }
        .auto-h1 { font-size:clamp(2rem,5vw,3rem); font-weight:900; color:#fff; line-height:1.05; margin:0 0 1rem; }
        .auto-lead { color:rgba(255,255,255,0.6); max-width:620px; line-height:1.6; margin:0 0 1.1rem; }
        .auto-soon { font-family:var(--font-mono); font-size:.76rem; color:var(--color-muted);
          border:1px dashed var(--color-border); border-radius:999px; padding:5px 14px; display:inline-block; }
        @media (prefers-reduced-motion: reduce) { .auto-back { transition:none; } }
      `}</style>

      <div className="auto-wrap">
        <Link href="/preuves" className="auto-back">← Retour aux preuves</Link>
        <p className="ap-seclabel">Automatisations // démos testables</p>
        <h1 className="auto-h1">Testez mes automatisations n8n</h1>
        <p className="auto-lead">
          Des workflows métier réels que vous déclenchez vous-même. Une démo en ligne aujourd&apos;hui —
          les suivantes arrivent.
        </p>
        <p className="auto-soon">1 démo en ligne · SAV, factures, comptes rendus… en préparation</p>

        <EmailTriageDemo />
      </div>
    </main>
  );
}
