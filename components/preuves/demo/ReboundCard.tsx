"use client";

import { Icon } from "./nodeIcons";
import type { NodeIcon } from "./workflow-types";

export interface Suggestion {
  id: string;
  label: string;
  icon: NodeIcon;
}

// Carte de rebond : apparaît (slide/fade doux via CSS) sous le résultat une fois le
// workflow terminé, pour proposer d'autres automatisations. Jamais un modal bloquant.
export default function ReboundCard({
  suggestions, onSelect,
}: { suggestions: Suggestion[]; onSelect?: (id: string) => void }) {
  return (
    <div className="wc-rebound" role="note">
      <p className="wc-rebound-t">✅ Workflow terminé — envie d&apos;en voir un autre&nbsp;?</p>
      <div className="wc-rebound-btns">
        {suggestions.map((s) => (
          <button key={s.id} type="button" className="wc-rebound-btn" onClick={() => onSelect?.(s.id)}>
            <Icon name={s.icon} />
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
