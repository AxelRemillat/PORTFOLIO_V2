// Types partagés des métiers de démonstration : l'agent devis (/agent) et
// l'assistant SAV (/automatisations) lisent les mêmes fiches. Données FICTIVES
// (catalogues d'exemple) : chez un client, on branche son catalogue et ses prix.

export type MetierId = "menuiserie" | "btp" | "negoce" | "boulangerie" | "services";

export interface Article {
  ref: string;
  nom: string;
  categorie: string;
  description: string;
  unite: string;          // "pièce", "m²", "forfait", "mois"…
  prix_unitaire: number;  // € HT
  delai_jours: number;    // délai de préparation / fabrication (jours ouvrés)
  tva?: number;           // taux propre à l'article, sinon celui du métier
}

export interface Exemple { label: string; texte: string }

export interface Livraison {
  libelle: string;        // "Livraison sur chantier", "Déplacement"…
  frais: number;          // € HT par commande
  franco: number | null;  // offerte au-delà de ce montant HT (null = jamais)
  delai_jours: number;    // transport / intervention
}

export interface FaqSav { id: string; question: string; reponse: string }

export interface Metier {
  id: MetierId;
  label: string;          // "Menuiserie / fenêtres"
  entreprise: string;     // nom fictif
  activite: string;       // une ligne de présentation
  tva: number;            // taux par défaut (0.2, 0.1, 0.055)
  remises: { seuil: number; taux: number }[]; // paliers, du plus haut au plus bas
  minimum_ht: number;
  livraison: Livraison;
  catalogue: Article[];
  exemples: Exemple[];    // 3 demandes types pour l'agent devis
  politique: Record<string, string>; // garantie, paiement, délais…
  sav: FaqSav[];          // base de l'assistant SAV
  savExemples: string[];  // 3 questions types (dont 1 hors base)
}
