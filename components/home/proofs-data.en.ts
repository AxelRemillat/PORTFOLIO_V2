import { METIERS_EN } from "@/lib/metiers";
import { NB_AUTOMATISATIONS, PROOFS } from "./proofs-data";

// Homepage proof list in English: same projects, same links, same counts as
// the French (tests/coherence.test.ts checks the counts against the demos).
export const PROOFS_EN: typeof PROOFS = [
  { t: "Quoting agent", d: `${METIERS_EN.length} sample trades, a priced quote with VAT and questions for the customer — try it online.`, href: "/agent" },
  { t: "Automations", d: `${NB_AUTOMATISATIONS} open live demos: email, meeting notes, customer files, invoices, customer support.`, href: "/automatisations" },
  { t: "VEGA", d: "This site's voice assistant: it answers questions about my background and projects, live.", href: "/demos" },
  { t: "RISE", d: "A student startup I co-founded: 3 competition podiums, including 1st place out of 400+ projects.", href: "/parcours" },
  { t: "SEACO", d: "Personal R&D project: an everyday assistant designed from scratch (on hold).", href: "/projets" },
];
