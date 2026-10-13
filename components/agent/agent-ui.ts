// Libellés de la démo agent devis (/agent) : un fichier par langue, même type.
// Les montants passent par `eur` (« 1 750,00 € » en français, « €1,750.00 » en anglais).
export interface AgentUi {
  eur: (n: number) => string;
  pct: (t: number) => string;
  errors: Record<string, string>;
  tryLabel: string;
  freeLabel: string;
  running: string;
  run: string;
  stepsLabel: string;
  starting: string;
  thinking: string;
  traceAria: string;
  techShow: string;
  techHide: string;
  techReturned: string;
  techPseudo: string;
  partialTitle: string;
  partialText: string;
  questionsLabel: string;
  emailLabel: string;
  copy: string;
  copied: string;
  slotsLabel: string;
  table: { item: string; qty: string; unit: string; unitPrice: string; amount: string; subtotal: string; discount: string; total: string; vat: string; grand: string; toPrice: string };
  leadTime: (jours: number, partial: boolean) => { before: string; strong: string; after: string };
  days: string[];
  callsLead: { before: string; strong: string; after: string };
  slotsAria: (list: string) => string;
  toDefine: string;
  calNote: string;
  sampleCatalogue: string;
  sampleNote: string;
  botTag: string;
  botIntro: { a: string; quote: string; b: string; questions: string; c: string; email: string; d: string };
  catalogueSummary: (n: number) => string;
  catalogueHead: { ref: string; item: string; unit: string; price: string };
}

const fr = (n: number, d = 2) => (n ?? 0).toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });

export const AGENT_UI_FR: AgentUi = {
  eur: (n) => `${fr(n)} €`,
  pct: (t) => `${(t * 100).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`,
  errors: {
    rate_limited: "Trop d'essais rapprochés. Réessayez dans une minute.",
    demo_busy: "Démo très sollicitée aujourd'hui, réessayez plus tard.",
    demo_disabled: "Démo momentanément indisponible.",
    invalid_input: "Demande invalide (vide ou trop longue).",
    upstream_error: "L'agent est injoignable, réessayez plus tard.",
    default: "Une erreur est survenue, réessayez.",
  },
  tryLabel: "Testez avec une demande type :",
  freeLabel: "…ou écrivez la demande d'un client",
  running: "L'agent prépare le devis…",
  run: "Lancer l'agent",
  stepsLabel: "Ce que fait l'agent",
  starting: "L'agent démarre",
  thinking: "l'agent réfléchit",
  traceAria: "Trace de l'agent",
  techShow: "Voir plus — détail technique",
  techHide: "Masquer le détail technique",
  techReturned: "données retournées",
  techPseudo: "logique (extrait)",
  partialTitle: "Devis partiel :",
  partialText: "tout ce qui est au catalogue est chiffré ; le reste attend les réponses du client.",
  questionsLabel: "Questions à poser au client",
  emailLabel: "Email de réponse",
  copy: "Copier",
  copied: "Copié ✓",
  slotsLabel: "Rendez-vous proposés",
  table: { item: "Désignation", qty: "Qté", unit: "Unité", unitPrice: "P.U. HT", amount: "Montant HT", subtotal: "Sous-total HT", discount: "Remise", total: "Total HT", vat: "TVA", grand: "Total TTC", toPrice: "à chiffrer" },
  leadTime: (j, partial) => ({ before: "Délai estimé : ", strong: `${j} jours ouvrés`, after: partial ? " (hors lignes à chiffrer)" : "" }),
  days: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"],
  callsLead: { before: "📞 Appels proposés ", strong: "avec le client", after: " — semaine prochaine :" },
  slotsAria: (list) => `Créneaux proposés : ${list}`,
  toDefine: "à définir",
  calNote: "Démo — affichage indicatif, la prise de rendez-vous se fait ensuite avec Axel.",
  sampleCatalogue: "Catalogue d'exemple",
  sampleNote: " — chez vous, l'agent utilise votre catalogue et vos prix.",
  botTag: "agent devis",
  botIntro: { a: "Il lit la demande du client, cherche dans le catalogue, puis prépare un ", quote: "devis chiffré", b: " (HT, TVA, TTC, délai), les ", questions: "questions à poser", c: " s'il manque une information, et l'", email: "email de réponse", d: "." },
  catalogueSummary: (n) => `Voir le catalogue d'exemple (${n} articles)`,
  catalogueHead: { ref: "Réf.", item: "Article", unit: "Unité", price: "Prix HT" },
};
