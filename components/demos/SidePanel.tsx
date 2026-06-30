"use client";
import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import SidePanelHandle from "./SidePanelHandle";
import { usePanelDrag } from "./usePanelDrag";

// ── Constantes réglables ────────────────────────────────────────────────────
export const PANEL_W = 320; // largeur du panneau (px)
const PEEK = 6;             // liseré visible au repos (amorce "il y a du contenu")
const SNAP = 0.4;           // seuil de snap au drag (>40% ouvert → s'ouvre)
const TRANS_MS = 350;       // durée slide
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  side: "left" | "right";
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  label: string;
  icon: ReactNode;
  children: ReactNode;
  reduced?: boolean;
  intro?: boolean;
}

export default function SidePanel({ side, open, onOpenChange, title, label, icon, children, reduced, intro }: Props) {
  const isLeft = side === "left";
  const panelRef = useRef<HTMLElement>(null);

  const { dragFrac, onPointerDown } = usePanelDrag({ side, width: PANEL_W, open, setOpen: onOpenChange, snap: SNAP });

  const dragging = dragFrac !== null;
  const frac = dragFrac ?? (open ? 1 : 0);
  const visible = PEEK + frac * (PANEL_W - PEEK); // largeur réellement visible

  // Échap ferme le panneau ouvert
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onOpenChange(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  // Clic en dehors (hors panneau et hors poignée) ferme
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (panelRef.current?.contains(t)) return;
      if (t.closest(".ax-handle")) return;
      onOpenChange(false);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [open, onOpenChange]);

  const panel: CSSProperties = {
    position: "fixed", top: 0, bottom: 0, width: PANEL_W, zIndex: 45,
    left: isLeft ? 0 : undefined,
    right: isLeft ? undefined : 0,
    transform: `translateX(${isLeft ? visible - PANEL_W : PANEL_W - visible}px)`,
    transition: dragging || reduced ? "none" : `transform ${TRANS_MS}ms cubic-bezier(0.22,1,0.36,1)`,
    background: "rgba(10,10,18,0.92)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
    [isLeft ? "borderRight" : "borderLeft"]: "1px solid rgba(255,120,0,0.3)",
    boxShadow: open ? `${isLeft ? "" : "-"}8px 0 40px rgba(0,0,0,0.5)` : "none",
    display: "flex", flexDirection: "column", fontFamily: "var(--font-mono, monospace)",
    pointerEvents: open || dragging ? "auto" : "none",
  };

  return (
    <>
      <aside ref={panelRef} style={panel} role="region" aria-label={title} aria-hidden={!open}>
        <div style={{ padding: "18px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12, letterSpacing: "0.14em", color: "rgba(255,140,0,0.85)" }}>
          {title}
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
      </aside>

      <SidePanelHandle
        side={side}
        label={label}
        icon={icon}
        open={open}
        offset={visible}
        dragging={dragging}
        reduced={reduced}
        intro={intro}
        transMs={TRANS_MS}
        onPointerDown={onPointerDown}
        onToggleKey={() => onOpenChange(!open)}
        ariaLabel={`${open ? "Fermer" : "Ouvrir"} ${title}`}
      />
    </>
  );
}
