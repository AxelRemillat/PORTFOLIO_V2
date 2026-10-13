"use client";

import { createContext, createElement, useContext, type ReactNode } from "react";
import { defaultLocale, type Locale } from "./config";
import { getMessages, type Messages } from "@/messages";

/**
 * Langue côté CLIENT. Le layout `app/[lang]` pose `<LocaleProvider locale=…>`
 * une fois pour tout l'arbre ; n'importe quel composant client lit ensuite :
 *
 *   const locale = useLocale();          // "fr" | "en"
 *   const t = useMessages();             // textes d'interface typés
 *
 * Hors fournisseur (cas qui ne devrait pas arriver), c'est le français.
 */

const LocaleContext = createContext<Locale>(defaultLocale);

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return createElement(LocaleContext.Provider, { value: locale }, children);
}

export const useLocale = (): Locale => useContext(LocaleContext);

export const useMessages = (): Messages => getMessages(useLocale());
