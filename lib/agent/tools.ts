import type { Metier, Article } from "@/lib/metiers";

// Outils déterministes de l'agent devis : fonctions pures sur la fiche métier.
// Toute valeur chiffrée (prix, délai, TVA) provient d'ici — jamais du LLM.
// Une demande hors catalogue ne donne jamais un « non » sec : la ligne passe
// « à chiffrer » et une question est ajoutée pour le client.
const r2 = (n: number) => Math.round(n * 100) / 100;
export const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const STOP = new Set(["pour", "avec", "des", "une", "les", "vous", "sur", "dans", "est", "que", "qui", "par", "pas", "plus", "bonjour", "merci", "faire", "devis"]);
const stem = (t: string) => (t.length > 3 ? t.replace(/[sx]$/, "") : t);

// Destinations hors zone habituelle : devis possible, frais et délai à confirmer.
const HORS_ZONE = ["corse", "ajaccio", "bastia", "porto-vecchio", "guadeloupe", "martinique", "guyane", "cayenne", "reunion", "mayotte", "belgique", "suisse", "luxembourg"];

export interface LigneDemandee { ref: string; quantite: number }
export interface LigneHors { designation: string; quantite?: number; unite?: string }

function tokens(text: string) {
  return norm(text).split(/[^a-z0-9]+/).filter((t) => (t.length >= 3 || /^\d{2,}$/.test(t)) && !STOP.has(t)).map(stem);
}

export function rechercher_articles(m: Metier, { requete }: { requete: string }) {
  const tk = tokens(requete || "");
  const scored = m.catalogue.map((a) => {
    const hay = norm(`${a.nom} ${a.categorie} ${a.description} ${a.ref}`);
    return { a, score: tk.reduce((s, t) => s + (hay.includes(t) ? 1 : 0), 0) };
  }).filter((x) => x.score > 0).sort((x, y) => y.score - x.score).slice(0, 8);
  const articles = scored.map(({ a }) => ({ ref: a.ref, nom: a.nom, unite: a.unite, prix_unitaire: a.prix_unitaire, delai_jours: a.delai_jours, description: a.description }));
  return articles.length
    ? { articles }
    : { articles, conseil: "Rien d'équivalent au catalogue : ajoute la ligne dans hors_catalogue de calculer_devis (elle sera « à chiffrer ») et pose une question au client." };
}

export function verifier_livraison(m: Metier, { ville }: { ville?: string }) {
  const v = norm(ville || "");
  if (!v) return { ville: null, a_confirmer: true, question: "À quelle adresse faut-il livrer ou intervenir ?" };
  if (HORS_ZONE.some((z) => v.includes(z))) {
    return { ville, a_confirmer: true, question: `${ville} est hors de notre zone habituelle : acceptez-vous un transport spécifique (frais et délai à confirmer) ?` };
  }
  const { libelle, frais, franco, delai_jours } = m.livraison;
  return { ville, a_confirmer: false, libelle, frais, franco, delai_jours };
}

const ligne = (a: Article, q: number) => ({ ref: a.ref, designation: a.nom, unite: a.unite, quantite: q, prix_unitaire: a.prix_unitaire, montant: r2(a.prix_unitaire * q), _delai: a.delai_jours });

export function calculer_devis(m: Metier, { lignes, hors_catalogue, ville }: { lignes?: LigneDemandee[]; hors_catalogue?: LigneHors[]; ville?: string }) {
  const questions: string[] = [];
  const a_chiffrer = (hors_catalogue || []).filter((h) => h?.designation).map((h) => ({ designation: String(h.designation), quantite: Number(h.quantite) || 1, unite: h.unite || "à préciser" }));
  const chiffrees: (ReturnType<typeof ligne> & { tva: number })[] = [];
  for (const l of lignes || []) {
    const a = m.catalogue.find((x) => x.ref === l.ref);
    const q = Number(l.quantite) > 0 ? r2(Number(l.quantite)) : 1;
    if (!a) { a_chiffrer.push({ designation: `Article ${l.ref}`, quantite: q, unite: "à préciser" }); continue; }
    chiffrees.push({ ...ligne(a, q), tva: a.tva ?? m.tva });
  }
  for (const h of a_chiffrer) questions.push(`« ${h.designation} » n'est pas dans notre catalogue standard : pouvez-vous préciser dimensions, quantité et finition pour qu'on le chiffre ?`);

  const sous_total_ht = r2(chiffrees.reduce((s, l) => s + l.montant, 0));
  const palier = m.remises.find((p) => sous_total_ht >= p.seuil);
  const taux = palier?.taux ?? 0;
  const remise = { taux, montant: r2(sous_total_ht * taux) };
  const net_ht = r2(sous_total_ht - remise.montant);

  const zone = verifier_livraison(m, { ville });
  if (zone.question) questions.push(zone.question);
  const offert = m.livraison.franco !== null && net_ht >= m.livraison.franco;
  const frais_livraison = zone.a_confirmer || offert ? 0 : m.livraison.frais;
  const total_ht = r2(net_ht + frais_livraison);
  if (chiffrees.length && total_ht < m.minimum_ht) questions.push(`Le minimum de commande est de ${m.minimum_ht} € HT : souhaitez-vous compléter la commande ?`);

  // TVA par taux : remise répartie au prorata, livraison au taux du métier.
  const bases = new Map<number, number>();
  for (const l of chiffrees) bases.set(l.tva, (bases.get(l.tva) ?? 0) + l.montant * (1 - taux));
  if (frais_livraison) bases.set(m.tva, (bases.get(m.tva) ?? 0) + frais_livraison);
  const tva = [...bases].map(([t, base]) => ({ taux: t, base: r2(base), montant: r2(base * t) }));
  const tva_montant = r2(tva.reduce((s, x) => s + x.montant, 0));

  const delai = chiffrees.reduce((d, l) => Math.max(d, l._delai), 0) + m.livraison.delai_jours;
  return {
    lignes: chiffrees.map(({ ref, designation, unite, quantite, prix_unitaire, montant }) => ({ ref, designation, unite, quantite, prix_unitaire, montant })),
    a_chiffrer, sous_total_ht, remise, frais_livraison, livraison_offerte: offert, total_ht, tva, tva_montant,
    total_ttc: r2(total_ht + tva_montant), delai_jours: delai, ville: ville ?? null,
    complet: a_chiffrer.length === 0 && !zone.a_confirmer && chiffrees.length > 0, questions,
  };
}

export function infos_entreprise(m: Metier, { sujet }: { sujet: string }) {
  const s = norm(sujet || "");
  const key = Object.keys(m.politique).find((k) => s.includes(norm(k)) || norm(m.politique[k]).includes(s));
  if (key) return { sujet: key, reponse: m.politique[key] };
  return { sujet, infos: m.politique };
}

export type DevisCalcule = ReturnType<typeof calculer_devis>;

export function createToolFns(m: Metier): Record<string, (args: Record<string, unknown>) => unknown> {
  return {
    rechercher_articles: (a) => rechercher_articles(m, a as { requete: string }),
    verifier_livraison: (a) => verifier_livraison(m, a as { ville?: string }),
    calculer_devis: (a) => calculer_devis(m, a as Parameters<typeof calculer_devis>[1]),
    infos_entreprise: (a) => infos_entreprise(m, a as { sujet: string }),
  };
}
