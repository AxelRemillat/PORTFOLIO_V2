import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site-config";

// Legal notice in English — a courtesy translation of the French "mentions
// légales", which remain the reference. Same publisher, same host, same data
// processing: nothing is added or left out.

const h2 = "font-mono text-xs tracking-[0.15em] uppercase text-orange mt-12 mb-4";
const p = "text-[15px] leading-relaxed text-text mb-3";
const link = "text-orange underline underline-offset-2 hover:opacity-80";

export default function LegalEn() {
  return (
    <main className="max-w-3xl mx-auto px-6 pt-16 pb-8">
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">Legal notice</h1>
      <p className="text-muted mb-8">Last updated: September 2026. This English version is provided for convenience; the French version prevails.</p>

      <h2 className={h2}>Publisher</h2>
      <p className={p}>
        Axel Remillat, sole proprietor (French micro-entreprise).
        <br />
        SIRET: 109 144 477 00014
        <br />
        Address: 61 chemin de Pré Longe, 38350 Oris-en-Rattier, France
        <br />
        Phone: <a className={link} href="tel:+33749727192">+33 7 49 72 71 92</a>
        <br />
        Contact: <a className={link} href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
      <p className={p}>Publication director: Axel Remillat.</p>

      <h2 className={h2}>Hosting provider</h2>
      <p className={p}>
        Vercel Inc.,
        <br />
        440 N Barranca Ave #4133, Covina, CA 91723, USA
        <br />
        <a className={link} href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>
      </p>

      <h2 className={h2}>Intellectual property</h2>
      <p className={p}>
        The text, visuals, code and demos on this site belong to Axel Remillat unless stated otherwise. Any reproduction
        without written permission is prohibited.
      </p>

      <h2 id="donnees" className={h2}>Personal data</h2>
      <p className={p}>Data controller: Axel Remillat (contact details above).</p>

      <h3 className="text-lg font-semibold mt-6 mb-2">Contact form</h3>
      <ul className="list-disc pl-6 text-[15px] leading-relaxed text-text space-y-2 mb-3">
        <li>
          <strong>Data collected</strong>: the name, email address, subject and message you enter.
        </li>
        <li>
          <strong>Purpose</strong>: replying to your request (a conversation, a quote, a discovery call). This data is
          never sold and never used for newsletters.
        </li>
        <li>
          <strong>Recipient</strong>: Axel Remillat. The message goes through the Resend email service; the limit on the
          number of messages uses your IP address, kept for 24 hours at most (Upstash).
        </li>
        <li>
          <strong>Retention</strong>: three years from our last exchange, then deleted.
        </li>
        <li>
          <strong>Your rights</strong>: access, correction, deletion, objection and restriction of processing. To use
          them, write to <a className={link} href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>: your data is deleted
          on simple request by email. You can also contact the{" "}
          <a className={link} href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>, the French
          data protection authority.
        </li>
      </ul>

      <h3 className="text-lg font-semibold mt-6 mb-2">Audience measurement</h3>
      <p className={p}>
        This site uses Umami, a cookieless analytics tool: no tracking cookie is set and no consent banner is needed.
        Statistics (page views, general origin) are aggregated and cannot identify you. A few actions are also counted, in
        the same anonymous way: opening a demo, clicking through to book a call, submitting the contact form. Never the
        content of what you type.
      </p>
      <p className={p}>
        The only cookie is a technical one, &ldquo;lang&rdquo;, set when you pick a language with the FR | EN switcher:
        it remembers that choice for one year and is used for nothing else.
      </p>

      <h3 className="text-lg font-semibold mt-6 mb-2">Demos and the VEGA assistant</h3>
      <p className={p}>
        The text and files you enter in the demos are sent to third-party AI and automation services (OpenAI, n8n
        workflows) to produce the answer. Do not enter personal or confidential data.
      </p>

      <p className="text-[15px] text-muted mt-12">
        <Link href="/en/contact" className={link}>Back to contact</Link>
      </p>
    </main>
  );
}
