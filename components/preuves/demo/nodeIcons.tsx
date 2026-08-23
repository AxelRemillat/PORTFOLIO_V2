import type { NodeIcon } from "./workflow-types";

// Icônes SVG intégrées (stroke = currentColor → suivent l'état du node/onglet).
// Partagées par NodePipeline et TabBar. Aucune dépendance.
const ICONS: Record<NodeIcon, React.ReactNode> = {
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  shield: <path d="M12 3l7 3v5c0 4.6-3.1 7.6-7 9-3.9-1.4-7-4.4-7-9V6l7-3z" />,
  ai: <path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4z" />,
  format: <><path d="M8 4c-2 0-2 2-2 4 0 1-1 2-2 2 1 0 2 1 2 2 0 2 0 4 2 4" /><path d="M16 4c2 0 2 2 2 4 0 1 1 2 2 2-1 0-2 1-2 2 0 2 0 4-2 4" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  doc: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  table: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M9 5v14" /></>,
  receipt: <><path d="M6 3h12v17l-3-1.8-3 1.8-3-1.8-3 1.8V3z" /><path d="M9 8h6M9 12h5" /></>,
  chat: <path d="M21 5H3v12h4v3l4-3h10z" />,
  wave: <><path d="M5 10v4" /><path d="M9 7v10" /><path d="M12 5v14" /><path d="M15 7v10" /><path d="M19 10v4" /></>,
};

export function Icon({ name }: { name: NodeIcon }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name]}
    </svg>
  );
}
