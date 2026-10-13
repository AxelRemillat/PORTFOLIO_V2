"use client";

import { createContext, useContext } from "react";
import { AGENT_UI_FR, type AgentUi } from "./agent-ui";
import { AGENT_UI_EN } from "./agent-ui.en";
import type { DemoLocale } from "@/lib/demo-locale";

// Libellés de la démo agent dans la langue de la page : fournis une fois par
// AgentDemo, lus par chaque composant (français par défaut).
const AgentUiContext = createContext<AgentUi>(AGENT_UI_FR);

export const agentUi = (locale: DemoLocale): AgentUi => (locale === "en" ? AGENT_UI_EN : AGENT_UI_FR);
export const AgentUiProvider = AgentUiContext.Provider;
export const useAgentUi = () => useContext(AgentUiContext);
