# Portfolio — Axel Remillat

Site freelance d'**Axel Remillat**, Ingénieur IA — mise en production de systèmes IA pour PME/startups.  
Construit avec Next.js 16 App Router, React Three Fiber, Tailwind CSS v4, Supabase et OpenAI.

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Accueil — vidéo hero, positionnement, teaser offres/preuves |
| `/offres` | Les 3 offres packagées (Pré-Vol, Mise en Orbite, Contrôle de Mission) |
| `/preuves` | 3 case studies testables (VEGA RAG, N8N, infra self-hosted) |
| `/parcours` | Parcours académique et professionnel |
| `/contact` | Formulaire de contact + prise de RDV |
| `/demos` | VEGA — assistant IA vocal du site (RAG, nécessite les clés API) |
| `/ops` | Salle des machines — monitoring public (métriques en cours de câblage) |

> Le mini-jeu 3D `/game` et les pages projets historiques ont été retirés lors du pivot freelance (juillet 2026) — récupérables via le tag git `sauvegarde-game-rise`.

---

## Stack technique

- **Framework** : Next.js 16 (App Router, TypeScript)
- **3D** : React Three Fiber + Drei + Three.js r0.184
- **Style** : Tailwind CSS v4, animations CSS keyframes
- **IA / RAG** : OpenAI `text-embedding-3-large` + Supabase `pgvector`
- **Déploiement** : Vercel

---

## Lancer en local

```bash
# 1. Installer les dépendances
npm install

# 2. Copier les variables d'environnement
cp .env.example .env.local
# Remplir .env.local avec tes clés API

# 3. Lancer le dev server
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

> La démo RAG et le chatbot nécessitent les clés Supabase + OpenAI. Le reste du site fonctionne sans elles.

---

## Variables d'environnement

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `OPENAI_API_KEY` | Oui (RAG) | Clé API OpenAI |
| `SUPABASE_URL` | Oui (RAG) | URL du projet Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Oui (RAG) | Service role key Supabase (server-side uniquement) |
| `NEXT_PUBLIC_GA_ID` | Non | ID Google Analytics 4 |

---

## Initialiser Supabase (pour la démo RAG)

1. Créer un nouveau projet Supabase
2. Aller dans **SQL Editor** et exécuter le schéma SQL de `ARCHITECTURE.md`
3. Renseigner `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` dans `.env.local`

## Ingérer le contenu RAG

```bash
# Remplir les fichiers dans content/ avec ton contenu réel, puis :
npm run ingest
```

Le script lit tous les `.md` de `content/`, les découpe en chunks, génère les embeddings et les insère dans Supabase pgvector. Il vide la table avant chaque run.

---

## Structure

```
app/
  page.tsx              Accueil (vidéo hero + sections commerciales)
  offres/page.tsx       Offres packagées
  preuves/              Case studies (liste + fiches [slug])
  parcours/page.tsx     Parcours
  contact/page.tsx      Contact + RDV
  demos/page.tsx        VEGA (orbe IA, chat vocal RAG)
  ops/page.tsx          Salle des machines (monitoring public)
  api/                  chat (RAG), tts, contact

components/
  home/ offres/ projects/ parcours/ contact/ demos/ ui/

public/
  *.glb                 Modèles 3D (robot, satellite, drone)
  hero/                 Vidéo hero + poster

lib/
  ax-rag.ts             Pipeline RAG de VEGA
  demo-guard.ts         Rate-limit + plafond tokens/jour
  projects-data.ts      Données des preuves
  site-config.ts        Config (CALENDAR_URL...)

content/ax-knowledge/   Markdown source du RAG VEGA
scripts/ingest-ax.ts    Script d'ingestion Supabase
```

---

## Déployer sur Vercel

```bash
vercel
# ou : push sur GitHub → import dans Vercel → configurer les env vars
```
