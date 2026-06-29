import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Créer un compte gratuit sur resend.com → API Keys → coller la clé dans .env.local
// (RESEND_API_KEY=re_XXXX). Le from utilise le domaine par défaut du free tier.
const resend = new Resend(process.env.RESEND_API_KEY);

const DEST = "axelremillat@netcourrier.com";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Nom, email et message sont requis." },
        { status: 400 },
      );
    }

    const html = `
      <h2>Nouveau message — Portfolio</h2>
      <p><strong>Nom :</strong> ${name}</p>
      <p><strong>Email :</strong> ${email}</p>
      <p><strong>Sujet :</strong> ${subject ?? "—"}</p>
      <p><strong>Message :</strong></p>
      <p>${String(message).replace(/\n/g, "<br/>")}</p>
    `;

    const { error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: DEST,
      replyTo: email,
      subject: `[Portfolio] ${subject ?? "Message"} — de ${name}`,
      html,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur, réessaie." },
      { status: 500 },
    );
  }
}
