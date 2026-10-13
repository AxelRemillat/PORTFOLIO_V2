import DemoSwitch from "@/components/demo-kit/DemoSwitch";
import AutomationTabs from "@/components/preuves/demo/AutomationTabs";
import { demoPages } from "@/components/demo-kit/demo-pages";
import { WORKFLOW_CSS } from "@/components/preuves/demo/workflowCanvasCss";
import { pageMetadata } from "@/lib/i18n/seo";
import { getLocale } from "@/lib/i18n/server";

// Page « Tester les automatisations » — thème CLAIR « canvas n8n » (scopé à
// .wc-page via WORKFLOW_CSS, n'affecte pas le thème sombre global). Conteneur des
// démos : une barre de 5 onglets → le WorkflowCanvas de l'onglet actif.
// Textes FR/EN : components/demo-kit/demo-pages(.en).ts.
export const generateMetadata = pageMetadata("/automatisations", (locale) => {
  const t = demoPages(locale).auto;
  return { title: t.title, description: t.description };
});

export default async function AutomatisationsPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await getLocale(params);
  const t = demoPages(locale).auto;
  return (
    <main className="wc-page">
      <style>{WORKFLOW_CSS}</style>
      <div className="wc-grid" aria-hidden />

      <div className="wc-inner">
        <DemoSwitch current="/automatisations" locale={locale} />
        <p className="wc-kicker">{t.kicker}</p>
        <h1 className="wc-h1">{t.h1}</h1>
        <p className="wc-lead">{t.lead}</p>

        <AutomationTabs />
      </div>
    </main>
  );
}
