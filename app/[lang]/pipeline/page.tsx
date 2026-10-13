import type { Metadata } from "next";
import Link from "next/link";
import PipelineDemo from "@/components/pipeline/PipelineDemo";
import { WORKFLOW_CSS } from "@/components/preuves/demo/workflowCanvasCss";
import { AGENT_CSS } from "@/components/agent/agentCss";
import { pageMetadata } from "@/lib/i18n/seo";
import { getLocale } from "@/lib/i18n/server";
import { localizedHref } from "@/lib/i18n/paths";
import { pipelineLabels } from "@/components/pipeline/labels";

// Page « Pipeline Data/ML en production » — thème clair (wc-page), cohérent avec
// /agent. Démo 100 % client-side d'un pipeline data → ML → prédiction : scoring
// de leads (proba de conversion), avec explicabilité. Aucune API, aucun secret.
export const generateMetadata = pageMetadata("/pipeline", (locale) => {
  const t = pipelineLabels(locale).page;
  return { title: t.title, description: t.description };
});

export default async function PipelinePage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await getLocale(params);
  const t = pipelineLabels(locale).page;
  return (
    <main className="wc-page">
      <style>{WORKFLOW_CSS}</style>
      <style>{AGENT_CSS}</style>
      <div className="wc-grid" aria-hidden />

      <div className="wc-inner">
        <Link href={localizedHref("/projets", locale)} className="wc-back">{t.back}</Link>
        <p className="wc-kicker">{t.kicker}</p>
        <h1 className="wc-h1">{t.h1}</h1>
        <p className="wc-lead">{t.lead}</p>
        <PipelineDemo />
      </div>
    </main>
  );
}
