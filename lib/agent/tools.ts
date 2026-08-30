import { CATALOGUE, ZONES, ENTREPRISE, REMISE_PALIERS, TVA_TAUX, FRANCO_HT, type Produit } from "./mobibureau-data";

// Outils déterministes de l'agent : fonctions pures sur les données Mobibureau.
// Toute valeur chiffrée (prix, stock, délai) provient d'ici — jamais du LLM.
const r2 = (n: number) => Math.round(n * 100) / 100;
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const pub = (p: Produit) => ({ ref: p.ref, nom: p.nom, categorie: p.categorie, description: p.description, prix_unitaire: p.prix_unitaire, stock: p.stock, delai_base_jours: p.delai_base_jours, options: p.options });

export function rechercher_produits({ requete }: { requete: string }) {
  const tokens = norm(requete || "").split(/[^a-z0-9]+/).filter((t) => t.length >= 3);
  const scored = CATALOGUE.map((p) => {
    const hay = norm(`${p.nom} ${p.categorie} ${p.description} ${p.ref}`);
    const score = tokens.reduce((s, t) => s + (hay.includes(t) ? 1 : 0), 0);
    return { p, score };
  }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 8);
  return { produits: scored.map((x) => pub(x.p)) };
}

export function verifier_stock({ ref, quantite }: { ref: string; quantite: number }) {
  const p = CATALOGUE.find((x) => x.ref === ref);
  if (!p) return { trouve: false, ref, disponible: false, stock: 0, delai_jours: 0 };
  const q = Math.max(1, Math.round(quantite || 1));
  return { trouve: true, ref, nom: p.nom, disponible: p.stock >= q, stock: p.stock, quantite_demandee: q, delai_jours: p.delai_base_jours };
}

export function verifier_livraison({ ville }: { ville: string }) {
  const z = ZONES.find((x) => norm(x.ville) === norm(ville || ""));
  if (!z) return { ville, livrable: false, delai_jours: 0, frais: 0, raison: "zone hors couverture" };
  return { ville: z.ville, livrable: z.livrable, delai_jours: z.delai_jours, frais: z.frais, ...(z.livrable ? {} : { raison: "zone hors couverture" }) };
}

export function calculer_devis({ lignes, ville }: { lignes: { ref: string; quantite: number }[]; ville?: string }) {
  const detail = (lignes || []).map((l) => {
    const p = CATALOGUE.find((x) => x.ref === l.ref);
    const q = Math.max(1, Math.round(l.quantite || 1));
    if (!p) return { designation: `Référence inconnue (${l.ref})`, quantite: q, prix_unitaire: 0, montant: 0, _delai: 0 };
    return { designation: p.nom, quantite: q, prix_unitaire: p.prix_unitaire, montant: r2(p.prix_unitaire * q), _delai: p.delai_base_jours };
  });
  const sous_total_ht = r2(detail.reduce((s, l) => s + l.montant, 0));
  const palier = REMISE_PALIERS.find((pa) => sous_total_ht >= pa.seuil);
  const remise = { taux: palier?.taux ?? 0, montant: r2(sous_total_ht * (palier?.taux ?? 0)) };
  const total_apres_remise = r2(sous_total_ht - remise.montant);

  const z = ville ? ZONES.find((x) => norm(x.ville) === norm(ville)) : undefined;
  const franco = total_apres_remise >= FRANCO_HT;
  const frais_livraison = z?.livrable && !franco ? z.frais : 0;
  const delaiProduit = detail.reduce((m, l) => Math.max(m, l._delai), 0);
  const delai_livraison = z?.livrable ? delaiProduit + z.delai_jours : delaiProduit;

  const base_ht = r2(total_apres_remise + frais_livraison);
  const tva_montant = r2(base_ht * TVA_TAUX);
  const total_ttc = r2(base_ht + tva_montant);
  const lignes_out = detail.map(({ designation, quantite, prix_unitaire, montant }) => ({ designation, quantite, prix_unitaire, montant }));
  return { lignes: lignes_out, sous_total_ht, remise, tva_montant, total_ttc, frais_livraison, franco, delai_livraison, ville: z?.ville ?? ville ?? null };
}

export function infos_entreprise({ sujet }: { sujet: string }) {
  const s = norm(sujet || "");
  const key = Object.keys(ENTREPRISE).find((k) => s.includes(k) || norm(ENTREPRISE[k]).includes(s));
  if (key) return { sujet: key, reponse: ENTREPRISE[key] };
  return { sujet, infos: ENTREPRISE }; // renvoie tout si le sujet n'est pas ciblé
}

export const TOOL_FNS: Record<string, (args: Record<string, unknown>) => unknown> = {
  rechercher_produits: (a) => rechercher_produits(a as { requete: string }),
  verifier_stock: (a) => verifier_stock(a as { ref: string; quantite: number }),
  verifier_livraison: (a) => verifier_livraison(a as { ville: string }),
  calculer_devis: (a) => calculer_devis(a as { lignes: { ref: string; quantite: number }[]; ville?: string }),
  infos_entreprise: (a) => infos_entreprise(a as { sujet: string }),
};

// Schémas OpenAI (function-calling). `finaliser` clôt la boucle avec le livrable ;
// le devis chiffré est réattaché côté serveur (jamais réécrit ici).
export const TOOL_SCHEMAS = [
  { type: "function", function: { name: "rechercher_produits", description: "Cherche des produits du catalogue Mobibureau par mots-clés (catégorie, nom, description). Retourne réfs, prix, stock, délai, options.", parameters: { type: "object", properties: { requete: { type: "string", description: "Mots-clés produit, ex. 'bureau assis-debout' ou 'cabine acoustique'" } }, required: ["requete"] } } },
  { type: "function", function: { name: "verifier_stock", description: "Vérifie la disponibilité d'une référence pour une quantité.", parameters: { type: "object", properties: { ref: { type: "string" }, quantite: { type: "number" } }, required: ["ref", "quantite"] } } },
  { type: "function", function: { name: "verifier_livraison", description: "Vérifie si une ville est livrable, avec délai de transport et frais.", parameters: { type: "object", properties: { ville: { type: "string" } }, required: ["ville"] } } },
  { type: "function", function: { name: "calculer_devis", description: "Calcule un devis chiffré (remises par paliers, TVA 20%, livraison offerte au-delà d'un seuil, délai global) à partir de lignes ref+quantité.", parameters: { type: "object", properties: { lignes: { type: "array", items: { type: "object", properties: { ref: { type: "string" }, quantite: { type: "number" } }, required: ["ref", "quantite"] } }, ville: { type: "string" } }, required: ["lignes"] } } },
  { type: "function", function: { name: "infos_entreprise", description: "Répond aux questions générales : garantie, sav, paiement, livraison, delais, horaires, minimum de commande.", parameters: { type: "object", properties: { sujet: { type: "string", description: "Sujet, ex. 'garantie', 'paiement', 'délais de livraison'" } }, required: ["sujet"] } } },
  { type: "function", function: { name: "finaliser", description: "Clôt le traitement et produit le livrable. À appeler une seule fois, en dernier. Tu dois TOUJOURS fournir un email client personnalisé, quel que soit le cas (devis, demande partielle, livraison impossible, question générale).", parameters: { type: "object", properties: { faisable: { type: "boolean" }, email: { type: "string", description: "Email client personnalisé, prêt à envoyer — OBLIGATOIRE dans TOUS les cas (devis chiffré, refus avec alternative, ou réponse à une question générale)." }, reponse: { type: "string", description: "Réponse courte au client pour une question générale (optionnel, l'email reste obligatoire)" }, creneaux: { type: "array", description: "2 créneaux d'appel proposés avec le client", items: { type: "object", properties: { jour: { type: "string", description: "ex. 'Mardi'" }, heure: { type: "string", description: "ex. '14h'" } }, required: ["jour", "heure"] } }, note: { type: "string", description: "Alternative/explication si partiel ou non faisable, sinon vide" } }, required: ["faisable", "email"] } } },
] as const;
