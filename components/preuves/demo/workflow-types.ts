import type { ReactNode } from "react";

// Contrat data-driven d'une démo « workflow » (réutilisable pour les 5 démos).
export type NodeIcon =
  | "mail" | "shield" | "ai" | "format" | "check"
  | "doc" | "table" | "receipt" | "chat" | "wave";

export interface WorkflowNode {
  id: string;
  label: string;          // libellé humain
  icon: NodeIcon;
  sublabel?: string;      // petit nom technique (mono), optionnel
}

export interface TextExample { label: string; value: string }
export interface AudioExample { label: string; src: string }
export interface FileExample { label: string; src: string }
export interface WorkflowExamples { text?: TextExample[]; audio?: AudioExample[]; file?: FileExample[] }

export interface WorkflowConfig {
  id: string;             // "email", "meeting", … (clé onglet + remount)
  tabLabel: string;       // libellé court de l'onglet
  tabIcon: NodeIcon;
  accent: string;         // hex — couleur d'identité (propagée à tout le canvas)
  title: string;
  subtitle: string;
  endpoint: string;
  inputType: "textarea" | "file" | "dual";
  inputField: string;     // champ texte (ou fichier pour "file")
  audioField?: string;    // "dual" : nom du champ fichier audio (ex "audio")
  inputLabel: string;
  audioLabel?: string;    // "dual" : libellé du mode audio
  placeholder?: string;   // textarea
  accept?: string;        // file, ex ".csv" ou "audio/*"
  textMax?: number;       // longueur max textarea (défaut 4000)
  exampleText?: string;   // rétro-compat (bouton unique)
  examples?: WorkflowExamples; // exemples multiples (texte + audio)
  submitLabel?: string;   // défaut "Lancer le workflow"
  exampleLabel?: string;  // défaut "Essayer avec cet exemple"
  chat?: boolean;         // true → rendu chat conversationnel dédié (au lieu du canvas one-shot)
  nodes: WorkflowNode[];
  errorMessages?: Record<string, string>;
  // 2e arg = réponse complète ; 3e arg = contexte client (vignette du fichier uploadé).
  renderResult: (
    result: unknown, response?: unknown,
    ctx?: { fileUrl?: string | null; fileType?: string | null; fileName?: string | null },
  ) => ReactNode;
}

export interface WorkflowResponse {
  ok: boolean;
  result?: unknown;
  error?: string;
}

// Messages génériques (surchargés par config.errorMessages).
export const GENERIC_ERRORS: Record<string, string> = {
  rate_limited: "Trop d'essais, réessaie dans 1 min.",
  demo_disabled: "Démo momentanément indisponible.",
  invalid_input: "Entrée invalide (vide ou trop longue).",
  file_too_large: "Fichier trop volumineux (max 15 Mo).",
  upstream_error: "Le service est injoignable, réessaie plus tard.",
  default: "Une erreur est survenue, réessaie.",
};

// Textarea → JSON { [field]: value, hp }.
export async function runWorkflow(
  endpoint: string, field: string, value: string, hp: string,
): Promise<WorkflowResponse> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value, hp }),
    });
    return (await res.json()) as WorkflowResponse;
  } catch {
    return { ok: false, error: "default" };
  }
}

// Fichier → multipart FormData (le navigateur pose le Content-Type).
export async function runWorkflowFile(
  endpoint: string, field: string, file: File | null, hp: string,
): Promise<WorkflowResponse> {
  if (!file) return { ok: false, error: "invalid_input" };
  try {
    const fd = new FormData();
    fd.append(field, file);
    fd.append("hp", hp);
    const res = await fetch(endpoint, { method: "POST", body: fd });
    return (await res.json()) as WorkflowResponse;
  } catch {
    return { ok: false, error: "default" };
  }
}
