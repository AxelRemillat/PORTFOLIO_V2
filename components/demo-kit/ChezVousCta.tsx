import Link from "next/link";
import { CALENDAR_URL } from "@/lib/site-config";

// Bloc de fin de démo « Et chez vous ? » : réserver 15 min (Cal.eu) ou décrire
// son besoin (/contact, sujet prérempli). Deux thèmes : clair (pages démo wc-*)
// et sombre (reste du site). Clics suivis par Umami (data-umami-event).
const CSS = `
.cv { margin:2rem 0 0; padding:1.5rem 1.4rem; border-radius:16px; text-align:center; }
.cv-light { background:#fff; border:1.5px solid var(--wc-border-strong); }
.cv-dark { background:rgba(249,115,22,0.06); border:1px solid rgba(249,115,22,0.3); }
.cv-t { margin:0 0 .35rem; font-size:1.35rem; font-weight:800; }
.cv-light .cv-t { color:var(--wc-text); } .cv-dark .cv-t { color:var(--color-text); }
.cv-s { margin:0 auto 1.2rem; max-width:52ch; font-size:.95rem; line-height:1.55; }
.cv-light .cv-s { color:var(--wc-muted); } .cv-dark .cv-s { color:#94a3b8; }
.cv-row { display:flex; flex-wrap:wrap; gap:.75rem; justify-content:center; }
.cv-a { display:inline-flex; align-items:center; justify-content:center; min-height:44px; padding:.7rem 1.3rem; border-radius:12px; font-weight:700; font-size:.95rem; text-decoration:none; }
.cv-main { background:#c2410c; color:#fff; }
.cv-main:hover { background:#9a3412; }
.cv-alt { border:1.5px solid currentColor; }
.cv-light .cv-alt { color:var(--wc-text); } .cv-dark .cv-alt { color:var(--color-text); }
`;

export function contactHref(sujet: string) {
  return `/contact?sujet=${encodeURIComponent(sujet)}`;
}

export default function ChezVousCta({
  demo, sujet, theme = "light", texte,
}: { demo: string; sujet: string; theme?: "light" | "dark"; texte?: string }) {
  return (
    <section className={`cv cv-${theme}`} aria-label="Et chez vous ?">
      <style>{CSS}</style>
      <p className="cv-t">Et chez vous ?</p>
      <p className="cv-s">
        {texte ?? "La même chose, avec vos documents, vos prix et vos outils. On regarde votre cas en 15 minutes, sans engagement."}
      </p>
      <div className="cv-row">
        <a className="cv-a cv-main" href={CALENDAR_URL} target="_blank" rel="noopener noreferrer"
          data-umami-event="cta-reserver" data-umami-event-origine={demo}>
          Réserver 15 min
        </a>
        <Link className="cv-a cv-alt" href={contactHref(sujet)}
          data-umami-event="cta-besoin" data-umami-event-origine={demo}>
          Me décrire votre besoin
        </Link>
      </div>
    </section>
  );
}
