import type { ToolMeta } from "./tools-meta";

// English twin of tools-meta.ts: what each agent step does, in plain words, plus
// a pseudo-code excerpt. Read by TraceStep. No business logic here.
export const TOOL_META: Record<string, ToolMeta> = {
  rechercher_articles: {
    description: "Searches the selected trade's catalog (name, category, description) and returns the 8 closest items, with price excl. VAT, unit and lead time.",
    pseudo: [
      "const words = normalize(query).split(/\\W+/)",
      "return CATALOG",
      "  .map(a => ({ a, score: words.filter(w => text(a).includes(w)).length }))",
      "  .filter(x => x.score > 0).sort(byScore).slice(0, 8)",
    ],
  },
  verifier_livraison: {
    description: "Checks the area: standard fees, free-delivery threshold and lead time, or a question for the customer if the destination is outside the usual area.",
    pseudo: [
      "if (outsideArea(city)) return { to_confirm: true, question }",
      "return { fees, free_above, lead_time_days }",
    ],
  },
  calculer_devis: {
    description: "Prices each line (price × quantity), applies the discount, fees and VAT by rate, and lists what still needs pricing with the questions to ask.",
    pseudo: [
      "const subtotal = sum(lines.map(l => price(l.ref) * l.quantity))",
      "const discount = tier(subtotal)",
      "const vat = sum(byRate(bases).map(b => b.base * b.rate))",
      "return { lines, to_price, total_excl_vat, vat, total_incl_vat, questions }",
    ],
  },
  infos_entreprise: {
    description: "Reads the company policy (warranty, payment, lead times, VAT…) and returns the answer for the topic.",
    pseudo: ["const key = findTopic(topic)", "return POLICY[key]"],
  },
  finaliser: {
    description: "Assembles the deliverable: customer email, questions to ask, call slots. The priced quote is reattached on the server (never rewritten by the AI).",
    pseudo: ["return { complete, email, questions, call_slots }", "// quote = last calculer_devis (source of truth)"],
  },
};
