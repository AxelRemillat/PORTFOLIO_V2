# SEACO — Pipeline RAG hybride

## Description

Pipeline RAG (Retrieval-Augmented Generation) hybride développé pour le projet SEACO. Permet d'interroger un corpus de documents métier en langage naturel et d'obtenir des réponses précises et sourcées.

## Stack technique

- Python (ingestion, traitement, orchestration)
- OpenAI API : text-embedding-3-large (1536 dimensions) pour les embeddings, GPT-4o-mini pour la génération
- Supabase avec extension pgvector pour le stockage et le retrieval vectoriel
- FastAPI pour l'API de requête

## Architecture

1. **Ingestion** : lecture des documents, découpe en chunks, génération des embeddings
2. **Stockage** : chunks + embeddings dans Supabase (pgvector, vector(1536))
3. **Retrieval** : recherche par similarité cosinus via fonction SQL `match_documents`
4. **Génération** : réponse contextuelle avec GPT-4o-mini, prompt avec les chunks pertinents

## [Placeholder — à compléter]

Les détails spécifiques au projet SEACO sont à compléter. Cette architecture a été réutilisée directement pour la démo RAG du portfolio.
