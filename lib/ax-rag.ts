import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

// RAG pour l'assistant A.X — réutilise l'infra Supabase pgvector + OpenAI déjà
// en place dans le projet (cf. lib/supabase.ts, app/api/demo/rag, scripts/ingest).
//
// ⚠️ Le projet utilise les variables SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY
//    (pas les NEXT_PUBLIC_*), et les embeddings sont stockés en 1536 dimensions
//    (text-embedding-3-large, dimensions: 1536) — il FAUT garder ces réglages
//    pour que la recherche vectorielle matche les vecteurs déjà ingérés.

// Contexte de secours minimal : utilisé si la base vectorielle n'est pas
// disponible (clés absentes, table/fonction Supabase pas encore créée, erreur
// réseau) — on préfère un fallback plutôt que de faire crasher l'API chat.
const FALLBACK_CONTEXT = `Axel Remillat — étudiant ingénieur 4e année à l'ESME Paris, spécialité Big Data & IA.
Co-fondateur & Lead Tech de RISE (plateforme de mobilité internationale étudiante, 3 concours remportés).
Alternance Ingénieur IA Agentic chez Andra Learning (Station F) à partir de juillet 2026.
Projets : RAG portfolio, automatisations N8N, "La Planète qui Chante" (jeu 3D).
Stack : Python, React, Next.js, TypeScript, OpenAI API, Supabase, N8N, Docker, Vercel.`;

// Lazy init : évite l'erreur "supabaseUrl is required" au build Next.js et
// permet de basculer proprement sur le fallback quand l'env n'est pas configuré.
function getClients() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!url || !serviceKey || !openaiKey) return null;
  return {
    supabase: createClient(url, serviceKey),
    openai: new OpenAI({ apiKey: openaiKey }),
  };
}

export async function retrieveContext(query: string): Promise<string> {
  const clients = getClients();
  if (!clients) return FALLBACK_CONTEXT;

  try {
    // 1. Embed la query (1536 dims pour matcher les vecteurs stockés)
    const embRes = await clients.openai.embeddings.create({
      model: "text-embedding-3-large",
      input: query,
      dimensions: 1536,
    });
    const embedding = embRes.data[0].embedding;

    // 2. Recherche vectorielle dans la base dédiée A.X (table 'ax_documents'
    //    via la fonction 'match_ax_documents') — séparée du RAG RISE/portfolio.
    const { data, error } = await clients.supabase.rpc("match_ax_documents", {
      query_embedding: embedding,
      match_threshold: 0.70,
      match_count: 4,
    });

    // Table/fonction absente ou erreur RPC → fallback (ne pas crasher)
    if (error) return FALLBACK_CONTEXT;
    // Requête OK mais aucun passage pertinent → pas de contexte additionnel
    if (!data?.length) return "";

    return data.map((d: { content: string }) => d.content).join("\n\n---\n\n");
  } catch {
    return FALLBACK_CONTEXT;
  }
}
