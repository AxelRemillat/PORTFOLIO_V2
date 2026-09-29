import type { Metadata } from "next";
import { OPS_METRICS } from "./ops-data";

// Server component : conserve le SEO. Squelette statique — les valeurs
// viendront de ops-data.ts quand le monitoring réel sera câblé.
export const metadata: Metadata = {
  // Tuiles encore en « câblage en cours » : ni indexée, ni dans le sitemap ni dans le menu.
  robots: { index: false, follow: false },
  title: "Ops — Axel Remillat | Salle des machines",
  description:
    "Le monitoring de ce site, en public : uptime, latence VEGA, requêtes et coût par réponse.",
};

const PAD = "clamp(1.5rem, 4vw, 3rem)";

export default function OpsPage() {
  return (
    <main style={{ background: "var(--color-bg)", minHeight: "100vh", padding: `10vh ${PAD} 14vh` }}>
      <style>{`
        .ops-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        @media (min-width: 600px)  { .ops-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .ops-grid { grid-template-columns: repeat(4, 1fr); } }
        .ops-tile {
          border: 1px solid var(--color-border);
          background: var(--color-surface);
          border-radius: 6px;
          padding: 1.25rem 1.25rem 1rem;
          display: flex; flex-direction: column; gap: 0.9rem;
          transition: border-color 0.25s ease;
        }
        .ops-tile:hover { border-color: rgba(249,115,22,0.45); }
        .ops-dot {
          width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
          background: var(--color-orange);
          animation: opsPulse 1.8s ease-in-out infinite;
        }
        @keyframes opsPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.3; transform: scale(0.8); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ops-dot { animation: none; }
        }
      `}</style>

      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <p
          style={{
            margin: "0 0 0.9rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-orange)",
          }}
        >
          OPS // SALLE DES MACHINES
        </p>

        <p
          style={{
            margin: "0 0 3.5rem",
            maxWidth: 640,
            fontSize: "clamp(1.05rem, 1.8vw, 1.3rem)",
            lineHeight: 1.6,
            color: "var(--color-text)",
          }}
        >
          Le monitoring de ce site, en public. Parce qu&apos;un ingénieur qui vous
          vend du monitoring doit montrer le sien.
        </p>

        <div className="ops-grid">
          {OPS_METRICS.map((m) => (
            <div key={m.id} className="ops-tile">
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#94a3b8",
                }}
              >
                {m.label}
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-mono)",
                  fontSize: "2.4rem",
                  fontWeight: 700,
                  lineHeight: 1,
                  color: m.value ? "var(--color-text)" : "var(--color-muted)",
                }}
              >
                {m.value ?? "—"}
              </p>
              <p
                style={{
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  color: "var(--color-muted)",
                }}
              >
                <span className="ops-dot" aria-hidden />
                {m.value ? m.detail : "câblage en cours"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
