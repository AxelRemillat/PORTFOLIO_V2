"use client";

import type { SavData } from "./SavResult";

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  data?: SavData;      // assistant : contrat RAG (sources/extraits/trouve)
  error?: boolean;     // assistant : bulle d'erreur (pas de pied d'ancrage)
}

const clamp = (n: number) => Math.max(0, Math.min(100, n));
const confClass = (n: number) => (n >= 80 ? "is-hi" : n >= 60 ? "is-mid" : "is-lo");

// Une bulle du fil : user à droite ; assistant à gauche (avatar cyan) avec un pied
// compact : score de confiance coloré, puis badge « hors périmètre » (si hors_sujet)
// ou chips des sources, et enfin les extraits consultés repliables.
export default function SavBubble({ msg }: { msg: ChatMessage }) {
  if (msg.role === "user") {
    return (
      <div className="wc-chat-row is-user">
        <div className="wc-chat-bubble is-user">{msg.text}</div>
      </div>
    );
  }

  const d = msg.data;
  const sources = d?.sources ?? [];
  const extraits = d?.extraits ?? [];
  const hs = d?.hors_sujet === true;
  const conf = typeof d?.confiance === "number" ? d.confiance : null;

  return (
    <div className="wc-chat-row is-bot">
      <span className="wc-chat-avatar" aria-hidden>🌿</span>
      <div className={`wc-chat-bubble is-bot${msg.error ? " is-err" : ""}`}>
        <div className="wc-chat-text">{msg.text}</div>
        {d && !msg.error && (
          <div className="wc-chat-foot">
            {conf != null && (
              <div className={`wc-conf ${confClass(conf)}`} role="img" aria-label={`Score de confiance ${conf}%`}>
                <span className="wc-conf-lbl">Confiance {conf}%</span>
                <span className="wc-conf-bar"><span className="wc-conf-fill" style={{ width: `${clamp(conf)}%` }} /></span>
              </div>
            )}
            {hs ? (
              <span className="wc-chat-badge is-warn">⚠ hors périmètre — recentrage / transfert conseiller</span>
            ) : sources.length > 0 && (
              <div className="wc-chat-src">
                <span className="wc-chat-srclbl">Sources</span>
                {sources.map((s, i) => (
                  <span key={`${s.id ?? i}`} className="wc-sav-chip" title={s.question ?? undefined}>
                    <code>{String(s.id ?? "?")}</code>
                  </span>
                ))}
              </div>
            )}
            {!hs && extraits.length > 0 && (
              <details className="wc-sav-extraits wc-chat-extraits">
                <summary>extraits consultés ({extraits.length})</summary>
                <ul>
                  {extraits.map((e, i) => (
                    <li key={`${e.id ?? i}`}>
                      <span className="wc-sav-ex-id">{String(e.id ?? "?")}</span>
                      <span>{e.question ?? ""}</span>
                      {e.score != null && e.score !== "" && <span className="wc-sav-ex-score">score {String(e.score)}</span>}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
