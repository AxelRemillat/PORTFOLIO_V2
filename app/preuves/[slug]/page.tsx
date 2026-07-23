import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, projects } from "@/lib/projects-data";

// Schémas d'architecture (texte stylisé) — une entrée par preuve.
const ARCHI: Record<string, string> = {
  vega: `Document (CV / Markdown)
   │  ingestion + découpe en chunks
   ▼
OpenAI  text-embedding-3-large ──► vecteurs 1536d
   │
   ▼
Supabase / pgvector  ◄── recherche cosinus (top-k)
   │  contexte pertinent
   ▼
gpt-4o-mini  ──► réponse sourcée
   │
   ▼
Synthèse vocale (TTS)  ──► voix
   │
   └─ garde-fou tokens/jour · rate-limit par IP`,
  n8n: `Déclencheur (webhook · email · cron)
   │
   ▼
 n8n  ──► routage + règles métier
   ├─ Agent IA (OpenAI)  ── extraction / rédaction
   ├─ Rate limit + retries
   └─ Monitoring / logs
   │
   ▼
Action (facture · email · compte rendu · SAV)`,
  infra: `Internet
   │  tunnel sécurisé (HTTPS)
   ▼
Reverse proxy
   ├─ API TTS (self-hosted)
   ├─ Ollama  ── LLM local
   └─ Services Docker
   │
   ├─ Monitoring (métriques + alertes)
   └─ Backups planifiés
   ▼
Serveur GPU (RTX) — production`,
};

const DOT: Record<string, string> = { live: "#22c55e", wip: "#f59e0b", building: "#60a5fa" };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  return project ? { title: `${project.title} — Preuve`, description: project.tagline } : {};
}

export default async function PreuveDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  const { accent } = project;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/preuves" className="text-sm text-muted hover:text-white transition-colors inline-flex items-center gap-1 mb-12">
        ← Retour aux preuves
      </Link>

      <div className="flex items-center gap-2 mb-4">
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: DOT[project.state] }} />
        <span className="text-xs font-mono uppercase tracking-[0.12em]" style={{ color: accent }}>
          {project.badge}
        </span>
      </div>
      <h1 className="text-4xl font-bold text-white mb-3">{project.title}</h1>
      <p className="text-lg text-muted mb-10">{project.tagline}</p>

      <div className="space-y-10">
        <Section title="Contexte" content={project.context} accent={accent} />
        <Section title="Problème" content={project.problem} accent={accent} />

        <div className="border-l-2 pl-6" style={{ borderColor: `${accent}55` }}>
          <p className="text-xs font-mono uppercase tracking-[0.12em] mb-3" style={{ color: accent }}>Architecture</p>
          <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${accent}33`, background: "rgba(0,0,0,0.35)" }}>
            <pre style={{ margin: 0, padding: 20, fontFamily: "monospace", fontSize: "0.8rem", lineHeight: 1.6, color: "rgba(255,255,255,0.82)", whiteSpace: "pre" }}>
              {ARCHI[slug]}
            </pre>
          </div>
        </div>

        <div className="border-l-2 pl-6" style={{ borderColor: `${accent}55` }}>
          <p className="text-xs font-mono uppercase tracking-[0.12em] mb-3" style={{ color: accent }}>Stack technique</p>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span key={tech} className="text-xs font-mono px-3 py-1 rounded" style={{ background: `${accent}18`, border: `1px solid ${accent}55`, color: "#fff" }}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        <Section title="Résultats / état" content={project.result} accent={accent} />
      </div>

      <div className="mt-14 flex flex-wrap gap-4">
        {project.demoUrl && (
          <Link href={project.demoUrl} className="px-5 py-2.5 rounded-lg text-sm font-bold" style={{ background: accent, color: "#0a0a0a" }}>
            Tester en live →
          </Link>
        )}
        <Link href={project.offer.href} className="px-5 py-2.5 rounded-lg text-sm font-semibold" style={{ border: `1px solid ${accent}88`, background: `${accent}14`, color: "#fff" }}>
          {project.offer.label}
        </Link>
      </div>
    </div>
  );
}

function Section({ title, content, accent }: { title: string; content: string; accent: string }) {
  return (
    <div className="border-l-2 pl-6" style={{ borderColor: `${accent}55` }}>
      <p className="text-xs font-mono uppercase tracking-[0.12em] mb-2" style={{ color: accent }}>{title}</p>
      <p className="text-text leading-relaxed">{content}</p>
    </div>
  );
}
