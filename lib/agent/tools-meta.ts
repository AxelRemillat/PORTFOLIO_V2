// Métadonnées pédagogiques par outil de l'agent : ce que fait l'étape, en clair,
// et un extrait de pseudo-code. Consommé par TraceStep. Aucune logique métier ici.
export interface ToolMeta { description: string; pseudo: string[] }

export const TOOL_META: Record<string, ToolMeta> = {
  rechercher_articles: {
    description: "Cherche dans le catalogue du métier choisi (nom, catégorie, description) et retourne les 8 articles les plus proches, avec prix HT, unité et délai.",
    pseudo: [
      "const mots = normaliser(requete).split(/\\W+/)",
      "return CATALOGUE",
      "  .map(a => ({ a, score: mots.filter(m => texte(a).includes(m)).length }))",
      "  .filter(x => x.score > 0).sort(parScore).slice(0, 8)",
    ],
  },
  verifier_livraison: {
    description: "Vérifie la zone : frais, franco et délai standard, ou question à poser au client si la destination sort de la zone habituelle.",
    pseudo: [
      "if (horsZone(ville)) return { a_confirmer: true, question }",
      "return { frais, franco, delai_jours }",
    ],
  },
  calculer_devis: {
    description: "Chiffre chaque ligne (prix × quantité), applique la remise, les frais, la TVA par taux, et liste ce qui reste à chiffrer avec les questions à poser.",
    pseudo: [
      "const sous_total = somme(lignes.map(l => prix(l.ref) * l.quantite))",
      "const remise = palier(sous_total)",
      "const tva = somme(parTaux(bases).map(b => b.base * b.taux))",
      "return { lignes, a_chiffrer, total_ht, tva, total_ttc, questions }",
    ],
  },
  infos_entreprise: {
    description: "Lit la politique de l'entreprise (garantie, paiement, délais, TVA…) et retourne la réponse liée au sujet.",
    pseudo: ["const cle = trouverSujet(sujet)", "return POLITIQUE[cle]"],
  },
  finaliser: {
    description: "Assemble le livrable : email client, questions à poser, créneaux d'appel. Le devis chiffré est réattaché côté serveur (jamais réécrit par l'IA).",
    pseudo: ["return { complet, email, questions, creneaux }", "// devis = dernier calculer_devis (source de vérité)"],
  },
};
