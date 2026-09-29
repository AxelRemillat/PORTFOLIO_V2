import type { Metier } from "@/lib/metiers";

// Schémas OpenAI (function-calling) et prompt système, paramétrés par le métier.
// `finaliser` clôt la boucle ; le devis chiffré est réattaché côté serveur.
const fn = (name: string, description: string, properties: Record<string, unknown>, required: string[]) =>
  ({ type: "function", function: { name, description, parameters: { type: "object", properties, required } } }) as const;

const ligne = { type: "object", properties: { ref: { type: "string" }, quantite: { type: "number" } }, required: ["ref", "quantite"] };
const hors = { type: "object", properties: { designation: { type: "string" }, quantite: { type: "number" }, unite: { type: "string" } }, required: ["designation"] };

export function toolSchemas(m: Metier) {
  return [
    fn("rechercher_articles", `Cherche dans le catalogue de ${m.entreprise} par mots-clés. Retourne réfs, unités, prix HT et délais.`, { requete: { type: "string", description: "Mots-clés, ex. 'fenêtre PVC 100' ou 'plateau salé'" } }, ["requete"]),
    fn("verifier_livraison", "Vérifie la zone (livraison ou intervention) : frais, délai, ou question à poser si hors zone.", { ville: { type: "string" } }, ["ville"]),
    fn("calculer_devis", "Calcule le devis : lignes du catalogue (ref + quantité) + lignes hors catalogue « à chiffrer ». Remises, TVA, livraison, délai et questions au client.", { lignes: { type: "array", items: ligne }, hors_catalogue: { type: "array", items: hors }, ville: { type: "string" } }, ["lignes"]),
    fn("infos_entreprise", "Politique de l'entreprise : garantie, paiement, délais, TVA, livraison, etc.", { sujet: { type: "string" } }, ["sujet"]),
    fn("finaliser", "Clôt le traitement. À appeler une seule fois, en dernier. L'email client est OBLIGATOIRE dans tous les cas.", {
      complet: { type: "boolean", description: "true si tout est chiffré, false si devis partiel (lignes à chiffrer ou infos manquantes)" },
      email: { type: "string", description: "Email client personnalisé, prêt à envoyer, qui reprend le devis et les questions." },
      questions: { type: "array", items: { type: "string" }, description: "Questions à poser au client pour compléter le devis (0 à 4)." },
      reponse: { type: "string", description: "Réponse courte pour une question générale (optionnel)." },
      creneaux: { type: "array", description: "2 créneaux d'appel proposés", items: { type: "object", properties: { jour: { type: "string" }, heure: { type: "string" } }, required: ["jour", "heure"] } },
      note: { type: "string", description: "Ce qui reste à confirmer, ou vide." },
    }, ["complet", "email"]),
  ];
}

export function systemPrompt(m: Metier) {
  return `Tu es OSCAR, l'agent devis de ${m.entreprise} (${m.label} — ${m.activite}).
Tu traites une demande client entrante DE BOUT EN BOUT avec tes outils, en français, vouvoiement.
Devis : comprends le besoin → rechercher_articles (une recherche par besoin) → verifier_livraison si une ville est donnée → calculer_devis → finaliser (email + 2 créneaux + questions).
Question générale : infos_entreprise → finaliser (sans devis).
Règles STRICTES :
- N'invente JAMAIS un prix, un délai, une référence ou une politique : ils viennent EXCLUSIVEMENT des outils.
- Tu ne réponds JAMAIS « non faisable ». Ce qui n'est pas au catalogue va dans hors_catalogue (ligne « à chiffrer ») et devient une question au client. Tu chiffres tout ce qui peut l'être : devis partiel plutôt que refus.
- Quantité ou dimension manquante : prends une hypothèse raisonnable, chiffre, et pose la question pour confirmer.
- Budget serré : choisis l'option la plus économique et dis-le.
- Termine TOUJOURS par finaliser, avec un email cordial qui reprend le total et les questions. Une phrase de raisonnement avant chaque appel d'outil.`;
}
