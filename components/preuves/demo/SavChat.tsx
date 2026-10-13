"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import SavBubble from "./SavBubble";
import type { ChatMessage } from "./SavBubble";
import SavInput from "./SavInput";
import NodePipeline from "./NodePipeline";
import { SAV_CSS } from "./savCss";
import { runWorkflow } from "./workflow-types";
import type { WorkflowConfig } from "./workflow-types";
import type { SavData } from "./SavResult";
import MetierPicker from "@/components/demo-kit/MetierPicker";
import { getMetier, metiersFor, type MetierId } from "@/lib/metiers";
import { useDemoUi } from "./DemoUiContext";

const MIN_MS = 1200; // durée mini d'animation, lisible même si l'API répond vite
type PipePhase = "idle" | "running" | "done" | "error";

// Onglet SAV rendu en CHAT conversationnel. Le visiteur choisit un métier : la
// base de connaissance d'exemple suit (lib/metiers). Chaque message est traité
// indépendamment par /api/demo/sav ; changer de métier repart de zéro.
export default function SavChat({ config }: { config: WorkflowConfig }) {
  const ui = useDemoUi();
  const t = ui.sav;
  const metiers = metiersFor(ui.locale);
  const [metierId, setMetierId] = useState<MetierId>("menuiserie");
  const metier = getMetier(metierId, ui.locale) ?? metiers[0];
  const [messages, setMessages] = useState<ChatMessage[]>(() => [{ role: "assistant", text: t.welcome(metiers[0].entreprise) }]);
  const [sending, setSending] = useState(false);
  const [pipeIndex, setPipeIndex] = useState(-1);   // node actif du pipeline
  const [pipePhase, setPipePhase] = useState<PipePhase>("idle");
  const logRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const errors = { ...ui.errors, ...(config.errorMessages ?? {}) };
  const accentVars = { "--wc-accent": config.accent, "--wc-accent-weak": `${config.accent}1f` } as CSSProperties;

  const nodes = config.nodes;
  const lastProcess = Math.max(0, nodes.length - 2); // dernier node « de traitement » (avant Résultat)
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  // Auto-scroll vers le dernier message (effet DOM, sans setState → lint-safe).
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending]);
  // Nettoyage des timers au démontage (changement d'onglet).
  useEffect(() => () => clearTimers(), []);

  const pick = (id: MetierId) => {
    const m = getMetier(id, ui.locale);
    if (!m || sending) return;
    setMetierId(id);
    setMessages([{ role: "assistant", text: t.welcome(m.entreprise) }]);
  };

  const send = async (q: string) => {
    if (sending) return;
    clearTimers();
    setMessages((m) => [...m, { role: "user", text: q }]);
    setSending(true);

    // Pipeline animé en synchro avec le traitement (même mécanique que WorkflowCanvas).
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPipePhase("running");
    setPipeIndex(reduce ? lastProcess : 0);
    let minDelay: Promise<unknown> = Promise.resolve();
    if (!reduce) {
      const step = Math.max(220, MIN_MS / Math.max(1, lastProcess));
      for (let i = 1; i <= lastProcess; i++) timers.current.push(window.setTimeout(() => setPipeIndex(i), i * step));
      minDelay = new Promise((r) => { timers.current.push(window.setTimeout(r, MIN_MS)); });
    }

    const [res] = await Promise.all([runWorkflow(config.endpoint, config.inputField, q, "", { metier: metier.id }, ui.locale), minDelay]);
    clearTimers();

    if (res.ok && res.result != null) {
      const d = res.result as SavData;
      setMessages((m) => [...m, { role: "assistant", text: d.reponse || "—", data: d }]);
    } else {
      setMessages((m) => [...m, { role: "assistant", text: errors[res.error ?? "default"] ?? errors.default, error: true }]);
    }
    setSending(false);

    // Termine sur « Résultat » puis retour au repos.
    setPipeIndex(nodes.length - 1);
    setPipePhase("done");
    timers.current.push(window.setTimeout(() => { setPipePhase("idle"); setPipeIndex(-1); }, 700));
  };

  return (
    <div className="wc-card wc-chat" style={accentVars}>
      <style>{SAV_CSS}</style>
      <MetierPicker metiers={metiers} value={metier.id} onChange={pick} disabled={sending} label={t.pick} />
      <div className="wc-chat-ctx">
        <div>
          <p className="wc-chat-ctx-t">{t.ctx}<b>{metier.entreprise}</b>, {metier.activite.charAt(0).toLowerCase() + metier.activite.slice(1)}</p>
          <p className="wc-chat-ctx-s">{t.ctxNote}</p>
        </div>
        <span className="wc-chat-pill">{t.pill}</span>
      </div>

      <NodePipeline nodes={nodes} activeIndex={pipeIndex} phase={pipePhase} />

      <div
        className="wc-chat-log" ref={logRef} role="log" aria-live="polite"
        aria-label={t.logAria}
      >
        {messages.map((m, i) => <SavBubble key={i} msg={m} />)}
        {sending && (
          <div className="wc-chat-row is-bot">
            <span className="wc-chat-avatar" aria-hidden>🌿</span>
            <div className="wc-chat-bubble is-bot wc-chat-typing" role="status" aria-label={t.typing}>
              <span /><span /><span />
            </div>
          </div>
        )}
      </div>

      <div className="wc-chat-suggs">
        {metier.savExemples.map((s) => (
          <button key={s} type="button" className="wc-chat-sugg" disabled={sending} onClick={() => send(s)}>{s}</button>
        ))}
      </div>

      <SavInput onSend={send} disabled={sending} />
    </div>
  );
}
