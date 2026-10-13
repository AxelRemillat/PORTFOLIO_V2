import type OpenAI from "openai";
import type { Metier } from "@/lib/metiers";
import { createToolFns, type DevisCalcule } from "./tools";
import { toolSchemas, systemPrompt } from "./schemas";
import { AGENT_TEXT_FR, type AgentText } from "./text";

// Boucle de l'agent devis (raisonnement + outils), indépendante d'OpenAI : le
// client LLM est injecté (vrai client dans la route, script dans les tests).
type Msg = OpenAI.Chat.ChatCompletionMessageParam;
type Reply = OpenAI.Chat.ChatCompletionMessage;
export type Llm = (messages: Msg[], tools: unknown[], force?: string) => Promise<Reply | undefined>;

export type Trace = { type: string; icon?: string; title: string; detail?: string; args?: string; result?: string; fn?: string; rawArgs?: unknown; rawResult?: unknown };
type Livrable = { complet?: boolean; email?: string; reponse?: string; note?: string; questions?: string[]; creneaux?: { jour: string; heure: string }[] };

const MAX_ITER = 8;
function summarize(t: AgentText, name: string, res: Record<string, unknown>): string {
  if (name === "rechercher_articles") return t.summary.found((res.articles as unknown[])?.length ?? 0);
  if (name === "verifier_livraison") return res.a_confirmer ? t.summary.toConfirm : t.summary.zone(res.delai_jours, res.frais);
  if (name === "calculer_devis") return t.summary.total(res.total_ttc, Boolean((res.a_chiffrer as unknown[])?.length));
  if (name === "infos_entreprise") return t.summary.policy;
  return "ok";
}

const parse = (s?: string) => { try { return JSON.parse(s || "{}") as Record<string, unknown>; } catch { return {}; } };

export async function runAgent(m: Metier, demande: string, llm: Llm, t: AgentText = AGENT_TEXT_FR) {
  const fns = createToolFns(m, t);
  const tools = toolSchemas(m, t);
  const trace: Trace[] = [];
  const messages: Msg[] = [{ role: "system", content: systemPrompt(m, t) }, { role: "user", content: demande }];
  let devis: DevisCalcule | null = null;
  let livrable: Livrable | null = null;

  for (let i = 0; i < MAX_ITER && !livrable; i++) {
    const msg = await llm(messages, tools);
    if (!msg) break;
    if (msg.content) trace.push({ type: "reflexion", icon: "💭", title: t.trace.reflexion, detail: msg.content });
    messages.push(msg);
    const calls = (msg.tool_calls ?? []).filter((c) => c.type === "function");
    if (calls.length === 0) break;
    for (const call of calls) {
      const name = call.function.name;
      const args = parse(call.function.arguments);
      if (name === "finaliser") {
        livrable = args as Livrable;
        trace.push({ type: "final", icon: "🏁", title: t.trace.ready, detail: t.trace.readyDetail, fn: name, rawArgs: args });
        messages.push({ role: "tool", tool_call_id: call.id, content: "ok" });
        continue;
      }
      const meta = t.meta[name] ?? { icon: "⚙", label: name, arg: () => "" };
      const result = (fns[name]?.(args) ?? { erreur: t.trace.unknownTool }) as Record<string, unknown>;
      if (name === "calculer_devis") devis = result as unknown as DevisCalcule;
      trace.push({ type: "outil", icon: meta.icon, title: meta.label, args: meta.arg(args), fn: name, rawArgs: args, result: summarize(t, name, result), rawResult: result });
      messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(result) });
    }
  }
  if (!livrable) {
    messages.push({ role: "user", content: t.finishNudge });
    const fc = (await llm(messages, tools, "finaliser"))?.tool_calls?.[0];
    if (fc?.type === "function") {
      livrable = parse(fc.function.arguments) as Livrable;
      trace.push({ type: "final", icon: "🏁", title: t.trace.ready, detail: t.trace.readyShort, fn: "finaliser", rawArgs: livrable });
    }
  }
  return { trace, result: assemble(m, devis, livrable, t) };
}

// Le devis vient du dernier calcul serveur ; les questions = outils + agent, dédoublonnées.
function assemble(m: Metier, devis: DevisCalcule | null, l: Livrable | null, t: AgentText) {
  const qs = [...(devis?.questions ?? []), ...(Array.isArray(l?.questions) ? l.questions : [])].map((q) => String(q).trim()).filter(Boolean);
  const questions = [...new Set(qs)].slice(0, 5);
  const email = (l?.email || l?.reponse || "").trim()
    || t.fallbackEmail(m.entreprise);
  return {
    complet: Boolean(devis?.complet) && questions.length === 0 && l?.complet !== false,
    devis: devis && devis.lignes.length + devis.a_chiffrer.length > 0 ? devis : null,
    email, reponse: l?.reponse ?? "", questions, creneaux: Array.isArray(l?.creneaux) ? l.creneaux : [], note: l?.note ?? "",
  };
}

export type AgentOutput = Awaited<ReturnType<typeof runAgent>>;
