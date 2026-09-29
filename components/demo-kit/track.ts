// Événements Umami nommés (script chargé en production par components/Analytics).
// Sans script (dev, bloqueur), l'appel ne fait rien. Pour les liens, préférer
// l'attribut data-umami-event, suivi par Umami sans JavaScript.
type Umami = { track: (event: string, data?: Record<string, string | number>) => void };

export function track(event: string, data?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  try { (window as unknown as { umami?: Umami }).umami?.track(event, data); } catch { /* stats non bloquantes */ }
}
