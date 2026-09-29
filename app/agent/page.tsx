import type { Metadata } from "next";
import Link from "next/link";
import AgentDemo from "@/components/agent/AgentDemo";
import IdentityHeader from "@/components/agent/IdentityHeader";
import { WORKFLOW_CSS } from "@/components/preuves/demo/workflowCanvasCss";

// Page « Agent commercial autonome » — thème clair (tokens de /automatisations via
// WORKFLOW_CSS, scopé .wc-page). Démo d'un agent IA (function-calling) qui traite
// une demande client de bout en bout : outils, décisions, livrable en 3 onglets.
export const metadata: Metadata = {
  alternates: { canonical: "/agent" },
  title: "Agent commercial autonome — Axel Remillat",
  description:
    "Démo testable d'un agent IA autonome (OSCAR) : collez une demande client, il raisonne, appelle ses outils (catalogue, stock, livraison, devis) et produit devis + email + créneau. Trace visible en direct.",
};

export default function AgentPage() {
  return (
    <main className="wc-page">
      <style>{WORKFLOW_CSS}</style>
      <div className="wc-grid" aria-hidden />

      <div className="wc-inner">
        <Link href="/projets" className="wc-back">← Retour aux projets</Link>
        <p className="wc-kicker">Agent IA autonome // démo testable</p>
        <h1 className="wc-h1">Agent commercial autonome</h1>

        <IdentityHeader />
        <AgentDemo />
      </div>
    </main>
  );
}
