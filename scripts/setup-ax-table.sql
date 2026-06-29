-- Base de connaissances dédiée à l'assistant A.X (profil personnel d'Axel),
-- séparée de la table du chatbot RISE / portfolio.
--
-- À exécuter dans le SQL Editor de Supabase.
--
-- NOTE dimension : on utilise vector(1536), pas 3072.
--  1) Le projet génère déjà ses embeddings text-embedding-3-large en 1536 dims
--     (cf. scripts/ingest.ts et lib/ax-rag.ts) → cohérence indispensable.
--  2) L'index ivfflat/hnsw de pgvector ne supporte PAS plus de 2000 dimensions :
--     un vector(3072) ferait échouer la création d'index ci-dessous.

create extension if not exists vector;

create table ax_documents (
  id bigserial primary key,
  content text,
  embedding vector(1536),
  source text
);

create index on ax_documents using ivfflat (embedding vector_cosine_ops) with (lists = 50);

create or replace function match_ax_documents(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (content text, source text, similarity float)
language sql stable
as $$
  select content, source, 1 - (embedding <=> query_embedding) as similarity
  from ax_documents
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;
