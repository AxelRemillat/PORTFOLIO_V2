"use client";

import { createContext, useContext } from "react";
import { DEMO_UI_FR, type DemoUi } from "./demo-ui";
import { DEMO_UI_EN } from "./demo-ui.en";
import type { DemoLocale } from "@/lib/demo-locale";

// Libellés des démos d'automatisation dans la langue de la page : fournis une
// fois par AutomationTabs, lus par chaque composant (français par défaut).
const DemoUiContext = createContext<DemoUi>(DEMO_UI_FR);

export const demoUi = (locale: DemoLocale): DemoUi => (locale === "en" ? DEMO_UI_EN : DEMO_UI_FR);
export const DemoUiProvider = DemoUiContext.Provider;
export const useDemoUi = () => useContext(DemoUiContext);
