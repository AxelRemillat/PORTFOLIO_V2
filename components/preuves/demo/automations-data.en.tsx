import EmailResult from "./EmailResult";
import MeetingResult from "./MeetingResult";
import type { MeetingData } from "./MeetingResult";
import DataCleanResult from "./DataCleanResult";
import type { DataCleanData } from "./DataCleanResult";
import InvoiceResult from "./InvoiceResult";
import type { InvoiceData } from "./InvoiceResult";
import SavResult from "./SavResult";
import type { SavData } from "./SavResult";
import { SAMPLE_EMAIL_EN } from "./email-triage-lib.en";
import type { TriageResult } from "./email-triage-lib";
import type { WorkflowConfig } from "./workflow-types";

// English version of the 5 automations (same ids, endpoints, nodes as automations-data.tsx).
const MEETING_SAMPLE = `Project meeting, 2 pm. Attendees: Emily, Jake, Priya.
Emily: the design is signed off, we start development on Monday.
Jake: I'll take the API, due Thursday.
Priya: I'll follow up with the client about the access credentials, otherwise we're blocked.
Decision: live demo for the client on Friday at 4 pm. Jake needs to fix the login bug before then.`;

export const AUTOMATIONS: WorkflowConfig[] = [
  {
    id: "email", tabLabel: "Email triage", tabIcon: "mail", accent: "#10b981",
    title: "Email and request triage",
    subtitle: "Paste an email you received: the AI sorts it, sets the priority and drafts a reply.",
    endpoint: "/api/demo/email-triage", inputType: "textarea", inputField: "email_text",
    inputLabel: "Email to analyze", placeholder: "Paste the email you received here…",
    exampleText: SAMPLE_EMAIL_EN, submitLabel: "Run the workflow",
    nodes: [
      { id: "in", label: "Intake", icon: "mail", sublabel: "Webhook" },
      { id: "chk", label: "Checks", icon: "shield", sublabel: "Guardrail · rate-limit" },
      { id: "ai", label: "AI analysis", icon: "ai", sublabel: "gpt-4o-mini" },
      { id: "fmt", label: "Formatting", icon: "format", sublabel: "JSON" },
      { id: "out", label: "Result", icon: "check", sublabel: "Reply" },
    ],
    errorMessages: {
      invalid_input: "Invalid email text (empty or too long).",
      upstream_error: "The triage service is unreachable, please try again later.",
    },
    renderResult: (r) => <EmailResult result={r as TriageResult} />,
  },
  {
    id: "meeting", tabLabel: "Meeting notes", tabIcon: "doc", accent: "#6366f1",
    title: "Meeting notes",
    subtitle: "Paste a transcript: the AI pulls out the decisions, action items and a written summary.",
    endpoint: "/api/demo/meeting-notes",
    inputType: "dual", inputField: "transcript_text", audioField: "audio",
    inputLabel: "Transcript to summarize", audioLabel: "Audio",
    placeholder: "Paste the meeting transcript…", accept: "audio/*", textMax: 12000,
    submitLabel: "Run the workflow",
    examples: {
      text: [{ label: "Text example", value: MEETING_SAMPLE }],
      audio: [],
    },
    errorMessages: { upstream_error: "The meeting notes service is unreachable, please try again later." },
    nodes: [
      { id: "in", label: "Intake", icon: "mail", sublabel: "Webhook" },
      { id: "tr", label: "Transcription", icon: "wave", sublabel: "Whisper" },
      { id: "ai", label: "AI analysis", icon: "ai", sublabel: "gpt-4o-mini" },
      { id: "ext", label: "Extraction", icon: "format", sublabel: "decisions · actions" },
      { id: "out", label: "Result", icon: "check", sublabel: "notes" },
    ],
    renderResult: (result, response) => (
      <MeetingResult
        result={result as MeetingData}
        transcript={(response as { transcript?: string } | undefined)?.transcript}
      />
    ),
  },
  {
    id: "dataclean", tabLabel: "Customer file", tabIcon: "table", accent: "#8b5cf6",
    title: "Customer file: cleanup and duplicates",
    subtitle: "Upload a CSV file (Excel export): errors flagged, formats standardized, duplicates merged, then a report.",
    endpoint: "/api/demo/data-clean", inputType: "file", accept: ".csv", inputField: "file",
    inputLabel: "CSV file to clean", submitLabel: "Run the workflow",
    examples: {
      file: [
        { label: "Duplicates (case, accents)", src: "/samples/en/data/customers-duplicates.csv" },
        { label: "Customer file", src: "/samples/en/data/customers-sales.csv" },
        { label: "Product catalog", src: "/samples/en/data/products-stock.csv" },
        { label: "CRM contacts", src: "/samples/en/data/crm-contacts.csv" },
      ],
    },
    errorMessages: { upstream_error: "The cleanup service is unreachable, please try again later." },
    nodes: [
      { id: "in", label: "CSV import", icon: "table", sublabel: ".csv" },
      { id: "col", label: "Column analysis", icon: "format", sublabel: "columns" },
      { id: "ano", label: "Anomaly detection", icon: "shield", sublabel: "anomalies" },
      { id: "norm", label: "Normalize · dedupe", icon: "ai", sublabel: "dedupe" },
      { id: "out", label: "Report", icon: "check", sublabel: "report" },
    ],
    renderResult: (result) => <DataCleanResult result={result as DataCleanData} />,
  },
  {
    id: "invoice", tabLabel: "Invoice", tabIcon: "receipt", accent: "#f59e0b",
    title: "Invoice extraction",
    subtitle: "Upload an invoice (image or PDF): the AI reads the document, extracts the details and checks the totals.",
    endpoint: "/api/demo/invoice", inputType: "file", accept: "image/jpeg,image/png,image/webp,application/pdf", inputField: "file",
    inputLabel: "Invoice to analyze (image or PDF)", submitLabel: "Run the workflow",
    examples: {
      file: [
        { label: "Web agency invoice", src: "/samples/en/invoices/web-agency-invoice.png" },
        { label: "Equipment invoice", src: "/samples/en/invoices/equipment-invoice.png" },
        { label: "Consulting invoice (PDF)", src: "/samples/en/invoices/consulting-invoice.pdf" },
      ],
    },
    errorMessages: {
      invalid_input: "Invalid file (JPG/PNG/WEBP image or PDF expected).",
      upstream_error: "The extraction service is unreachable, please try again later.",
    },
    nodes: [
      { id: "in", label: "Doc import", icon: "receipt", sublabel: "image" },
      { id: "ocr", label: "OCR · Vision", icon: "ai", sublabel: "OCR · Vision" },
      { id: "ext", label: "Field extraction", icon: "format", sublabel: "fields" },
      { id: "val", label: "Total check", icon: "shield", sublabel: "totals" },
      { id: "out", label: "Result", icon: "check", sublabel: "result" },
    ],
    renderResult: (result, _response, ctx) => (
      <InvoiceResult
        result={result as InvoiceData}
        fileUrl={ctx?.fileUrl} fileType={ctx?.fileType} fileName={ctx?.fileName}
      />
    ),
  },
  {
    id: "sav", tabLabel: "Customer service", tabIcon: "chat", accent: "#06b6d4", chat: true,
    title: "Customer service",
    subtitle: "Pick your industry and ask a customer question: the assistant answers from the company's knowledge base, cites its sources, and hands off to a human agent when it doesn't know.",
    endpoint: "/api/demo/sav", inputType: "textarea", inputField: "question",
    inputLabel: "Customer question", placeholder: "Ask a customer question…", textMax: 500,
    errorMessages: { upstream_error: "The customer service assistant is unreachable, please try again later." },
    nodes: [
      { id: "q", label: "Question", icon: "chat", sublabel: "question" },
      { id: "rag", label: "Knowledge search", icon: "table", sublabel: "RAG" },
      { id: "ai", label: "AI analysis", icon: "ai", sublabel: "gpt-4o-mini" },
      { id: "red", label: "Drafting", icon: "format", sublabel: "drafting" },
      { id: "out", label: "Sourced answer", icon: "check", sublabel: "sourced" },
    ],
    renderResult: (r) => <SavResult result={r as SavData} />,
  },
];
