import Link from "next/link";
import Badge from "@/components/ui/Badge";
import type { Project } from "@/lib/projects-data";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projets/${project.slug}`}
      className="group block bg-surface border border-border rounded-xl p-6 hover:border-orange/40 transition-all duration-200 hover:shadow-[0_0_30px_rgba(249,115,22,0.06)]"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-white font-semibold group-hover:text-orange transition-colors">
          {project.title}
        </h3>
        {project.demoUrl && (
          <span className="shrink-0 text-xs text-orange border border-orange/30 rounded px-2 py-0.5">
            Démo live
          </span>
        )}
      </div>

      <p className="text-sm text-muted mb-4 line-clamp-2">{project.tagline}</p>

      <div className="flex flex-wrap gap-2">
        {project.stack.slice(0, 4).map((tech) => (
          <Badge key={tech} label={tech} />
        ))}
        {project.stack.length > 4 && (
          <Badge label={`+${project.stack.length - 4}`} />
        )}
      </div>
    </Link>
  );
}
