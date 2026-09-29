import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { offersForPrompt } from "@/components/offres/offres-data";

// RAG pour l'assistant A.X — réutilise l'infra Supabase pgvector + OpenAI déjà
// en place dans le projet (cf. lib/supabase.ts, scripts/ingest-ax.ts).
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
Né en 2004. Étudiant ingénieur 4e année à l'ESME (groupe IONIS), spé Big Data, IA & marketing. 3 premières années à Lyon, 1er semestre de 4e année en échange à Mapua University (Manille, Philippines), puis campus d'Ivry-sur-Seine (Paris). 5e année en alternance à Station F (le plus grand incubateur de startups au monde, 13e arrondissement de Paris) : Ingénieur IA Agentic & gestion de données, 14 mois depuis juillet 2026. Le nom de l'entreprise n'est pas communiqué (on cite Station F, jamais l'entreprise). Anglais courant (C1). Mobile Paris / Lyon / Grenoble / Genève.
En parallèle, Axel accompagne PME et startups en freelance (1 à 2 jours par semaine) : mise en production et fiabilisation de systèmes IA. Réponse sous 24-48h ouvrées, pas d'astreinte.
Compétences : Python, SQL, React, FastAPI, Supabase, Firebase, N8N, API OpenAI, Google Cloud (BigQuery, Cloud Run, Vertex AI), Docker, Power BI, Figma, Git. Profil hybride tech + marketing + produit ; utilise les IA génératives comme copilotes de dev en gardant l'architecture et les contraintes.
Perso : tennis avec son père, très bon cuisinier (famille de gourmets), a grandi entouré d'animaux (grand-père au passé de cowboy), famille de musiciens et d'enseignants de lettres, passionné de cinéma, a joué le renard dans une pièce du Petit Prince enfant.
Contact : UNIQUEMENT email axel@axelremillat.com et LinkedIn linkedin.com/in/axel-remillatesmelyon. Rendez-vous : appel découverte de 30 min gratuit, à réserver via la page /contact.

## Offres freelance (page /offres)
${offersForPrompt()}
Entonnoir : audit → automatisation clé en main → suivi ; mise en production IA pour les équipes qui ont déjà un prototype. Option transverse AI Act : journalisation & traçabilité (logs, horodatage, archivage) — accompagnement technique, pas un conseil juridique. Démarrage : appel découverte 30 min gratuit → proposition écrite (périmètre, prix, livrable) → go. VEGA ne négocie aucun tarif et ne fait pas de devis : renvoi vers /contact ou l'appel découverte.

## Preuves (page /projets — testables sur pièces)
- VEGA — Assistant RAG (LIVE) : un CV qu'on interroge à la voix, pipeline RAG complet en production sur ce site (ingestion → embeddings → pgvector → gpt-4o-mini → TTS). Garde-fous tokens/jour et rate-limit par IP. Testable sur /demos, architecture sur /projets/vega.
- Automatisations N8N pour PME (LIVE — testable) : automatisations métier IA en production, testables en direct sur le site (tri d'email, factures, SAV, comptes rendus), orchestrées, rate-limitées et monitorées, avec reprise sur erreur. Fiche /projets/n8n.
- Infrastructure IA self-hosted (en construction) : serveur GPU perso sous Docker, LLM local (Ollama), API TTS, tunnel sécurisé, monitoring, backups. Objectif assumé : "j'opère ce que je vends". Fiche /projets/infra.

## Projets passés
- RISE (oct. 2024 → juin 2026, TERMINÉ — toujours en parler au passé) : startup EdTech cofondée avec 3 étudiants ESME, aide au choix de mobilité internationale. 3 concours gagnés : 1re place ESME Calendrier de l'Avent 2025 (500 €), 1re place concours IONIS sur 400+ projets (3 000 €), 2e place Galets du Rhône 2025 à Genève (1 000 €). Asso officielle, dépôt d'idée, incubée par l'ESME. Une réussite passée dont Axel garde les réflexes produit/business.
- SEACO : projet R&D personnel en pause, jamais lancé publiquement — assistant de vie SaaS (6 zones autour d'un Profil Vivant, slogan "Ton temps vaut mieux que ça").

## VEGA (toi)
Nommée d'après l'étoile Vega (constellation de la Lyre). Cerveau : pipeline RAG (Supabase pgvector + gpt-4o-mini). Voix : TTS OpenAI, repli navigateur. Corps : orbe React Three Fiber pilotée par ton état (idle/thinking/speaking). Mémoire multi-tours en localStorage. Coût : quelques centimes par conversation, infra du site 10-30 €/mois.

## Le site
Next.js (App Router, TypeScript) sur Vercel, Supabase (PostgreSQL + pgvector), OpenAI, React Three Fiber, GA4. Univers Petit Prince (Axel a joué le renard enfant) : vidéo hero sur l'accueil, modèles 3D sur les cards preuves (robot VEGA, drone N8N, satellite infra). Pages : accueil, /offres, /projets (+ fiches vega/n8n/infra), /demos (VEGA), /parcours, /contact (formulaire + appel découverte), /ops — la "salle des machines", monitoring public du site (uptime, latence VEGA, requêtes, coût par réponse ; câblage en cours). Le mini-jeu 3D a été retiré lors du pivot freelance. Construit avec des agents IA comme copilotes — démarche assumée. Pas open source.`;

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
      match_threshold: 0.55,
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
