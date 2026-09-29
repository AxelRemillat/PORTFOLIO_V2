import type { Metadata } from "next";
import DemoSwitch from "@/components/demo-kit/DemoSwitch";
import AutomationTabs from "@/components/preuves/demo/AutomationTabs";
import { WORKFLOW_CSS } from "@/components/preuves/demo/workflowCanvasCss";

// Page « Tester les automatisations » — thème CLAIR « canvas n8n » (scopé à
// .wc-page via WORKFLOW_CSS, n'affecte pas le thème sombre global). Conteneur des
// démos : une barre de 5 onglets → le WorkflowCanvas de l'onglet actif.
export const metadata: Metadata = {
  title: "Démos d'automatisation pour PME — Axel Remillat",
  description:
    "Testez en direct des automatisations pour PME : tri des emails, comptes rendus, fichier clients et doublons, factures, service client adapté à votre métier.",
};

export default function AutomatisationsPage() {
  return (
    <main className="wc-page">
      <style>{WORKFLOW_CSS}</style>
      <div className="wc-grid" aria-hidden />

      <div className="wc-inner">
        <DemoSwitch current="/automatisations" />
        <p className="wc-kicker">Démos testables // automatisations</p>
        <h1 className="wc-h1">Testez les automatisations</h1>
        <p className="wc-lead">
          Des tâches répétitives de PME, traitées en quelques secondes. Choisissez une démo, lancez un
          exemple ou essayez avec le vôtre.
        </p>

        <AutomationTabs />
      </div>
    </main>
  );
}
