import EmailResult from "./EmailResult";
import GenericResult from "./GenericResult";
import { SAMPLE_EMAIL } from "./email-triage-lib";
import type { TriageResult } from "./email-triage-lib";
import type { WorkflowConfig } from "./workflow-types";

// Les 5 automatisations (data-driven). Les nodes sont le miroir du vrai backend
// (avec sublabel technique). Seul "email" est câblé ; les autres endpoints seront
// créés un par un (ils échouent proprement en attendant).
const MEETING_SAMPLE = `Réunion projet — 14h. Présents : Marie, Thomas, Sofia.
Marie : le design est validé, on démarre le dev lundi.
Thomas : je prends l'API, livrable jeudi.
Sofia : je relance le client pour les accès, sinon on est bloqués.
Décision : démo client vendredi 16h. Thomas doit corriger le bug de login avant.`;

const SAV_SAMPLE = `Bonjour, j'ai reçu un article défectueux (réf. AZ-200). Comment le retourner et être remboursé ? Merci.`;

export const AUTOMATIONS: WorkflowConfig[] = [
  {
    id: "email", tabLabel: "Tri d'email", tabIcon: "mail", accent: "#10b981",
    title: "Tri d'email par IA",
    subtitle: "Collez un email reçu : l'IA le classe, le priorise et rédige une réponse.",
    endpoint: "/api/demo/email-triage", inputType: "textarea", inputField: "email_text",
    inputLabel: "Email à analyser", placeholder: "Collez ici l'email reçu…",
    exampleText: SAMPLE_EMAIL, submitLabel: "Lancer le workflow",
    nodes: [
      { id: "in", label: "Réception", icon: "mail", sublabel: "Webhook" },
      { id: "chk", label: "Vérification", icon: "shield", sublabel: "Garde-fou · rate-limit" },
      { id: "ai", label: "Analyse IA", icon: "ai", sublabel: "gpt-4o-mini" },
      { id: "fmt", label: "Mise en forme", icon: "format", sublabel: "JSON" },
      { id: "out", label: "Résultat", icon: "check", sublabel: "Réponse" },
    ],
    errorMessages: {
      invalid_input: "Texte d'email invalide (vide ou trop long).",
      upstream_error: "Le service de tri est injoignable, réessaie plus tard.",
    },
    renderResult: (r) => <EmailResult result={r as TriageResult} />,
  },
  {
    id: "meeting", tabLabel: "Compte rendu", tabIcon: "doc", accent: "#6366f1",
    title: "Compte rendu de réunion",
    subtitle: "Collez une transcription : l'IA en extrait décisions, actions et compte rendu.",
    endpoint: "/api/demo/meeting-notes", inputType: "textarea", inputField: "transcript_text",
    inputLabel: "Transcription à résumer", placeholder: "Collez la transcription de la réunion…",
    exampleText: MEETING_SAMPLE, submitLabel: "Lancer le workflow",
    nodes: [
      { id: "in", label: "Réception", icon: "mail", sublabel: "Webhook" },
      { id: "chk", label: "Vérification", icon: "shield", sublabel: "Garde-fou" },
      { id: "ai", label: "Analyse IA", icon: "ai", sublabel: "gpt-4o-mini" },
      { id: "ext", label: "Extraction", icon: "format", sublabel: "décisions · actions" },
      { id: "out", label: "Résultat", icon: "check", sublabel: "CR" },
    ],
    renderResult: (r) => <GenericResult result={r} />,
  },
  {
    id: "dataclean", tabLabel: "Nettoyage data", tabIcon: "table", accent: "#8b5cf6",
    title: "Nettoyage de données CSV",
    subtitle: "Envoyez un CSV : détection d'anomalies, normalisation et dédup, puis rapport.",
    endpoint: "/api/demo/data-clean", inputType: "file", accept: ".csv", inputField: "file",
    inputLabel: "Fichier CSV à nettoyer", submitLabel: "Lancer le workflow",
    nodes: [
      { id: "in", label: "Import CSV", icon: "table", sublabel: ".csv" },
      { id: "col", label: "Analyse colonnes", icon: "format", sublabel: "colonnes" },
      { id: "ano", label: "Détection anomalies", icon: "shield", sublabel: "anomalies" },
      { id: "norm", label: "Normalisation · dédup", icon: "ai", sublabel: "dédup" },
      { id: "out", label: "Rapport", icon: "check", sublabel: "rapport" },
    ],
    renderResult: (r) => <GenericResult result={r} />,
  },
  {
    id: "invoice", tabLabel: "Facture", tabIcon: "receipt", accent: "#f59e0b",
    title: "Extraction de facture",
    subtitle: "Envoyez une facture (image ou PDF) : OCR, extraction des champs, contrôle des totaux.",
    endpoint: "/api/demo/invoice", inputType: "file", accept: "image/*,application/pdf", inputField: "file",
    inputLabel: "Facture à analyser (image ou PDF)", submitLabel: "Lancer le workflow",
    nodes: [
      { id: "in", label: "Import doc", icon: "receipt", sublabel: "doc" },
      { id: "ocr", label: "OCR · Vision", icon: "ai", sublabel: "OCR · Vision" },
      { id: "ext", label: "Extraction champs", icon: "format", sublabel: "champs" },
      { id: "val", label: "Validation totaux", icon: "shield", sublabel: "totaux" },
      { id: "out", label: "Résultat", icon: "check", sublabel: "résultat" },
    ],
    renderResult: (r) => <GenericResult result={r} />,
  },
  {
    id: "sav", tabLabel: "SAV", tabIcon: "chat", accent: "#06b6d4",
    title: "Assistant SAV (RAG)",
    subtitle: "Posez une question client : recherche dans la base, analyse et réponse sourcée.",
    endpoint: "/api/demo/sav", inputType: "textarea", inputField: "question",
    inputLabel: "Question client", placeholder: "Ex : Comment retourner un article défectueux ?",
    exampleText: SAV_SAMPLE, submitLabel: "Lancer le workflow",
    nodes: [
      { id: "q", label: "Question", icon: "chat", sublabel: "question" },
      { id: "rag", label: "Recherche base", icon: "table", sublabel: "RAG" },
      { id: "ai", label: "Analyse IA", icon: "ai", sublabel: "gpt-4o-mini" },
      { id: "red", label: "Rédaction", icon: "format", sublabel: "rédaction" },
      { id: "out", label: "Résultat sourcé", icon: "check", sublabel: "sourcé" },
    ],
    renderResult: (r) => <GenericResult result={r} />,
  },
];
