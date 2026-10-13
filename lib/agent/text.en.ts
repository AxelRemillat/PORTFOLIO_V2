import type { AgentText } from "./text";

// English texts of the quote agent: same type as text.ts. Amounts are written
// "€1,750" (never "1750 €"); prices and lead times always come from the tools.
const eur = (n: unknown) => `€${Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

export const AGENT_TEXT_EN: AgentText = {
  systemPrompt: (m) => `You are OSCAR, the quote agent of ${m.entreprise} (${m.label} — ${m.activite}).
You handle an incoming customer request END TO END with your tools. Write in English, warm and professional.
Quote: understand the need → rechercher_articles (one search per need, English keywords) → verifier_livraison if a city is given → calculer_devis → finaliser (email + 2 call slots + questions).
General question: infos_entreprise → finaliser (no quote).
STRICT rules:
- NEVER invent a price, lead time, reference or policy: they come ONLY from the tools.
- NEVER answer "not possible". Anything not in the catalog goes into hors_catalogue (a "to be priced" line) and becomes a question for the customer. Price everything you can: a partial quote beats a refusal.
- Missing quantity or size: make a reasonable assumption, price it, and ask a question to confirm.
- Tight budget: pick the most affordable option and say so.
- ALWAYS end with finaliser and a friendly email that restates the total (format amounts like €1,750) and the questions. Write one sentence of reasoning before each tool call.`,
  finishNudge: "Finish now: call finaliser with the customer email and the questions.",
  fallbackEmail: (e) => `Hello,\n\nThank you for your request. A member of the ${e} team will get back to you shortly to finalize it.\n\nBest regards,\nOSCAR — ${e}`,
  trace: { reflexion: "Reasoning", ready: "Deliverable ready", readyDetail: "Quote, email and questions generated.", readyShort: "Generated.", unknownTool: "unknown tool" },
  meta: {
    rechercher_articles: { icon: "🔎", label: "Catalog search", arg: (a) => `“${a.requete ?? ""}”` },
    verifier_livraison: { icon: "🚚", label: "Delivery area", arg: (a) => `${a.ville ?? "—"}` },
    calculer_devis: { icon: "🧮", label: "Quote calculation", arg: (a) => `${(a.lignes as unknown[])?.length ?? 0} line(s)${(a.hors_catalogue as unknown[])?.length ? ` + ${(a.hors_catalogue as unknown[]).length} to be priced` : ""}` },
    infos_entreprise: { icon: "ℹ️", label: "Company info", arg: (a) => `${a.sujet ?? ""}` },
  },
  summary: {
    found: (n) => `${n} item(s) found`,
    toConfirm: "To confirm with the customer",
    zone: (j, f) => `${j} days · ${eur(f)} excl. VAT`,
    total: (ttc, partial) => `${eur(ttc)} incl. VAT${partial ? " · partial quote" : ""}`,
    policy: "Policy retrieved",
  },
  tools: {
    search: (e) => `Searches the ${e} catalog by keywords. Returns references, units, prices excl. VAT and lead times.`,
    searchArg: "Keywords, e.g. 'PVC window 100' or 'savory platter'",
    zone: "Checks the area (delivery or on-site work): fees, lead time, or a question to ask if outside the usual area.",
    quote: "Calculates the quote: catalog lines (ref + quantity) + off-catalog lines \"to be priced\". Discounts, VAT, delivery, lead time and questions for the customer.",
    policy: "Company policy: warranty, payment, lead times, VAT, delivery, etc.",
    finish: "Closes the request. Call it once, last. The customer email is ALWAYS required.",
    finishArgs: {
      complet: "true if everything is priced, false for a partial quote (lines to be priced or missing info)",
      email: "Personalized customer email, ready to send, restating the quote and the questions.",
      questions: "Questions to ask the customer to complete the quote (0 to 4).",
      reponse: "Short answer to a general question (optional).",
      creneaux: "2 suggested call slots",
      note: "What remains to be confirmed, or empty.",
    },
  },
  questions: {
    noMatch: "Nothing equivalent in the catalog: add the line to hors_catalogue in calculer_devis (it will be \"to be priced\") and ask the customer a question.",
    address: "What address should we deliver to or work at?",
    outOfZone: (v) => `${v} is outside our usual area: would you accept special transport (fees and lead time to be confirmed)?`,
    offCatalogue: (d) => `“${d}” is not in our standard catalog: could you share the dimensions, quantity and finish so we can price it?`,
    minimum: (n) => `Our minimum order is ${eur(n)} excl. VAT: would you like to add to your order?`,
    unknownItem: (ref) => `Item ${ref}`,
    unitTbd: "to be confirmed",
  },
  stopWords: ["for", "with", "the", "and", "you", "your", "can", "could", "would", "please", "hello", "thanks", "thank", "quote", "need", "want", "our", "are", "this", "that", "from", "into", "about"],
  outOfZone: ["corsica", "ajaccio", "bastia", "porto-vecchio", "guadeloupe", "martinique", "french guiana", "cayenne", "reunion", "mayotte", "belgium", "switzerland", "luxembourg"],
};
