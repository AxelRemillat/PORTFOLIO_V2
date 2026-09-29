# Architecture — Portfolio

## Stack

| Couche | Tech |
|--------|------|
| Frontend | Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 |
| API | Next.js API Routes (server-side, secrets protégés) |
| Embeddings | OpenAI text-embedding-3-large, dimensions 1536 |
| Génération | OpenAI GPT-4o-mini |
| Base de données | Supabase (PostgreSQL + pgvector) |
| Déploiement | Vercel |
| Analytics | GA4 |

---

## SQL Supabase

Le RAG de VEGA a son propre schéma : `scripts/setup-ax-table.sql` (table `ax_documents` + fonction de recherche). L'ancien RAG « portfolio » (tables et fonction de recherche dédiées, route `/api/demo/rag`, composant `RagChat`) a été retiré ; le rate-limit des démos passe par `lib/demo-rate-limit.ts` (Upstash, repli mémoire), sans table Supabase.

---

## Variables d'environnement

Créer `.env.local` à la racine du projet (non commité) :

```env
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_UMAMI_WEBSITE_ID=    # optionnel — analytics Umami (prod)
NEXT_PUBLIC_UMAMI_SCRIPT_URL=    # optionnel — ex. https://cloud.umami.is/script.js
```

---

## Roadmap

### v1 (actuelle)
- [x] Pages : accueil, projets, démos, parcours, contact
- [x] Contenu markdown (placeholders à compléter)
- [x] Script d'ingestion VEGA (`npm run ingest-ax`)

### v2
- [ ] Traduction EN (structure i18n déjà préparée avec `lang="fr"`)
- [ ] Streaming de la réponse RAG (Server-Sent Events)
- [ ] Démo N8N (webhook sandboxé + walkthrough vidéo)
- [ ] Blog / notes techniques
- [ ] Mode clair optionnel
