import type { Locale } from "@/lib/i18n/config";

/**
 * Textes de /contact (page + formulaire). Français MOT POUR MOT d'avant le
 * bilingue ; l'anglais a le même type. Module pur, client comme serveur.
 */
const FR = {
  meta: {
    title: "Contact — Axel Remillat",
    description: "Contacter Axel Remillat — email, LinkedIn, téléphone, CV et formulaire.",
  },
  page: {
    label: "04 // CONTACT",
    titleA: "Construisons",
    titleEm: "quelque chose.",
    callA: "Appel découverte de 30 min",
    callFree: "gratuit",
    callLink: "Voir mes disponibilités de la semaine →",
    divider: "─── COORDONNÉES + FORMULAIRE",
  },
  rows: {
    email: "Email",
    linkedin: "LinkedIn",
    linkedinValue: "Voir mon profil",
    phone: "Téléphone",
    cv: "CV",
    cvValue: "Télécharger mon CV",
    cvBadge: "PDF 2026",
    meeting: "Rendez-vous",
    meetingValue: "Réserver un créneau",
  },
  form: {
    heading: "// Envoyer un message direct",
    name: "Nom",
    email: "Email",
    subject: "Sujet",
    short: "Message court",
    shortPlaceholder: "En une phrase...",
    long: "Message complet (optionnel)",
    trap: "Ne pas remplir",
    noteA: "Dispo pour missions data/IA & collaborations. Réponse en moins de 24h.",
    noteB: "Ces informations servent uniquement à te répondre, voir les",
    noteLink: "mentions légales",
    sending: "Envoi...",
    send: "Envoyer",
    error: "Une erreur est survenue. Réessaie ou écris-moi directement par email.",
    sent: "Message reçu — je te réponds en moins de 24h.",
  },
};

export type ContactCopy = typeof FR;

const EN: ContactCopy = {
  meta: {
    title: "Contact — Axel Remillat",
    description: "Get in touch with Axel Remillat — email, LinkedIn, phone, résumé and contact form.",
  },
  page: {
    label: "04 // CONTACT",
    titleA: "Let's build",
    titleEm: "something.",
    callA: "30-min discovery call,",
    callFree: "free",
    callLink: "See my availability this week →",
    divider: "─── CONTACT DETAILS + FORM",
  },
  rows: {
    email: "Email",
    linkedin: "LinkedIn",
    linkedinValue: "View my profile",
    phone: "Phone",
    cv: "Résumé",
    cvValue: "Download my résumé",
    // Le CV n'existe qu'en français : on le dit plutôt que de surprendre.
    cvBadge: "PDF 2026 · FR",
    meeting: "Meeting",
    meetingValue: "Book a slot",
  },
  form: {
    heading: "// Send me a message",
    name: "Name",
    email: "Email",
    subject: "Subject",
    short: "Short message",
    shortPlaceholder: "In one sentence...",
    long: "Full message (optional)",
    trap: "Leave empty",
    noteA: "Available for data/AI projects & collaborations. Reply within 24 hours.",
    noteB: "This information is only used to reply to you — see the",
    noteLink: "legal notice",
    sending: "Sending...",
    send: "Send",
    error: "Something went wrong. Try again, or email me directly.",
    sent: "Message received — I'll get back to you within 24 hours.",
  },
};

export const contactCopy = (locale: Locale): ContactCopy => (locale === "en" ? EN : FR);
