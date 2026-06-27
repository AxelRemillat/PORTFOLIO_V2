import { useSyncExternalStore } from "react";
import { gameAudio } from "../audio/GameAudioEngine";

export type QuestId =
  // Missions principales
  | "visit_rag" | "visit_rise" | "visit_seaco" | "visit_n8n" | "visit_music"
  // Missions secrètes
  | "talk_fox" | "talk_sheep" | "touch_rose" | "touch_baobab" | "watch_shooting_star" | "touch_volcano";

export interface Quest {
  id: QuestId;
  type: "main" | "secret";
  label: string;        // affiché quand découverte
  hint: string;         // affiché si secret + pas encore découverte
  completed: boolean;
  discovered: boolean;  // secrets : false jusqu'au 1er trigger
  icon: string;         // emoji
  completedAt?: number;
}

const QUESTS_DEF: Quest[] = [
  { id: "visit_rag",   type: "main",   icon: "🟠", label: "Visiter le CV Interactif RAG",    hint: "", completed: false, discovered: true },
  { id: "visit_rise",  type: "main",   icon: "⚪", label: "Visiter RISE",                     hint: "", completed: false, discovered: true },
  { id: "visit_seaco", type: "main",   icon: "🔵", label: "Visiter SEACO Pipeline",           hint: "", completed: false, discovered: true },
  { id: "visit_n8n",   type: "main",   icon: "🟣", label: "Visiter les Automatisations N8N",  hint: "", completed: false, discovered: true },
  { id: "visit_music", type: "main",   icon: "🟡", label: "Visiter la Planète qui Chante",    hint: "", completed: false, discovered: true },
  { id: "talk_fox",    type: "secret", icon: "🦊", label: "Se faire embobiner par un renard",          hint: "Un influenceur en fourrure attend d'être apprivoisé...", completed: false, discovered: false },
  { id: "talk_sheep",  type: "secret", icon: "🐑", label: "Satisfaire les caprices d'un mouton",       hint: "Un quadrupède exigeant réclame un portrait...", completed: false, discovered: false },
  { id: "touch_rose",  type: "secret", icon: "🌹", label: "Valider l'ego d'une rose capricieuse",      hint: "Une fleur narcissique attend votre attention...", completed: false, discovered: false },
  { id: "touch_baobab", type: "secret", icon: "🌳", label: "Écouter un arbre se raconter",             hint: "Un arbre centenaire a visiblement besoin de parler...", completed: false, discovered: false },
  { id: "watch_shooting_star", type: "secret", icon: "✨", label: "Gâcher un vœu sur une étoile filante", hint: "L'univers est en attente de tes doléances...", completed: false, discovered: false },
  { id: "touch_volcano", type: "secret", icon: "🌋", label: "Faire un câlin au volcan", hint: "Une montagne avec des reflux gastriques t'attend quelque part...", completed: false, discovered: false },
];

const KEY = "pp_quests";
type Persisted = Record<string, { completed: boolean; discovered: boolean; completedAt?: number }>;

function load(): Quest[] {
  const base = QUESTS_DEF.map((q) => ({ ...q }));
  if (typeof window === "undefined") return base;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return base;
    const data: Persisted = JSON.parse(raw);
    return base.map((q) => {
      const p = data[q.id];
      return p
        ? { ...q, completed: p.completed, discovered: q.discovered || p.discovered, completedAt: p.completedAt }
        : q;
    });
  } catch {
    return base;
  }
}

interface Snapshot {
  quests: Quest[];
  lastCompleted: QuestId | null;
  guidedPortalId: string | null;
  progress: { main: number; total: number; secret: number; secretTotal: number };
}

let quests = load();
let lastCompleted: QuestId | null = null;
let guidedPortalId: string | null = null; // quête principale actuellement guidée (lucioles)
let resetTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

function buildFrom(qs: Quest[], last: QuestId | null, guided: string | null): Snapshot {
  const main = qs.filter((q) => q.type === "main");
  const secret = qs.filter((q) => q.type === "secret");
  return {
    quests: qs,
    lastCompleted: last,
    guidedPortalId: guided,
    progress: {
      main: main.filter((q) => q.completed).length,
      total: main.length,
      secret: secret.filter((q) => q.completed).length,
      secretTotal: secret.length,
    },
  };
}

function build(): Snapshot {
  return buildFrom(quests, lastCompleted, guidedPortalId);
}

let snapshot = build();

// IMPORTANT : getServerSnapshot doit refléter ce que le SERVEUR rend (état par
// défaut, sans localStorage). On le bâtit depuis QUESTS_DEF — sinon, sur le client,
// le module charge déjà localStorage et l'hydratation casserait (texte 1 vs 0).
const SERVER_SNAPSHOT = buildFrom(QUESTS_DEF.map((q) => ({ ...q })), null, null);

function commit() {
  snapshot = build();
  listeners.forEach((l) => l());
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    const data: Persisted = {};
    quests.forEach((q) => { data[q.id] = { completed: q.completed, discovered: q.discovered, completedAt: q.completedAt }; });
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* localStorage indisponible */
  }
}

/** Révèle un secret (remplace "???" par son label) sans le compléter. */
export function discoverQuest(id: QuestId) {
  const q = quests.find((x) => x.id === id);
  if (!q || q.discovered) return;
  quests = quests.map((x) => (x.id === id ? { ...x, discovered: true } : x));
  persist();
  commit();
}

/** Complète une quête (idempotent) + déclenche le toast pendant 3s. */
export function completeQuest(id: QuestId) {
  const q = quests.find((x) => x.id === id);
  if (!q || q.completed) return;
  quests = quests.map((x) =>
    x.id === id ? { ...x, completed: true, discovered: true, completedAt: Date.now() } : x,
  );
  lastCompleted = id;
  if (guidedPortalId === id) guidedPortalId = null; // la quête guidée vient d'être finie
  gameAudio.playQuestComplete(); // fanfare de quête accomplie
  if (resetTimer) clearTimeout(resetTimer);
  resetTimer = setTimeout(() => { lastCompleted = null; resetTimer = null; commit(); }, 3000);
  persist();
  commit();
}

/** Active/désactive le guidage par lucioles vers une quête principale. */
export function toggleGuide(portalId: string) {
  guidedPortalId = guidedPortalId === portalId ? null : portalId;
  commit();
}

/** Réinitialise toutes les quêtes à leur état de départ + efface le localStorage. */
export function resetQuests() {
  quests = QUESTS_DEF.map((q) => ({ ...q }));
  lastCompleted = null;
  guidedPortalId = null;
  if (resetTimer) { clearTimeout(resetTimer); resetTimer = null; }
  if (typeof window !== "undefined") {
    try { window.localStorage.removeItem(KEY); } catch { /* localStorage indisponible */ }
  }
  commit();
}

export function useQuestSystem() {
  const snap = useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => snapshot,
    () => SERVER_SNAPSHOT,
  );
  return { ...snap, completeQuest, discoverQuest, toggleGuide };
}
