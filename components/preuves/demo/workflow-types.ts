import type { ReactNode } from "react";

// Contrat data-driven d'une démo « workflow » (réutilisable pour les 5 démos).
export type NodeIcon =
  | "mail" | "shield" | "ai" | "format" | "check"
  | "doc" | "table" | "receipt" | "chat";

export interface WorkflowNode {
  id: string;
  label: string;          // libellé humain
  icon: NodeIcon;
  sublabel?: string;      // petit nom technique (mono), optionnel
}

export interface WorkflowConfig {
  id: string;             // "email", "meeting", … (clé onglet + remount)
  tabLabel: string;       // libellé court de l'onglet
  tabIcon: NodeIcon;
  accent: string;         // hex — couleur d'identité (propagée à tout le canvas)
  title: string;
  subtitle: string;
  endpoint: string;
  inputType: "textarea" | "file";
  inputField: string;     // nom du champ dans le body / FormData
  inputLabel: string;
  placeholder?: string;   // textarea
  accept?: string;        // file, ex ".csv" ou "image/*,application/pdf"
  exampleText?: string;   // textarea uniquement
  submitLabel?: string;   // défaut "Lancer le workflow"
  exampleLabel?: string;  // défaut "Essayer avec cet exemple"
  nodes: WorkflowNode[];
  errorMessages?: Record<string, string>;
  renderResult: (result: unknown) => ReactNode;
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
  upstream_error: "Le service est injoignable, réessaie plus tard.",
  default: "Une erreur est survenue, réessaie.",
};

// Textarea → JSON { [field]: value, hp }. Comportement inchangé.
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

// Fichier → multipart FormData (le navigateur pose le Content-Type). Endpoint
// absent → res.json() échoue → erreur propre, jamais de crash.
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
