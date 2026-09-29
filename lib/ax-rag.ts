import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { FALLBACK_CONTEXT } from "./ax-fallback.generated";

// RAG de VEGA : base de connaissances content/ax-knowledge/*.md, indexée dans
// la table `ax_documents` (npm run ingest-ax) et interrogée via la fonction
// `match_ax_documents`.
//
// ⚠️ Variables SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (pas les NEXT_PUBLIC_*),
//    embeddings text-embedding-3-large en 1536 dimensions : les mêmes réglages
//    qu'à l'ingestion (lib/ax-knowledge/build.ts, EMBEDDING), sinon rien ne matche.

export interface Retrieved {
  context: string;
  /** Fiches d'où viennent les passages (« fallback » = contexte de secours). */
  sources: string[];
}

// Contexte de secours : TOUTES les fiches, générées depuis les mêmes fichiers
// que l'ingestion (lib/ax-fallback.generated.ts). Utilisé si la base vectorielle
// est indisponible (clés absentes, erreur réseau ou RPC) : on préfère répondre
// avec la base complète plutôt que de faire échouer le chat.
const FALLBACK: Retrieved = { context: FALLBACK_CONTEXT, sources: ["fallback"] };

// Lazy init : évite l'erreur "supabaseUrl is required" au build Next.js.
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

export async function retrieveContext(query: string): Promise<Retrieved> {
  const clients = getClients();
  if (!clients) return FALLBACK;

  try {
    const embRes = await clients.openai.embeddings.create({
      model: "text-embedding-3-large",
      input: query,
      dimensions: 1536,
    });

    const { data, error } = await clients.supabase.rpc("match_ax_documents", {
      query_embedding: embRes.data[0].embedding,
      // Mesuré sur les questions de prospect (29/09/2026) : une question métier
      // courte plafonne vers 0,50, « pour qui ? » vers 0,31, un hors-sujet
      // (« capitale de l'Australie ») vers 0,13. 0,30 garde les premières et écarte le reste.
      match_threshold: 0.3,
      match_count: 5,
    });

    if (error) return FALLBACK;
    // Aucun passage pertinent : VEGA répond qu'elle ne sait pas (cf. prompt).
    if (!data?.length) return { context: "", sources: [] };

    const rows = data as { content: string; source: string }[];
    return {
      context: rows.map((d) => `[${d.source}]\n${d.content}`).join("\n\n---\n\n"),
      sources: [...new Set(rows.map((d) => d.source))],
    };
  } catch {
    return FALLBACK;
  }
}
