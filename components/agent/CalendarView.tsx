"use client";

import { useAgentUi } from "./AgentUiContext";

export interface Creneau { jour: string; heure: string }

const norm = (s: string) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

// Mini-calendrier « semaine prochaine » : affichage seulement. Les créneaux proposés
// par l'agent sont mis en avant (rose) dans la colonne du jour correspondant.
export default function CalendarView({ creneaux }: { creneaux: Creneau[] }) {
  const t = useAgentUi();
  const byDay = (day: string) => (creneaux || []).filter((c) => norm(c.jour).startsWith(norm(day).slice(0, 3)));

  return (
    <div>
      <p className="ag-cal-lead">{t.callsLead.before}<b>{t.callsLead.strong}</b>{t.callsLead.after}</p>
      <div className="ag-cal" role="img" aria-label={t.slotsAria(creneaux.map((c) => `${c.jour} ${c.heure}`).join(", ") || t.toDefine)}>
        {t.days.map((day) => {
          const slots = byDay(day);
          return (
            <div key={day} className={`ag-cal-col${slots.length ? " has-slot" : ""}`}>
              <div className="ag-cal-day">{day}</div>
              <div className="ag-cal-slots">
                {slots.length > 0
                  ? slots.map((s, i) => <span key={i} className="ag-cal-slot is-proposed">{s.heure}</span>)
                  : <span className="ag-cal-slot is-empty" aria-hidden>·</span>}
              </div>
            </div>
          );
        })}
      </div>
      <p className="ag-cal-note">{t.calNote}</p>
    </div>
  );
}
