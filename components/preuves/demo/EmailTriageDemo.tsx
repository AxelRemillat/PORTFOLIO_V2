"use client";

import { useState } from "react";
import ResultPanel from "./ResultPanel";
import { DEMO_CSS } from "./demoCss";
import { SAMPLE_EMAIL, ERROR_MESSAGES, analyzeEmail } from "./email-triage-lib";
import type { TriageResult } from "./email-triage-lib";

// Démo publique « tri d'email » : n'appelle QUE /api/demo/email-triage (le webhook
// n8n et le secret restent côté serveur). Honeypot anti-bot, états loading/erreur.
export default function EmailTriageDemo() {
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState(""); // honeypot : reste vide pour un humain
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    const data = await analyzeEmail(email, hp);
    if (data.ok && data.result) setResult(data.result);
    else setError(ERROR_MESSAGES[data.error ?? "default"] ?? ERROR_MESSAGES.default);
    setLoading(false);
  };

  const canSubmit = email.trim().length > 0 && !loading;

  return (
    <section className="etd" aria-labelledby="etd-title">
      <style>{DEMO_CSS}</style>
      <p className="ap-seclabel">Démo // tri d&apos;email en direct</p>
      <h2 id="etd-title" className="etd-title">Essayez le tri d&apos;email</h2>
      <p className="etd-lead">Collez un email reçu, l&apos;IA le trie et rédige une réponse.</p>

      <div className="etd-form">
        <label htmlFor="etd-ta" className="etd-lbl">Email à analyser</label>
        <textarea
          id="etd-ta" className="etd-ta" value={email} maxLength={4000}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Collez ici l'email reçu…"
        />

        {/* Honeypot anti-bot : invisible, hors tabulation, jamais rempli par un humain */}
        <input
          className="etd-hp" type="text" name="hp" tabIndex={-1} autoComplete="off"
          aria-hidden="true" value={hp} onChange={(e) => setHp(e.target.value)}
        />

        <div className="etd-actions">
          <button type="button" className="etd-btn etd-primary" onClick={analyze} disabled={!canSubmit}>
            {loading && <span className="etd-spin" aria-hidden />}
            {loading ? "Analyse en cours…" : "Analyser"}
          </button>
          <button type="button" className="etd-btn etd-ghost" onClick={() => setEmail(SAMPLE_EMAIL)} disabled={loading}>
            Essayer avec cet exemple
          </button>
        </div>
      </div>

      {error && <p className="etd-error" role="alert">{error}</p>}
      {result && <ResultPanel result={result} />}

      <div className="etd-how">
        <p className="ap-seclabel">Comment ça marche</p>
        <ul className="etd-how-steps">
          <li><b>1.</b> Webhook n8n sécurisé</li>
          <li><b>2.</b> Tri + rédaction par IA</li>
          <li><b>3.</b> Catégorie, priorité &amp; réponse</li>
        </ul>
        <div className="etd-shot">Capture du workflow n8n — à ajouter</div>
      </div>
    </section>
  );
}
