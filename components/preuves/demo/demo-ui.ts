import type { DemoLocale } from "@/lib/demo-locale";

// Libellés des démos d'automatisation (/automatisations) : un fichier par langue,
// même type. Les valeurs du contrat n8n (« facturation », « haute »…) restent
// en français dans les données et sont traduites à l'affichage.
export interface DemoUi {
  locale: DemoLocale;
  tabsAria: string;
  pipelineAria: string;
  modeAria: string;
  modeText: string;
  modeAudio: string;
  run: string;
  running: string;
  tryLabel: string;
  exampleAria: (label: string) => string;
  exampleDefault: string;
  fileFallback: string;
  chooseFile: string;
  noFile: string;
  rebound: string;
  copy: string;
  copied: string;
  errors: Record<string, string>;
  cta: (title: string) => string;
  email: { priority: (p: string) => string; lang: (l: string) => string; keyPoints: string; reply: string; categories: Record<string, string>; priorities: Record<string, string> };
  meeting: { decisions: string; actions: string; task: string; owner: string; due: string; open: string; transcript: string };
  clean: {
    dupesRemoved: string; download: string; fileName: string; detail: string; rows: string; dupes: string; issues: string; delimiter: string;
    anomalies: string; normalizations: string; quality: string; filled: (col: string, pct: number) => string;
    hint: (n: number) => string; before: string; after: string; beforeAria: (n: number) => string; afterAria: (n: number) => string;
  };
  invoice: {
    ok: string; gap: string; computed: string; announced: string; openPdf: (name?: string | null) => string; pdfDoc: string; open: string;
    analyzedDoc: string; analyzedImg: string; imgAlt: string; supplier: string; number: string; date: string; due: string; client: string;
    linesAria: string; item: string; qty: string; unitPrice: string; amount: string; totalExcl: string; vat: string; totalIncl: string; pct: (v: string) => string;
  };
  sav: {
    welcome: (entreprise: string) => string; pick: string; ctx: string; ctxNote: string; pill: string; logAria: string; typing: string;
    found: string; notFound: string; answer: string; sources: string; sourcesShort: string; excerpts: (n: number) => string; excerptsLower: (n: number) => string;
    confidence: (n: number) => string; confidenceAria: (n: number) => string; offTopic: string; inputAria: string; placeholder: string; sendAria: string; send: string;
  };
}

export const DEMO_UI_FR: DemoUi = {
  locale: "fr",
  tabsAria: "Automatisations",
  pipelineAria: "Étapes du workflow",
  modeAria: "Mode d'entrée",
  modeText: "Texte",
  modeAudio: "Audio",
  run: "Lancer le workflow",
  running: "Exécution du workflow…",
  tryLabel: "Pas d'idée ? Testez avec un exemple :",
  exampleAria: (l) => `Exemple : ${l}`,
  exampleDefault: "Essayer avec cet exemple",
  fileFallback: "fichier",
  chooseFile: "Choisir un fichier",
  noFile: "Aucun fichier sélectionné",
  rebound: "✅ Workflow terminé — envie d'en voir un autre ?",
  copy: "Copier",
  copied: "Copié ✓",
  errors: {
    rate_limited: "Trop d'essais rapprochés, réessaie dans 1 min.",
    demo_busy: "Démo très sollicitée aujourd'hui, réessayez plus tard.",
    demo_disabled: "Démo momentanément indisponible.",
    invalid_input: "Entrée invalide (vide ou trop longue).",
    file_too_large: "Fichier trop volumineux (max 15 Mo).",
    upstream_error: "Le service est injoignable, réessayez plus tard.",
    default: "Une erreur est survenue, réessayez.",
  },
  cta: (title) => `Démo « ${title} » : je voudrais la même chose chez moi`,
  email: {
    priority: (p) => `priorité ${p}`, lang: (l) => `langue : ${l}`, keyPoints: "Points clés", reply: "Réponse suggérée",
    categories: {}, priorities: {},
  },
  meeting: { decisions: "Décisions", actions: "Actions", task: "Tâche", owner: "Responsable", due: "Échéance", open: "Points ouverts", transcript: "Voir la transcription" },
  clean: {
    dupesRemoved: "doublons supprimés", download: "⬇ Télécharger le CSV nettoyé", fileName: "nettoye.csv", detail: "Détail de l'analyse",
    rows: "lignes", dupes: "doublons retirés", issues: "anomalies", delimiter: "délimiteur", anomalies: "Anomalies",
    normalizations: "Normalisations appliquées", quality: "Qualité par colonne", filled: (c, p) => `${c} : rempli à ${p}%`,
    hint: (n) => `3 lignes visibles · faites défiler pour voir les ${n}`, before: "AVANT — données brutes", after: "APRÈS — nettoyé",
    beforeAria: (n) => `Avant nettoyage — ${n} lignes, faites défiler`, afterAria: (n) => `Après nettoyage — ${n} lignes, faites défiler`,
  },
  invoice: {
    ok: "Totaux cohérents · HT + TVA = TTC", gap: "Écart détecté : ", computed: "calculé", announced: "vs annoncé",
    openPdf: (n) => `Ouvrir le PDF analysé${n ? " : " + n : ""}`, pdfDoc: "Document PDF", open: "Ouvrir ↗",
    analyzedDoc: "Document analysé", analyzedImg: "Image analysée", imgAlt: "Facture analysée",
    supplier: "Fournisseur", number: "N° facture", date: "Date", due: "Échéance", client: "Client",
    linesAria: "Lignes de la facture", item: "Désignation", qty: "Qté", unitPrice: "P.U.", amount: "Montant",
    totalExcl: "Total HT", vat: "TVA", totalIncl: "Total TTC", pct: (v) => `${v} %`,
  },
  sav: {
    welcome: (e) => `Bonjour 👋 Je suis l'assistant de ${e}. Posez-moi une question sur nos délais, garanties, paiements ou commandes.`,
    pick: "Votre métier", ctx: "Service client — ", ctxNote: "Base de questions-réponses d'exemple : chez vous, l'assistant répond à partir de vos propres documents.",
    pill: "réponses sourcées", logAria: "Conversation avec l'assistant SAV", typing: "L'assistant écrit…",
    found: "Réponse issue de la base de connaissance", notFound: "Non couvert par la base — transfert à un conseiller",
    answer: "Réponse", sources: "Sources citées", sourcesShort: "Sources", excerpts: (n) => `Extraits consultés (${n})`, excerptsLower: (n) => `extraits consultés (${n})`,
    confidence: (n) => `Confiance ${n}%`, confidenceAria: (n) => `Score de confiance ${n}%`,
    offTopic: "⚠ hors périmètre — recentrage / transfert conseiller", inputAria: "Votre message", placeholder: "Écrivez votre message…",
    sendAria: "Envoyer le message", send: "Envoyer",
  },
};
