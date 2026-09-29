import Link from "next/link";
import SectionLabel from "@/components/parcours/SectionLabel";
import { PROOFS } from "./proofs-data";
import { section, h2, lead } from "./homeStyles";

// Preuves : des projets réels, une ligne chacun (données : proofs-data.ts).
export default function ProjectsStrip() {
  return (
    <section id="preuves" style={section(900)}>
      <div className="rv">
        <SectionLabel>05 // PREUVES</SectionLabel>
        <h2 style={h2}>Des projets réels, pas des promesses</h2>
        <p style={lead}>Tout ce qui est testable l&apos;est, directement sur ce site.</p>
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, borderTop: "1px solid var(--color-border)" }}>
        {PROOFS.map((p) => (
          <li key={p.t} style={{ borderBottom: "1px solid var(--color-border)" }}>
            <Link href={p.href} className="ps-row" style={{ display: "flex", gap: "1rem", alignItems: "baseline", padding: "1rem 0.2rem", textDecoration: "none", flexWrap: "wrap" }}>
              <strong style={{ minWidth: 150, color: "#fff", fontSize: "1rem" }}>{p.t}</strong>
              <span style={{ flex: "1 1 280px", color: "#b6b6c8", fontSize: "0.92rem", lineHeight: 1.5 }}>{p.d}</span>
              <span aria-hidden style={{ color: "#fb923c" }}>→</span>
            </Link>
          </li>
        ))}
      </ul>
      <p style={{ margin: "1.2rem 0 0", fontSize: "0.9rem" }}>
        <Link href="/projets" style={{ color: "#fb923c", fontWeight: 700 }}>Tous les projets →</Link>
      </p>
    </section>
  );
}
