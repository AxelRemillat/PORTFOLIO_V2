import type { Metadata } from "next";
import AgentDemo from "@/components/agent/AgentDemo";
import DemoSwitch from "@/components/demo-kit/DemoSwitch";
import ChezVousCta from "@/components/demo-kit/ChezVousCta";
import { WORKFLOW_CSS } from "@/components/preuves/demo/workflowCanvasCss";

// Page « Agent devis » — thème clair (tokens de /automatisations via WORKFLOW_CSS,
// scopé .wc-page). Le visiteur choisit son métier, envoie une demande type et
// obtient un devis structuré, les questions à poser et l'email de réponse.
export const metadata: Metadata = {
  alternates: { canonical: "/agent" },
  title: "Agent devis — testez sur votre métier | Axel Remillat",
  description:
    "Choisissez votre métier (menuiserie, BTP, négoce, boulangerie-traiteur, services), envoyez une demande client : l'agent prépare le devis HT/TVA/TTC, les questions à poser et l'email de réponse.",
};

export default function AgentPage() {
  return (
    <main className="wc-page">
      <style>{WORKFLOW_CSS}</style>
      <div className="wc-grid" aria-hidden />

      <div className="wc-inner">
        <DemoSwitch current="/agent" />
        <p className="wc-kicker">Démo testable // agent devis</p>
        <h1 className="wc-h1">Une demande client, un devis prêt à envoyer</h1>
        <p className="wc-lead">
          Choisissez votre métier et lancez une demande type. L&apos;agent cherche dans le catalogue, chiffre,
          liste ce qu&apos;il faut demander au client et rédige la réponse.
        </p>

        <AgentDemo />
        <ChezVousCta demo="agent" sujet="Démo agent devis : je voudrais la même chose avec mon catalogue" />
      </div>
    </main>
  );
}
