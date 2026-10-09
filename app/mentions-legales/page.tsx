import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site-config";

export const metadata: Metadata = {
  alternates: { canonical: "/mentions-legales" },
  title: "Mentions légales — Axel Remillat",
  description: "Éditeur, hébergeur et traitement des données personnelles du site axelremillat.com.",
};

const h2 = "font-mono text-xs tracking-[0.15em] uppercase text-orange mt-12 mb-4";
const p = "text-[15px] leading-relaxed text-text mb-3";
const link = "text-orange underline underline-offset-2 hover:opacity-80";

export default function MentionsLegalesPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 pt-16 pb-8">
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">Mentions légales</h1>
      <p className="text-muted mb-8">Dernière mise à jour : septembre 2026.</p>

      <h2 className={h2}>Éditeur du site</h2>
      <p className={p}>
        Axel Remillat, entrepreneur individuel (micro-entreprise).
        <br />
        SIRET : 109 144 477 00014
        <br />
        Adresse : 61 chemin de Pré Longe, 38350 Oris-en-Rattier, France
        <br />
        Téléphone : <a className={link} href="tel:+33749727192">07 49 72 71 92</a>
        <br />
        Contact : <a className={link} href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
      <p className={p}>Directeur de la publication : Axel Remillat.</p>

      <h2 className={h2}>Hébergeur</h2>
      <p className={p}>
        Vercel Inc.,
        <br />
        440 N Barranca Ave #4133, Covina, CA 91723, USA
        <br />
        <a className={link} href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>
      </p>

      <h2 className={h2}>Propriété intellectuelle</h2>
      <p className={p}>
        Les textes, visuels, code et démos de ce site sont la propriété d&apos;Axel Remillat, sauf mention contraire.
        Toute reproduction sans autorisation écrite est interdite.
      </p>

      <h2 id="donnees" className={h2}>Données personnelles</h2>
      <p className={p}>Responsable du traitement : Axel Remillat (coordonnées ci-dessus).</p>

      <h3 className="text-lg font-semibold mt-6 mb-2">Formulaire de contact</h3>
      <ul className="list-disc pl-6 text-[15px] leading-relaxed text-text space-y-2 mb-3">
        <li>
          <strong>Données collectées</strong> : nom, adresse email, sujet et contenu du message que vous saisissez.
        </li>
        <li>
          <strong>Finalité</strong> : répondre à votre demande (échange, devis, appel découverte). Ces données ne servent ni
          à de la revente, ni à de l&apos;envoi de newsletters.
        </li>
        <li>
          <strong>Destinataire</strong> : Axel Remillat. Le message transite par le service d&apos;envoi d&apos;emails Resend ; la
          limitation du nombre d&apos;envois utilise votre adresse IP, conservée au plus 24 heures (Upstash).
        </li>
        <li>
          <strong>Durée de conservation</strong> : trois ans à compter du dernier échange, puis suppression.
        </li>
        <li>
          <strong>Vos droits</strong> : accès, rectification, suppression, opposition et limitation du traitement. Pour les
          exercer, écrivez à <a className={link} href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> : la suppression de vos
          données est effectuée sur simple demande par email. Vous pouvez aussi saisir la{" "}
          <a className={link} href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>.
        </li>
      </ul>

      <h3 className="text-lg font-semibold mt-6 mb-2">Mesure d&apos;audience</h3>
      <p className={p}>
        Ce site utilise Umami, un outil de mesure d&apos;audience sans cookie : aucun cookie n&apos;est déposé et aucune bannière de
        consentement n&apos;est nécessaire. Les statistiques (pages vues, provenance générale) sont agrégées et ne permettent pas
        de vous identifier. Sont également comptés, de la même façon anonyme, quelques gestes : ouverture d&apos;une démo,
        clic vers la prise de rendez-vous, envoi du formulaire de contact. Jamais le contenu de ce que vous saisissez.
      </p>

      <h3 className="text-lg font-semibold mt-6 mb-2">Démos et assistant VEGA</h3>
      <p className={p}>
        Les textes et fichiers que vous saisissez dans les démos sont transmis à des services d&apos;IA et d&apos;automatisation tiers
        (OpenAI, workflows n8n) pour produire la réponse. Ne saisissez pas de données personnelles ou confidentielles.
      </p>

      <p className="text-[15px] text-muted mt-12">
        <Link href="/contact" className={link}>Retour au contact</Link>
      </p>
    </main>
  );
}
