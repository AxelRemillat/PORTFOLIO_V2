import { METIERS } from "@/lib/metiers";

// Preuves de la home : une ligne par projet réel. Données pures (pas d'import de
// composants client, pour garder la home légère). Les compteurs sont vérifiés
// contre les données des démos par tests/coherence.test.ts.
export const NB_AUTOMATISATIONS = 5; // = AUTOMATIONS.length (/automatisations)

export const PROOFS = [
  { t: "Agent devis", d: `${METIERS.length} métiers d'exemple, un devis chiffré avec TVA et questions au client, testable en ligne.`, href: "/agent" },
  { t: "Automatisations", d: `${NB_AUTOMATISATIONS} démos en libre accès : emails, comptes rendus, fichier clients, factures, service client.`, href: "/automatisations" },
  { t: "VEGA", d: "L'assistant vocal de ce site : il répond sur mon parcours et mes projets, en ligne.", href: "/demos" },
  { t: "RISE", d: "Startup étudiante cofondée : 3 podiums de concours, dont la 1re place sur plus de 400 projets.", href: "/parcours" },
  { t: "SEACO", d: "Projet personnel de R&D : un assistant du quotidien conçu de A à Z (en pause).", href: "/projets" },
];
