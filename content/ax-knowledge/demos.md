<!-- GÉNÉRÉ par scripts/build-ax-knowledge.ts — ne pas éditer à la main. -->
# Les démos du site

Toutes les démos sont testables en ligne, sans inscription. Elles utilisent des entreprises et des catalogues fictifs ; chez un client, on branche ses propres documents, ses prix et ses outils.

## Agent devis — /agent

On choisit un métier, on colle une demande de client, et l'agent prépare le devis chiffré (remises, TVA, livraison), l'email de réponse et un créneau d'appel. Les prix et délais viennent uniquement du catalogue ; ce qui sort du catalogue est signalé. 5 métiers :

- Menuiserie / fenêtres (entreprise fictive Atelier Boisclair) : Fenêtres, portes et volets sur mesure, fourniture et pose. Exemples de demandes : rénovation maison, volets local pro, hors catalogue.
- BTP / rénovation (entreprise fictive Rénov'Artisans) : Rénovation intérieure : cloisons, peinture, sols, électricité, salles de bain. Exemples de demandes : appartement 60 m², cloison + prises, hors catalogue.
- Négoce B2B (entreprise fictive Négoce Martel Matériaux) : Matériaux et fournitures pour les pros du bâtiment, livrés sur chantier. Exemples de demandes : commande cloisons, gros œuvre, hors catalogue.
- Boulangerie-traiteur (entreprise fictive Maison Fournier) : Boulangerie-pâtisserie et traiteur : petits-déjeuners, buffets et événements d'entreprise. Exemples de demandes : séminaire 40 pers., pot de départ, hors catalogue.
- Services B2B (entreprise fictive Azur Services Pro) : Propreté, informatique et maintenance des locaux, au forfait. Exemples de demandes : nettoyage 250 m², 8 postes informatiques, hors catalogue.

## 5 automatisations — /automatisations

- Tri des emails et demandes — /automatisations?demo=email : Collez un email reçu : l'IA le classe, le priorise et rédige une réponse.
- Compte rendu de réunion — /automatisations?demo=meeting : Transcription (texte ou audio) : l'IA en extrait décisions, actions et compte rendu.
- Fichier clients : nettoyage et doublons — /automatisations?demo=dataclean : Envoyez un fichier CSV (export Excel) : erreurs repérées, formats harmonisés, doublons fusionnés, puis un rapport.
- Extraction de facture — /automatisations?demo=invoice : Envoyez une facture (image ou PDF) : l'IA lit le document, en extrait les informations et vérifie les totaux.
- Service client (SAV) — /automatisations?demo=sav : Choisissez votre métier et posez une question de client : l'assistant répond à partir de la base de l'entreprise, cite ses sources, et passe la main à un conseiller s'il ne sait pas.

## Classement des contacts entrants — /pipeline

Chaque contact entrant reçoit une probabilité d'aboutir (chaud, tiède, froid) et on voit ce qui fait monter ou baisser son score.

## VEGA — /demos

L'assistante du site, à qui l'on pose ses questions par écrit ou à la voix.
