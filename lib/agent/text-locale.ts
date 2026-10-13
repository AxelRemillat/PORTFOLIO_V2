import type { DemoLocale } from "@/lib/demo-locale";
import { AGENT_TEXT_FR, type AgentText } from "./text";
import { AGENT_TEXT_EN } from "./text.en";

// Textes de l'agent devis dans la langue de la demande.
export const agentText = (locale: DemoLocale): AgentText => (locale === "en" ? AGENT_TEXT_EN : AGENT_TEXT_FR);
