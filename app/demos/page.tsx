import RagChat from "@/components/demos/RagChat";

export const metadata = {
  title: "Démos — Axel Remillat",
  description: "Chatbot RAG live qui répond sur le profil et les projets d'Axel Remillat.",
};

export default function DemosPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p className="text-sm font-mono text-orange mb-3 tracking-[0.12em] uppercase">
          Démo live
        </p>
        <h1 className="text-4xl font-bold text-white mb-4">CV Interactif RAG</h1>
        <p className="text-muted max-w-2xl">
          Pose n&apos;importe quelle question sur Axel — projets, compétences, parcours.
          Le chatbot interroge une base de connaissances vectorielle et répond en temps réel.
        </p>
      </div>

      <RagChat />

      <div className="mt-6 rounded-lg border border-border bg-surface p-5">
        <p className="text-xs font-mono text-orange mb-2 uppercase tracking-wide">Sous le capot</p>
        <p className="text-sm text-muted leading-relaxed">
          <span className="text-text font-medium">text-embedding-3-large</span> (1536 dim) →
          retrieval cosinus dans{" "}
          <span className="text-text font-medium">Supabase pgvector</span> →
          génération avec{" "}
          <span className="text-text font-medium">GPT-4o-mini</span>.
          Rate-limité à 10 req/heure · 50k tokens/jour.
        </p>
      </div>
    </div>
  );
}
