import { buildContactMail, CONTACT_MAX_BODY_BYTES, validateContact, type ContactMail, type ContactData } from "./schema";

// Logique de la route /api/contact, sans dépendance à Next ni à Resend : la
// route branche les vrais services, le test local branche des doubles.

export interface OutgoingMail extends ContactMail {
  to: string;
  replyTo: string;
}
/** Envoie un mail ; `domainNotVerified` = le domaine expéditeur n'est pas (encore) vérifié. */
export type SendResult = { ok: true } | { ok: false; error: string; domainNotVerified?: boolean };
export type SendMail = (mail: OutgoingMail & { from: string }) => Promise<SendResult>;
export type RateCheck = (ip: string, prefix: string) => Promise<{ ok: true } | { ok: false; scope: "ip" | "global" }>;

export const CONTACT_ADDRESS = "axel@axelremillat.com";
/** Expéditeur nominal : domaine axelremillat.com vérifié dans Resend. */
export const FROM_VERIFIED = `Axel Remillat <${CONTACT_ADDRESS}>`;
/** Repli tant que le domaine n'est pas vérifié (n'écrit qu'au titulaire du compte Resend). */
export const FROM_FALLBACK = "Portfolio <onboarding@resend.dev>";

export interface ContactDeps {
  send: SendMail;
  rateLimit: RateCheck;
}

export interface ContactRequest {
  ip: string;
  /** Corps brut de la requête (texte) : sa taille est vérifiée avant tout parsing. */
  rawBody: string;
}

export interface ContactResponse {
  status: number;
  body: { success: true } | { error: string };
}

const fail = (status: number, error: string): ContactResponse => ({ status, body: { error } });

export async function handleContact(request: ContactRequest, deps: ContactDeps): Promise<ContactResponse> {
  if (Buffer.byteLength(request.rawBody, "utf8") > CONTACT_MAX_BODY_BYTES) return fail(413, "Message trop volumineux.");

  let json: unknown;
  try {
    json = JSON.parse(request.rawBody);
  } catch {
    return fail(400, "Requête invalide.");
  }

  const checked = validateContact(json);
  // Robot pris au piège : réponse « ok » identique, rien n'est envoyé ni compté.
  if (!checked.ok && checked.honeypot) return { status: 200, body: { success: true } };
  if (!checked.ok) return fail(400, checked.error);

  const limit = await deps.rateLimit(request.ip, "contact");
  if (!limit.ok) return fail(429, "Trop de messages envoyés. Réessaie dans quelques minutes, ou écris-moi directement par email.");

  const outcome = await sendWithFallback(checked.data, deps.send);
  if (!outcome.ok) return fail(502, "L'envoi a échoué. Réessaie ou écris-moi directement par email.");
  return { status: 200, body: { success: true } };
}

/** Domaine vérifié d'abord ; si Resend le refuse, repli sur le domaine de test. */
async function sendWithFallback(data: ContactData, send: SendMail): Promise<SendResult> {
  const mail = { ...buildContactMail(data), to: CONTACT_ADDRESS, replyTo: data.email };
  const first = await send({ ...mail, from: FROM_VERIFIED });
  if (first.ok || !first.domainNotVerified) return first;
  return send({ ...mail, from: FROM_FALLBACK });
}
