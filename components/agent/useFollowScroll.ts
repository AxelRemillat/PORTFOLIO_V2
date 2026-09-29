import { useEffect, type RefObject } from "react";

// Auto-scroll qui SUIT l'agent : à chaque nouvelle étape/section, on garde le bas
// visible (smooth). Stop dès que l'utilisateur reprend la main (molette, tactile,
// clavier) ; reprise s'il redescend tout en bas. Aucun setState → lint-safe.
export function useFollowScroll(outRef: RefObject<HTMLElement | null>, endRef: RefObject<HTMLElement | null>, runId: number) {
  useEffect(() => {
    const el = outRef.current;
    if (!el) return;
    let following = true;
    const follow = () => { if (following) endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); };
    const obs = new MutationObserver(follow);
    obs.observe(el, { childList: true, subtree: true });
    const stop = () => { following = false; };
    const onScroll = () => {
      if (following) return;
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 60) following = true;
    };
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchmove", stop, { passive: true });
    window.addEventListener("keydown", stop);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      obs.disconnect();
      window.removeEventListener("wheel", stop); window.removeEventListener("touchmove", stop);
      window.removeEventListener("keydown", stop); window.removeEventListener("scroll", onScroll);
    };
  }, [outRef, endRef, runId]);
}
