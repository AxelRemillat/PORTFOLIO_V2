import Link from "next/link";
import SectionLabel from "@/components/parcours/SectionLabel";
import { CALENDAR_URL } from "@/lib/site-config";
import { section, h2, btnMain } from "./homeStyles";

// À propos (court) + CTA final vers la prise de rendez-vous.
export default function HomeCta({ origine = "home", about = true }: { origine?: string; about?: boolean }) {
  return (
    <section style={{ ...section(820), paddingBottom: "16vh" }}>
      {about && (
        <div className="rv">
          <SectionLabel>06 // À PROPOS</SectionLabel>
          <h2 style={h2}>Axel Remillat, ingénieur IA</h2>
          <p style={{ margin: "0 0 3rem", fontSize: "1rem", lineHeight: 1.65, color: "#cbd5e1" }}>
            Je conçois des outils concrets qui font gagner du temps : un devis préparé en une minute, des factures
            saisies toutes seules, un fichier clients propre. Chaque projet commence sur vos propres exemples, pour que
            vous voyiez le résultat avant de décider. <Link href="/parcours" style={{ color: "#fb923c" }}>Mon parcours →</Link>
          </p>
        </div>
      )}
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "clamp(1.5rem, 4vw, 2.3rem)", fontWeight: 800, color: "var(--color-text)", margin: "0 0 1.5rem" }}>
          Une tâche qui vous fait perdre du temps ?
        </p>
        <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" style={btnMain}
          data-umami-event="cta-reserver" data-umami-event-origine={`${origine}-final`}>
          Parlons de votre cas — 15 min
        </a>
      </div>
    </section>
  );
}
