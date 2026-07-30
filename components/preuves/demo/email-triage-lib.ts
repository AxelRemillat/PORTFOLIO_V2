// Types + constantes + helper d'appel de la démo tri d'email. L'UI est construite
// contre le CONTRAT n8n ci-dessous — ne pas le modifier.
export interface TriageResult {
  categorie: "SAV" | "commercial" | "facturation" | "spam" | "autre";
  priorite: "haute" | "moyenne" | "basse";
  justification_priorite: string;
  langue: string;
  points_cles: string[];
  reponse_suggeree: string;
}
export interface TriageResponse {
  ok: boolean;
  result?: TriageResult;
  error?: string;
}

export const SAMPLE_EMAIL = `Objet : Toujours pas reçu ma commande !!
Bonjour, cela fait 10 jours que j'ai passé ma commande (n° 48213) et je n'ai toujours rien reçu. Le suivi indique "en préparation" depuis une semaine. C'est inadmissible, j'ai besoin de ce matériel pour lundi. Je veux une solution rapide ou je demande un remboursement. Cordialement, Marc D.`;

// Couleurs sémantiques (pas de token dédié rouge/jaune ; orange & vert alignés sur
// l'accent du site — même approche que les pastilles de statut de /preuves).
export const CATEGORY_COLORS: Record<string, string> = {
  SAV: "#f97316", commercial: "#10b981", facturation: "#60a5fa", spam: "#ef4444", autre: "#94a3b8",
};
export const PRIORITY_COLORS: Record<string, string> = {
  haute: "#ef4444", moyenne: "#f59e0b", basse: "#10b981",
};
export const ERROR_MESSAGES: Record<string, string> = {
  rate_limited: "Trop d'essais, réessaie dans 1 min.",
  demo_disabled: "Démo momentanément indisponible.",
  invalid_input: "Texte d'email invalide (vide ou trop long).",
  upstream_error: "Le service de tri est injoignable, réessaie plus tard.",
  default: "Une erreur est survenue, réessaie.",
};

export async function analyzeEmail(email_text: string, hp: string): Promise<TriageResponse> {
  try {
    const res = await fetch("/api/demo/email-triage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email_text, hp }),
    });
    return (await res.json()) as TriageResponse;
  } catch {
    return { ok: false, error: "default" };
  }
}
