// The 5 projects shown on /projets, in English. Same type, same slugs, same
// order, same links and visuals as projects-data.ts — only the wording changes.
// Vocabulary: messages/GLOSSARY.md.

import type { Project } from "./projects-data";

export const projectsEn: Project[] = [
  {
    slug: "vega",
    title: "VEGA — RAG assistant",
    tagline:
      "A résumé you can talk to. A full RAG pipeline, running in production on this site.",
    badge: "LIVE — try it",
    state: "live",
    model: "robot",
    accent: "#ff6b35",
    cardBg: "linear-gradient(120deg, #1a0500 0%, #3d0e00 40%, #5a1500 100%)",
    glow: "breatheOrange 3s ease-in-out infinite",
    stack: ["Next.js", "Supabase", "OpenAI", "pgvector"],
    demoUrl: "/demos",
    primaryCta: { label: "Try VEGA →", href: "/demos" },
    detailCta: { label: "See the architecture", href: "/projets/vega" },
    context:
      "A PDF résumé just sits there: a recruiter or a client can't ask a precise question or check a skill in a few seconds. I wanted living proof of what I deliver — a complete RAG system in production, not a throwaway demo.",
    problem:
      "Make a profile you can query in plain language, by voice, with sourced answers, acceptable latency and controlled costs — all hosted in production, not running locally on my laptop.",
    result:
      "Live on this site. Pipeline deployed on Vercel + Supabase: document ingestion → embeddings → vector search (pgvector) → generation (gpt-4o-mini) → speech synthesis. A daily token cap and per-IP rate limiting keep costs under control. You can try it right now.",
    offer: { label: "See the service — AI to production →", href: "/offres" },
  },
  {
    slug: "n8n",
    title: "n8n automations for small businesses",
    tagline:
      "Email triage, invoices, customer support and meeting notes — AI business automations you can test live.",
    badge: "LIVE — try it",
    state: "live",
    model: "drone",
    accent: "#10b981",
    cardBg: "linear-gradient(135deg, #010a04 0%, #021508 50%, #033014 100%)",
    glow: "breatheGreen 3s ease-in-out infinite",
    stack: ["n8n", "OpenAI", "Webhooks", "Python"],
    demoUrl: "/automatisations",
    primaryCta: { label: "Try the automations →", href: "/automatisations" },
    detailCta: { label: "See the architecture", href: "/projets/n8n" },
    context:
      "Small businesses pile up low-value repetitive work: retyping invoices, sorting emails, writing meeting notes, answering support questions. One by one they seem harmless; added up, they cost hours every week.",
    problem:
      "Build reliable workflows instead of fragile scripts: orchestrated, rate-limited against third-party APIs, monitored, with error recovery. And make them publicly testable without ever exposing customer data.",
    result:
      "AI business automations in production, testable live on this site: email triage, invoices, customer support, meeting notes. Orchestrated, rate-limited and monitored workflows, with error recovery.",
    offer: { label: "See the service — Business automation →", href: "/offres" },
  },
  {
    slug: "agent",
    title: "Autonomous sales agent",
    tagline:
      "One customer request → quote, reply and call slot, handled end to end by an agent that reasons and decides.",
    badge: "LIVE — try it",
    state: "live",
    model: "drone",
    accent: "#ec4899",
    cardBg: "linear-gradient(130deg, #2a0416 0%, #4a0a28 45%, #6d0f3c 100%)",
    glow: "breathePink 3s ease-in-out infinite",
    stack: ["OpenAI function calling", "Next.js", "Business tools", "gpt-4o-mini"],
    demoUrl: "/agent",
    primaryCta: { label: "Try the agent →", href: "/agent" },
    detailCta: { label: "See the architecture", href: "/projets/agent" },
    context:
      "A small business receives inbound sales requests (“I need X, delivered to Y, what's your price?”). Answering means cross-checking the catalog, stock, delivery zones and discount rules — repetitive work that delays quotes.",
    problem:
      "Automate it without ever hallucinating a price or a lead time: an agent that REASONS, calls deterministic tools (catalog, stock, delivery, quote) and decides whether the order is feasible — not a chatbot that improvises.",
    result:
      "Live demo online. A function-calling agent (gpt-4o-mini, loop capped at 6 turns) chains its tools, shows its trace live and produces a complete deliverable: a priced quote (discounts, VAT), a ready-to-send email and a call slot. Prices, stock and lead times come only from the tools.",
    offer: { label: "See the service — AI to production →", href: "/offres" },
  },
  {
    slug: "pipeline",
    title: "Data/ML pipeline in production",
    tagline:
      "Lead scoring (conversion probability): ingestion → ML → predictions + explainability, testable live.",
    badge: "LIVE — try it",
    state: "live",
    model: "satellite",
    accent: "#22d3ee",
    cardBg: "linear-gradient(135deg, #04141a 0%, #062a33 50%, #083a45 100%)",
    glow: "breatheCyan 3s ease-in-out infinite",
    stack: ["Machine Learning", "Feature engineering", "Scoring", "Explainability"],
    demoUrl: "/pipeline",
    primaryCta: { label: "Try the pipeline →", href: "/pipeline" },
    detailCta: { label: "See the architecture", href: "/projets/pipeline" },
    context:
      "Small businesses are swamped with inbound leads but handle them in no particular order, without knowing which ones are most likely to convert — sales time wasted on cold prospects.",
    problem:
      "Build a real end-to-end data → ML pipeline, not a throwaway notebook: ingestion, cleaning, feature engineering, model and explainability — lightweight, deterministic, testable online, with no heavy infrastructure and no per-prediction cost.",
    result:
      "Live demo. A fixed-weight logistic regression (trained offline), scoring 100% client-side: each lead gets a conversion probability (hot/warm/cold) and the features driving its score. A 5-step pipeline revealed step by step, sortable predictions and analysis charts.",
    offer: { label: "See the service — AI to production →", href: "/offres" },
  },
  {
    slug: "infra",
    title: "Self-hosted AI infrastructure",
    tagline:
      "My own production GPU server: Docker, local LLM, TTS API, secure tunnel, monitoring, backups.",
    badge: "Under construction",
    state: "building",
    model: "satellite",
    accent: "#a855f7",
    cardBg: "radial-gradient(ellipse at 60% 40%, #3d0f72 0%, #1c0540 45%, #080118 100%)",
    glow: "breathePurple 3.5s ease-in-out infinite",
    stack: ["Docker", "Ollama", "TTS API", "Tunnel", "Monitoring"],
    detailCta: { label: "See the architecture →", href: "/projets/infra" },
    context:
      "Renting everything from third-party APIs (LLM, TTS, hosting) caps margins and creates dependency. I want to run the infrastructure I sell to my clients myself — and be able to prove it.",
    problem:
      "Set up an in-house production GPU server: containers, a local LLM, a speech synthesis API, secure exposure to the outside world, monitoring and backups. Reproducible and reliable, not a throwaway setup.",
    result:
      "Under construction. Target: a GPU server (RTX) running Docker, a local LLM through Ollama, a self-hosted TTS API, a secure tunnel, monitoring and scheduled backups. The stated goal: “I run what I sell.” Status: the foundation is being set up.",
    offer: { label: "See the service — Run & infrastructure →", href: "/offres" },
  },
];
