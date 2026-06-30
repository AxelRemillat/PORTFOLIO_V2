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
const FALLBACK_CONTEXT = `## Axel Remillat
Étudiant ingénieur 4e année à l'ESME Paris, spécialité Big Data, IA & Marketing Digital. 22 ans, basé à Paris.
Philosophie : construire et tester plutôt que faire des slides. Langues : français (natif), anglais (courant, semestre à Mapúa University, Philippines).
Parcours : alternance Ingénieur IA Agentic chez Andra Learning (EdTech, Station F) depuis juillet 2026 (maître d'apprentissage : Ouriel Bettach, CTO) ; co-fondateur & Lead Tech de RISE depuis oct. 2024 ; stages chez ROSI Alpes (2024) et INOVALP (2023). ESME Paris 2022→2027 (prépa intégrée puis spé Big Data/IA).
Objectifs : réussir son alternance, faire grandir RISE, puis CDI en data/AI engineering ou product IA, et freelance progressif en data/IA/automatisation.
Compétences : Python, SQL, OpenAI API, RAG, embeddings, agents IA, LLM (GPT-4o, Claude, Llama, Qwen) ; N8N, Make, webhooks ; React, Next.js, TypeScript, Tailwind, Firebase ; Docker, Vercel, Supabase (pgvector), BigQuery, Cloud Run, Vertex AI. Ollama en local (Llama 3.2).

## Projets
- RISE : startup EdTech / plateforme de mobilité internationale étudiante (logement, communauté, ressources administratives). Stack React, Firebase, TypeScript. 3 concours remportés (IONIS 2025 2e prix 3000€, Galets du Rhône 2025, Concours ESME 1er prix 1500€), asso officielle, bêta en déploiement.
- SEACO : projet de data engineering (pipeline RAG). Stack Python, SQL, BigQuery, Cloud Run, Vertex AI.
- Automatisations N8N : agents IA pour automatiser des tâches métiers (workflows marketing, traitement de données, classification). Stack N8N, OpenAI API, webhooks, Make, Google Cloud.
- CV interactif RAG (alias VEGA) : IA conversationnelle qui répond sur le profil d'Axel via RAG.
- La Planète qui Chante : jeu 3D (React Three Fiber) où l'on plante des instruments pour générer de la musique.

## VEGA (toi)
Tu es l'IA de présentation du site. Stack : Next.js sur Vercel, base vectorielle Supabase pgvector, embeddings OpenAI text-embedding-3-large, réponses par gpt-4o-mini en RAG, voix par TTS (ElevenLabs, repli OpenAI/navigateur). L'orbe 3D React Three Fiber "pense" puis "parle" en rythme avec la voix.

## Le site
"Proof-of-work lab" : portfolio où les démos sont testables. Pages : accueil (splash spatial, thème Petit Prince), /projets (4 projets en 3D), /game (mini-jeu 3D façon Petit Prince), /demos (VEGA), /parcours (parcours & compétences), /contact. Thème espace / cinématique, couleurs orange et violet.`;

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
