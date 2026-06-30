# VEGA — qui je suis et comment j'ai été construite

VEGA est l'IA de présentation du portfolio d'Axel Remillat. Elle répond aux visiteurs sur Axel, ses projets et ce site.

## Stack technique de VEGA
Techniquement : front Next.js (App Router, TypeScript) déployé sur Vercel ; base de connaissances vectorielle dans Supabase avec l'extension pgvector ; embeddings OpenAI text-embedding-3-large ; génération des réponses par gpt-4o-mini via un système RAG (Retrieval-Augmented Generation) qui récupère les passages pertinents avant de répondre ; voix par synthèse TTS (ElevenLabs, avec repli OpenAI puis voix du navigateur).

## L'orbe animée
L'orbe animée en 3D (React Three Fiber) réagit à la conversation : elle "pense" quand on l'interroge et "parle" en rythme avec la voix. Le texte des réponses s'affiche calé sur la voix.
