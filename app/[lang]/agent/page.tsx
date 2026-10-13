import AgentDemo from "@/components/agent/AgentDemo";
import DemoSwitch from "@/components/demo-kit/DemoSwitch";
import ChezVousCta from "@/components/demo-kit/ChezVousCta";
import { demoPages } from "@/components/demo-kit/demo-pages";
import { WORKFLOW_CSS } from "@/components/preuves/demo/workflowCanvasCss";
import { pageMetadata } from "@/lib/i18n/seo";
import { getLocale } from "@/lib/i18n/server";

// Page « Agent devis » — thème clair (tokens de /automatisations via WORKFLOW_CSS,
// scopé .wc-page). Le visiteur choisit son métier, envoie une demande type et
// obtient un devis structuré, les questions à poser et l'email de réponse.
// Textes FR/EN : components/demo-kit/demo-pages(.en).ts.
export const generateMetadata = pageMetadata("/agent", (locale) => {
  const t = demoPages(locale).agent;
  return { title: t.title, description: t.description };
});

export default async function AgentPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await getLocale(params);
  const t = demoPages(locale).agent;
  return (
    <main className="wc-page">
      <style>{WORKFLOW_CSS}</style>
      <div className="wc-grid" aria-hidden />

      <div className="wc-inner">
        <DemoSwitch current="/agent" locale={locale} />
        <p className="wc-kicker">{t.kicker}</p>
        <h1 className="wc-h1">{t.h1}</h1>
        <p className="wc-lead">{t.lead}</p>

        <AgentDemo />
        <ChezVousCta demo="agent" sujet={t.ctaSubject} locale={locale} />
      </div>
    </main>
  );
}
