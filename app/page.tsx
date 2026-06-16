import Link from "next/link";
import ProjectCard from "@/components/ui/ProjectCard";
import { getFeaturedProjects } from "@/lib/projects-data";

const stats = [
  { value: "3", label: "concours\nremportés" },
  { value: "4 500 €", label: "gagnés en\ncompétition" },
  { value: "1", label: "startup\nactive" },
];

export default function Home() {
  const featured = getFeaturedProjects();

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(249,115,22,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Glow */}
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-orange/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 py-24">
          <p className="text-sm font-mono text-orange mb-6 tracking-[0.15em] uppercase">
            Ingénieur Data & IA — ESME Paris
          </p>
          <h1 className="text-6xl md:text-8xl font-bold text-white leading-none mb-6 tracking-tight">
            Axel
            <br />
            <span className="text-orange">Remillat</span>
          </h1>
          <p className="text-lg md:text-xl text-muted mb-10 max-w-lg">
            Pas des screenshots —{" "}
            <span className="text-text">des projets testables en vrai.</span>
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/demos"
              className="px-6 py-3 rounded-lg bg-orange text-white font-medium hover:bg-orange/90 transition-colors"
            >
              Tester la démo RAG →
            </Link>
            <Link
              href="/projets"
              className="px-6 py-3 rounded-lg border border-border text-muted hover:text-white hover:border-white/20 transition-colors"
            >
              Voir les projets
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/50 bg-surface">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-3 divide-x divide-border/50">
          {stats.map((stat) => (
            <div key={stat.value} className="px-8 text-center first:pl-0 last:pr-0">
              <p className="text-3xl md:text-4xl font-bold text-orange mb-1">{stat.value}</p>
              <p className="text-xs text-muted whitespace-pre-line leading-relaxed">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured projects */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold text-white">Projets phares</h2>
          <Link
            href="/projets"
            className="text-sm text-muted hover:text-white transition-colors"
          >
            Voir tout →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      {/* Demo CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="rounded-xl border border-orange/20 bg-orange/5 p-10 md:p-14 text-center">
          <p className="text-sm font-mono text-orange mb-3 tracking-[0.12em] uppercase">
            Démo phare
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Interroge mon CV en temps réel
          </h2>
          <p className="text-muted mb-8 max-w-lg mx-auto">
            Un chatbot RAG qui répond sur mes projets, compétences et parcours.
            Pas générique — il sait qui je suis.
          </p>
          <Link
            href="/demos"
            className="inline-block px-6 py-3 rounded-lg bg-orange text-white font-medium hover:bg-orange/90 transition-colors"
          >
            Essayer maintenant →
          </Link>
        </div>
      </section>
    </>
  );
}
