import type { Metier } from "@/lib/metiers";

// Textes de l'agent devis (prompt, outils, trace, questions) : un fichier par
// langue, même type. Les montants et délais viennent toujours des outils.
export interface AgentText {
  systemPrompt: (m: Metier) => string;
  finishNudge: string;
  fallbackEmail: (entreprise: string) => string;
  trace: { reflexion: string; ready: string; readyDetail: string; readyShort: string; unknownTool: string };
  meta: Record<string, { icon: string; label: string; arg: (a: Record<string, unknown>) => string }>;
  summary: {
    found: (n: number) => string;
    toConfirm: string;
    zone: (jours: unknown, frais: unknown, franco?: unknown) => string;
    total: (ttc: unknown, partial: boolean) => string;
    policy: string;
  };
  tools: {
    search: (entreprise: string) => string;
    searchArg: string;
    zone: string;
    quote: string;
    policy: string;
    finish: string;
    finishArgs: { complet: string; email: string; questions: string; reponse: string; creneaux: string; note: string };
  };
  questions: {
    noMatch: string;
    address: string;
    outOfZone: (ville: string) => string;
    offCatalogue: (designation: string) => string;
    minimum: (montant: number) => string;
    unknownItem: (ref: string) => string;
    unitTbd: string;
  };
  stopWords: string[];
  outOfZone: string[];
}

export const AGENT_TEXT_FR: AgentText = {
  systemPrompt: (m) => `Tu es OSCAR, l'agent devis de ${m.entreprise} (${m.label} — ${m.activite}).
Tu traites une demande client entrante DE BOUT EN BOUT avec tes outils, en français, vouvoiement.
Devis : comprends le besoin → rechercher_articles (une recherche par besoin) → verifier_livraison si une ville est donnée → calculer_devis → finaliser (email + 2 créneaux + questions).
Question générale : infos_entreprise → finaliser (sans devis).
Règles STRICTES :
- N'invente JAMAIS un prix, un délai, une référence ou une politique : ils viennent EXCLUSIVEMENT des outils.
- Tu ne réponds JAMAIS « non faisable ». Ce qui n'est pas au catalogue va dans hors_catalogue (ligne « à chiffrer ») et devient une question au client. Tu chiffres tout ce qui peut l'être : devis partiel plutôt que refus.
- Quantité ou dimension manquante : prends une hypothèse raisonnable, chiffre, et pose la question pour confirmer.
- Budget serré : choisis l'option la plus économique et dis-le.
- Termine TOUJOURS par finaliser, avec un email cordial qui reprend le total et les questions. Une phrase de raisonnement avant chaque appel d'outil.
- L'email est en TEXTE BRUT : aucun Markdown (pas d'astérisques, pas de #, pas de listes à puces Markdown).
- Livraison : reprends exactement le devis (frais_livraison, livraison_offerte, franco). Si elle est offerte, dis-le avec le seuil (« livraison offerte dès … € HT »).`,
  finishNudge: "Termine maintenant : appelle finaliser avec l'email client et les questions.",
  fallbackEmail: (e) => `Bonjour,\n\nMerci pour votre demande. Un conseiller de ${e} revient vers vous très rapidement pour la finaliser.\n\nCordialement,\nOSCAR — ${e}`,
  trace: { reflexion: "Réflexion", ready: "Livrable prêt", readyDetail: "Devis, email et questions générés.", readyShort: "Généré.", unknownTool: "outil inconnu" },
  meta: {
    rechercher_articles: { icon: "🔎", label: "Recherche catalogue", arg: (a) => `« ${a.requete ?? ""} »` },
    verifier_livraison: { icon: "🚚", label: "Zone de livraison", arg: (a) => `${a.ville ?? "—"}` },
    calculer_devis: { icon: "🧮", label: "Calcul du devis", arg: (a) => `${(a.lignes as unknown[])?.length ?? 0} ligne(s)${(a.hors_catalogue as unknown[])?.length ? ` + ${(a.hors_catalogue as unknown[]).length} à chiffrer` : ""}` },
    infos_entreprise: { icon: "ℹ️", label: "Infos entreprise", arg: (a) => `${a.sujet ?? ""}` },
  },
  summary: {
    found: (n) => `${n} article(s) trouvé(s)`,
    toConfirm: "À confirmer avec le client",
    zone: (j, f, franco) => `${j} j · ${f} € HT${franco ? ` (offerte dès ${Number(franco).toLocaleString("fr-FR")} € HT)` : ""}`,
    total: (ttc, partial) => `${ttc} € TTC${partial ? " · devis partiel" : ""}`,
    policy: "Politique récupérée",
  },
  tools: {
    search: (e) => `Cherche dans le catalogue de ${e} par mots-clés. Retourne réfs, unités, prix HT et délais.`,
    searchArg: "Mots-clés, ex. 'fenêtre PVC 100' ou 'plateau salé'",
    zone: "Vérifie la zone (livraison ou intervention) : frais, délai, ou question à poser si hors zone.",
    quote: "Calcule le devis : lignes du catalogue (ref + quantité) + lignes hors catalogue « à chiffrer ». Remises, TVA, livraison, délai et questions au client.",
    policy: "Politique de l'entreprise : garantie, paiement, délais, TVA, livraison, etc.",
    finish: "Clôt le traitement. À appeler une seule fois, en dernier. L'email client est OBLIGATOIRE dans tous les cas.",
    finishArgs: {
      complet: "true si tout est chiffré, false si devis partiel (lignes à chiffrer ou infos manquantes)",
      email: "Email client personnalisé, prêt à envoyer, en texte brut (sans Markdown), qui reprend le devis et les questions.",
      questions: "Questions à poser au client pour compléter le devis (0 à 4).",
      reponse: "Réponse courte pour une question générale (optionnel).",
      creneaux: "2 créneaux d'appel proposés",
      note: "Ce qui reste à confirmer, ou vide.",
    },
  },
  questions: {
    noMatch: "Rien d'équivalent au catalogue : ajoute la ligne dans hors_catalogue de calculer_devis (elle sera « à chiffrer ») et pose une question au client.",
    address: "À quelle adresse faut-il livrer ou intervenir ?",
    outOfZone: (v) => `${v} est hors de notre zone habituelle : acceptez-vous un transport spécifique (frais et délai à confirmer) ?`,
    offCatalogue: (d) => `« ${d} » n'est pas dans notre catalogue standard : pouvez-vous préciser dimensions, quantité et finition pour qu'on le chiffre ?`,
    minimum: (n) => `Le minimum de commande est de ${n} € HT : souhaitez-vous compléter la commande ?`,
    unknownItem: (ref) => `Article ${ref}`,
    unitTbd: "à préciser",
  },
  stopWords: ["pour", "avec", "des", "une", "les", "vous", "sur", "dans", "est", "que", "qui", "par", "pas", "plus", "bonjour", "merci", "faire", "devis"],
  outOfZone: ["corse", "ajaccio", "bastia", "porto-vecchio", "guadeloupe", "martinique", "guyane", "cayenne", "reunion", "mayotte", "belgique", "suisse", "luxembourg"],
};
