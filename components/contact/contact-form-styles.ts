import type { CSSProperties } from "react";

// Styles constants du formulaire de contact (extraits de ContactForm pour
// garder chaque fichier sous 150 lignes ; valeurs inchangées).

export const labelStyle: CSSProperties = {
  display: "block",
  fontFamily: "var(--font-mono)",
  fontSize: 13,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: 8,
};

export const fieldWrap: CSSProperties = { marginBottom: "1.5rem" };

export const trapStyle: CSSProperties = { position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" };
