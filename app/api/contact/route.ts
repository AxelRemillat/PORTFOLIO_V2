import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { handleContact, type SendMail } from "@/lib/contact/handler";
import { checkRateLimit } from "@/lib/demo-rate-limit";

export const runtime = "nodejs";

// Envoi via Resend, expéditeur axel@axelremillat.com (domaine à vérifier dans
// Resend : voir README « Formulaire de contact »). Le repli sur
// onboarding@resend.dev est géré dans lib/contact/handler.ts.
const send: SendMail = async (mail) => {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "RESEND_API_KEY absente." };
  const { error } = await new Resend(key).emails.send({
    from: mail.from,
    to: mail.to,
    replyTo: mail.replyTo,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
  });
  if (!error) return { ok: true };
  // Resend répond 403 « The <domaine> domain is not verified » tant que les DNS ne sont pas validés.
  const domainNotVerified = /not verified|domain/i.test(error.message ?? "") && (error.statusCode === 403 || error.statusCode === 422 || error.statusCode == null);
  return { ok: false, error: error.message ?? "erreur Resend", domainNotVerified };
};

// IP du visiteur : premier élément de x-forwarded-for (posé par Vercel).
const ipOf = (req: NextRequest) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

export async function POST(req: NextRequest) {
  try {
    const result = await handleContact({ ip: ipOf(req), rawBody: await req.text() }, { send, rateLimit: checkRateLimit });
    return NextResponse.json(result.body, { status: result.status });
  } catch {
    return NextResponse.json({ error: "Erreur serveur, réessaie." }, { status: 500 });
  }
}
