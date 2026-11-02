import { useEffect, useRef, useState } from "react";

const CYCLE = 3.6; // seconds for one shimmer wave
const STEP = 0.13; // delay between neighbouring diagonals

type Grid = { cols: number; rows: number; size: number; gap: number };

/**
 * Tile shimmer background for the sections below the hero.
 * One viewport-sized grid stays pinned behind the content (position: sticky) while the
 * page scrolls, so the number of tiles depends on the screen, not on the page length.
 * A diagonal wave of soft brand-red light moves across the tiles.
 */
export function TileBackground() {
  const layerRef = useRef<HTMLDivElement>(null);
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

  // Pause the animation while the tile area is off screen (hero or footer in view).
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      layer.toggleAttribute("data-paused", !entry.isIntersecting);
    });
    observer.observe(layer);
    return () => observer.disconnect();
  }, []);

  const tiles = [];
  if (grid) {
    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        // Negative delays start every tile mid-cycle, so the wave runs from top-left
        // to bottom-right immediately instead of waiting for the first pass.
        const phase = ((r + c) * STEP) % CYCLE;
        tiles.push(<i key={`${r}-${c}`} style={{ animationDelay: `${(phase - CYCLE).toFixed(2)}s` }} />);
      }
    }
  }

  return (
    <div ref={layerRef} className="lw-tiles" aria-hidden="true">
      <div className="lw-tiles-pin">
        {grid ? (
          <div
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
