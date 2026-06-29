import Link from "next/link";
import { notFound } from "next/navigation";
import Badge from "@/components/ui/Badge";
import { getProjectBySlug, projects } from "@/lib/projects-data";

export async function generateStaticParams() {
  // "rise" est servi par la route statique app/projets/rise (fiche détaillée ;
  // le site live est sous /projets/rise/site).
  return projects.filter((p) => p.slug !== "rise").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  return project
    ? { title: `${project.title} — Axel Remillat`, description: project.tagline }
    : {};
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link
        href="/projets"
        className="text-sm text-muted hover:text-white transition-colors inline-flex items-center gap-1 mb-12"
      >
        ← Retour aux projets
      </Link>

      <p className="text-sm font-mono text-orange mb-3 tracking-[0.12em] uppercase">
        Projet
      </p>
      <h1 className="text-4xl font-bold text-white mb-2">{project.title}</h1>
      <p className="text-xl text-muted mb-8">{project.tagline}</p>

      <div className="flex flex-wrap gap-2 mb-12">
        {project.stack.map((tech) => (
          <Badge key={tech} label={tech} />
        ))}
      </div>

      <div className="space-y-10">
        <ProjectSection title="Le problème" content={project.problem} />
        <ProjectSection title="La solution" content={project.solution} />
        <ProjectSection title="Le résultat" content={project.result} />
      </div>

      {(project.demoUrl || project.githubUrl) && (
        <div className="mt-14 flex flex-wrap gap-4">
          {project.demoUrl && (
            <Link
              href={project.demoUrl}
              className="px-5 py-2.5 rounded-lg bg-orange text-white text-sm font-medium hover:bg-orange/90 transition-colors"
            >
              Tester la démo →
            </Link>
          )}
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg border border-border text-muted text-sm hover:text-white hover:border-white/20 transition-colors"
            >
              GitHub →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function ProjectSection({ title, content }: { title: string; content: string }) {
  return (
    <div className="border-l-2 border-orange/30 pl-6">
      <p className="text-xs font-mono text-orange uppercase tracking-[0.12em] mb-2">{title}</p>
      <p className="text-text leading-relaxed">{content}</p>
    </div>
  );
}
