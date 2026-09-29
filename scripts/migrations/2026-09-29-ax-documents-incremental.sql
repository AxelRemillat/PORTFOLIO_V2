-- Ingestion incrémentale de la base de connaissances de VEGA.
--
-- PÉRIMÈTRE : la table `ax_documents` UNIQUEMENT. La base Supabase est partagée
-- avec ORION ; aucune autre table n'est lue ni modifiée ici. Rien n'est
-- supprimé : deux colonnes ajoutées, un index remplacé.
--
-- À exécuter une fois (SQL Editor Supabase ou psql). Idempotent.
-- Ne PAS l'enregistrer dans supabase_migrations.schema_migrations : ce registre
-- appartient au dépôt ORION (`supabase db push` refuserait une version inconnue).

-- 1. Quand le passage a été indexé, et l'empreinte du fichier source dont il vient.
--    Tous les passages d'une même source portent la même empreinte : le script
--    `npm run ingest-ax` la compare au fichier local et ne réindexe que ce qui a changé.
alter table public.ax_documents add column if not exists indexed_at timestamptz not null default now();
alter table public.ax_documents add column if not exists source_hash text;
create index if not exists ax_documents_source_idx on public.ax_documents (source);

-- 2. Index vectoriel adapté à une petite table.
--    L'ancien index ivfflat avait 50 listes pour une quarantaine de passages. Une
--    requête n'explore qu'UNE liste par défaut (ivfflat.probes = 1) : la plupart
--    des passages n'étaient donc jamais comparés. HNSW n'a pas ce défaut et reste
--    exact en pratique à cette taille.
drop index if exists public.ax_documents_embedding_idx;
create index if not exists ax_documents_embedding_hnsw on public.ax_documents
  using hnsw (embedding vector_cosine_ops);
