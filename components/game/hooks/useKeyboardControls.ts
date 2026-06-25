import { useRef, useEffect } from "react";

export function useKeyboardControls() {
  const keysRef = useRef(new Set<string>());
  const jumpRef = useRef({ active: false, t: 0 });

  useEffect(() => {
    const BLOCK_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "]);
    const down = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (BLOCK_KEYS.has(e.key)) e.preventDefault();
      if (e.key === " " && !jumpRef.current.active)
        jumpRef.current = { active: true, t: 0 };
    };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup",   up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup",   up);
    };
  }, []);

  return { keysRef, jumpRef };
}
