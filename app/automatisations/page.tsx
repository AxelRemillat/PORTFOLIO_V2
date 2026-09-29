import type { Metadata } from "next";
import Link from "next/link";
import AutomationTabs from "@/components/preuves/demo/AutomationTabs";
import { WORKFLOW_CSS } from "@/components/preuves/demo/workflowCanvasCss";

// Page « Tester les automatisations » — thème CLAIR « canvas n8n » (scopé à
// .wc-page via WORKFLOW_CSS, n'affecte pas le thème sombre global). Conteneur des
// démos : une barre de 5 onglets → le WorkflowCanvas de l'onglet actif.
export const metadata: Metadata = {
  alternates: { canonical: "/automatisations" },
  title: "Tester les automatisations n8n — Axel Remillat",
  description:
    "Testez en direct mes automatisations métier n8n pour PME, mises en scène comme dans l'éditeur n8n : tri d'email, compte rendu, nettoyage data, facture, SAV.",
};

export default function AutomatisationsPage() {
  return (
    <main className="wc-page">
      <style>{WORKFLOW_CSS}</style>
      <div className="wc-grid" aria-hidden />

      <div className="wc-inner">
        <Link href="/projets" className="wc-back">← Retour aux projets</Link>
        <p className="wc-kicker">Automatisations n8n // démos testables</p>
        <h1 className="wc-h1">Testez mes automatisations</h1>
        <p className="wc-lead">
          Des workflows métier réels, mis en scène comme dans l&apos;éditeur n8n. Choisissez une
          automatisation et lancez-la.
        </p>

        <AutomationTabs />
      </div>
    </main>
  );
}
