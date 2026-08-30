import type { Metadata } from "next";
import Link from "next/link";
import PipelineDemo from "@/components/pipeline/PipelineDemo";
import { WORKFLOW_CSS } from "@/components/preuves/demo/workflowCanvasCss";
import { AGENT_CSS } from "@/components/agent/agentCss";

// Page « Pipeline Data/ML en production » — thème clair (wc-page), cohérent avec
// /agent. Démo 100 % client-side d'un pipeline data → ML → prédiction : scoring
// de leads (proba de conversion), avec explicabilité. Aucune API, aucun secret.
export const metadata: Metadata = {
  title: "Pipeline Data/ML en production — Axel Remillat",
  description:
    "Démo testable d'un pipeline data → ML → prédiction : scoring de leads (probabilité de conversion). Ingestion, nettoyage, feature engineering, régression logistique et explicabilité, en direct et 100 % client-side.",
};

export default function PipelinePage() {
  return (
    <main className="wc-page">
      <style>{WORKFLOW_CSS}</style>
      <style>{AGENT_CSS}</style>
      <div className="wc-grid" aria-hidden />

      <div className="wc-inner">
        <Link href="/projets" className="wc-back">← Retour aux projets</Link>
        <p className="wc-kicker">Pipeline Data/ML // démo testable</p>
        <h1 className="wc-h1">Scoring de leads — pipeline en production</h1>
        <p className="wc-lead">
          Un cas PME concret : estimer la probabilité de conversion de chaque lead. Tout le
          cycle en direct — ingestion → nettoyage → feature engineering → régression
          logistique → prédictions + explicabilité. Déterministe, gratuit, calculé dans votre navigateur.
        </p>
        <PipelineDemo />
      </div>
    </main>
  );
}
