/**
 * Test LOCAL du formulaire de contact — mock d'envoi et de limiteur, aucun
 * réseau, aucun vrai mail. Exécution : `npm run test:contact`.
 */
import { CONTACT_LIMITS, CONTACT_SUBJECTS, HONEYPOT_FIELD, escapeHtml, validateContact } from "../lib/contact/schema";
import { CONTACT_ADDRESS, FROM_FALLBACK, FROM_VERIFIED, handleContact, type SendMail } from "../lib/contact/handler";

let failures = 0;
function check(name: string, condition: boolean, detail = "") {
  if (condition) console.log(`  ok   ${name}`);
  else {
    failures += 1;
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

const valid = { name: "Claire Martin", email: "claire@exemple.fr", subject: "Demander un devis", message: "Bonjour, un devis svp." };
const raw = (over: Record<string, unknown> = {}) => JSON.stringify({ ...valid, ...over });

function harness(opts: { unverified?: boolean; limited?: boolean } = {}) {
  const sent: Parameters<SendMail>[0][] = [];
  const send: SendMail = async (mail) => {
    sent.push(mail);
    if (opts.unverified && mail.from === FROM_VERIFIED) return { ok: false, error: "domain is not verified", domainNotVerified: true };
    return { ok: true };
  };
  let limiterCalls = 0;
  const rateLimit = async () => {
    limiterCalls += 1;
    return opts.limited ? ({ ok: false, scope: "ip" } as const) : ({ ok: true } as const);
  };
  return { sent, deps: { send, rateLimit }, calls: () => limiterCalls };
}

(async () => {
  console.log("\n1. Validation serveur");
  check("message valide accepté", validateContact(valid).ok);
  check("sujets autorisés : exactement les 4 demandés", CONTACT_SUBJECTS.join("|") === "Automatiser une tâche|Demander un devis|Mise en production IA|Autre");
  for (const subject of CONTACT_SUBJECTS) check(`sujet « ${subject} » accepté`, validateContact({ ...valid, subject }).ok);
  check("ancien sujet « Diagnostic IA » refusé", !validateContact({ ...valid, subject: "Diagnostic IA" }).ok);
  check("nom vide refusé", !validateContact({ ...valid, name: "  " }).ok);
  check("nom trop long refusé", !validateContact({ ...valid, name: "a".repeat(CONTACT_LIMITS.name + 1) }).ok);
  check("email invalide refusé", !validateContact({ ...valid, email: "pas-un-email" }).ok);
  check("email à deux destinataires refusé", !validateContact({ ...valid, email: "a@b.fr,c@d.fr" }).ok);
  check("email avec retour à la ligne refusé", !validateContact({ ...valid, email: "a@b.fr\nBcc: x@y.fr" }).ok);
  check("message trop long refusé", !validateContact({ ...valid, message: "x".repeat(CONTACT_LIMITS.message + 1) }).ok);
  check("types non-chaîne refusés", !validateContact({ ...valid, name: { $ne: 1 } }).ok && !validateContact(null).ok && !validateContact([]).ok);
  const multiline = validateContact({ ...valid, name: "Claire\r\nBcc: x@y.fr" });
  check("nom sur une ligne (pas d'injection d'en-tête)", multiline.ok && !/[\r\n]/.test(multiline.data.name));

  console.log("\n2. Échappement HTML");
  const xss = `<img src=x onerror=alert(1)> "quote" & 'apos'`;
  check("escapeHtml neutralise < > & \" '", escapeHtml(xss) === "&lt;img src=x onerror=alert(1)&gt; &quot;quote&quot; &amp; &#39;apos&#39;");
  const a = harness();
  await handleContact({ ip: "1.1.1.1", rawBody: raw({ name: "<script>alert(1)</script>", email: "a@b.fr", message: `<b>gras</b>\n<a href="javascript:x">lien</a>` }) }, a.deps);
  const html = a.sent[0]?.html ?? "";
  check("aucune balise du visiteur dans le HTML du mail", !/<script|<b>|<a href/i.test(html) && html.includes("&lt;script&gt;") && html.includes("&lt;b&gt;gras"), html);
  check("retour à la ligne du message conservé (<br/>)", html.includes("<br/>"));

  console.log("\n3. Route : envoi, pot de miel, débit");
  const ok = harness();
  const res = await handleContact({ ip: "2.2.2.2", rawBody: raw() }, ok.deps);
  check("succès : 200", res.status === 200 && "success" in res.body);
  check("expéditeur axel@axelremillat.com, destinataire axel@axelremillat.com", ok.sent[0].from === FROM_VERIFIED && ok.sent[0].to === CONTACT_ADDRESS && CONTACT_ADDRESS === "axel@axelremillat.com");
  check("reply-to = email du visiteur", ok.sent[0].replyTo === valid.email);
  check("objet du mail : sujet + nom", ok.sent[0].subject === "[Portfolio] Demander un devis — de Claire Martin", ok.sent[0].subject);

  const trap = harness();
  const trapped = await handleContact({ ip: "3.3.3.3", rawBody: raw({ [HONEYPOT_FIELD]: "http://spam.example" }) }, trap.deps);
  check("pot de miel : réponse « ok » identique, rien n'est envoyé", trapped.status === 200 && trap.sent.length === 0 && trap.calls() === 0);

  const limited = harness({ limited: true });
  const blocked = await handleContact({ ip: "4.4.4.4", rawBody: raw() }, limited.deps);
  check("limite de débit : 429, rien n'est envoyé", blocked.status === 429 && limited.sent.length === 0);

  const invalid = harness();
  const bad = await handleContact({ ip: "5.5.5.5", rawBody: raw({ email: "nope" }) }, invalid.deps);
  check("entrée invalide : 400 et le limiteur n'est pas consommé", bad.status === 400 && invalid.calls() === 0);
  check("JSON illisible : 400", (await handleContact({ ip: "6.6.6.6", rawBody: "{oups" }, invalid.deps)).status === 400);
  check("corps énorme : 413", (await handleContact({ ip: "6.6.6.6", rawBody: raw({ message: "x".repeat(40_000) }) }, invalid.deps)).status === 413);

  console.log("\n4. Repli tant que le domaine n'est pas vérifié");
  const fallback = harness({ unverified: true });
  const viaFallback = await handleContact({ ip: "7.7.7.7", rawBody: raw() }, fallback.deps);
  check("domaine non vérifié : 2e tentative sur onboarding@resend.dev, succès", viaFallback.status === 200 && fallback.sent.length === 2 && fallback.sent[1].from === FROM_FALLBACK);
  check("reply-to conservé dans le repli", fallback.sent[1].replyTo === valid.email);
  const down: SendMail = async () => ({ ok: false, error: "boom" });
  const failed = await handleContact({ ip: "8.8.8.8", rawBody: raw() }, { send: down, rateLimit: async () => ({ ok: true }) });
  check("échec d'envoi : 502 lisible, pas de détail interne", failed.status === 502 && !JSON.stringify(failed.body).includes("boom"));

  console.log(failures === 0 ? "\nTous les tests passent.\n" : `\n${failures} test(s) en echec.\n`);
  process.exit(failures === 0 ? 0 : 1);
})();
