import type { Metier } from "./types";

// Bakery & catering: business orders and events. Sample prices excl. VAT.
// Takeaway food: 5.5% VAT; on-site service: 10%.
export const BOULANGERIE: Metier = {
  id: "boulangerie",
  label: "Bakery & catering",
  entreprise: "Hearth & Crumb Bakery",
  activite: "Bakery, pastry shop and caterer: breakfasts, buffets and corporate events.",
  tva: 0.055,
  remises: [{ seuil: 1500, taux: 0.05 }],
  minimum_ht: 60,
  livraison: { libelle: "On-site delivery", frais: 25, franco: 300, delai_jours: 2 },
  catalogue: [
    { ref: "VIEN-MINI30", nom: "Tray of 30 mini pastries", categorie: "breakfast pastries", description: "Croissants, chocolate croissants, raisin swirls.", unite: "tray", prix_unitaire: 27, delai_jours: 2 },
    { ref: "CROISSANT", nom: "All-butter croissant", categorie: "breakfast pastries", description: "Classic size.", unite: "piece", prix_unitaire: 1.15, delai_jours: 1 },
    { ref: "PAIN-CHOC", nom: "Chocolate croissant (pain au chocolat)", categorie: "breakfast pastries", description: "All butter.", unite: "piece", prix_unitaire: 1.25, delai_jours: 1 },
    { ref: "JUS-1L", nom: "Artisan fruit juice 1 L", categorie: "breakfast drinks", description: "Orange or apple, freshly pressed.", unite: "bottle", prix_unitaire: 4.2, delai_jours: 1 },
    { ref: "BAGUETTE", nom: "Traditional baguette", categorie: "bread", description: "Label Rouge certified flour.", unite: "piece", prix_unitaire: 1.2, delai_jours: 1 },
    { ref: "PAIN-SURPRISE", nom: "Party bread loaf, 48 mini sandwiches", categorie: "savory buffet", description: "Ham, salmon, cheese.", unite: "piece", prix_unitaire: 59, delai_jours: 2 },
    { ref: "PLATEAU-SALE", nom: "Savory platter, 40 pieces", categorie: "savory buffet cocktail", description: "Mini sandwiches, canapés, puff pastry bites.", unite: "platter", prix_unitaire: 72, delai_jours: 2 },
    { ref: "QUICHE-8", nom: "Quiche, 8 slices", categorie: "savory buffet", description: "Lorraine or vegetable.", unite: "piece", prix_unitaire: 18, delai_jours: 1 },
    { ref: "FORMULE-DEJ", nom: "Sandwich lunch box", categorie: "lunch sandwiches", description: "Sandwich, dessert and drink, in a named bag.", unite: "box", prix_unitaire: 11.5, delai_jours: 1 },
    { ref: "MIGNARDISES", nom: "Platter of 40 petits fours", categorie: "sweet buffet cocktail", description: "Mini tarts, macarons, cream puffs.", unite: "platter", prix_unitaire: 68, delai_jours: 2 },
    { ref: "ENTREMETS-6", nom: "Mousse cake, 6 servings", categorie: "cakes pastry", description: "Chocolate, red berries or vanilla.", unite: "piece", prix_unitaire: 24, delai_jours: 2 },
    { ref: "ENTREMETS-12", nom: "Mousse cake, 12 servings", categorie: "cakes pastry", description: "Flavor of your choice, custom message.", unite: "piece", prix_unitaire: 44, delai_jours: 2 },
    { ref: "PIECE-MONTEE", nom: "Cream puff tower (croquembouche)", categorie: "cakes pastry", description: "3 cream puffs per person, nougatine.", unite: "person", prix_unitaire: 5.9, delai_jours: 5 },
    { ref: "SERVICE-CAFE", nom: "Coffee service (20-cup thermos)", categorie: "drinks service", description: "Coffee, sugar, cups and stirrers.", unite: "thermos", prix_unitaire: 35, delai_jours: 1, tva: 0.1 },
    { ref: "SERVEUR-H", nom: "Server for the event", categorie: "service staff", description: "Setup, serving and clearing.", unite: "hour", prix_unitaire: 38, delai_jours: 2, tva: 0.1 },
  ],
  exemples: [
    { label: "Seminar, 40 people", texte: "For a 40-person seminar on Thursday: breakfast (pastries, juice, coffee) and a sandwich lunch. Can you give me a quote?" },
    { label: "Farewell drinks", texte: "Farewell drinks on Friday at 6 pm for 60 people: savory and sweet bites, with a server for 3 hours." },
    { label: "Off-catalog", texte: "I need a gluten-free cake for 30 people and 2 savory platters for Saturday lunch." },
  ],
  politique: {
    commande: "Order at least 48 hours ahead, 5 days for cream puff towers.",
    paiement: "Businesses: invoice payable at 30 days. Individuals: 30% deposit when ordering.",
    livraison: "On-site delivery within 20 km, free from €300 excl. VAT. Free pickup at the shop.",
    allergenes: "An allergen list is provided for every product. We cannot guarantee gluten-free production.",
    annulation: "Free cancellation up to 72 hours before, 50% charged after that.",
  },
  sav: [
    { id: "T1", question: "How far ahead to order", reponse: "48 hours ahead for buffets and pastries, 5 days for cream puff towers." },
    { id: "T2", question: "Allergens and special diets", reponse: "The allergen list comes with every order. Vegetarian options on request. We can't guarantee gluten-free." },
    { id: "T3", question: "Delivery and pickup", reponse: "Delivery within 20 km, free from €300 excl. VAT. Free pickup at the shop from 7 am." },
    { id: "T4", question: "Canceling or changing an order", reponse: "Free up to 72 hours before the event, 50% charged after that." },
    { id: "T5", question: "Payment for businesses", reponse: "Invoice payable at 30 days for businesses, with a purchase order." },
    { id: "T6", question: "Quantities per person", reponse: "Plan on 3 mini pastries per person for breakfast, and 10 to 12 cocktail pieces per person for a cocktail reception." },
  ],
  savExemples: ["How many cocktail pieces should I plan per person?", "Can I cancel my order for Saturday?", "Do you cater hot meals at home?"],
};
