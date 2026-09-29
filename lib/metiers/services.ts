import type { Metier } from "./types";

// Services B2B au forfait : propreté, informatique, maintenance. Prix HT d'exemple.
export const SERVICES: Metier = {
  id: "services",
  label: "Services B2B",
  entreprise: "Azur Services Pro",
  activite: "Propreté, informatique et maintenance des locaux, au forfait.",
  tva: 0.2,
  remises: [{ seuil: 5000, taux: 0.05 }],
  minimum_ht: 100,
  livraison: { libelle: "Démarrage de la prestation", frais: 0, franco: null, delai_jours: 5 },
  catalogue: [
    { ref: "NET-100", nom: "Nettoyage de bureaux ≤ 100 m² — 2 passages/semaine", categorie: "propreté nettoyage", description: "Sols, poussières, sanitaires, poubelles.", unite: "mois", prix_unitaire: 390, delai_jours: 0 },
    { ref: "NET-300", nom: "Nettoyage de bureaux ≤ 300 m² — 3 passages/semaine", categorie: "propreté nettoyage", description: "Sols, poussières, sanitaires, cuisine, poubelles.", unite: "mois", prix_unitaire: 980, delai_jours: 0 },
    { ref: "NET-VITRES", nom: "Nettoyage des vitres (jusqu'à 50 m²)", categorie: "propreté nettoyage vitres", description: "Intérieur et extérieur, accessibles sans nacelle.", unite: "intervention", prix_unitaire: 180, delai_jours: 0 },
    { ref: "NET-TRAVAUX", nom: "Remise en état après travaux", categorie: "propreté nettoyage", description: "Dépoussiérage complet, décapage des traces.", unite: "m²", prix_unitaire: 6.5, delai_jours: 0 },
    { ref: "IT-MAINT", nom: "Maintenance informatique d'un poste", categorie: "informatique", description: "Assistance, mises à jour, antivirus, dépannage à distance.", unite: "poste/mois", prix_unitaire: 29, delai_jours: 0 },
    { ref: "IT-INSTALL", nom: "Installation et configuration d'un poste", categorie: "informatique", description: "Mise en service, comptes, messagerie, imprimantes.", unite: "poste", prix_unitaire: 120, delai_jours: 0 },
    { ref: "IT-SAUVEGARDE", nom: "Sauvegarde externalisée 500 Go", categorie: "informatique", description: "Sauvegarde quotidienne chiffrée, restauration incluse.", unite: "mois", prix_unitaire: 49, delai_jours: 0 },
    { ref: "IT-DIAG", nom: "Diagnostic informatique et sécurité (½ journée)", categorie: "informatique", description: "État du parc, sauvegardes, mots de passe, recommandations.", unite: "forfait", prix_unitaire: 450, delai_jours: 0 },
    { ref: "DEMENAGEMENT", nom: "Transfert de bureaux (par poste de travail)", categorie: "déménagement", description: "Emballage, transport, remontage du poste.", unite: "poste", prix_unitaire: 85, delai_jours: 5 },
    { ref: "CLIM-ENTRETIEN", nom: "Entretien annuel de climatisation", categorie: "maintenance", description: "Nettoyage des filtres, contrôle, attestation.", unite: "unité", prix_unitaire: 140, delai_jours: 0 },
    { ref: "EXTINCTEUR", nom: "Vérification annuelle d'extincteur", categorie: "maintenance sécurité", description: "Contrôle réglementaire et étiquetage.", unite: "extincteur", prix_unitaire: 12, delai_jours: 0 },
    { ref: "ACCUEIL", nom: "Accueil téléphonique externalisé", categorie: "accueil", description: "Prise d'appels 9 h - 18 h, messages transmis par email.", unite: "mois", prix_unitaire: 690, delai_jours: 0 },
    { ref: "URGENCE-4H", nom: "Intervention urgente sous 4 h", categorie: "maintenance", description: "Plomberie, serrurerie ou informatique, hors pièces.", unite: "intervention", prix_unitaire: 190, delai_jours: 0 },
  ],
  exemples: [
    { label: "Nettoyage 250 m²", texte: "Nous avons 250 m² de bureaux à Paris : nettoyage 3 fois par semaine et les vitres une fois par mois. Quel tarif ?" },
    { label: "8 postes informatiques", texte: "On équipe 8 nouveaux postes : installation, maintenance mensuelle et sauvegarde des données. Vous pouvez me faire une offre ?" },
    { label: "Hors catalogue", texte: "Transfert de 15 postes le mois prochain et gardiennage du local le week-end, c'est possible ?" },
  ],
  politique: {
    engagement: "Contrats mensuels sans engagement de durée, préavis d'un mois.",
    paiement: "Facturation mensuelle, prélèvement ou virement à 30 jours.",
    delais: "Démarrage sous 5 jours ouvrés après signature ; urgences sous 4 h.",
    zone: "Intervention en Île-de-France et dans les grandes métropoles.",
    qualite: "Contrôle qualité mensuel et interlocuteur dédié.",
  },
  sav: [
    { id: "S1", question: "Démarrage d'un contrat", reponse: "La prestation démarre sous 5 jours ouvrés après signature, avec une visite des locaux." },
    { id: "S2", question: "Résilier le contrat", reponse: "Sans engagement : un préavis d'un mois suffit, par email." },
    { id: "S3", question: "Un passage de ménage a été oublié", reponse: "Signalez-le avant 10 h : un agent repasse dans la journée, sans frais." },
    { id: "S4", question: "Panne informatique urgente", reponse: "Maintenance incluse : prise en main à distance sous 1 h ouvrée, déplacement sous 4 h si besoin." },
    { id: "S5", question: "Facturation et paiement", reponse: "Facture mensuelle, prélèvement ou virement à 30 jours." },
    { id: "S6", question: "Produits utilisés pour le ménage", reponse: "Produits écolabellisés, fournis et inclus dans le forfait." },
  ],
  savExemples: ["L'agent n'est pas passé ce matin, que faire ?", "Comment résilier le contrat ?", "Vous faites aussi l'entretien des espaces verts ?"],
};
