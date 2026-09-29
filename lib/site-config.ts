// Config simple des liens externes du site (un seul endroit à mettre à jour).

// Réservation d'un appel découverte (Cal.eu — agenda Google synchronisé)
export const CALENDAR_URL = "https://cal.eu/axel-remillat/appel-decouverte";

// URL publique du site : base des URLs absolues (canonical, Open Graph, sitemap).
// À surcharger via NEXT_PUBLIC_SITE_URL si le domaine de production diffère.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://axelremillat.com").replace(/\/$/, "");

export const SITE_NAME = "Axel Remillat";
export const SITE_TAGLINE = "Automatisation & IA pour PME";
export const CONTACT_EMAIL = "axel@axelremillat.com";

// Pages indexables (sitemap), hors fiches /projets/[slug] (ajoutées depuis
// projects-data). /ops en est exclue tant que ses tuiles affichent « câblage en cours ».
export const PUBLIC_ROUTES = [
  "/",
  "/offres",
  "/projets",
  "/demos",
  "/automatisations",
  "/agent",
  "/pipeline",
  "/parcours",
  "/contact",
  "/mentions-legales",
] as const;
