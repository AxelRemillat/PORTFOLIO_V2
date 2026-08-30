// Métadonnées pédagogiques par outil de l'agent : description backend (source de
// données + logique) + extrait de pseudo-code. Consommé par TraceStep pour exposer
// la structure réelle derrière chaque étape. Aucune logique métier ici.
export interface ToolMeta { description: string; pseudo: string[] }

export const TOOL_META: Record<string, ToolMeta> = {
  rechercher_produits: {
    description: "Filtre le catalogue Mobibureau (≈36 produits) par mots-clés (nom, catégorie, description), score les correspondances et retourne les 8 références les plus pertinentes.",
    pseudo: [
      "const tokens = normalize(requete).split(/\\W+/)",
      "return CATALOGUE",
      "  .map(p => ({ p, score: tokens.filter(t => hay(p).includes(t)).length }))",
      "  .filter(x => x.score > 0).sort(byScore).slice(0, 8)",
    ],
  },
  verifier_stock: {
    description: "Cherche la référence dans le catalogue et compare le stock disponible à la quantité demandée. Renvoie aussi le délai de préparation produit.",
    pseudo: [
      "const p = CATALOGUE.find(x => x.ref === ref)",
      "return { disponible: p.stock >= quantite,",
      "         stock: p.stock, delai_jours: p.delai_base_jours }",
    ],
  },
  verifier_livraison: {
    description: "Recherche la ville dans la table des zones de livraison (couverture, délai de transport, frais). Renvoie « hors couverture » si la ville n'y figure pas.",
    pseudo: [
      "const z = ZONES.find(x => norm(x.ville) === norm(ville))",
      "if (!z) return { livrable: false, raison: 'hors couverture' }",
      "return { livrable: z.livrable, delai_jours: z.delai_jours, frais: z.frais }",
    ],
  },
  calculer_devis: {
    description: "Chiffre chaque ligne (prix catalogue × quantité), applique les remises par paliers, la TVA 20 %, les frais de livraison (offerts au-delà du franco) et calcule le délai global.",
    pseudo: [
      "const sous_total = sum(lignes.map(l => prix(l.ref) * l.quantite))",
      "const remise = palier(sous_total)   // −5% ≥2000€, −10% ≥5000€",
      "const tva = (sous_total - remise + frais) * 0.20",
      "return { sous_total_ht, remise, tva_montant, total_ttc, delai_livraison }",
    ],
  },
  infos_entreprise: {
    description: "Interroge la base de politique commerciale (garantie, SAV, paiement, livraison, délais, horaires, minimum de commande) et retourne la réponse liée au sujet.",
    pseudo: [
      "const key = matchSujet(sujet)   // garantie | paiement | livraison…",
      "return ENTREPRISE[key]          // texte de politique",
    ],
  },
  finaliser: {
    description: "Assemble le livrable final à partir des données collectées : email client personnalisé, créneaux d'appel et note d'alternative. Le devis chiffré est réattaché côté serveur (jamais réécrit par le LLM).",
    pseudo: [
      "return { faisable, email, creneaux, note }",
      "// devis = résultat du dernier calculer_devis (source de vérité)",
    ],
  },
};
