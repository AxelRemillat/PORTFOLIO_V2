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

/**
 * Libellés ANGLAIS des sujets, affichés par le formulaire /en. La valeur envoyée
 * reste le sujet français : la validation serveur et le mail d'Axel ne changent pas.
 */
export const CONTACT_SUBJECT_LABELS_EN: Record<ContactSubject, string> = {
  "Automatiser une tâche": "Automate a task",
  "Demander un devis": "Request a quote",
  "Mise en production IA": "Take AI to production",
  Autre: "Other",
};

/** Langue du visiteur, portée par le corps de la requête ('fr' par défaut). */
export type ContactLocale = "fr" | "en";
export const contactLocale = (value: unknown): ContactLocale => (value === "en" ? "en" : "fr");

/** Messages d'erreur renvoyés au visiteur, dans sa langue. Le français est celui d'origine. */
export const CONTACT_ERRORS = {
  fr: {
    invalid: "Requête invalide.",
    required: "Nom, email et message sont requis.",
    nameTooLong: (max: number) => `Nom trop long (${max} caractères maximum).`,
    email: "Adresse email invalide.",
    messageTooLong: (max: number) => `Message trop long (${max} caractères maximum).`,
    subject: "Sujet invalide.",
    tooBig: "Message trop volumineux.",
    rate: "Trop de messages envoyés. Réessaie dans quelques minutes, ou écris-moi directement par email.",
    sendFailed: "L'envoi a échoué. Réessaie ou écris-moi directement par email.",
    server: "Erreur serveur, réessaie.",
  },
  en: {
    invalid: "Invalid request.",
    required: "Name, email and message are required.",
    nameTooLong: (max: number) => `Name is too long (${max} characters max).`,
    email: "Invalid email address.",
    messageTooLong: (max: number) => `Message is too long (${max} characters max).`,
    subject: "Invalid subject.",
    tooBig: "Message is too large.",
    rate: "Too many messages sent. Try again in a few minutes, or email me directly.",
    sendFailed: "Sending failed. Try again, or email me directly.",
    server: "Server error, please try again.",
  },
} as const;

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
  /** Langue du visiteur : le mail d'Axel le signale s'il faut répondre en anglais. */
  locale?: ContactLocale;
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
    return { ok: false, error: CONTACT_ERRORS.fr.invalid };
  }
  const body = input as Record<string, unknown>;
  const locale = contactLocale(body.locale);
  const t = CONTACT_ERRORS[locale];

  // Pot de miel rempli : on ne dit rien au robot (la route répond « ok »).
  if (asString(body[HONEYPOT_FIELD]).trim()) return { ok: false, error: t.invalid, honeypot: true };

  // Sur une ligne : retours à la ligne et caractères de contrôle retirés (en-têtes du mail).
  const name = asString(body.name).replace(CONTROL, " ").replace(/\s+/g, " ").trim();
  const email = asString(body.email).trim();
  const message = asString(body.message).replace(/\r\n/g, "\n").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim();
  const subject = asString(body.subject);

  if (!name || !email || !message) return { ok: false, error: t.required };
  if (name.length > CONTACT_LIMITS.name) return { ok: false, error: t.nameTooLong(CONTACT_LIMITS.name) };
  if (email.length > CONTACT_LIMITS.email || !EMAIL.test(email)) return { ok: false, error: t.email };
  if (message.length > CONTACT_LIMITS.message) {
    return { ok: false, error: t.messageTooLong(CONTACT_LIMITS.message) };
  }
  if (!(CONTACT_SUBJECTS as readonly string[]).includes(subject)) return { ok: false, error: t.subject };

  return { ok: true, data: { name, email, subject: subject as ContactSubject, message, ...(locale === "en" ? { locale } : {}) } };
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

/**
 * Le mail reçu par Axel (en français). Toutes les valeurs du visiteur sont
 * échappées. Visiteur anglophone : « [EN] » dans l'objet et une ligne
 * « Langue », pour répondre en anglais ; sinon le mail est celui d'avant.
 */
export function buildContactMail(data: ContactData): ContactMail {
  const english = data.locale === "en";
  const html = `
      <h2>Nouveau message — axelremillat.com</h2>${english ? "\n      <p><strong>Langue :</strong> anglais — répondre en anglais</p>" : ""}
      <p><strong>Nom :</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email :</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Sujet :</strong> ${escapeHtml(data.subject)}</p>
      <p><strong>Message :</strong></p>
      <p>${escapeHtml(data.message).replace(/\n/g, "<br/>")}</p>
    `;
  const text = `Nouveau message — axelremillat.com\n\n${english ? "Langue : anglais — répondre en anglais\n" : ""}Nom : ${data.name}\nEmail : ${data.email}\nSujet : ${data.subject}\n\n${data.message}\n`;
  return { subject: `[Portfolio]${english ? " [EN]" : ""} ${data.subject} — de ${data.name}`, html, text };
}
