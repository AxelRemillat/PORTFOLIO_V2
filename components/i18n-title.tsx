"use client";

import { useEffect } from "react";

/**
 * Titre d'onglet dans la langue de la page, pour les écrans où Next ne
 * transmet pas la langue aux métadonnées (la 404 : `not-found` ne reçoit pas
 * `params`). Le titre servi reste le français d'origine — la 404 est en noindex,
 * aucun enjeu de référencement — et l'onglet est corrigé dès l'affichage.
 */
export default function LocalizedTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return null;
}
