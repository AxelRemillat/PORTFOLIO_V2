"use client";
import { useCallback, useEffect, useState } from "react";

export interface Msg { role: "user" | "assistant"; content: string; }
export interface Conversation {
  id: string; title: string; createdAt: number; updatedAt: number; messages: Msg[];
}

// ── Schéma localStorage (réglable) ─────────────────────────────────────────
const STORAGE_KEY = "vega_chat_history_v1"; // clé dédiée, versionnée
const SCHEMA_V = 1;
const MAX_CONVERSATIONS = 50;               // garde-fou taille de stockage
// ──────────────────────────────────────────────────────────────────────────

// Lecture défensive : JSON corrompu / mauvaise version → repart à vide.
function load(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!data || data.v !== SCHEMA_V || !Array.isArray(data.conversations)) return [];
    return data.conversations.filter(
      (c: unknown): c is Conversation =>
        !!c && typeof (c as Conversation).id === "string" && Array.isArray((c as Conversation).messages),
    );
  } catch { return []; }
}
function persist(conversations: Conversation[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: SCHEMA_V, conversations })); } catch {}
}

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const titleFrom = (messages: Msg[]) => {
  const first = messages.find(m => m.role === "user")?.content ?? "Conversation";
  return first.length > 44 ? first.slice(0, 44) + "…" : first;
};

export function useConversationHistory() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => { setConversations(load()); }, []);
  useEffect(() => { persist(conversations); }, [conversations]);

  // Upsert de la conversation active à partir des tours courants.
  const recordActive = useCallback((messages: Msg[]) => {
    if (!messages.some(m => m.role === "user")) return;
    setConversations(prev => {
      const now = Date.now();
      const idx = activeId ? prev.findIndex(c => c.id === activeId) : -1;
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], messages, updatedAt: now };
        return next;
      }
      const id = uid();
      setActiveId(id); // nouvelle conversation → devient active
      return [{ id, title: titleFrom(messages), createdAt: now, updatedAt: now, messages }, ...prev]
        .slice(0, MAX_CONVERSATIONS);
    });
  }, [activeId]);

  const newConversation = useCallback(() => setActiveId(null), []);
  const remove = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    setActiveId(cur => (cur === id ? null : cur));
  }, []);

  return { conversations, activeId, setActiveId, recordActive, newConversation, remove };
}
