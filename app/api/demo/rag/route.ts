import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit } from "@/lib/demo-rate-limit";

// Lazy init : évite l'erreur "supabaseUrl is required" au build Next.js
function getClients() {
  return {
    openai: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
    supabase: createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    ),
  };
}

export async function POST(req: NextRequest) {
  // Kill-switch (opt-out : actif par défaut).
  if (process.env.DEMO_RAG_ENABLED === "false") {
    return NextResponse.json({ error: "demo_disabled", message: "Démo en pause, reviens plus tard." }, { status: 503 });
  }
  const { openai, supabase } = getClients();
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "127.0.0.1";

  const rl = await checkRateLimit(ip, "vegarag");
  if (!rl.ok) {
    return NextResponse.json(
      rl.scope === "global"
        ? { error: "demo_busy", message: "Démo très sollicitée aujourd'hui, réessaie plus tard." }
        : { error: "rate_limited", message: "Trop de questions rapprochées — réessaie dans une minute." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { question } = body;

  if (!question || typeof question !== "string" || question.length > 2000) {
    return NextResponse.json({ error: "Question invalide." }, { status: 400 });
  }

  const embeddingRes = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: question,
    dimensions: 1536,
  });
  const embedding = embeddingRes.data[0].embedding;

  const { data: chunks } = await supabase.rpc("match_documents", {
    query_embedding: embedding,
    match_threshold: 0.65,
    match_count: 5,
  });

  const context = (chunks ?? [])
    .map((c: { content: string }) => c.content)
    .join("\n\n---\n\n");

  const systemPrompt = `Tu es l'assistant portfolio d'Axel Remillat, ingénieur Data & IA (ESME Paris, spé Big Data).
Réponds aux questions sur son parcours, projets et compétences en te basant uniquement sur le contexte fourni.
Sois concis, direct et factuel. Si l'information n'est pas dans le contexte, dis-le honnêtement.
Réponds toujours en français.

Contexte :
${context || "Aucun contexte disponible — le contenu RAG n'est pas encore ingéré."}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: question },
    ],
    max_tokens: 400,
    temperature: 0.3,
  });

  const answer = completion.choices[0].message.content ?? "";
  return NextResponse.json({ answer });
}
