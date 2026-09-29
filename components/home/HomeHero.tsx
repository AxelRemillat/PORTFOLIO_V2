import Link from "next/link";
import { CALENDAR_URL } from "@/lib/site-config";
import { btnMain, btnAlt } from "./homeStyles";

// Hero de la home (et de /pme via props) : promesse, sous-titre, 2 CTA. Composant
// serveur, sans JS ni animation sur le titre (affichage immédiat, bon LCP).
// Fond sombre + halo orange, repris de l'ancien hero.
export default function HomeHero({
  origine = "home",
  title = "J'automatise les tâches répétitives de votre PME avec l'IA",
  subtitle = "Devis, commandes, relances, documents : moins de ressaisie, des réponses plus rapides. Testable avant de signer.",
}: { origine?: string; title?: string; subtitle?: string }) {
  return (
    <section className="hh relative overflow-hidden">
      <div className="hh-bg" aria-hidden />
      <div className="hh-in relative">
        <p className="text-xs font-mono tracking-[0.2em] uppercase" style={{ color: "#fb923c", margin: 0 }}>
          Axel Remillat — ingénieur IA pour les PME
        </p>
        <h1 className="hh-title">{title}</h1>
        <p className="hh-sub">{subtitle}</p>
        <div className="hh-ctas">
          <Link href="/agent" style={btnMain} data-umami-event="cta-demo" data-umami-event-origine={origine}>
            Tester une démo
          </Link>
          <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" style={btnAlt}
            data-umami-event="cta-reserver" data-umami-event-origine={origine}>
            Réserver 15 min
          </a>
        </div>
      </div>
      <style>{`
        .hh { background: var(--color-bg); min-height: min(88vh, 760px); display: flex; align-items: center; }
        .hh-bg { position:absolute; inset:0; pointer-events:none;
          background:
            radial-gradient(60% 60% at 85% 35%, rgba(249,115,22,0.16), transparent 60%),
            radial-gradient(45% 45% at 50% 120%, rgba(249,115,22,0.07), transparent 70%); }
        .hh-in { width:100%; max-width:1100px; margin:0 auto; padding:4rem 6vw; display:flex; flex-direction:column; gap:1.4rem; }
        .hh-title { margin:0; font-size:clamp(2.2rem, 6.2vw, 4.4rem); font-weight:800; line-height:1.05; letter-spacing:-0.02em; color:#fff; max-width:18ch; }
        .hh-sub { margin:0; font-size:clamp(1.05rem, 2.4vw, 1.3rem); line-height:1.55; color:#cbd5e1; max-width:56ch; }
        .hh-ctas { display:flex; flex-wrap:wrap; gap:0.9rem; margin-top:0.6rem; }
      `}</style>
    </section>
  );
}
