"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { projects } from "@/lib/projects-data";
import type { Project } from "@/lib/projects-data";

const SpaceBackground  = dynamic(() => import("@/components/ui/SpaceBackground"),  { ssr: false });
const RobotModel       = dynamic(() => import("@/components/projects/RobotModel"),     { ssr: false });
const PlaneModel       = dynamic(() => import("@/components/projects/PlaneModel"),     { ssr: false });
const SatelliteModel   = dynamic(() => import("@/components/projects/SatelliteModel"), { ssr: false });
const GearsModel       = dynamic(() => import("@/components/projects/GearsModel"),     { ssr: false });

// ─── Theme config ─────────────────────────────────────────────────────────────

type ProjectTheme = {
  accent:      string;
  borderIdle:  string;
  cardBg:      string;
  glowAnim:    string;
  descColor:   string;
  tagBg:       string;
  tagBorder:   string;
  tagColor:    string;
  demoStyle:   React.CSSProperties;
  Model:       React.ComponentType;
};

const THEMES: Record<string, ProjectTheme> = {
  "rag-chatbot": {
    accent:     "#ff6b35",
    borderIdle: "#ff6b35",
    cardBg:     "linear-gradient(120deg, #1a0500 0%, #3d0e00 40%, #5a1500 100%)",
    glowAnim:   "breatheOrange 3s ease-in-out infinite",
    descColor:  "rgba(255,200,150,0.85)",
    tagBg:      "rgba(255,107,53,0.15)",
    tagBorder:  "rgba(255,107,53,0.35)",
    tagColor:   "#ff9966",
    demoStyle:  { background: "#ff6b35", color: "#fff", fontWeight: 700, border: "none" },
    Model:      RobotModel,
  },
  rise: {
    accent:     "#38bdf8",
    borderIdle: "#38bdf8",
    cardBg:     "linear-gradient(120deg, #000814 0%, #001d3d 45%, #003566 100%)",
    glowAnim:   "breatheBlue 4s ease-in-out infinite",
    descColor:  "rgba(150,225,255,0.85)",
    tagBg:      "rgba(56,189,248,0.15)",
    tagBorder:  "rgba(56,189,248,0.35)",
    tagColor:   "#7dd3fc",
    demoStyle:  { background: "#38bdf8", color: "#000", fontWeight: 700, border: "none" },
    Model:      PlaneModel,
  },
  seaco: {
    accent:     "#a855f7",
    borderIdle: "#a855f7",
    cardBg:     "radial-gradient(ellipse at 60% 40%, #3d0f72 0%, #1c0540 45%, #080118 100%)",
    glowAnim:   "breathePurple 3.5s ease-in-out infinite",
    descColor:  "rgba(210,160,255,0.85)",
    tagBg:      "rgba(168,85,247,0.15)",
    tagBorder:  "rgba(168,85,247,0.35)",
    tagColor:   "#c084fc",
    demoStyle:  { background: "#a855f7", color: "#fff", fontWeight: 700, border: "none" },
    Model:      SatelliteModel,
  },
  "n8n-automations": {
    accent:     "#10b981",
    borderIdle: "#10b981",
    cardBg:     "linear-gradient(135deg, #010a04 0%, #021508 50%, #033014 100%)",
    glowAnim:   "breatheGreen 3s ease-in-out infinite",
    descColor:  "rgba(150,255,200,0.85)",
    tagBg:      "rgba(16,185,129,0.15)",
    tagBorder:  "rgba(16,185,129,0.35)",
    tagColor:   "#34d399",
    demoStyle:  { background: "#10b981", color: "#000", fontWeight: 700, border: "none" },
    Model:      GearsModel,
  },
};

// ─── Decorators ───────────────────────────────────────────────────────────────

// Colonnes de pluie matrix style — 10 colonnes indépendantes à vitesses variées
const MATRIX_COLS = [
  { left: "2%",  dur: "6s",  delay: "0s",    content: "01001\nRAG>\n11010\nembed\n3.2ms\n00110\nvector\nmatch\n01100\nllm>\nstream\n01001\nquery\n11010\nembed" },
  { left: "8%",  dur: "8s",  delay: "1.2s",  content: "embed\n>3.2ms\n110101\nquery\nvector\n010011\nRAG>\nstream\nllm>\n010110\nmatch\n11010\n3.2ms\nembed" },
  { left: "14%", dur: "5s",  delay: "0.5s",  content: "11010\n00110\nvector\n01001\nRAG>\nembed\n3.2ms\nstream\nmatch\n010110\nquery\nllm>\n11010\n00110" },
  { left: "20%", dur: "9s",  delay: "2.1s",  content: "query\n010011\nRAG>\n110101\nembed\n3.2ms\n01001\nvector\nmatch\n11010\nstream\n00110\nllm>\nquery" },
  { left: "26%", dur: "7s",  delay: "0.8s",  content: "stream\n01100\n010011\nllm>\n3.2ms\nvector\nRAG>\n110101\nmatch\nembed\n01001\nquery\n11010\nstream" },
  { left: "33%", dur: "6.5s",delay: "3s",    content: "vector\n3.2ms\n01001\nmatch\n110101\nRAG>\nstream\n010011\nllm>\nembed\n11010\nquery\n01100\nvector" },
  { left: "40%", dur: "8.5s",delay: "1.7s",  content: "match\nllm>\n010110\nRAG>\n01001\nvector\n3.2ms\nstream\n00110\nquery\nembed\n110101\nmatch\nllm>" },
  { left: "47%", dur: "5.5s",delay: "0.3s",  content: "llm>\n11010\nRAG>\n3.2ms\n010011\nvector\nmatch\n01001\nstream\n00110\nquery\nembed\n01100\nllm>" },
  { left: "54%", dur: "7.5s",delay: "2.5s",  content: "3.2ms\nvector\nstream\n010110\nRAG>\n01001\n11010\nmatch\nllm>\n110101\nquery\n00110\nembed\n3.2ms" },
  { left: "60%", dur: "6s",  delay: "1s",    content: "110101\nmatch\n01100\nllm>\nvector\n01001\nRAG>\n3.2ms\nstream\n010011\n11010\nquery\n00110\n110101" },
];

function RagDecorator() {
  return (
    <>
      {/* Scanlines fines */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,107,53,0.018) 3px, rgba(255,107,53,0.018) 4px)",
      }} />
      {/* Colonnes matrix */}
      {MATRIX_COLS.map((col, i) => (
        <div key={i} style={{
          position: "absolute", top: 0, left: col.left,
          width: 52, height: "100%",
          pointerEvents: "none", zIndex: 0,
          overflow: "hidden",
        }}>
          <div
            className="scroll-code"
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              color: "#ff6b35",
              opacity: i % 3 === 0 ? 0.45 : i % 3 === 1 ? 0.30 : 0.20,
              lineHeight: 1.9,
              whiteSpace: "pre",
              animationDuration: col.dur,
              animationDelay: col.delay,
            }}
          >
            {col.content}
          </div>
        </div>
      ))}
    </>
  );
}

function RiseDecorator() {
  const stars = [
    { top: "12%", left: "6%",  size: 2, delay: "0s",   dur: "2.1s" },
    { top: "33%", left: "14%", size: 1, delay: "0.7s", dur: "3.2s" },
    { top: "58%", left: "4%",  size: 3, delay: "1.2s", dur: "2.7s" },
    { top: "18%", left: "24%", size: 1, delay: "0.3s", dur: "4s"   },
    { top: "72%", left: "17%", size: 2, delay: "1.8s", dur: "2.4s" },
    { top: "44%", left: "28%", size: 1, delay: "0.9s", dur: "3.5s" },
  ];
  const streaks = [
    { top: "20%", width: 90,  delay: "0s",   dur: "2.2s" },
    { top: "38%", width: 130, delay: "0.6s", dur: "2.8s" },
    { top: "58%", width: 70,  delay: "1.1s", dur: "1.9s" },
    { top: "76%", width: 110, delay: "1.7s", dur: "2.4s" },
  ];
  return (
    <>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse at 80% 50%, rgba(56,189,248,0.12) 0%, transparent 60%)",
      }} />
      {stars.map((s, i) => (
        <div key={i} className="star-twinkle" style={{
          position: "absolute", top: s.top, left: s.left,
          width: s.size, height: s.size,
          borderRadius: "50%", background: "white",
          pointerEvents: "none", zIndex: 0,
          animationDelay: s.delay, animationDuration: s.dur,
        }} />
      ))}
      {streaks.map((s, i) => (
        <div key={i} className="speed-streak" style={{
          position: "absolute", top: s.top, right: "42%",
          width: s.width, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), rgba(56,189,248,0.9), transparent)",
          pointerEvents: "none", zIndex: 0,
          animationDelay: s.delay, animationDuration: s.dur,
        }} />
      ))}
      <div style={{
        position: "absolute", bottom: "38%", left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.2), transparent)",
        pointerEvents: "none", zIndex: 0,
      }} />
    </>
  );
}

function SeacoDecorator() {
  const rings = [
    { size: 80,  delay: "0s",   border: "rgba(192,132,252,0.32)", glow: "0 0 6px rgba(168,85,247,0.2)" },
    { size: 155, delay: "0.7s", border: "rgba(168,85,247,0.22)",  glow: "0 0 4px rgba(168,85,247,0.12)" },
    { size: 240, delay: "1.4s", border: "rgba(147,51,234,0.15)",  glow: "none" },
    { size: 330, delay: "2.1s", border: "rgba(126,34,206,0.09)",  glow: "none" },
  ];

  const hLines = [
    { top: "18%", left: "4%",  width: "28%", delay: "0s",   dur: "4.2s" },
    { top: "38%", left: "2%",  width: "40%", delay: "1.5s", dur: "5.3s" },
    { top: "58%", left: "6%",  width: "22%", delay: "2.8s", dur: "3.8s" },
    { top: "75%", left: "3%",  width: "34%", delay: "3.5s", dur: "4.8s" },
  ];
  const vLines = [
    { left: "16%", top: "18%", h: "20%", delay: "0.8s",  dur: "5s"   },
    { left: "30%", top: "38%", h: "20%", delay: "2s",    dur: "5.8s" },
    { left: "9%",  top: "58%", h: "17%", delay: "3.2s",  dur: "4.5s" },
  ];

  return (
    <>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse at 65% 48%, rgba(168,85,247,0.22) 0%, rgba(124,58,237,0.08) 38%, transparent 65%)",
      }} />

      {rings.map((r, i) => (
        <div key={i} className="seaco-ring" style={{
          position: "absolute", right: "20%", top: "50%",
          width: r.size, height: r.size,
          borderRadius: "50%",
          border: `1.5px solid ${r.border}`,
          boxShadow: r.glow,
          transform: "translate(50%, -50%)",
          pointerEvents: "none", zIndex: 0,
          animationDelay: r.delay,
        }} />
      ))}

      {hLines.map((l, i) => (
        <div key={i} className="seaco-draw-h" style={{
          position: "absolute", top: l.top, left: l.left,
          width: l.width, height: 2,
          background: "linear-gradient(90deg, rgba(192,132,252,0.9), rgba(168,85,247,0.7), rgba(126,34,206,0.3))",
          boxShadow: "0 0 6px rgba(168,85,247,0.55)",
          pointerEvents: "none", zIndex: 0,
          animationDelay: l.delay, animationDuration: l.dur,
        }} />
      ))}

      {vLines.map((l, i) => (
        <div key={i} className="seaco-draw-v" style={{
          position: "absolute", left: l.left, top: l.top,
          width: 2, height: l.h,
          background: "linear-gradient(180deg, rgba(192,132,252,0.8), rgba(168,85,247,0.5), rgba(126,34,206,0.2))",
          boxShadow: "0 0 5px rgba(168,85,247,0.4)",
          pointerEvents: "none", zIndex: 0,
          animationDelay: l.delay, animationDuration: l.dur,
        }} />
      ))}
    </>
  );
}

function GearSvg({ size, gx, gy, teeth, color, opacity, dir, speed }: {
  size: number; gx: string; gy: string; teeth: number;
  color: string; opacity: number; dir: "cw" | "ccw"; speed: string;
}) {
  const half = size / 2;
  const R    = half * 0.88;
  const r    = half * 0.63;
  const hub  = half * 0.17;
  const dash = (2 * Math.PI * R) / (teeth * 2);

  return (
    <div style={{
      position: "absolute", left: gx, top: gy,
      transform: "translate(-50%, -50%)",
      pointerEvents: "none", zIndex: 0,
    }}>
      <svg
        width={size} height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          display: "block", opacity,
          animation: `${dir === "cw" ? "gearCw" : "gearCcw"} ${speed} linear infinite`,
        }}
      >
        {/* Dents */}
        <circle cx={half} cy={half} r={R} fill="none"
          stroke={color} strokeWidth={7}
          strokeDasharray={`${dash} ${dash}`}
        />
        {/* Jante */}
        <circle cx={half} cy={half} r={r}   fill="none" stroke={color} strokeWidth={1.5} />
        {/* Moyeu */}
        <circle cx={half} cy={half} r={hub} fill="none" stroke={color} strokeWidth={2}   />
        {/* Rayons */}
        {Array.from({ length: 4 }, (_, i) => {
          const a = (i / 4) * Math.PI * 2;
          return (
            <line key={i}
              x1={half + Math.cos(a) * hub} y1={half + Math.sin(a) * hub}
              x2={half + Math.cos(a) * r}   y2={half + Math.sin(a) * r}
              stroke={color} strokeWidth={1}
            />
          );
        })}
      </svg>
    </div>
  );
}

function N8nDecorator() {
  const color = "#10b981";
  const lines = [
    { top: "22%", delay: "0s",   dur: "3.5s" },
    { top: "50%", delay: "1.2s", dur: "3.5s" },
    { top: "76%", delay: "2.5s", dur: "3.5s" },
  ];
  return (
    <>
      {/* Grille circuit */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.09,
        backgroundImage: [
          "radial-gradient(circle, #10b981 1px, transparent 1px)",
          "linear-gradient(rgba(16,185,129,0.25) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(16,185,129,0.25) 1px, transparent 1px)",
        ].join(", "),
        backgroundSize: "20px 20px, 40px 40px, 40px 40px",
      }} />

      {/* Engrenages */}
      <GearSvg size={190} gx="60%" gy="50%" teeth={12} color={color} opacity={0.22} dir="cw"  speed="16s" />
      <GearSvg size={110} gx="75%" gy="70%" teeth={8}  color={color} opacity={0.26} dir="ccw" speed="10s" />
      <GearSvg size={72}  gx="71%" gy="26%" teeth={6}  color={color} opacity={0.18} dir="cw"  speed="7s"  />

      {/* Lignes de flux */}
      {lines.map((l, i) => (
        <div key={i} className="circuit-flow" style={{
          position: "absolute", top: l.top, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, #10b981, transparent)",
          opacity: 0.25,
          pointerEvents: "none", zIndex: 0,
          animationDelay: l.delay, animationDuration: l.dur,
        }} />
      ))}
    </>
  );
}

const DECORATORS: Record<string, React.ReactNode> = {
  "rag-chatbot":     <RagDecorator />,
  rise:              <RiseDecorator />,
  seaco:             <SeacoDecorator />,
  "n8n-automations": <N8nDecorator />,
};

// ─── ProjectCard3D ────────────────────────────────────────────────────────────

function ProjectCard3D({ project, index }: { project: Project; index: number }) {
  const theme = THEMES[project.slug];
  if (!theme) return null;
  const { accent, borderIdle, cardBg, glowAnim, descColor, tagBg, tagBorder, tagColor, demoStyle, Model } = theme;

  return (
    <div
      className="project-card"
      style={{
        border: `2px solid ${borderIdle}`,
        background: cardBg,
        borderRadius: 16,
        minHeight: 280,
        position: "relative",
        overflow: "hidden",
        animation: `fadeInUp 0.55s ease ${index * 120}ms both, ${glowAnim}`,
      }}
    >
      {DECORATORS[project.slug]}

      <Link
        href={`/projets/${project.slug}`}
        className="flex flex-col sm:flex-row h-full"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Left — 60% text */}
        <div style={{
          flexBasis: "60%", flexShrink: 0,
          padding: "40px",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          borderRight: `1px solid ${accent}44`,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
              <h3 style={{ color: "#ffffff", fontSize: "1.8rem", fontWeight: 800, lineHeight: 1.2, margin: 0 }}>
                {project.title}
              </h3>
              {project.demoUrl && (
                <span style={{
                  ...demoStyle,
                  flexShrink: 0,
                  fontSize: "0.75rem",
                  fontFamily: "monospace",
                  padding: "6px 16px",
                  borderRadius: 20,
                }}>
                  Démo live
                </span>
              )}
            </div>
            <p style={{ color: descColor, fontSize: "0.9rem", lineHeight: 1.65, margin: 0 }}>
              {project.tagline}
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 24 }}>
            {project.stack.slice(0, 5).map((tech) => (
              <span key={tech} style={{
                display: "inline-block",
                padding: "3px 12px",
                borderRadius: 6,
                fontSize: "0.72rem",
                fontFamily: "monospace",
                fontWeight: 500,
                background: tagBg,
                border: `1px solid ${tagBorder}`,
                color: tagColor,
              }}>
                {tech}
              </span>
            ))}
            {project.stack.length > 5 && (
              <span style={{
                display: "inline-block",
                padding: "3px 12px",
                borderRadius: 6,
                fontSize: "0.72rem",
                fontFamily: "monospace",
                fontWeight: 500,
                background: tagBg,
                border: `1px solid ${tagBorder}`,
                color: tagColor,
              }}>
                +{project.stack.length - 5}
              </span>
            )}
          </div>
        </div>

        {/* Right — 40% canvas */}
        <div style={{
          flex: 1,
          minHeight: 200,
          position: "relative",
        }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <Model />
          </div>
        </div>
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const ORDERED_SLUGS = ["rag-chatbot", "rise", "seaco", "n8n-automations"];

export default function ProjetsPage() {
  const ordered = ORDERED_SLUGS
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter(Boolean) as Project[];

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes breatheOrange {
          0%   { box-shadow: 0 0 40px rgba(255,107,53,0.30), 0 0 80px rgba(255,107,53,0.15), inset 0 0 40px rgba(255,107,53,0.08); }
          50%  { box-shadow: 0 0 70px rgba(255,107,53,0.60), 0 0 120px rgba(255,107,53,0.30), inset 0 0 80px rgba(255,107,53,0.15); }
          100% { box-shadow: 0 0 40px rgba(255,107,53,0.30), 0 0 80px rgba(255,107,53,0.15), inset 0 0 40px rgba(255,107,53,0.08); }
        }
        @keyframes breatheBlue {
          0%,100% { box-shadow: 0 0 40px rgba(56,189,248,0.30), 0 0 80px rgba(56,189,248,0.12), inset 0 0 50px rgba(56,189,248,0.06); }
          50%     { box-shadow: 0 0 80px rgba(56,189,248,0.55), 0 0 140px rgba(56,189,248,0.25), inset 0 0 90px rgba(56,189,248,0.12); }
        }
        @keyframes breathePurple {
          0%,100% { box-shadow: 0 0 40px rgba(168,85,247,0.30), 0 0 80px rgba(168,85,247,0.12), inset 0 0 50px rgba(168,85,247,0.06); }
          50%     { box-shadow: 0 0 75px rgba(168,85,247,0.60), 0 0 130px rgba(168,85,247,0.28), inset 0 0 90px rgba(168,85,247,0.14); }
        }
        @keyframes breatheGreen {
          0%,100% { box-shadow: 0 0 35px rgba(16,185,129,0.28), 0 0 70px rgba(16,185,129,0.12), inset 0 0 45px rgba(16,185,129,0.06); }
          50%     { box-shadow: 0 0 70px rgba(16,185,129,0.55), 0 0 120px rgba(16,185,129,0.26), inset 0 0 80px rgba(16,185,129,0.13); }
        }
        @keyframes twinkle {
          from { opacity: 0.15; }
          to   { opacity: 0.85; }
        }
        @keyframes speedStreak {
          from { transform: translateX(120%); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          to   { transform: translateX(-200%); opacity: 0; }
        }
        @keyframes pulseRing {
          0%   { transform: translate(50%, -50%) scale(0.94); opacity: 0.35; }
          50%  { transform: translate(50%, -50%) scale(1.06); opacity: 0.10; }
          100% { transform: translate(50%, -50%) scale(0.94); opacity: 0.35; }
        }
        @keyframes circuitFlow {
          from { transform: translateX(-100%); }
          to   { transform: translateX(200%); }
        }
        @keyframes scrollCode {
          from { transform: translateY(0); }
          to   { transform: translateY(-60%); }
        }
        @keyframes seacoRing {
          0%,100% { transform: translate(50%,-50%) scale(0.97); opacity: 0.80; }
          50%     { transform: translate(50%,-50%) scale(1.03); opacity: 0.25; }
        }
        @keyframes seacoDrawH {
          0%   { transform: scaleX(0); opacity: 0; }
          12%  { opacity: 1; }
          55%  { transform: scaleX(1); opacity: 1; }
          82%  { transform: scaleX(1); opacity: 0; }
          100% { transform: scaleX(0); opacity: 0; }
        }
        @keyframes seacoDrawV {
          0%   { transform: scaleY(0); opacity: 0; }
          12%  { opacity: 1; }
          55%  { transform: scaleY(1); opacity: 1; }
          82%  { transform: scaleY(1); opacity: 0; }
          100% { transform: scaleY(0); opacity: 0; }
        }
        @keyframes gearCw  { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes gearCcw { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        .project-card  { opacity: 0; }
        .star-twinkle  { animation: twinkle ease-in-out infinite alternate; }
        .speed-streak  { animation: speedStreak linear infinite; }
        .pulse-ring    { animation: pulseRing 3s ease-in-out infinite; }
        .seaco-ring    { animation: seacoRing 3.5s ease-in-out infinite; }
        .seaco-draw-h  { animation: seacoDrawH ease-in-out infinite; transform-origin: left center; }
        .seaco-draw-v  { animation: seacoDrawV ease-in-out infinite; transform-origin: top center; }
        .circuit-flow  { animation: circuitFlow linear infinite; }
        .scroll-code   { animation: scrollCode 8s linear infinite; }
      `}</style>

      <SpaceBackground />

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div style={{ marginBottom: 48 }}>
          <p style={{
            fontSize: "0.75rem", fontFamily: "monospace",
            color: "#f97316", letterSpacing: "0.12em",
            textTransform: "uppercase", marginBottom: 12,
          }}>
            Projets
          </p>
          <h1 style={{ fontSize: "4rem", fontWeight: 900, color: "#fff", lineHeight: 1.05, margin: "0 0 16px" }}>
            Ce que j&apos;ai construit
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", maxWidth: 560 }}>
            Chaque projet résout un vrai problème. Certains ont une démo live — vas voir par toi-même.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {ordered.map((project, i) => (
            <ProjectCard3D key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </>
  );
}
