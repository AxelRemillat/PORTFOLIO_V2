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
// ⚠️ Résumé condensé de content/ax-knowledge/*.md — garder ALIGNÉ avec ces docs.
const FALLBACK_CONTEXT = `## Axel Remillat
Né en 2004. Étudiant ingénieur 4e année à l'ESME (groupe IONIS), spé Big Data, IA & marketing. 3 premières années à Lyon, 1er semestre de 4e année en échange à Mapua University (Manille, Philippines), puis campus d'Ivry-sur-Seine (Paris). 5e année en alternance. Anglais courant (C1). Mobile Paris / Lyon / Grenoble / Genève.
Alternance : Ingénieur IA Agentic & gestion de données chez Andra Learning (EdTech, Station F), 14 mois à partir de juillet 2026, sous la direction du CTO Ouriel Bettach.
Objectifs : CDI ingénieur IA/Data, missions freelance data/IA, à terme vivre de ses produits (RISE, SEACO). Vision : "un bon produit, c'est un produit qui aide un maximum de gens et qu'on comprend en une seconde".
Compétences : Python, SQL, React, FastAPI, Supabase, Firebase, N8N, API OpenAI, Google Cloud (BigQuery, Cloud Run, Vertex AI), Docker, Power BI, Figma, Git. Profil hybride tech + marketing + produit ; utilise les IA génératives comme copilotes de dev en gardant l'architecture et les contraintes.
Perso : tennis avec son père, très bon cuisinier (famille de gourmets), a grandi entouré d'animaux (grand-père au passé de cowboy), famille de musiciens et d'enseignants de lettres, passionné de cinéma, a joué le renard dans une pièce du Petit Prince enfant.
Contact : UNIQUEMENT email axelremillat@netcourrier.com et LinkedIn linkedin.com/in/axel-remillatesmelyon.

## Projets
- RISE (Reach, Inspire, Study and Explore) : startup EdTech cofondée avec 3 étudiants ESME — centralise témoignages, infos et recommandations locales pour choisir sa destination de semestre à l'international. 3 concours gagnés : 1re place ESME Calendrier de l'Avent 2025 (500 €), 1re place concours IONIS sur 400+ projets (3 000 €), 2e place Galets du Rhône 2025 à Genève (1 000 €). Asso officielle, dépôt d'idée, bêta en déploiement, incubateur ESME.
- SEACO : plateforme SaaS en développement — assistant de vie pour étudiants/jeunes actifs, 6 zones interconnectées (Études, Carrière, Réseaux, Budget, Entrepreneuriat) autour d'un Profil Vivant. Slogan : "Ton temps vaut mieux que ça." Stack React 18 + Vite, Tailwind, Supabase, OpenAI, N8N. Non lancé publiquement.
- Automatisations N8N : page du portfolio avec automatisations testables en direct (workflows N8N réels + LLM) pour montrer aux PME des cas d'usage — 5 démos finales en sélection parmi 12. Rate-limiting et plafonds de tokens.
- CV interactif RAG : c'est VEGA elle-même — RAG de bout en bout (embeddings OpenAI, Supabase pgvector, gpt-4o-mini, TTS synchronisé, orbe 3D).

## VEGA (toi)
Nommée d'après l'étoile Vega (constellation de la Lyre). Cerveau : pipeline RAG (Supabase pgvector + gpt-4o-mini). Voix : TTS OpenAI, repli navigateur. Corps : orbe React Three Fiber pilotée par ton état (idle/thinking/speaking). Mémoire multi-tours en localStorage. Coût : quelques centimes par conversation, infra du site 10-30 €/mois.

## Le site
Next.js (App Router, TypeScript) sur Vercel, Supabase (PostgreSQL + pgvector), OpenAI, React Three Fiber, GA4. Univers espace inspiré du Petit Prince (Axel a joué le renard enfant). Pages : accueil étoilé, /projets (modèles 3D : drone pour CV RAG, avion RISE, satellite SEACO, robot N8N), mini-jeu 3D (robot sur planète, 4 portails), /demos (VEGA). Construit avec des agents IA comme copilotes — démarche assumée. Pas open source. À venir : pages détail projets, parcours, contact, démos N8N.`;

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
