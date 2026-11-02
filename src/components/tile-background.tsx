import { useEffect, useRef, useState } from "react";

const RADIUS = 220; // px around the pointer that lights up

type Grid = { cols: number; rows: number; size: number; gap: number };

/**
 * Tile background for the sections below the hero.
 * One viewport-sized grid stays pinned behind the content (position: sticky) while the
 * page scrolls. Tiles near the mouse light up in the brand red and fade out as it moves
 * away, like the hero's dot spotlight. Touch devices see the quiet tile grid only.
 */
export function TileBackground() {
  const layerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState<Grid | null>(null);

  // Size the grid to the viewport (client only, so the server HTML stays stable).
  useEffect(() => {
    const measure = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const size = w < 640 ? 46 : 64;
      const gap = w < 640 ? 5 : 6;
      setGrid({
        cols: Math.ceil((w + gap) / (size + gap)) + 1,
        rows: Math.ceil((h + gap) / (size + gap)) + 1,
        size,
        gap,
      });
    };
    measure();
    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Pointer spotlight (mouse and trackpad only).
  useEffect(() => {
    const layer = layerRef.current;
    const pin = pinRef.current;
    const gridEl = gridRef.current;
    if (!grid || !layer || !pin || !gridEl) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const tiles = Array.from(gridEl.children) as HTMLElement[];
    // Tile centres relative to the pinned layer; the grid does not move inside it.
    const centres = tiles.map((tile) => ({
      x: tile.offsetLeft + tile.offsetWidth / 2,
      y: tile.offsetTop + tile.offsetHeight / 2,
    }));
    const lit = new Set<number>();
    let visible = false;
    let frame = 0;
    let pointer: { x: number; y: number } | null = null;

    const paint = () => {
      frame = 0;
      const next = new Set<number>();
      if (pointer && visible) {
        const rect = pin.getBoundingClientRect();
        const px = pointer.x - rect.left;
        const py = pointer.y - rect.top;
        centres.forEach((c, i) => {
          const dx = c.x - px;
          const dy = c.y - py;
          if (Math.abs(dx) > RADIUS || Math.abs(dy) > RADIUS) return;
          const strength = 1 - Math.hypot(dx, dy) / RADIUS;
          if (strength <= 0) return;
          next.add(i);
          tiles[i].style.setProperty("--glow", Math.pow(strength, 1.4).toFixed(3));
        });
      }
      lit.forEach((i) => {
        if (!next.has(i)) tiles[i].style.setProperty("--glow", "0");
      });
      lit.clear();
      next.forEach((i) => lit.add(i));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer = { x: event.clientX, y: event.clientY };
      schedule();
    };
    const onLeave = () => {
      pointer = null;
      schedule();
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    });
    observer.observe(layer);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", schedule);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [grid]);

  const tiles = [];
  if (grid) {
    for (let i = 0; i < grid.rows * grid.cols; i++) tiles.push(<i key={i} />);
  }

  return (
    <div ref={layerRef} className="lw-tiles" aria-hidden="true">
      <div ref={pinRef} className="lw-tiles-pin">
        {grid ? (
          <div
            ref={gridRef}
            className="lw-tiles-grid"
            style={{
              gridTemplateColumns: `repeat(${grid.cols}, ${grid.size}px)`,
              gridAutoRows: `${grid.size}px`,
              gap: `${grid.gap}px`,
            }}
          >
            {tiles}
          </div>
        ) : null}
      </div>
    </div>
  );
}
