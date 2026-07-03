# Projet — SEACO

SEACO est une plateforme SaaS en cours de développement par Axel : un assistant de vie qui automatise et interconnecte le quotidien des étudiants et jeunes actifs. Slogan : "Ton temps vaut mieux que ça."

Le concept : six zones de vie interconnectées — Études (fiches de révision IA, moyennes auto, résumé de PDF), Carrière (auto-CV, alertes stages, prépa entretiens IA), Réseaux (bot WhatsApp, communauté), Budget (suivi dépenses, détection d'aides et bourses), Entrepreneuriat (business plan, incubateurs), et au centre le Profil Vivant : un profil utilisateur dynamique qui évolue à chaque interaction et propage les mises à jour entre zones. Exemple : un changement de filière régénère les fiches de révision, adapte les offres de stage, réajuste le budget.

Stack : React 18 + Vite, Tailwind CSS, Framer Motion, Supabase (PostgreSQL, Row Level Security, auth email/OTP/Google OAuth), OpenAI pour l'IA, et N8N pour l'orchestration — notamment un chatbot connecté par webhook avec deux branches (visiteur ou utilisateur authentifié avec profil + historique des 20 derniers messages) capable de mettre à jour le profil utilisateur depuis la conversation. Le projet inclut un pipeline RAG documenté. État : en développement actif, non lancé publiquement.
