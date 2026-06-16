# Portfolio — Axel Remillat

Portfolio + lab de démos Data & IA. Construit avec Next.js 16, Tailwind CSS v4, Supabase et OpenAI.

## Lancer en local

```bash
# 1. Installer les dépendances
npm install

# 2. Copier les variables d'env
cp .env.example .env.local
# Remplir .env.local avec tes clés

# 3. Lancer le dev server
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

> La démo RAG nécessite les clés Supabase + OpenAI. Sans elles, le reste du site fonctionne normalement.

## Variables d'environnement

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `OPENAI_API_KEY` | Oui (RAG) | Clé API OpenAI |
| `SUPABASE_URL` | Oui (RAG) | URL du projet Supabase portfolio |
| `SUPABASE_SERVICE_ROLE_KEY` | Oui (RAG) | Service role key Supabase (server-side uniquement) |
| `NEXT_PUBLIC_GA_ID` | Non | ID Google Analytics 4 |

## Initialiser Supabase

1. Créer un nouveau projet Supabase dédié au portfolio
2. Aller dans **SQL Editor** et exécuter le SQL de `ARCHITECTURE.md`
3. Renseigner `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` dans `.env.local`

## Ingérer le contenu RAG

```bash
# Remplir d'abord les fichiers dans content/ avec ton vrai contenu
npm run ingest
```

Le script lit tous les `.md` de `content/`, les découpe en chunks, génère les embeddings (text-embedding-3-large, 1536 dim) et les insère dans Supabase. Il vide la table avant chaque run — réexécute à chaque mise à jour du contenu.

## Déployer sur Vercel

```bash
vercel
# ou pousser sur GitHub → import dans Vercel → configurer les env vars
```

## Structure

```
app/                    Pages et API routes (App Router)
  api/demo/rag/         Endpoint RAG cappé
components/             Composants React (< 150 lignes chacun)
  demos/RagChat.tsx     Composant chat interactif
  ui/                   ProjectCard, Badge
lib/                    Utilitaires server-side
  demo-guard.ts         Rate-limit par IP + plafond tokens/jour
  projects-data.ts      Données statiques des projets
content/                Markdown pour le RAG (à compléter)
scripts/ingest.ts       Script d'ingestion
```
