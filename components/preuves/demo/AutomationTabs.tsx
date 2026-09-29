"use client";

import { useEffect, useState } from "react";
import TabBar from "./TabBar";
import WorkflowCanvas from "./WorkflowCanvas";
import SavChat from "./SavChat";
import ChezVousCta from "@/components/demo-kit/ChezVousCta";
import { AUTOMATIONS } from "./automations-data";

// Orchestrateur des onglets : un seul WorkflowCanvas actif à la fois (key=id → son
// état se réinitialise au switch). Lien direct vers un onglet : ?demo=<id> (lu au
// montage, sans useSearchParams → la page reste statique). Changer d'onglet ne
// modifie pas la position de scroll de la page.
export default function AutomationTabs() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("demo");
    const i = AUTOMATIONS.findIndex((a) => a.id === id);
    if (i > 0) requestAnimationFrame(() => setActive(i));
  }, []);

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
      <ChezVousCta demo={cfg.id} sujet={`Démo « ${cfg.title} » : je voudrais la même chose chez moi`} />
    </>
  );
}
