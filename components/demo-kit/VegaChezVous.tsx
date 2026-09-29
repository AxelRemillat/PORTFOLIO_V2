import Link from "next/link";
import { CALENDAR_URL } from "@/lib/site-config";
import { contactHref } from "./ChezVousCta";

// Version compacte de « Et chez vous ? » pour VEGA (page plein écran, sans
// footer) : bandeau fixe sous le titre, affiché après la première réponse.
const CSS = `
.vcv { position:fixed; top:100px; left:50%; transform:translateX(-50%); z-index:20; display:flex; align-items:center; gap:.6rem;
  flex-wrap:wrap; justify-content:center; padding:.45rem .6rem .45rem .9rem; border-radius:999px; max-width:calc(100vw - 32px);
  background:rgba(8,8,16,.82); border:1px solid rgba(249,115,22,.35); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); }
.vcv-t { font-size:.82rem; font-weight:700; color:#e2e8f0; }
.vcv a { font-size:.8rem; font-weight:700; text-decoration:none; padding:.4rem .8rem; border-radius:999px; }
.vcv-main { background:#c2410c; color:#fff; }
.vcv-alt { color:#e2e8f0; border:1px solid rgba(255,255,255,.3); }
`;

export default function VegaChezVous() {
  return (
    <div className="vcv" role="complementary" aria-label="Et chez vous ?">
      <style>{CSS}</style>
      <span className="vcv-t">Et chez vous ?</span>
      <a className="vcv-main" href={CALENDAR_URL} target="_blank" rel="noopener noreferrer"
        data-umami-event="cta-reserver" data-umami-event-origine="vega">Réserver 15 min</a>
      <Link className="vcv-alt" href={contactHref("Démo VEGA : un assistant comme celui-ci pour mon entreprise")}
        data-umami-event="cta-besoin" data-umami-event-origine="vega">Me décrire votre besoin</Link>
    </div>
  );
}
