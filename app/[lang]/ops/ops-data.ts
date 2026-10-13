// Données de la salle des machines (/ops). value === null tant que la
// métrique n'est pas branchée → la tuile affiche "—" + "câblage en cours".
// Quand le monitoring réel sera câblé, il suffira de remplir value/detail
// (ou de remplacer ce fichier par un fetch) sans toucher au rendu.

export interface OpsMetric {
  id: string;
  label: string;
  /** Valeur formatée prête à afficher (ex. "99.98 %", "740 ms") — null = pas encore branchée */
  value: string | null;
  /** Précision affichée sous la valeur quand elle sera branchée (ex. "30 derniers jours") */
  detail: string;
}

/** Textes de la page /ops (jumeau anglais : ops-data.en.ts). */
export interface OpsText {
  title: string;
  description: string;
  kicker: string;
  intro: string;
  wiring: string;
}

export const OPS_TEXT: OpsText = {
  title: "Ops — Axel Remillat | Salle des machines",
  description: "Le monitoring de ce site, en public : uptime, latence VEGA, requêtes et coût par réponse.",
  kicker: "OPS // SALLE DES MACHINES",
  intro: "Le monitoring de ce site, en public. Parce qu'un ingénieur qui vous vend du monitoring doit montrer le sien.",
  wiring: "câblage en cours",
};

export const OPS_METRICS: OpsMetric[] = [
  {
    id: "uptime",
    label: "Uptime du site",
    value: null,
    detail: "30 derniers jours",
  },
  {
    id: "vega-latency",
    label: "Latence médiane VEGA",
    value: null,
    detail: "réponse complète, p50",
  },
  {
    id: "requests-today",
    label: "Requêtes aujourd'hui",
    value: null,
    detail: "toutes routes API",
  },
  {
    id: "cost-per-answer",
    label: "Coût par réponse",
    value: null,
    detail: "LLM + TTS, moyenne",
  },
];
