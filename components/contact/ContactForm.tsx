"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { CONTACT_LIMITS, CONTACT_SUBJECTS, HONEYPOT_FIELD } from "@/lib/contact/schema";

type Status = "idle" | "sending" | "sent" | "error";

const labelStyle: CSSProperties = {
  display: "block",
  fontFamily: "var(--font-mono)",
  fontSize: 13,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: 8,
};

const fieldWrap: CSSProperties = { marginBottom: "1.5rem" };

const SUBJECTS = CONTACT_SUBJECTS;

/** Champ piège : hors écran, ignoré des lecteurs d'écran et du clavier. Un robot le remplit. */
const trapStyle: CSSProperties = { position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" };

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState<string>(SUBJECTS[0]);
  const [shortMsg, setShortMsg] = useState("");
  const [longMsg, setLongMsg] = useState("");
  const [trap, setTrap] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setErrorMsg("");
    const message = longMsg.trim() ? `${shortMsg}\n\n${longMsg}` : shortMsg;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, [HONEYPOT_FIELD]: trap }),
      });
      if (res.ok) return setStatus("sent");
      // Le serveur renvoie un message lisible (validation, limite de débit).
      const payload = (await res.json().catch(() => null)) as { error?: string } | null;
      setErrorMsg(payload?.error ?? "");
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
        <div style={{ fontSize: "2.5rem", color: "var(--color-orange)", marginBottom: "1rem" }}>✦</div>
        <p style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 700, color: "var(--color-text)" }}>
          Message reçu — je te réponds en moins de 24h.
        </p>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form onSubmit={handleSubmit}>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 15,
          color: "var(--color-orange)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: "1.75rem",
        }}
      >
        {"// Envoyer un message direct"}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 2rem" }}>
        <div style={fieldWrap}>
          <label style={labelStyle} htmlFor="cf-name">Nom</label>
          <input id="cf-name" className="contact-field" value={name} autoComplete="name"
            maxLength={CONTACT_LIMITS.name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div style={fieldWrap}>
          <label style={labelStyle} htmlFor="cf-email">Email</label>
          <input id="cf-email" type="email" className="contact-field" value={email} autoComplete="email"
            maxLength={CONTACT_LIMITS.email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div style={fieldWrap}>
          <label style={labelStyle} htmlFor="cf-subject">Sujet</label>
          <select id="cf-subject" className="contact-field" value={subject}
            onChange={(e) => setSubject(e.target.value)}>
            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={fieldWrap}>
          <label style={labelStyle} htmlFor="cf-short">Message court</label>
          <input id="cf-short" className="contact-field" placeholder="En une phrase..."
            value={shortMsg} maxLength={300} onChange={(e) => setShortMsg(e.target.value)} required />
        </div>
      </div>

      <div style={{ ...fieldWrap, marginBottom: "2rem" }}>
        <label style={labelStyle} htmlFor="cf-long">Message complet (optionnel)</label>
        <textarea id="cf-long" className="contact-field" style={{ height: 80, resize: "none" }}
          value={longMsg} maxLength={CONTACT_LIMITS.message - 400} onChange={(e) => setLongMsg(e.target.value)} />
      </div>

      {/* Pot de miel : invisible et non focalisable pour un humain */}
      <div style={trapStyle} aria-hidden="true">
        <label htmlFor="cf-trap">Ne pas remplir</label>
        <input id="cf-trap" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" value={trap}
          onChange={(e) => setTrap(e.target.value)} />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <p style={{ fontSize: 13, color: "#94a3b8", maxWidth: 320 }}>
          Dispo pour missions data/IA & collaborations. Réponse en moins de 24h.
          {" "}Ces informations servent uniquement à te répondre, voir les{" "}
          <Link href="/mentions-legales#donnees" style={{ color: "var(--color-orange)", textDecoration: "underline" }}>mentions légales</Link>.
        </p>
        <button type="submit" className="contact-submit" disabled={sending}>
          <span className="contact-ring" />
          {sending ? "Envoi..." : "Envoyer"}
        </button>
      </div>

      {status === "error" && (
        <p role="alert" style={{ marginTop: "1rem", fontSize: 13, color: "#f87171" }}>
          {errorMsg || "Une erreur est survenue. Réessaie ou écris-moi directement par email."}
        </p>
      )}
    </form>
  );
}
