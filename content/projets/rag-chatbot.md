# CV Interactif RAG — Chatbot Portfolio

## Description

Chatbot RAG intégré à ce portfolio. Répond en temps réel aux questions sur Axel Remillat : projets, compétences, parcours, expériences.

## Pourquoi

Un CV PDF reste passif. Ce chatbot permet à un recruteur ou prospect d'explorer activement le profil, de poser des questions précises et de vérifier une compétence en quelques secondes.

## Architecture technique

1. **Contenu** : fichiers markdown dans `content/` (profil, projets, parcours, compétences)
2. **Ingestion** : script `scripts/ingest.ts` — découpe les markdown en chunks, génère les embeddings avec text-embedding-3-large (1536 dim), insère dans Supabase
3. **Retrieval** : fonction SQL `match_documents` — similarité cosinus dans pgvector
4. **Génération** : GPT-4o-mini avec contexte des chunks pertinents
5. **Rate limiting** : 10 requêtes/heure par IP, 50 000 tokens/jour (table `demo_events`)
6. **Déploiement** : Next.js 16 sur Vercel, Supabase dédié portfolio

## Stack

Next.js 16, TypeScript, Tailwind CSS, Supabase, pgvector, OpenAI API, Vercel.
