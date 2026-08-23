# Portfolio — Axel Remillat

Site freelance d'**Axel Remillat**, Ingénieur IA — je fais passer les projets IA des PME/startups **du prototype à la production** (agents, RAG, automatisations, fiables et monitorés).

Construit avec Next.js (App Router, TypeScript), Tailwind CSS v4, Supabase (pgvector) et OpenAI. Les démos d'automatisation sont propulsées par des workflows **n8n** auto-hébergés.

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Accueil — hero, manifesto, teaser offres/projets, chiffres, VEGA |
| `/offres` | Les 3 offres : **Diagnostic** (audit express), **Mise en production** (déploiement), **Suivi mensuel** (run monitoré) |
| `/projets` | Projets détaillés (liste + fiche `/projets/[slug]`) |
| `/automatisations` | **5 démos n8n testables en vrai** : tri d'email, compte rendu de réunion, nettoyage de CSV, extraction de facture, assistant SAV (RAG) |
| `/parcours` | Parcours académique & professionnel (graphe de compétences) |
| `/contact` | Formulaire de contact (Resend) + prise de RDV |
| `/demos` | **VEGA** — assistant IA du site (RAG vocal sur le parcours d'Axel) |
| `/ops` | Salle des machines — monitoring public (en cours de câblage) |

---

## Stack technique

- **Framework** : Next.js (App Router, TypeScript, Turbopack)
- **Style** : Tailwind CSS v4 + CSS keyframes
- **3D / visuels** : React Three Fiber + Three.js (éléments de scène)
- **RAG VEGA** : OpenAI `text-embedding-3-large` + Supabase `pgvector` (recherche par similarité)
- **Automatisations** : workflows **n8n** auto-hébergés (elestio), appelés via des **routes API Next.js sécurisées** (`/api/demo/*` : secret partagé, rate-limit, honeypot, kill-switch par démo) — le webhook et le secret ne sont jamais exposés au client
- **Analytics** : **Umami** (cookieless, sans bannière de consentement, chargé en production uniquement)
- **Emails** : Resend (formulaire de contact)
- **Déploiement** : Vercel

---

## Lancer en local

```bash
npm install
cp .env.example .env.local   # puis renseigner les clés (voir ci-dessous)
npm run dev                  # http://localhost:3000
```

Scripts : `npm run dev` · `npm run build` · `npm run start` · `npm run lint` · `npm run ingest-ax` (ré-ingestion du RAG VEGA).

> Le site tourne sans clés ; seules VEGA (Supabase + OpenAI) et les démos `/automatisations` (n8n) nécessitent leurs variables. Sans elles, les démos renvoient une erreur propre (`demo_disabled`).

---

## Variables d'environnement

Voir **`.env.example`** pour la liste complète et les emplacements (aucune valeur secrète n'est versionnée ; `.env.local` est gitignoré).

| Variable | Rôle |
|----------|------|
| `OPENAI_API_KEY` | Embeddings + génération (VEGA / RAG) |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Base pgvector du RAG VEGA (server-side) |
| `RESEND_API_KEY` | Envoi du formulaire de contact |
| `N8N_DEMO_SECRET` | Secret partagé site → n8n (header `x-demo-secret`) |
| `N8N_EMAIL_TRIAGE_WEBHOOK_URL` … `N8N_SAV_WEBHOOK_URL` | Les 5 webhooks n8n des démos `/automatisations` |
| `DEMO_EMAIL_TRIAGE_ENABLED` … `DEMO_SAV_ENABLED` | Kill-switch par démo (`true` pour activer) |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, `NEXT_PUBLIC_UMAMI_SCRIPT_URL` | Analytics Umami (prod uniquement) |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | *(optionnel)* rate-limit distribué des démos ; sinon fallback mémoire |

---

## RAG VEGA (Supabase)

1. Créer un projet Supabase, exécuter `scripts/setup-ax-table.sql` (table + `pgvector`).
2. Renseigner `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` et `OPENAI_API_KEY` dans `.env.local`.
3. Ingérer la base de connaissance :

```bash
npm run ingest-ax
```

Le script lit les `.md` de `content/ax-knowledge/`, les découpe en chunks, génère les embeddings et les insère dans Supabase (table vidée avant chaque run).

---

## Structure

```
app/
  page.tsx                Accueil
  offres/ projets/        Offres · projets (+ [slug])
  automatisations/        5 démos n8n testables
  parcours/ contact/      Parcours · contact
  demos/ ops/             VEGA · monitoring public
  api/
    chat/ tts/            VEGA (RAG) + synthèse vocale
    contact/              Formulaire (Resend)
    demo/                 Routes sécurisées vers n8n : email-triage, meeting-notes,
                          data-clean, invoice, sav (+ rag)

components/
  home/ offres/ parcours/ contact/ demos/ ui/
  preuves/demo/           Composants des démos /automatisations (canvas, chat SAV, résultats…)

content/ax-knowledge/     Markdown source du RAG VEGA
lib/
  ax-rag.ts               Pipeline RAG de VEGA
  demo-rate-limit.ts      Rate-limit hybride des démos (Upstash + fallback mémoire)
  projects-data.ts        Données des projets
scripts/
  ingest-ax.ts            Ingestion Supabase (VEGA)
  setup-ax-table.sql      Schéma pgvector
public/samples/           Jeux d'essai des démos (CSV, audio, factures)
```

---

## Déployer sur Vercel

Push sur GitHub → import dans Vercel → renseigner les variables d'environnement (Production). Les webhooks n8n et le secret restent côté serveur.
