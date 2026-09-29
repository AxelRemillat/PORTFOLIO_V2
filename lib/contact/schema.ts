// Validation serveur du formulaire de contact + mise en forme du mail.
// Module pur (aucun import serveur) : testé localement avec un mock d'envoi
// (scripts/contact.test.ts). Pas de dépendance ajoutée : les règles tiennent en
// quelques lignes et zod n'est pas dans le projet.

export const CONTACT_SUBJECTS = [
  "Automatiser une tâche",
  "Demander un devis",
  "Mise en production IA",
  "Autre",
] as const;
export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];

/** Longueurs maximales, appliquées aussi côté client (attribut maxLength). */
export const CONTACT_LIMITS = { name: 100, email: 254, message: 4000 } as const;
/** Corps de requête JSON maximal, en octets : un formulaire légitime pèse < 6 Ko. */
export const CONTACT_MAX_BODY_BYTES = 16_000;
/** Nom du champ piège : invisible pour un humain, rempli par les robots. */
export const HONEYPOT_FIELD = "company_url";

export interface ContactData {
  name: string;
  email: string;
  subject: ContactSubject;
  message: string;
}

export type ContactValidation =
  | { ok: true; data: ContactData }
  | { ok: false; error: string; honeypot?: boolean };

// Un email simple : pas d'espace, pas de chevron ni de virgule (donc pas de
// second destinataire glissé dans reply-to), un point dans le domaine.
const EMAIL = /^[^\s@<>,;"]+@[^\s@<>,;"]+\.[^\s@<>,;"]{2,}$/;
const CONTROL = /[\u0000-\u001f\u007f]/g;

const asString = (value: unknown) => (typeof value === "string" ? value : "");

/** Valide et nettoie le corps reçu. Ne lève jamais. */
export function validateContact(input: unknown): ContactValidation {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "Requête invalide." };
  }
  const body = input as Record<string, unknown>;

  // Pot de miel rempli : on ne dit rien au robot (la route répond « ok »).
  if (asString(body[HONEYPOT_FIELD]).trim()) return { ok: false, error: "Requête invalide.", honeypot: true };

  // Sur une ligne : retours à la ligne et caractères de contrôle retirés (en-têtes du mail).
  const name = asString(body.name).replace(CONTROL, " ").replace(/\s+/g, " ").trim();
  const email = asString(body.email).trim();
  const message = asString(body.message).replace(/\r\n/g, "\n").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim();
  const subject = asString(body.subject);

  if (!name || !email || !message) return { ok: false, error: "Nom, email et message sont requis." };
  if (name.length > CONTACT_LIMITS.name) return { ok: false, error: `Nom trop long (${CONTACT_LIMITS.name} caractères maximum).` };
  if (email.length > CONTACT_LIMITS.email || !EMAIL.test(email)) return { ok: false, error: "Adresse email invalide." };
  if (message.length > CONTACT_LIMITS.message) {
    return { ok: false, error: `Message trop long (${CONTACT_LIMITS.message} caractères maximum).` };
  }
  if (!(CONTACT_SUBJECTS as readonly string[]).includes(subject)) return { ok: false, error: "Sujet invalide." };

  return { ok: true, data: { name, email, subject: subject as ContactSubject, message } };
}

/** Échappe une valeur avant de l'insérer dans du HTML (texte ET attributs). */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface ContactMail {
  subject: string;
  html: string;
  text: string;
}

/** Le mail reçu par Axel. Toutes les valeurs du visiteur sont échappées. */
export function buildContactMail(data: ContactData): ContactMail {
  const html = `
      <h2>Nouveau message — axelremillat.com</h2>
      <p><strong>Nom :</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email :</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Sujet :</strong> ${escapeHtml(data.subject)}</p>
      <p><strong>Message :</strong></p>
      <p>${escapeHtml(data.message).replace(/\n/g, "<br/>")}</p>
    `;
  const text = `Nouveau message — axelremillat.com\n\nNom : ${data.name}\nEmail : ${data.email}\nSujet : ${data.subject}\n\n${data.message}\n`;
  return { subject: `[Portfolio] ${data.subject} — de ${data.name}`, html, text };
}
