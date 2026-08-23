# Architecture — Portfolio RAG

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

## SQL Supabase à exécuter

Copier-coller dans l'éditeur SQL de ton projet Supabase dédié portfolio.

```sql
-- Extension pgvector (à activer dans Extensions si pas déjà fait)
CREATE EXTENSION IF NOT EXISTS vector;

-- Table des chunks RAG
CREATE TABLE portfolio_chunks (
  id        BIGSERIAL PRIMARY KEY,
  content   TEXT NOT NULL,
  source    TEXT,
  metadata  JSONB DEFAULT '{}',
  embedding VECTOR(1536)
);

-- Index HNSW pour la similarité cosinus (plus rapide qu'IVFFlat sur petit volume)
CREATE INDEX portfolio_chunks_embedding_idx
  ON portfolio_chunks
  USING hnsw (embedding vector_cosine_ops);

-- Table de rate-limiting des démos
CREATE TABLE demo_events (
  id          BIGSERIAL PRIMARY KEY,
  ip          TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX demo_events_ip_time_idx ON demo_events (ip, created_at);

-- Fonction de retrieval vectoriel
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.65,
  match_count     INT   DEFAULT 5
)
RETURNS TABLE (
  id         BIGINT,
  content    TEXT,
  source     TEXT,
  metadata   JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    pc.id,
    pc.content,
    pc.source,
    pc.metadata,
    1 - (pc.embedding <=> query_embedding) AS similarity
  FROM portfolio_chunks pc
  WHERE 1 - (pc.embedding <=> query_embedding) > match_threshold
  ORDER BY pc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

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
- [x] Démo RAG live avec rate-limit
- [x] Contenu markdown (placeholders à compléter)
- [x] Script d'ingestion

### v2
- [ ] Traduction EN (structure i18n déjà préparée avec `lang="fr"`)
- [ ] Streaming de la réponse RAG (Server-Sent Events)
- [ ] Démo N8N (webhook sandboxé + walkthrough vidéo)
- [ ] Blog / notes techniques
- [ ] Mode clair optionnel
