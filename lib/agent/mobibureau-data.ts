// Données fictives de « Mobibureau » (fournisseur B2B de mobilier & équipement de
// bureau). Source de vérité des outils de l'agent : prix, stocks, délais, livraison
// et politique entreprise viennent EXCLUSIVEMENT d'ici (jamais inventés par le LLM).

export interface Produit {
  ref: string;
  nom: string;
  categorie: string;
  description: string;
  prix_unitaire: number; // € HT
  stock: number;
  delai_base_jours: number;
  options?: string[];
}

export const CATALOGUE: Produit[] = [
  // Bureaux assis-debout
  { ref: "BUR-ASD-120", nom: "Bureau assis-debout électrique 120 cm", categorie: "bureaux assis-debout", description: "Plateau 120 cm, réglage électrique 65-125 cm, mémoire 3 positions.", prix_unitaire: 489, stock: 18, delai_base_jours: 8, options: ["chêne", "blanc", "anthracite"] },
  { ref: "BUR-ASD-140", nom: "Bureau assis-debout électrique 140 cm", categorie: "bureaux assis-debout", description: "Plateau 140 cm, double moteur, montée silencieuse.", prix_unitaire: 549, stock: 15, delai_base_jours: 8, options: ["chêne", "blanc", "anthracite"] },
  { ref: "BUR-ASD-160", nom: "Bureau assis-debout électrique 160 cm", categorie: "bureaux assis-debout", description: "Plateau 160 cm, double moteur, capacité 120 kg.", prix_unitaire: 629, stock: 9, delai_base_jours: 8, options: ["chêne", "blanc", "noyer"] },
  { ref: "BUR-BENCH-4", nom: "Bench assis-debout 4 postes", categorie: "bureaux assis-debout", description: "Îlot 4 postes réglables, passe-câbles intégré.", prix_unitaire: 1690, stock: 5, delai_base_jours: 14 },
  { ref: "BUR-DROIT-140", nom: "Bureau droit 140 cm", categorie: "bureaux assis-debout", description: "Bureau fixe 140 cm, piètement métal, entrée de gamme.", prix_unitaire: 199, stock: 40, delai_base_jours: 5, options: ["chêne", "blanc"] },
  // Sièges & fauteuils ergo
  { ref: "SIE-ERG-PRO", nom: "Fauteuil ergonomique Pro", categorie: "sièges & fauteuils ergo", description: "Soutien lombaire dynamique, accoudoirs 4D, dossier maille.", prix_unitaire: 379, stock: 30, delai_base_jours: 6, options: ["noir", "gris"] },
  { ref: "SIE-ERG-MESH", nom: "Fauteuil ergonomique Mesh", categorie: "sièges & fauteuils ergo", description: "Dossier résille respirant, mécanisme synchrone.", prix_unitaire: 259, stock: 45, delai_base_jours: 6, options: ["noir", "bleu"] },
  { ref: "SIE-DIR-CUIR", nom: "Fauteuil direction simili-cuir", categorie: "sièges & fauteuils ergo", description: "Assise haute densité, finition simili-cuir, appui-tête.", prix_unitaire: 449, stock: 8, delai_base_jours: 10, options: ["noir", "cognac"] },
  { ref: "SIE-REU-EMP", nom: "Chaise de réunion empilable", categorie: "sièges & fauteuils ergo", description: "Coque polypropylène, empilable par 10, piètement luge.", prix_unitaire: 79, stock: 120, delai_base_jours: 4, options: ["noir", "gris", "vert"] },
  { ref: "SIE-REU-LUX", nom: "Chaise de réunion rembourrée", categorie: "sièges & fauteuils ergo", description: "Assise et dossier tapissés, piètement chromé.", prix_unitaire: 119, stock: 60, delai_base_jours: 5 },
  { ref: "SIE-TAB-HAUT", nom: "Tabouret assis-debout", categorie: "sièges & fauteuils ergo", description: "Assise inclinable, vérin haut, socle lesté.", prix_unitaire: 99, stock: 50, delai_base_jours: 5 },
  // Rangement & caissons
  { ref: "RAN-CAS-3", nom: "Caisson 3 tiroirs mobile", categorie: "rangement & caissons", description: "Caisson sous-bureau, serrure centralisée, roulettes.", prix_unitaire: 129, stock: 55, delai_base_jours: 5, options: ["chêne", "blanc"] },
  { ref: "RAN-ARM-H", nom: "Armoire haute portes battantes", categorie: "rangement & caissons", description: "Armoire 5 niveaux, portes verrouillables.", prix_unitaire: 299, stock: 20, delai_base_jours: 9 },
  { ref: "RAN-ARM-RID", nom: "Armoire à rideaux", categorie: "rangement & caissons", description: "Rideaux métalliques, 4 tablettes réglables.", prix_unitaire: 349, stock: 14, delai_base_jours: 9 },
  { ref: "RAN-VES-6", nom: "Casier vestiaire 6 portes", categorie: "rangement & caissons", description: "Vestiaire collectif 6 cases, aération, porte-étiquette.", prix_unitaire: 219, stock: 35, delai_base_jours: 9 },
  { ref: "RAN-VES-1", nom: "Casier de vestiaire individuel", categorie: "rangement & caissons", description: "Casier une porte, serrure à clé.", prix_unitaire: 89, stock: 40, delai_base_jours: 9 },
  // Cloisons & acoustique
  { ref: "ACO-CLO-120", nom: "Cloison acoustique 120 cm", categorie: "cloisons & acoustique", description: "Écran séparateur absorbant, fixation bureau.", prix_unitaire: 149, stock: 40, delai_base_jours: 7, options: ["gris", "bleu", "vert"] },
  { ref: "ACO-PAN-MUR", nom: "Panneau mural absorbant", categorie: "cloisons & acoustique", description: "Panneau feutre 60×60 cm, réduit la réverbération.", prix_unitaire: 59, stock: 90, delai_base_jours: 6, options: ["gris", "moutarde", "terracotta"] },
  { ref: "ACO-CAB-1", nom: "Cabine acoustique 1 personne", categorie: "cloisons & acoustique", description: "Phone-box insonorisée, ventilation + éclairage LED.", prix_unitaire: 3490, stock: 3, delai_base_jours: 21 },
  { ref: "ACO-CAB-4", nom: "Cabine acoustique 4 personnes", categorie: "cloisons & acoustique", description: "Bulle de réunion 4 places, acoustique + prises.", prix_unitaire: 6900, stock: 2, delai_base_jours: 28 },
  { ref: "ACO-SUSP", nom: "Panneau acoustique suspendu", categorie: "cloisons & acoustique", description: "Baffle plafond, suspension câble, absorption élevée.", prix_unitaire: 89, stock: 60, delai_base_jours: 7 },
  // Tables de réunion
  { ref: "TAB-REU-6", nom: "Table de réunion 6 personnes", categorie: "tables de réunion", description: "Plateau 180 cm, passe-câbles, piètement panneau.", prix_unitaire: 690, stock: 10, delai_base_jours: 12, options: ["chêne", "blanc"] },
  { ref: "TAB-REU-8", nom: "Table de réunion 8 personnes", categorie: "tables de réunion", description: "Plateau 220 cm, boîtier électrification en option.", prix_unitaire: 890, stock: 7, delai_base_jours: 12, options: ["chêne", "blanc", "noyer"] },
  { ref: "TAB-REU-12", nom: "Grande table de réunion 12 personnes", categorie: "tables de réunion", description: "Plateau 360 cm, deux modules, gestion des câbles.", prix_unitaire: 1490, stock: 4, delai_base_jours: 15 },
  { ref: "TAB-HAUT-BIS", nom: "Table haute bistrot", categorie: "tables de réunion", description: "Mange-debout Ø80 cm, espaces informels.", prix_unitaire: 249, stock: 18, delai_base_jours: 7 },
  { ref: "TAB-PLIANTE", nom: "Table pliante polyvalente", categorie: "tables de réunion", description: "Plateau rabattable 160 cm, roulettes, formation/événement.", prix_unitaire: 179, stock: 30, delai_base_jours: 6 },
  // Éclairage
  { ref: "ECL-LAMP-LED", nom: "Lampe de bureau LED", categorie: "éclairage", description: "Bras articulé, variation, température réglable.", prix_unitaire: 49, stock: 80, delai_base_jours: 3, options: ["noir", "blanc"] },
  { ref: "ECL-LAMP-PIED", nom: "Lampadaire sur pied LED", categorie: "éclairage", description: "Éclairage indirect + direct, détecteur de présence.", prix_unitaire: 189, stock: 22, delai_base_jours: 5 },
  { ref: "ECL-SUSP-REU", nom: "Suspension LED salle de réunion", categorie: "éclairage", description: "Luminaire linéaire 120 cm, anti-éblouissement.", prix_unitaire: 159, stock: 26, delai_base_jours: 6 },
  { ref: "ECL-VISIO", nom: "Kit éclairage visio", categorie: "éclairage", description: "Barre LED frontale pour visioconférence, USB-C.", prix_unitaire: 79, stock: 40, delai_base_jours: 4 },
  // Accessoires
  { ref: "ACC-ECR-DBL", nom: "Bras support double écran", categorie: "accessoires", description: "Fixation bureau, deux écrans jusqu'à 32\", gestion câbles.", prix_unitaire: 89, stock: 70, delai_base_jours: 3 },
  { ref: "ACC-REP-PIED", nom: "Repose-pieds ergonomique", categorie: "accessoires", description: "Inclinaison réglable, surface antidérapante.", prix_unitaire: 39, stock: 90, delai_base_jours: 3 },
  { ref: "ACC-TAPIS", nom: "Tapis anti-fatigue debout", categorie: "accessoires", description: "Confort en position debout, pour bureau assis-debout.", prix_unitaire: 45, stock: 65, delai_base_jours: 3 },
  { ref: "ACC-DOCK", nom: "Station d'accueil USB-C", categorie: "accessoires", description: "Dock double affichage, charge 100 W, RJ45.", prix_unitaire: 139, stock: 34, delai_base_jours: 4 },
  { ref: "ACC-CABLE", nom: "Kit gestion des câbles", categorie: "accessoires", description: "Goulotte, passe-câbles et velcros pour un poste net.", prix_unitaire: 25, stock: 120, delai_base_jours: 3 },
  { ref: "ACC-CHARIOT", nom: "Chariot multimédia mobile", categorie: "accessoires", description: "Support écran mobile + tablette, pour salles flexibles.", prix_unitaire: 329, stock: 12, delai_base_jours: 7 },
];

export interface Zone { ville: string; livrable: boolean; delai_jours: number; frais: number }

// Couverture logistique : grandes villes livrables + zones hors couverture
// (pour créer une vraie décision « faisable / non faisable »).
export const ZONES: Zone[] = [
  { ville: "Paris", livrable: true, delai_jours: 2, frais: 0 },
  { ville: "Lyon", livrable: true, delai_jours: 3, frais: 39 },
  { ville: "Marseille", livrable: true, delai_jours: 4, frais: 49 },
  { ville: "Bordeaux", livrable: true, delai_jours: 4, frais: 49 },
  { ville: "Lille", livrable: true, delai_jours: 3, frais: 39 },
  { ville: "Nantes", livrable: true, delai_jours: 4, frais: 49 },
  { ville: "Toulouse", livrable: true, delai_jours: 5, frais: 59 },
  { ville: "Strasbourg", livrable: true, delai_jours: 4, frais: 49 },
  { ville: "Rennes", livrable: true, delai_jours: 4, frais: 49 },
  { ville: "Nice", livrable: true, delai_jours: 5, frais: 59 },
  { ville: "Ajaccio", livrable: false, delai_jours: 0, frais: 0 },
  { ville: "Cayenne", livrable: false, delai_jours: 0, frais: 0 },
];

// Règles commerciales.
export const REMISE_PALIERS = [
  { seuil: 5000, taux: 0.1 },
  { seuil: 2000, taux: 0.05 },
];
export const TVA_TAUX = 0.2;
export const FRANCO_HT = 3000;    // livraison offerte au-delà (HT après remise)
export const MIN_COMMANDE_HT = 150;

// Politique / infos entreprise (questions générales, pas seulement les devis).
export const ENTREPRISE: Record<string, string> = {
  garantie: "Garantie 5 ans sur les bureaux et sièges, 2 ans sur l'électronique et l'éclairage. Pièces détachées disponibles 7 ans.",
  sav: "SAV réactif : prise en charge sous 48 h ouvrées, intervention ou pièce envoyée. Retours acceptés 30 jours (produit non monté, emballage d'origine).",
  paiement: "Paiement à 30 jours sur facture pour les professionnels (après validation), ou carte / virement à la commande. Devis gratuit et sans engagement.",
  livraison: `Livraison en France métropolitaine, montage en option. Frais selon la ville ; livraison OFFERTE au-delà de ${FRANCO_HT} € HT. Zones hors couverture : Corse et DROM-COM.`,
  delais: "Délai = disponibilité produit + transport. La plupart des articles partent sous 3 à 9 jours ouvrés ; le sur-mesure (cabines acoustiques) sous 3 à 4 semaines.",
  horaires: "Service commercial ouvert du lundi au vendredi, 9 h - 18 h. Réponse aux demandes sous 24 h ouvrées.",
  minimum: `Commande minimum : ${MIN_COMMANDE_HT} € HT. En dessous, on oriente vers le réassort ou le retrait.`,
};
