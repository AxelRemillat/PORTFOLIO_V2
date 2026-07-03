"use client";

// Marquee horizontal infini des compétences. Extrait de SkillsSection pour
// garder chaque fichier sous 150 lignes.
const ALL_SKILLS = [
  "Python", "SQL", "OpenAI API", "pgvector", "FastAPI", "Supabase", "N8N",
  "Make", "Webhooks", "Google Cloud", "React", "Next.js", "TypeScript",
  "Docker", "Vercel", "BigQuery", "Vertex AI",
];

export default function SkillsMarquee() {
  // Tableau dupliqué ×2 : la translation de -50% boucle de façon transparente.
  const loop = [...ALL_SKILLS, ...ALL_SKILLS];

  return (
    <div
      style={{
        overflow: "hidden",
        width: "100%",
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <div className="parcours-marquee" style={{ display: "flex", width: "max-content" }}>
        {loop.map((s, i) => (
          <span key={i} className="parcours-skill-tag">{s}</span>
        ))}
      </div>
    </div>
  );
}
