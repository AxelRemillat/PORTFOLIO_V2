"use client";

import Link from "next/link";
import { CALENDAR_URL } from "@/lib/site-config";
import { contactHref } from "./ChezVousCta";
import { useLocale } from "@/lib/i18n/client";
import { localizedHref } from "@/lib/i18n/paths";
import { vegaUi } from "@/components/demos/vega-ui";

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
  const locale = useLocale();
  const t = vegaUi(locale).chezVous;
  return (
    <div className="vcv" role="complementary" aria-label={t.aria}>
      <style>{CSS}</style>
      <span className="vcv-t">{t.title}</span>
      <a className="vcv-main" href={CALENDAR_URL} target="_blank" rel="noopener noreferrer"
        data-ax-event="cta_rdv" data-ax-page="vega">{t.book}</a>
      <Link className="vcv-alt" href={localizedHref(contactHref(t.subject), locale)}
        data-ax-event="sortie" data-ax-cible="contact" data-ax-page="vega">{t.describe}</Link>
    </div>
  );
}
