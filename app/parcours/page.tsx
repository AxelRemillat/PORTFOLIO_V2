export const metadata = {
  title: "Parcours — Axel Remillat",
  description: "Profil, compétences, expériences d'Axel Remillat, ingénieur Data & IA ESME Paris.",
};

const skills = [
  { category: "Data & IA", items: ["Python", "SQL", "OpenAI API", "pgvector", "FastAPI", "Supabase"] },
  { category: "Automatisation", items: ["N8N", "Make", "Webhooks", "Google Cloud"] },
  { category: "Développement", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { category: "Infrastructure", items: ["Docker", "Vercel", "BigQuery", "Cloud Run", "Vertex AI"] },
];

const experiences = [
  {
    role: "Ingénieur IA Agentic & Gestion de données",
    company: "Andra Learning",
    type: "Alternance",
    period: "Juillet 2026 →",
    description: "EdTech — Station F. Maître d'apprentissage : Ouriel Bettach (CTO).",
    current: true,
  },
  {
    role: "Co-fondateur & Lead Tech",
    company: "RISE",
    type: "Startup",
    period: "2024 → aujourd'hui",
    description:
      "Plateforme de mobilité internationale étudiante. 3 concours remportés, asso officielle, béta en déploiement.",
    current: false,
  },
  {
    role: "Ingénieur stagiaire",
    company: "INOVALP",
    type: "Stage",
    period: "[À compléter]",
    description: "[À compléter]",
    current: false,
  },
  {
    role: "Ingénieur stagiaire",
    company: "ROSI Alpes",
    type: "Stage",
    period: "[À compléter]",
    description: "[À compléter]",
    current: false,
  },
];

export default function ParcoursPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-16">
        <p className="text-sm font-mono text-orange mb-3 tracking-[0.12em] uppercase">À propos</p>
        <h1 className="text-4xl font-bold text-white mb-4">Axel Remillat</h1>
        <p className="text-xl text-muted max-w-2xl leading-relaxed">
          Étudiant ingénieur 4e année ESME Paris (Big Data & IA). Je préfère construire
          et tester plutôt que présenter des slides.
        </p>
      </div>

      {/* Skills */}
      <div className="mb-16">
        <h2 className="text-xl font-bold text-white mb-6">Compétences</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {skills.map((skill) => (
            <div key={skill.category} className="bg-surface border border-border rounded-xl p-5">
              <p className="text-xs font-mono text-orange uppercase tracking-[0.1em] mb-3">
                {skill.category}
              </p>
              <div className="flex flex-wrap gap-2">
                {skill.items.map((item) => (
                  <span
                    key={item}
                    className="text-sm text-muted font-mono bg-border/60 px-2.5 py-1 rounded"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="mb-16">
        <h2 className="text-xl font-bold text-white mb-8">Expériences</h2>
        <div className="space-y-8">
          {experiences.map((exp) => (
            <div
              key={`${exp.company}-${exp.period}`}
              className={`relative pl-6 border-l-2 ${
                exp.current ? "border-orange" : "border-border"
              }`}
            >
              {exp.current && (
                <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-orange ring-4 ring-bg" />
              )}
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <p className="font-semibold text-white">{exp.role}</p>
                <span className="text-xs text-orange border border-orange/30 rounded px-1.5 py-0.5">
                  {exp.type}
                </span>
              </div>
              <p className="text-sm text-text mb-1">
                {exp.company} · <span className="text-muted">{exp.period}</span>
              </p>
              <p className="text-sm text-muted">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Formation */}
      <div className="p-6 bg-surface border border-border rounded-xl">
        <p className="text-xs font-mono text-orange uppercase tracking-[0.1em] mb-3">Formation</p>
        <p className="text-white font-semibold">ESME Paris — Diplôme d'ingénieur</p>
        <p className="text-sm text-muted mt-1">
          Spécialité Big Data / IA / Marketing · 2022 → 2027
        </p>
      </div>
    </div>
  );
}
