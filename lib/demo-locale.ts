// Langue d'une route de démo : le corps (ou le formulaire) porte `locale`,
// 'fr' par défaut. Toute autre valeur retombe sur le français.
export type DemoLocale = "fr" | "en";

export const demoLocale = (value: unknown): DemoLocale => (value === "en" ? "en" : "fr");
