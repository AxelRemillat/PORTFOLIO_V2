"use client";

import { useEffect } from "react";
import { trackWithChannel } from "@/lib/analytics";

/**
 * Un seul écouteur, en haut de l'arbre, pour tous les clics suivis.
 *
 * Les liens restent des ancres rendues par le serveur — rien ne devient
 * composant client, donc rien ne peut changer visuellement. Et c'est le seul
 * moyen d'ajouter le canal de la session à l'événement : l'attribut
 * `data-umami-event` ne sait envoyer que des valeurs écrites en dur.
 *
 * Un élément suivi porte `data-ax-event` et, au choix, `data-ax-page`,
 * `data-ax-offre`, `data-ax-cible` ou `data-ax-demo`. La liste des événements
 * est dans docs/tracking.md.
 */
const PROPS = ["page", "offre", "cible", "demo"] as const;

export default function TrackClicks() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const node = target.closest<HTMLElement>("[data-ax-event]");
      const name = node?.dataset.axEvent;
      if (!node || !name) return;

      const data: Record<string, string> = {};
      for (const key of PROPS) {
        const value = node.dataset[`ax${key[0].toUpperCase()}${key.slice(1)}`];
        if (value) data[key] = value;
      }
      trackWithChannel(name as "cta_rdv", data);
    };

    // `capture` : l'événement est lu avant qu'un gestionnaire de lien ne
    // navigue. `passive` : on n'empêche jamais le clic d'aboutir.
    document.addEventListener("click", onClick, { capture: true, passive: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
