// Spécifique à la démo tri d'email : contrat de sortie + exemple + couleurs. Le
// fetch générique est dans workflow-types.ts (runWorkflow). Contrat inchangé.
export interface TriageResult {
  categorie: "SAV" | "commercial" | "facturation" | "spam" | "autre";
  priorite: "haute" | "moyenne" | "basse";
  justification_priorite: string;
  langue: string;
  points_cles: string[];
  reponse_suggeree: string;
}

export const SAMPLE_EMAIL = `Objet : Toujours pas reçu ma commande !!
Bonjour, cela fait 10 jours que j'ai passé ma commande (n° 48213) et je n'ai toujours rien reçu. Le suivi indique "en préparation" depuis une semaine. C'est inadmissible, j'ai besoin de ce matériel pour lundi. Je veux une solution rapide ou je demande un remboursement. Cordialement, Marc D.`;

// Couleurs sémantiques (rouge/jaune n'ont pas de token ; orange & vert alignés marque).
export const CATEGORY_COLORS: Record<string, string> = {
  SAV: "#f97316", commercial: "#10b981", facturation: "#0ea5e9", spam: "#ef4444", autre: "#6b7280",
};
export const PRIORITY_COLORS: Record<string, string> = {
  haute: "#ef4444", moyenne: "#d97706", basse: "#10b981",
};
