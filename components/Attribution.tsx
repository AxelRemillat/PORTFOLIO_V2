"use client";

import { useEffect, useSyncExternalStore } from "react";
import { applyOptOut, readOptOut, trackArrival } from "@/lib/analytics";

/**
 * Deux choses au premier affichage, et rien de visible le reste du temps.
 *
 * 1. L'événement `arrivee` part une fois par session, avec le canal d'où vient
 *    la visite (voir lib/analytics.ts).
 * 2. `?moi=1` sort ce navigateur des statistiques, `?moi=0` l'y remet. C'est
 *    l'URL discrète d'Axel et de sa famille : aucune page en plus, rien dans
 *    le menu, et le message n'apparaît que si l'URL le demandait.
 *
 * On lit `window.location.search`, PAS `useSearchParams` : ce dernier ferait
 * basculer tout l'arbre au-dessus en rendu client et casserait le prérendu des
 * pages statiques. Et on le lit par `useSyncExternalStore` plutôt qu'avec un
 * état posé dans un effet : c'est la forme que React attend pour une valeur qui
 * n'existe que côté navigateur, et le lint du dépôt l'exige.
 */

/** La valeur ne change pas pendant la vie de la page : rien à écouter. */
const subscribe = () => () => {};
const snapshot = () => readOptOut(window.location.search);
const serverSnapshot = () => null;

export default function Attribution() {
  const optOut = useSyncExternalStore(subscribe, snapshot, serverSnapshot);

  useEffect(() => {
    const asked = readOptOut(window.location.search);
    if (asked !== null) {
      applyOptOut(asked);
      return; // Visite d'exclusion : on ne la compte pas comme une arrivée.
    }
    trackArrival();
  }, []);

  if (optOut === null) return null;

  return (
    <p role="status" className="mx-auto max-w-2xl px-4 py-2 text-center text-sm text-muted">
      {optOut
        ? "Ce navigateur n’est plus compté dans les statistiques."
        : "Ce navigateur est de nouveau compté dans les statistiques."}
    </p>
  );
}
