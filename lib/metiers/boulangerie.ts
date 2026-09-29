import type { Metier } from "./types";

// Boulangerie-traiteur : commandes pro et événements. Prix HT d'exemple.
// Produits alimentaires à emporter : TVA 5,5 % ; service sur place : 10 %.
export const BOULANGERIE: Metier = {
  id: "boulangerie",
  label: "Boulangerie-traiteur",
  entreprise: "Maison Fournier",
  activite: "Boulangerie-pâtisserie et traiteur : petits-déjeuners, buffets et événements d'entreprise.",
  tva: 0.055,
  remises: [{ seuil: 1500, taux: 0.05 }],
  minimum_ht: 60,
  livraison: { libelle: "Livraison sur site", frais: 25, franco: 300, delai_jours: 2 },
  catalogue: [
    { ref: "VIEN-MINI30", nom: "Plateau de 30 mini-viennoiseries", categorie: "petit-déjeuner viennoiseries", description: "Croissants, pains au chocolat, pains aux raisins.", unite: "plateau", prix_unitaire: 27, delai_jours: 2 },
    { ref: "CROISSANT", nom: "Croissant pur beurre", categorie: "petit-déjeuner viennoiseries", description: "Taille classique.", unite: "pièce", prix_unitaire: 1.15, delai_jours: 1 },
    { ref: "PAIN-CHOC", nom: "Pain au chocolat", categorie: "petit-déjeuner viennoiseries", description: "Pur beurre.", unite: "pièce", prix_unitaire: 1.25, delai_jours: 1 },
    { ref: "JUS-1L", nom: "Jus de fruits artisanal 1 L", categorie: "boissons petit-déjeuner", description: "Orange ou pomme, pressé.", unite: "bouteille", prix_unitaire: 4.2, delai_jours: 1 },
    { ref: "BAGUETTE", nom: "Baguette tradition", categorie: "pains", description: "Farine Label Rouge.", unite: "pièce", prix_unitaire: 1.2, delai_jours: 1 },
    { ref: "PAIN-SURPRISE", nom: "Pain surprise 48 pièces", categorie: "buffet salé", description: "Jambon, saumon, fromage.", unite: "pièce", prix_unitaire: 59, delai_jours: 2 },
    { ref: "PLATEAU-SALE", nom: "Plateau salé 40 pièces", categorie: "buffet salé cocktail", description: "Mini-sandwichs, canapés, feuilletés.", unite: "plateau", prix_unitaire: 72, delai_jours: 2 },
    { ref: "QUICHE-8", nom: "Quiche 8 parts", categorie: "buffet salé", description: "Lorraine ou légumes.", unite: "pièce", prix_unitaire: 18, delai_jours: 1 },
    { ref: "FORMULE-DEJ", nom: "Formule déjeuner sandwich", categorie: "déjeuner sandwichs", description: "Sandwich, dessert et boisson, en sachet nominatif.", unite: "formule", prix_unitaire: 11.5, delai_jours: 1 },
    { ref: "MIGNARDISES", nom: "Plateau de 40 mignardises", categorie: "buffet sucré cocktail", description: "Mini-tartelettes, macarons, choux.", unite: "plateau", prix_unitaire: 68, delai_jours: 2 },
    { ref: "ENTREMETS-6", nom: "Entremets 6 parts", categorie: "gâteaux pâtisserie", description: "Chocolat, fruits rouges ou vanille.", unite: "pièce", prix_unitaire: 24, delai_jours: 2 },
    { ref: "ENTREMETS-12", nom: "Entremets 12 parts", categorie: "gâteaux pâtisserie", description: "Parfum au choix, message personnalisé.", unite: "pièce", prix_unitaire: 44, delai_jours: 2 },
    { ref: "PIECE-MONTEE", nom: "Pièce montée en choux", categorie: "gâteaux pâtisserie", description: "3 choux par personne, nougatine.", unite: "personne", prix_unitaire: 5.9, delai_jours: 5 },
    { ref: "SERVICE-CAFE", nom: "Service café (thermos 20 tasses)", categorie: "boissons service", description: "Café, sucre, gobelets et touillettes.", unite: "thermos", prix_unitaire: 35, delai_jours: 1, tva: 0.1 },
    { ref: "SERVEUR-H", nom: "Serveur pour le service", categorie: "service personnel", description: "Mise en place, service et débarrassage.", unite: "heure", prix_unitaire: 38, delai_jours: 2, tva: 0.1 },
  ],
  exemples: [
    { label: "Séminaire 40 pers.", texte: "Pour un séminaire de 40 personnes jeudi : petit-déjeuner (viennoiseries, jus, café) et un déjeuner sandwichs. Vous pouvez chiffrer ?" },
    { label: "Pot de départ", texte: "Pot de départ vendredi 18 h pour 60 personnes : du salé et du sucré, avec un serveur pendant 3 h." },
    { label: "Hors catalogue", texte: "Il me faudrait un gâteau sans gluten pour 30 personnes et 2 plateaux salés pour samedi midi." },
  ],
  politique: {
    commande: "Commande au plus tard 48 h avant, 5 jours pour les pièces montées.",
    paiement: "Entreprises : facture à 30 jours. Particuliers : acompte de 30 % à la commande.",
    livraison: "Livraison sur site dans un rayon de 20 km, offerte dès 300 € HT. Retrait gratuit en boutique.",
    allergenes: "La liste des allergènes est fournie pour chaque produit ; pas de production garantie sans gluten.",
    annulation: "Annulation gratuite jusqu'à 72 h avant, 50 % facturés ensuite.",
  },
  sav: [
    { id: "T1", question: "Délai pour commander", reponse: "48 h avant pour les buffets et viennoiseries, 5 jours pour les pièces montées." },
    { id: "T2", question: "Allergènes et régimes spéciaux", reponse: "La liste des allergènes est jointe à chaque commande. Options végétariennes sur demande ; pas de sans-gluten garanti." },
    { id: "T3", question: "Livraison et retrait", reponse: "Livraison dans un rayon de 20 km, offerte dès 300 € HT. Retrait gratuit en boutique dès 7 h." },
    { id: "T4", question: "Annuler ou modifier une commande", reponse: "Gratuit jusqu'à 72 h avant l'événement, 50 % facturés ensuite." },
    { id: "T5", question: "Paiement des entreprises", reponse: "Facture à 30 jours pour les entreprises, sur bon de commande." },
    { id: "T6", question: "Quantités par personne", reponse: "Comptez 3 mini-viennoiseries au petit-déjeuner, 10 à 12 pièces cocktail par personne pour un apéritif dînatoire." },
  ],
  savExemples: ["Combien de pièces cocktail prévoir par personne ?", "Je peux annuler ma commande de samedi ?", "Vous faites des plats chauds à domicile ?"],
};
