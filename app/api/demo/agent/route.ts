import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { checkRateLimit } from "@/lib/demo-rate-limit";
import { TOOL_FNS, TOOL_SCHEMAS } from "@/lib/agent/tools";

export const runtime = "nodejs";

const MAX_LEN = 1500;
const MAX_ITER = 8;
const err = (status: number, error: string) => NextResponse.json({ ok: false, error }, { status });

const SYSTEM = `Tu es OSCAR, l'agent commercial de Mobibureau, fournisseur B2B de mobilier et équipement de bureau.
Tu traites une demande client entrante DE BOUT EN BOUT avec tes outils.
Devis : comprends le besoin → rechercher_produits → verifier_stock → verifier_livraison → calculer_devis → finaliser (email + 2 creneaux).
Question générale (garantie, SAV, paiement, livraison, délais, horaires) : infos_entreprise → finaliser (PAS de devis).
Règles STRICTES :
- Tu dois TOUJOURS rédiger un email client personnalisé dans finaliser (champ email), quel que soit le cas : devis complet, demande partiellement satisfaite, livraison impossible, ou question générale. Jamais d'email vide.
- N'invente JAMAIS un prix, un stock, un délai, une réf, une politique : ces valeurs viennent EXCLUSIVEMENT des outils.
- Ne pose pas de question de clarification : fais des hypothèses raisonnables (produits adaptés, quantité par défaut) et va au bout, puis termine OBLIGATOIREMENT par finaliser.
- Budget « serré » → propose l'option la plus économique et explique-le. Ville hors couverture / stock insuffisant → faisable=false (ou partiel) : calcule ce qui est possible et explique l'alternative dans "note".
- Reste concis et pro. Une phrase de raisonnement avant chaque appel d'outil. L'email est cordial et reflète le devis calculé.`;

const META: Record<string, { icon: string; label: string; arg: (a: Record<string, unknown>) => string }> = {
  rechercher_produits: { icon: "🔎", label: "Recherche produits", arg: (a) => `« ${a.requete ?? ""} »` },
  verifier_stock: { icon: "📦", label: "Vérification du stock", arg: (a) => `${a.quantite ?? "?"} × ${a.ref ?? ""}` },
  verifier_livraison: { icon: "🚚", label: "Zone de livraison", arg: (a) => `${a.ville ?? "—"}` },
  calculer_devis: { icon: "🧮", label: "Calcul du devis", arg: (a) => `${(a.lignes as unknown[])?.length ?? 0} ligne(s)${a.ville ? ` · ${a.ville}` : ""}` },
  infos_entreprise: { icon: "ℹ️", label: "Infos entreprise", arg: (a) => `${a.sujet ?? ""}` },
  finaliser: { icon: "🏁", label: "Rédaction du livrable", arg: () => "" },
};

function summarize(name: string, res: Record<string, unknown>): string {
  if (name === "rechercher_produits") return `${(res.produits as unknown[])?.length ?? 0} produit(s) trouvé(s)`;
  if (name === "verifier_stock") return res.disponible ? `Stock OK : ${res.stock} dispo` : `Stock insuffisant (${res.stock})`;
  if (name === "verifier_livraison") return res.livrable ? `Livrable · ${res.delai_jours} j · ${res.frais}€` : "Hors couverture";
  if (name === "calculer_devis") return `${res.total_ttc}€ TTC · délai ${res.delai_livraison} j`;
  if (name === "infos_entreprise") return "Politique récupérée";
  return "ok";
}

type Trace = { type: string; icon?: string; title: string; detail?: string; args?: string; result?: string; fn?: string; rawArgs?: unknown; rawResult?: unknown };
type Livrable = { faisable?: boolean; email?: string; reponse?: string; note?: string; creneaux?: { jour: string; heure: string }[] };

export async function POST(req: NextRequest) {
  if (process.env.DEMO_AGENT_ENABLED !== "true") return err(503, "demo_disabled");
  if (!process.env.OPENAI_API_KEY) return err(502, "upstream_error");
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (!(req.headers.get("content-type") ?? "").includes("application/json")) return err(400, "invalid_input");
  let body: { demande?: unknown; hp?: unknown };
  try { body = await req.json(); } catch { return err(400, "invalid_input"); }
  if (typeof body.hp === "string" && body.hp.trim() !== "") return err(400, "invalid_input");
  const demande = body.demande;
  if (typeof demande !== "string" || demande.trim() === "" || demande.length > MAX_LEN) return err(400, "invalid_input");
  { const rl = await checkRateLimit(ip, "agent"); if (!rl.ok) return err(429, rl.scope === "global" ? "demo_busy" : "rate_limited"); }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 40_000);

  const trace: Trace[] = [];
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM },
    { role: "user", content: demande },
  ];
  let lastDevis: Record<string, unknown> | null = null;
  let livrable: Livrable | null = null;

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const opts = { model, temperature: 0.3, max_tokens: 700, tools: TOOL_SCHEMAS as unknown as OpenAI.Chat.ChatCompletionTool[] };

  try {
    for (let i = 0; i < MAX_ITER && !livrable; i++) {
      const completion = await openai.chat.completions.create({ ...opts, messages, tool_choice: "auto" }, { signal: controller.signal });
      const msg = completion.choices[0]?.message;
      if (!msg) break;
      if (msg.content) trace.push({ type: "reflexion", icon: "💭", title: "Réflexion", detail: msg.content });
      messages.push(msg);

      const calls = msg.tool_calls ?? [];
      if (calls.length === 0) break;

      for (const call of calls) {
        if (call.type !== "function") continue;
        const name = call.function.name;
        let args: Record<string, unknown> = {};
        try { args = JSON.parse(call.function.arguments || "{}"); } catch { /* args invalides */ }
        const meta = META[name] ?? { icon: "⚙", label: name, arg: () => "" };

        if (name === "finaliser") {
          livrable = args as Livrable;
          trace.push({ type: "final", icon: "🏁", title: "Livrable prêt", detail: "Devis, email et créneaux générés.", fn: "finaliser", rawArgs: args });
          messages.push({ role: "tool", tool_call_id: call.id, content: "ok" });
          continue;
        }
        const item: Trace = { type: "outil", icon: meta.icon, title: meta.label, args: meta.arg(args), fn: name, rawArgs: args };
        trace.push(item);
        const fn = TOOL_FNS[name];
        const result = fn ? (fn(args) as Record<string, unknown>) : { erreur: "outil inconnu" };
        if (name === "calculer_devis") lastDevis = result;
        item.result = summarize(name, result);
        item.rawResult = result;
        messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(result) });
      }
    }
    // Fallback : force finaliser si l'agent n'a pas produit de livrable.
    if (!livrable) {
      messages.push({ role: "user", content: "Termine maintenant : appelle finaliser (faisable, et selon le cas email+creneaux pour un devis, ou reponse pour une question générale)." });
      const forced = await openai.chat.completions.create({ ...opts, messages, tool_choice: { type: "function", function: { name: "finaliser" } } }, { signal: controller.signal });
      const fc = forced.choices[0]?.message?.tool_calls?.[0];
      if (fc?.type === "function") {
        let fargs: Record<string, unknown> = {};
        try { fargs = JSON.parse(fc.function.arguments || "{}"); } catch { /* args invalides */ }
        livrable = fargs as Livrable;
        trace.push({ type: "final", icon: "🏁", title: "Livrable prêt", detail: "Généré.", fn: "finaliser", rawArgs: fargs });
      }
    }
  } catch {
    clearTimeout(timer);
    return err(502, "upstream_error");
  }
  clearTimeout(timer);

  const devis = lastDevis
    ? { lignes: lastDevis.lignes, sous_total_ht: lastDevis.sous_total_ht, remise: lastDevis.remise, tva_montant: lastDevis.tva_montant, total_ttc: lastDevis.total_ttc, frais_livraison: lastDevis.frais_livraison, franco: lastDevis.franco, delai_livraison: lastDevis.delai_livraison }
    : null;

  // Filet de sécurité : un email client est TOUJOURS présent.
  const emailFinal = (livrable?.email || livrable?.reponse || "").trim()
    || "Bonjour,\n\nMerci pour votre demande. Un conseiller Mobibureau revient vers vous très rapidement pour la finaliser.\n\nCordialement,\nOSCAR — Mobibureau";

  return NextResponse.json({
    ok: true,
    trace,
    result: {
      faisable: livrable?.faisable ?? false,
      devis,
      email: emailFinal,
      reponse: livrable?.reponse ?? "",
      creneaux: livrable?.creneaux ?? [],
      note: livrable?.note ?? "",
    },
  });
}
