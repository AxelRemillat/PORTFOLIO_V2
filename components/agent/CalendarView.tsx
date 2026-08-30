"use client";

export interface Creneau { jour: string; heure: string }

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const norm = (s: string) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

// Mini-calendrier « semaine prochaine » : affichage seulement. Les créneaux proposés
// par l'agent sont mis en avant (rose) dans la colonne du jour correspondant.
export default function CalendarView({ creneaux }: { creneaux: Creneau[] }) {
  const byDay = (day: string) => (creneaux || []).filter((c) => norm(c.jour).startsWith(norm(day).slice(0, 3)));

  return (
    <div>
      <p className="ag-cal-lead">📞 Appels proposés <b>avec le client</b> — semaine prochaine :</p>
      <div className="ag-cal" role="img" aria-label={`Créneaux proposés : ${creneaux.map((c) => `${c.jour} ${c.heure}`).join(", ") || "à définir"}`}>
        {DAYS.map((day) => {
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
      <p className="ag-cal-note">Démo — affichage indicatif, la prise de rendez-vous se fait ensuite avec Axel.</p>
    </div>
  );
}
