import type { Metier } from "@/lib/metiers";
import { AGENT_TEXT_FR, type AgentText } from "./text";

// Schémas OpenAI (function-calling) et prompt système, paramétrés par le métier.
// `finaliser` clôt la boucle ; le devis chiffré est réattaché côté serveur.
const fn = (name: string, description: string, properties: Record<string, unknown>, required: string[]) =>
  ({ type: "function", function: { name, description, parameters: { type: "object", properties, required } } }) as const;

const ligne = { type: "object", properties: { ref: { type: "string" }, quantite: { type: "number" } }, required: ["ref", "quantite"] };
const hors = { type: "object", properties: { designation: { type: "string" }, quantite: { type: "number" }, unite: { type: "string" } }, required: ["designation"] };

export function toolSchemas(m: Metier, t: AgentText = AGENT_TEXT_FR) {
  const f = t.tools.finishArgs;
  return [
    fn("rechercher_articles", t.tools.search(m.entreprise), { requete: { type: "string", description: t.tools.searchArg } }, ["requete"]),
    fn("verifier_livraison", t.tools.zone, { ville: { type: "string" } }, ["ville"]),
    fn("calculer_devis", t.tools.quote, { lignes: { type: "array", items: ligne }, hors_catalogue: { type: "array", items: hors }, ville: { type: "string" } }, ["lignes"]),
    fn("infos_entreprise", t.tools.policy, { sujet: { type: "string" } }, ["sujet"]),
    fn("finaliser", t.tools.finish, {
      complet: { type: "boolean", description: f.complet },
      email: { type: "string", description: f.email },
      questions: { type: "array", items: { type: "string" }, description: f.questions },
      reponse: { type: "string", description: f.reponse },
      creneaux: { type: "array", description: f.creneaux, items: { type: "object", properties: { jour: { type: "string" }, heure: { type: "string" } }, required: ["jour", "heure"] } },
      note: { type: "string", description: f.note },
    }, ["complet", "email"]),
  ];
}

export function systemPrompt(m: Metier, t: AgentText = AGENT_TEXT_FR) {
  return t.systemPrompt(m);
}
