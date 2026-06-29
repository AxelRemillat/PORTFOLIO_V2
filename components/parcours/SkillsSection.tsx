"use client";

import ScrollReveal from "./ScrollReveal";

const ALL_SKILLS = [
  "Python", "SQL", "OpenAI API", "pgvector", "FastAPI", "Supabase", "N8N",
  "Make", "Webhooks", "Google Cloud", "React", "Next.js", "TypeScript",
  "Docker", "Vercel", "BigQuery", "Vertex AI",
];

const GROUPS = [
  { category: "Data & IA", items: ["Python", "SQL", "OpenAI API", "pgvector", "FastAPI", "Supabase"] },
  { category: "Automatisation", items: ["N8N", "Make", "Webhooks", "Google Cloud"] },
  { category: "Développement", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { category: "Infrastructure", items: ["Docker", "Vercel", "BigQuery", "Cloud Run", "Vertex AI"] },
];

export default function SkillsSection() {
  // Tableau dupliqué ×2 : la translation de -50% boucle de façon transparente.
  const loop = [...ALL_SKILLS, ...ALL_SKILLS];

  return (
    <section style={{ padding: "12vh 0" }}>
      {/* Marquee horizontal infini */}
      <div
        style={{
          overflow: "hidden",
          width: "100%",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
          maskImage:
            "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        }}
      >
        <div className="parcours-marquee" style={{ display: "flex", width: "max-content" }}>
          {loop.map((s, i) => (
            <span key={i} className="parcours-skill-tag">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Grille des compétences */}
      <div style={{ maxWidth: "1100px", margin: "10vh auto 0", padding: "0 6vw" }}>
        <ScrollReveal>
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "var(--color-text)",
              marginBottom: "2rem",
            }}
          >
            Compétences
          </h2>
        </ScrollReveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1rem",
          }}
        >
          {GROUPS.map((g, i) => (
            <ScrollReveal key={g.category} delay={i * 0.1}>
              <div
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "0.75rem",
                  padding: "1.5rem",
                  height: "100%",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--color-orange)",
                    marginBottom: "1rem",
                  }}
                >
                  {g.category}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {g.items.map((it) => (
                    <span
                      key={it}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.8rem",
                        color: "var(--color-muted)",
                        background: "rgba(30,30,50,0.6)",
                        padding: "0.25rem 0.6rem",
                        borderRadius: "0.4rem",
                      }}
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
