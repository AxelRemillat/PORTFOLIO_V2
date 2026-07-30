"use client";

import { useEffect, useRef, useState } from "react";
import TabBar from "./TabBar";
import WorkflowCanvas from "./WorkflowCanvas";
import { AUTOMATIONS } from "./automations-data";

// Orchestrateur des onglets : un seul WorkflowCanvas actif à la fois (key=id → son
// état se réinitialise au switch). Au changement d'onglet (TabBar ou rebond),
// scroll doux vers le haut du nouveau canvas — respecte prefers-reduced-motion.
export default function AutomationTabs() {
  const [active, setActive] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    const el = panelRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [active]);

  const cfg = AUTOMATIONS[active];
  const selectById = (id: string) => {
    const i = AUTOMATIONS.findIndex((a) => a.id === id);
    if (i >= 0) setActive(i);
  };
  const tabs = AUTOMATIONS.map((a) => ({ id: a.id, label: a.tabLabel, icon: a.tabIcon, accent: a.accent }));
  // 2 suggestions de rebond = les 2 automatisations suivantes (en boucle)
  const suggestions = [1, 2].map((k) => AUTOMATIONS[(active + k) % AUTOMATIONS.length])
    .map((a) => ({ id: a.id, label: a.tabLabel, icon: a.tabIcon }));

  return (
    <>
      <TabBar tabs={tabs} active={active} onSelect={setActive} />
      <div
        ref={panelRef} className="wc-panel" role="tabpanel"
        id={`panel-${cfg.id}`} aria-labelledby={`tab-${cfg.id}`}
      >
        <WorkflowCanvas key={cfg.id} config={cfg} suggestions={suggestions} onSelect={selectById} />
      </div>
    </>
  );
}
