"use client";

import { useId } from "react";
import { score, bucket } from "./model";
import type { Lead, Taille, Secteur, Source } from "./leads-data";

const TAILLES: Taille[] = ["TPE", "PME", "ETI"];
const SECTEURS: Secteur[] = ["SaaS", "Industrie", "Retail", "Services"];
const SOURCES: Source[] = ["ads", "organic", "referral"];

// Ligne de lead éditable : le score de conversion se recalcule EN DIRECT (client,
// déterministe) à chaque changement. Ce lead est ajouté au dataset au lancement.
export default function EditableLead({ lead, onChange }: { lead: Lead; onChange: (l: Lead) => void }) {
  const p = score(lead);
  const b = bucket(p);
  const set = (patch: Partial<Lead>) => onChange({ ...lead, ...patch });
  const clamp = (v: string, max: number) => Math.max(0, Math.min(max, Math.round(Number(v) || 0)));

  return (
    <div className="pl-edit">
      <div className="pl-edit-h">
        <p className="pl-edit-t">Votre lead — score en direct</p>
        <div className="pl-gauge">
          <div className="pl-gauge-p">{Math.round(p * 100)}%</div>
          <p className="pl-gauge-l"><span className={`pl-badge ${b}`}>{b}</span></p>
        </div>
      </div>
      <div className="pl-grid">
        <Sel label="Taille" v={lead.taille} opts={TAILLES} on={(v) => set({ taille: v as Taille })} />
        <Sel label="Secteur" v={lead.secteur} opts={SECTEURS} on={(v) => set({ secteur: v as Secteur })} />
        <Sel label="Source" v={lead.source} opts={SOURCES} on={(v) => set({ source: v as Source })} />
        <Num label="Pages vues" v={lead.pages_vues} on={(v) => set({ pages_vues: clamp(v, 60) })} />
        <Num label="Emails ouverts" v={lead.emails_ouverts} on={(v) => set({ emails_ouverts: clamp(v, 30) })} />
        <Num label="Ancienneté (j)" v={lead.anciennete_jours} on={(v) => set({ anciennete_jours: clamp(v, 360) })} />
        <Num label="Budget (€)" v={lead.budget_estime} on={(v) => set({ budget_estime: clamp(v, 60000) })} />
        <div className="pl-field">
          <label htmlFor="pl-essai">Essai gratuit</label>
          <label className="pl-check">
            <input id="pl-essai" type="checkbox" checked={lead.essai_gratuit}
              onChange={(e) => set({ essai_gratuit: e.target.checked })} /> activé
          </label>
        </div>
      </div>
    </div>
  );
}

// `useId` : chaque champ a un libellé explicitement associé (nom accessible).
function Sel({ label, v, opts, on }: { label: string; v: string; opts: string[]; on: (v: string) => void }) {
  const id = useId();
  return (
    <div className="pl-field">
      <label htmlFor={id}>{label}</label>
      <select id={id} className="pl-in" value={v} onChange={(e) => on(e.target.value)}>
        {opts.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
function Num({ label, v, on }: { label: string; v: number; on: (v: string) => void }) {
  const id = useId();
  return (
    <div className="pl-field">
      <label htmlFor={id}>{label}</label>
      <input id={id} className="pl-in" type="number" value={v} onChange={(e) => on(e.target.value)} />
    </div>
  );
}
