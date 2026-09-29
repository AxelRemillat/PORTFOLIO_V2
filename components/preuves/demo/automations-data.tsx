import EmailResult from "./EmailResult";
import MeetingResult from "./MeetingResult";
import type { MeetingData } from "./MeetingResult";
import DataCleanResult from "./DataCleanResult";
import type { DataCleanData } from "./DataCleanResult";
import InvoiceResult from "./InvoiceResult";
import type { InvoiceData } from "./InvoiceResult";
import SavResult from "./SavResult";
import type { SavData } from "./SavResult";
import { SAMPLE_EMAIL } from "./email-triage-lib";
import type { TriageResult } from "./email-triage-lib";
import type { WorkflowConfig } from "./workflow-types";

// Les 5 automatisations (data-driven). Les nodes sont le miroir du vrai backend
// (avec sublabel technique). Les ids servent aussi de lien direct : /automatisations?demo=<id>.
const MEETING_SAMPLE = `Réunion projet — 14h. Présents : Marie, Thomas, Sofia.
Marie : le design est validé, on démarre le dev lundi.
Thomas : je prends l'API, livrable jeudi.
Sofia : je relance le client pour les accès, sinon on est bloqués.
Décision : démo client vendredi 16h. Thomas doit corriger le bug de login avant.`;

export const AUTOMATIONS: WorkflowConfig[] = [
  {
    id: "email", tabLabel: "Tri des emails", tabIcon: "mail", accent: "#10b981",
    title: "Tri des emails et demandes",
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
      upstream_error: "Le service de tri est injoignable, réessayez plus tard.",
    },
    renderResult: (r) => <EmailResult result={r as TriageResult} />,
  },
  {
    id: "meeting", tabLabel: "Compte rendu", tabIcon: "doc", accent: "#6366f1",
    title: "Compte rendu de réunion",
    subtitle: "Transcription (texte ou audio) : l'IA en extrait décisions, actions et compte rendu.",
    endpoint: "/api/demo/meeting-notes",
    inputType: "dual", inputField: "transcript_text", audioField: "audio",
    inputLabel: "Transcription à résumer", audioLabel: "Audio",
    placeholder: "Collez la transcription de la réunion…", accept: "audio/*", textMax: 12000,
    submitLabel: "Lancer le workflow",
    examples: {
      text: [{ label: "Exemple texte", value: MEETING_SAMPLE }],
      audio: [
        { label: "Réunion produit", src: "/samples/meeting/reunion-equipe-produit.mp3" },
        { label: "Point client", src: "/samples/meeting/point-client-commercial.mp3" },
        { label: "Réunion asso", src: "/samples/meeting/reunion-asso-evenement.mp3" },
      ],
    },
    errorMessages: { upstream_error: "Le service de compte rendu est injoignable, réessayez plus tard." },
    nodes: [
      { id: "in", label: "Réception", icon: "mail", sublabel: "Webhook" },
      { id: "tr", label: "Transcription", icon: "wave", sublabel: "Whisper" },
      { id: "ai", label: "Analyse IA", icon: "ai", sublabel: "gpt-4o-mini" },
      { id: "ext", label: "Extraction", icon: "format", sublabel: "décisions · actions" },
      { id: "out", label: "Résultat", icon: "check", sublabel: "CR" },
    ],
    renderResult: (result, response) => (
      <MeetingResult
        result={result as MeetingData}
        transcript={(response as { transcript?: string } | undefined)?.transcript}
      />
    ),
  },
  {
    id: "dataclean", tabLabel: "Fichier clients", tabIcon: "table", accent: "#8b5cf6",
    title: "Fichier clients : nettoyage et doublons",
    subtitle: "Envoyez un fichier CSV (export Excel) : erreurs repérées, formats harmonisés, doublons fusionnés, puis un rapport.",
    endpoint: "/api/demo/data-clean", inputType: "file", accept: ".csv", inputField: "file",
    inputLabel: "Fichier CSV à nettoyer", submitLabel: "Lancer le workflow",
    examples: {
      file: [
        { label: "Doublons (majuscules, accents)", src: "/samples/data/clients-doublons.csv" },
        { label: "Fichier clients", src: "/samples/data/clients-sales.csv" },
        { label: "Catalogue produits", src: "/samples/data/produits-stock.csv" },
        { label: "Contacts CRM", src: "/samples/data/contacts-crm.csv" },
      ],
    },
    errorMessages: { upstream_error: "Le service de nettoyage est injoignable, réessayez plus tard." },
    nodes: [
      { id: "in", label: "Import CSV", icon: "table", sublabel: ".csv" },
      { id: "col", label: "Analyse colonnes", icon: "format", sublabel: "colonnes" },
      { id: "ano", label: "Détection anomalies", icon: "shield", sublabel: "anomalies" },
      { id: "norm", label: "Normalisation · dédup", icon: "ai", sublabel: "dédup" },
      { id: "out", label: "Rapport", icon: "check", sublabel: "rapport" },
    ],
    renderResult: (result) => <DataCleanResult result={result as DataCleanData} />,
  },
  {
    id: "invoice", tabLabel: "Facture", tabIcon: "receipt", accent: "#f59e0b",
    title: "Extraction de facture",
    subtitle: "Envoyez une facture (image ou PDF) : l'IA lit le document, en extrait les informations et vérifie les totaux.",
    endpoint: "/api/demo/invoice", inputType: "file", accept: "image/jpeg,image/png,image/webp,application/pdf", inputField: "file",
    inputLabel: "Facture à analyser (image ou PDF)", submitLabel: "Lancer le workflow",
    examples: {
      file: [
        { label: "Facture agence web", src: "/samples/invoices/facture-agence-web.png" },
        { label: "Facture matériel", src: "/samples/invoices/facture-materiel.png" },
        { label: "Facture conseil (PDF)", src: "/samples/invoices/facture-conseil.pdf" },
      ],
    },
    errorMessages: {
      invalid_input: "Fichier invalide (image JPG/PNG/WEBP ou PDF attendus).",
      upstream_error: "Le service d'extraction est injoignable, réessayez plus tard.",
    },
    nodes: [
      { id: "in", label: "Import doc", icon: "receipt", sublabel: "image" },
      { id: "ocr", label: "OCR · Vision", icon: "ai", sublabel: "OCR · Vision" },
      { id: "ext", label: "Extraction champs", icon: "format", sublabel: "champs" },
      { id: "val", label: "Validation totaux", icon: "shield", sublabel: "totaux" },
      { id: "out", label: "Résultat", icon: "check", sublabel: "résultat" },
    ],
    renderResult: (result, _response, ctx) => (
      <InvoiceResult
        result={result as InvoiceData}
        fileUrl={ctx?.fileUrl} fileType={ctx?.fileType} fileName={ctx?.fileName}
      />
    ),
  },
  {
    id: "sav", tabLabel: "Service client", tabIcon: "chat", accent: "#06b6d4", chat: true,
    title: "Service client (SAV)",
    subtitle: "Choisissez votre métier et posez une question de client : l'assistant répond à partir de la base de l'entreprise, cite ses sources, et passe la main à un conseiller s'il ne sait pas.",
    endpoint: "/api/demo/sav", inputType: "textarea", inputField: "question",
    inputLabel: "Question client", placeholder: "Posez une question de client…", textMax: 500,
    errorMessages: { upstream_error: "L'assistant SAV est injoignable, réessayez plus tard." },
    nodes: [
      { id: "q", label: "Question", icon: "chat", sublabel: "question" },
      { id: "rag", label: "Recherche base", icon: "table", sublabel: "RAG" },
      { id: "ai", label: "Analyse IA", icon: "ai", sublabel: "gpt-4o-mini" },
      { id: "red", label: "Rédaction", icon: "format", sublabel: "rédaction" },
      { id: "out", label: "Résultat sourcé", icon: "check", sublabel: "sourcé" },
    ],
    renderResult: (r) => <SavResult result={r as SavData} />,
  },
];
