"use client";

import { useEffect, useRef, useState } from "react";
import { type Body, MAX_DT, SLEEP_ENERGY, SPRINGS, applyDragPos, createBodies, step } from "./graph-physics";
import { CAT_MEMBERS, zonePath, zoneLabelAnchor, type Pt } from "./skills-zones";

interface ZoneRefs { paths: SVGPathElement[]; label: SVGTextElement | null }

const DRAG_THRESHOLD = 5; // px écran : en-deçà = clic (comportement existant)

export interface NodePointerHandlers {
  onPointerDown: React.PointerEventHandler<SVGGElement>;
  onPointerMove: React.PointerEventHandler<SVGGElement>;
  onPointerUp: React.PointerEventHandler<SVGGElement>;
  onPointerCancel: React.PointerEventHandler<SVGGElement>;
}

// Drag élastique de la constellation. Tout l'état vit dans des refs ; le rendu
// est impératif (setAttribute) dans la boucle rAF — un seul état React :
// isDragging. La boucle s'endort dès que l'énergie retombe (0 CPU au repos).
export default function useGraphPhysics(
  groupRef: React.RefObject<SVGGElement | null>, // <g> zoomable : son CTM absorbe zoom + viewBox
  enabled: boolean, // false si prefers-reduced-motion → drag désactivé, clics intacts
) {
  const [isDragging, setIsDragging] = useState(false);
  const bodies = useRef<Map<string, Body> | null>(null);
  const nodeEls = useRef(new Map<string, SVGGElement>());
  const edgeEls = useRef<(SVGLineElement | null)[]>([]);
  const zoneEls = useRef(new Map<string, ZoneRefs>());
  const dragId = useRef<string | null>(null);
  const draggingRef = useRef(false); // miroir non-React de isDragging (guards hover)
  const wasDragRef = useRef(false);  // le clic qui suit un drag doit être ignoré
  const gesture = useRef<{ id: string; pointerId: number; x0: number; y0: number } | null>(null);
  const running = useRef(false);
  const raf = useRef(0);
  const last = useRef(0);
  const enabledRef = useRef(enabled);
  useEffect(() => { enabledRef.current = enabled; }, [enabled]);

  const getBodies = () => (bodies.current ??= createBodies());

  const render = () => {
    const B = getBodies();
    nodeEls.current.forEach((el, id) => {
      const b = B.get(id);
      if (b) el.setAttribute("transform", `translate(${(b.x - b.hx).toFixed(2)} ${(b.y - b.hy).toFixed(2)})`);
    });
    edgeEls.current.forEach((el, i) => {
      if (!el) return;
      const a = B.get(SPRINGS[i].a)!, b = B.get(SPRINGS[i].b)!;
      el.setAttribute("x1", a.x.toFixed(2)); el.setAttribute("y1", a.y.toFixed(2));
      el.setAttribute("x2", b.x.toFixed(2)); el.setAttribute("y2", b.y.toFixed(2));
    });
    // Zones de thème : contour + label recalculés depuis les positions live.
    zoneEls.current.forEach((rec, cat) => {
      const pts = CAT_MEMBERS[cat].map((id) => { const b = B.get(id)!; return [b.x, b.y] as Pt; });
      const d = zonePath(pts);
      for (const p of rec.paths) p.setAttribute("d", d);
      if (rec.label) {
        const [lx, ly] = zoneLabelAnchor(pts);
        rec.label.setAttribute("x", lx.toFixed(1));
        rec.label.setAttribute("y", ly.toFixed(1));
      }
    });
  };

  const tick = (t: number) => {
    const dt = Math.min(MAX_DT, Math.max(1, t - last.current));
    last.current = t;
    const energy = step(getBodies(), dragId.current, dt / 16.7);
    render();
    // Veille : plus d'énergie et pas de drag → snap exact sur les homes + stop rAF
    if ((!dragId.current && energy < SLEEP_ENERGY) || !enabledRef.current) {
      getBodies().forEach((b) => { b.x = b.hx; b.y = b.hy; b.vx = 0; b.vy = 0; });
      render();
      running.current = false;
      return;
    }
    raf.current = requestAnimationFrame(tick);
  };

  const wake = () => {
    if (running.current || !enabledRef.current) return;
    running.current = true;
    last.current = performance.now();
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  // Curseur écran → coordonnées locales du <g> zoomable (viewBox + zoom inclus).
  const toLocal = (e: { clientX: number; clientY: number }) => {
    const m = groupRef.current?.getScreenCTM();
    return m ? new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse()) : null;
  };

  const endGesture: React.PointerEventHandler<SVGGElement> = (e) => {
    const g = gesture.current;
    if (!g || g.pointerId !== e.pointerId) return;
    gesture.current = null;
    if (draggingRef.current) {
      draggingRef.current = false;
      dragId.current = null; // relâchement : oscillation amortie jusqu'au sommeil
      setIsDragging(false);
      wake();
    }
  };

  const pointerHandlers = (id: string): NodePointerHandlers => ({
    onPointerDown: (e) => {
      if (!enabledRef.current) return;
      gesture.current = { id, pointerId: e.pointerId, x0: e.clientX, y0: e.clientY };
      wasDragRef.current = false;
      e.currentTarget.setPointerCapture(e.pointerId);
      wake();
    },
    onPointerMove: (e) => {
      const g = gesture.current;
      if (!g || g.pointerId !== e.pointerId) return;
      if (!draggingRef.current) {
        // < 5 px de déplacement = futur clic : ne pas démarrer le drag
        if (Math.hypot(e.clientX - g.x0, e.clientY - g.y0) < DRAG_THRESHOLD) return;
        draggingRef.current = true;
        wasDragRef.current = true;
        dragId.current = g.id;
        setIsDragging(true);
        wake();
      }
      const p = toLocal(e);
      const b = p && getBodies().get(g.id);
      if (p && b) applyDragPos(b, p.x, p.y);
    },
    onPointerUp: endGesture,
    onPointerCancel: endGesture,
  });

  const registerNode = (id: string) => (el: SVGGElement | null) => {
    if (el) nodeEls.current.set(id, el);
    else nodeEls.current.delete(id);
  };
  const registerEdge = (i: number) => (el: SVGLineElement | null) => {
    edgeEls.current[i] = el;
  };
  const zoneRec = (cat: string) => {
    let r = zoneEls.current.get(cat);
    if (!r) { r = { paths: [], label: null }; zoneEls.current.set(cat, r); }
    return r;
  };
  const registerZonePath = (cat: string) => (el: SVGPathElement | null) => {
    const r = zoneRec(cat);
    if (el && !r.paths.includes(el)) r.paths.push(el);
  };
  const registerZoneLabel = (cat: string) => (el: SVGTextElement | null) => {
    zoneRec(cat).label = el;
  };

  return {
    isDragging,
    draggingRef,                          // guards hover sans re-render
    wasDrag: () => wasDragRef.current,    // à consulter dans onClick
    pointerHandlers,
    registerNode,
    registerEdge,
    registerZonePath,
    registerZoneLabel,
  };
}
