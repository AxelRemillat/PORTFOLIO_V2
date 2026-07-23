"use client";

import dynamic from "next/dynamic";
import { projects } from "@/lib/projects-data";
import PreuveCard from "@/components/projects/PreuveCard";

const SpaceBackground = dynamic(() => import("@/components/ui/SpaceBackground"), { ssr: false });

export default function PreuvesPage() {
  return (
    <>
      <style>{`
        @keyframes breatheOrange {
          0%,100% { box-shadow: 0 0 40px rgba(255,107,53,0.30), 0 0 80px rgba(255,107,53,0.15), inset 0 0 40px rgba(255,107,53,0.08); }
          50%     { box-shadow: 0 0 70px rgba(255,107,53,0.60), 0 0 120px rgba(255,107,53,0.30), inset 0 0 80px rgba(255,107,53,0.15); }
        }
        @keyframes breatheGreen {
          0%,100% { box-shadow: 0 0 35px rgba(16,185,129,0.28), 0 0 70px rgba(16,185,129,0.12), inset 0 0 45px rgba(16,185,129,0.06); }
          50%     { box-shadow: 0 0 70px rgba(16,185,129,0.55), 0 0 120px rgba(16,185,129,0.26), inset 0 0 80px rgba(16,185,129,0.13); }
        }
        @keyframes breathePurple {
          0%,100% { box-shadow: 0 0 40px rgba(168,85,247,0.30), 0 0 80px rgba(168,85,247,0.12), inset 0 0 50px rgba(168,85,247,0.06); }
          50%     { box-shadow: 0 0 75px rgba(168,85,247,0.60), 0 0 130px rgba(168,85,247,0.28), inset 0 0 90px rgba(168,85,247,0.14); }
        }
        @keyframes preuveDot {
          0%,100% { opacity: 1; transform: scale(1); }
          50%     { opacity: 0.4; transform: scale(1.5); }
        }
        .preuve-dot-pulse { animation: preuveDot 1.6s ease-in-out infinite; }
        @keyframes preuveHeadIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .preuve-head { animation: preuveHeadIn 0.6s cubic-bezier(0.16,1,0.3,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .preuve-head { animation: none !important; }
        }
      `}</style>

      <SpaceBackground />

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div style={{ marginBottom: 48 }}>
          <p
            className="preuve-head"
            style={{
              fontSize: "0.75rem",
              fontFamily: "monospace",
              color: "#f97316",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            PREUVES // EN PRODUCTION
          </p>
          <h1
            className="preuve-head"
            style={{ fontSize: "3.4rem", fontWeight: 900, color: "#fff", lineHeight: 1.05, margin: "0 0 16px", animationDelay: "0.08s" }}
          >
            Ne me croyez pas sur parole. Testez.
          </h1>
          <p
            className="preuve-head"
            style={{ color: "rgba(255,255,255,0.55)", maxWidth: 620, lineHeight: 1.6, animationDelay: "0.16s" }}
          >
            Chaque système ci-dessous tourne en vrai. Cliquez, essayez, cassez-les si
            vous pouvez.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {projects.map((project) => (
            <PreuveCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </>
  );
}
