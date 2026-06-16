import ProjectCard from "@/components/ui/ProjectCard";
import { projects } from "@/lib/projects-data";

export const metadata = {
  title: "Projets — Axel Remillat",
  description: "RISE, SEACO RAG, automatisations N8N, chatbot portfolio — mes projets Data & IA.",
};

export default function ProjetsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-12">
        <p className="text-sm font-mono text-orange mb-3 tracking-[0.12em] uppercase">
          Projets
        </p>
        <h1 className="text-4xl font-bold text-white mb-4">Ce que j'ai construit</h1>
        <p className="text-muted max-w-2xl">
          Chaque projet résout un vrai problème. Certains ont une démo live — vas voir par toi-même.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
