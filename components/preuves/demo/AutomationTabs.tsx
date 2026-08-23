"use client";

import { useState } from "react";
import TabBar from "./TabBar";
import WorkflowCanvas from "./WorkflowCanvas";
import SavChat from "./SavChat";
import { AUTOMATIONS } from "./automations-data";

// Orchestrateur des onglets : un seul WorkflowCanvas actif à la fois (key=id → son
// état se réinitialise au switch). Changer d'onglet (clic, clavier ou rebond) ne
// modifie pas la position de scroll de la page — aucun scroll forcé.
export default function AutomationTabs() {
  const [active, setActive] = useState(0);

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
      <div role="tabpanel" id={`panel-${cfg.id}`} aria-labelledby={`tab-${cfg.id}`}>
        {cfg.chat
          ? <SavChat key={cfg.id} config={cfg} />
          : <WorkflowCanvas key={cfg.id} config={cfg} suggestions={suggestions} onSelect={selectById} />}
      </div>
    </>
  );
}
