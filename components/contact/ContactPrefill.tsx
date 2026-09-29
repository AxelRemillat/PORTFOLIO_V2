"use client";

import { useEffect } from "react";

// Préremplit le champ « En une phrase » du formulaire à partir de ?sujet=… (liens
// « Me décrire votre besoin » des démos), SANS modifier ContactForm : on passe par
// le setter natif + un événement input, que React traite comme une saisie.
export default function ContactPrefill() {
  useEffect(() => {
    const sujet = new URLSearchParams(window.location.search).get("sujet")?.trim().slice(0, 200);
    const field = document.getElementById("cf-short") as HTMLInputElement | null;
    if (!sujet || !field || field.value) return;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    setter?.call(field, sujet);
    field.dispatchEvent(new Event("input", { bubbles: true }));
  }, []);
  return null;
}
