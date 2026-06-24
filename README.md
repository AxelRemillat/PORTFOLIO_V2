# Portfolio — Axel Remillat

Portfolio personnel d'**Axel Remillat**, Ingénieur Data & IA.  
Construit avec Next.js 16 App Router, React Three Fiber, Tailwind CSS v4, Supabase et OpenAI.

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Accueil — fond spatial animé (étoiles + astéroïdes), présentation |
| `/projets` | 4 projets avec modèles 3D interactifs et effets visuels par carte |
| `/parcours` | Parcours académique et professionnel |
| `/contact` | Formulaire de contact |
| `/demos/rag` | Démo live du chatbot RAG (nécessite les clés API) |
| `/game` | Mini-jeu Three.js — exploration d'une planète sphérique en 3D |

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
  page.tsx              Accueil
  projets/page.tsx      Page projets (4 cartes 3D)
  parcours/page.tsx     Parcours
  contact/page.tsx      Contact
  demos/rag/page.tsx    Démo RAG
  game/page.tsx         Mini-jeu planète 3D
  api/demo/rag/         Endpoint RAG (rate-limit par IP)

components/
  game/
    GameCanvas.tsx      Scène Three.js (planète, robot, portails)
    Robot.tsx           Personnage joueur avec marche animée
    Portal.tsx          Portails interactifs vers les projets
  projects/
    RobotModel.tsx      Modèle 3D GLB — robot (RAG)
    PlaneModel.tsx      Modèle 3D GLB — avion (RISE)
    SatelliteModel.tsx  Modèle 3D GLB — satellite (SEACO)
    GearsModel.tsx      Modèle 3D GLB — drone (N8N)
  ui/
    SpaceBackground.tsx Fond étoilé animé (homepage + /projets)
    Navbar.tsx          Navigation

public/
  *.glb                 Modèles 3D (robot, avion, satellite, drone)

lib/
  demo-guard.ts         Rate-limit + plafond tokens/jour
  projects-data.ts      Données statiques des projets

content/                Markdown source pour le RAG
scripts/ingest.ts       Script d'ingestion Supabase
```

---

## Mini-jeu `/game`

Exploration en third-person d'une planète sphérique aplatie (ellipsoïde 7×5.95×7).

- **Déplacement** : ZQSD ou flèches directionnelles
- **Saut** : Barre espace
- **Clic** : Clic gauche sur la surface pour se déplacer vers ce point
- **Portails** : 4 portails sur la surface mènent vers les pages projets
- **Physique** : position toujours re-projetée sur l'ellipsoïde, orientation via quaternion aligné sur la normale de surface

---

## Déployer sur Vercel

```bash
vercel
# ou : push sur GitHub → import dans Vercel → configurer les env vars
```
