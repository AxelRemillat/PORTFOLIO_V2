import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { getProjectBySlug, projects } from "@/lib/projects-data";
import ArchiDiagram from "@/components/preuves/archi/ArchiDiagram";
import BlueprintGrid from "@/components/preuves/archi/BlueprintGrid";
import { ARCHI_CSS } from "@/components/preuves/archi/archiCss";

const DOT: Record<string, string> = { live: "#22c55e", wip: "#f59e0b", building: "#60a5fa" };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  return project
    ? { title: `${project.title} — Architecture`, description: project.tagline, alternates: { canonical: `/projets/${slug}` } }
    : {};
}

export default async function ProjetDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const { accent, badge, state, title, tagline, stack, context, problem, result, demoUrl, offer } = project;
  const sc = DOT[state];
  const vars = {
    "--ac": accent, "--ac-weak": `${accent}1e`, "--ac-line": `${accent}55`,
    "--ac-grid": `${accent}16`, "--ac-state": sc,
  } as CSSProperties;
  const SECTIONS = [
    { n: "01", t: "Contexte", c: context },
    { n: "02", t: "Le défi", c: problem },
    { n: "03", t: "Résultat / état", c: result },
  ];

  return (
    <main className="ap-root" style={vars}>
      <style>{ARCHI_CSS}</style>
      <BlueprintGrid accent={accent} />

      <div className="ap-inner">
        <Link href="/projets" className="ap-back">← Retour aux projets</Link>

        <header>
          <p className="ap-kicker">
            <span className="ap-sdot" />{badge}<span className="ap-sep">{"//"}</span>Architecture
          </p>
          <h1 className="ap-h1">{title}</h1>
          <p className="ap-tag">{tagline}</p>
        </header>

        <div className="ap-grid">
          <div className="ap-main">
            <p className="ap-seclabel">Pipeline // flux de données</p>
            <ArchiDiagram slug={slug} />

            {SECTIONS.map((s) => (
              <section key={s.n} className="ap-sec">
                <p className="ap-seclabel">{`${s.n} // ${s.t}`}</p>
                <p className="ap-sectext">{s.c}</p>
              </section>
            ))}
          </div>

          <aside className="ap-rail">
            <p className="ap-seclabel">Spécifications</p>
            <div className="ap-spec">
              <div className="ap-spec-row">
                <span>Statut</span><b style={{ color: sc }}>{badge}</b>
              </div>
              <div className="ap-spec-stack">
                {stack.map((t) => <span key={t} className="ap-chip">{t}</span>)}
              </div>
            </div>
            <div className="ap-ctas">
              {demoUrl && <Link href={demoUrl} className="ap-cta1">Tester en live →</Link>}
              <Link href={offer.href} className="ap-cta2">{offer.label}</Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
