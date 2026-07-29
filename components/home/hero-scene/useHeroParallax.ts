import { useEffect } from "react";

// Plomberie de parallaxe : UN seul listener scroll passif + rAF throttlé. Appelle
// `onFrame(scrollY)` à chaque frame utile ; c'est le consommateur qui applique les
// transforms sur SES propres refs (le hook ne touche jamais au DOM). Inactif si
// `enabled` est false (mobile / prefers-reduced-motion) — un dernier onFrame(0)
// remet les panneaux à plat. `onFrame` doit être stable (useCallback).
export function useHeroParallax(onFrame: (scrollY: number) => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled) {
      onFrame(0);
      return;
    }
    let raf = 0;
    const run = () => {
      raf = 0;
      onFrame(window.scrollY);
    };
    const handler = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    window.addEventListener("scroll", handler, { passive: true });
    run();
    return () => {
      window.removeEventListener("scroll", handler);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [onFrame, enabled]);
}
