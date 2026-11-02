import { useEffect, useRef } from "react";
import { accentRgb, isFinePointer, prefersReducedMotion, startCanvasLoop } from "./canvas-loop";

const SPACING = 16;
const RADIUS = 220; // spotlight radius in CSS pixels
const BASE_ALPHA = 0.18; // resting dots: visible across the whole hero, still quiet
const BASE_SIZE = 1.4;

/**
 * Hero background: a 16px dot grid that glows around the cursor. When the cursor is
 * outside the hero (or on touch screens) the glow wanders on its own.
 */
export function DotGridSpotlight({ host }: { host: HTMLElement | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !host) return;
    const reduced = prefersReducedMotion();
    const followCursor = isFinePointer() && !reduced;

    let width = 0;
    let height = 0;
    const pos = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let pointerInside = false;
    let base: HTMLCanvasElement | null = null;
    let baseKey = "";

    const buildBase = () => {
      // The resting grid is drawn once into an offscreen canvas and copied each frame.
      const [r, g, b] = accentRgb();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      base = document.createElement("canvas");
      base.width = Math.round(width * dpr);
      base.height = Math.round(height * dpr);
      const bctx = base.getContext("2d");
      if (!bctx) return;
      bctx.scale(dpr, dpr);
      bctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${BASE_ALPHA})`;
      for (let y = SPACING / 2; y < height; y += SPACING) {
        for (let x = SPACING / 2; x < width; x += SPACING) bctx.fillRect(x - BASE_SIZE / 2, y - BASE_SIZE / 2, BASE_SIZE, BASE_SIZE);
      }
      baseKey = `${width}x${height}:${r}`;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = host.getBoundingClientRect();
      target.x = event.clientX - rect.left;
      target.y = event.clientY - rect.top;
      pointerInside = true;
    };
    const onLeave = () => {
      pointerInside = false;
    };
    if (followCursor) {
      host.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerleave", onLeave);
    }

    const stopLoop = startCanvasLoop({
      canvas,
      host,
      animate: !reduced,
      onResize: (w, h) => {
        width = w;
        height = h;
        if (!pos.x) {
          pos.x = w * 0.3;
          pos.y = h * 0.45;
        }
        buildBase();
      },
      draw: (ctx, dt, time) => {
        const [r, g, b] = accentRgb();
        if (`${width}x${height}:${r}` !== baseKey) buildBase();
        ctx.clearRect(0, 0, width, height);
        if (base) ctx.drawImage(base, 0, 0, width, height);
        if (reduced) return;

        // Wander on a slow, smooth path when the cursor isn't in the hero.
        if (!pointerInside) {
          target.x = width * (0.5 + 0.38 * Math.sin(time * 0.17) * Math.cos(time * 0.07));
          target.y = height * (0.5 + 0.32 * Math.sin(time * 0.13 + 1.3));
        }
        const ease = 1 - Math.pow(0.0015, dt); // frame-rate independent smoothing
        pos.x += (target.x - pos.x) * ease;
        pos.y += (target.y - pos.y) * ease;

        // Soft glow under the spotlight.
        const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, RADIUS * 1.2);
        glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.12)`);
        glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = glow;
        ctx.fillRect(pos.x - RADIUS * 1.2, pos.y - RADIUS * 1.2, RADIUS * 2.4, RADIUS * 2.4);

        // Brighter, slightly larger dots inside the spotlight.
        const x0 = Math.max(SPACING / 2, Math.floor((pos.x - RADIUS) / SPACING) * SPACING + SPACING / 2);
        const y0 = Math.max(SPACING / 2, Math.floor((pos.y - RADIUS) / SPACING) * SPACING + SPACING / 2);
        for (let y = y0; y < Math.min(height, pos.y + RADIUS); y += SPACING) {
          for (let x = x0; x < Math.min(width, pos.x + RADIUS); x += SPACING) {
            const d = Math.hypot(x - pos.x, y - pos.y);
            if (d >= RADIUS) continue;
            const t = 1 - d / RADIUS;
            const k = t * t * (3 - 2 * t); // smoothstep falloff
            const size = BASE_SIZE + k * 1.4;
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${BASE_ALPHA + k * 0.72})`;
            ctx.fillRect(x - size / 2, y - size / 2, size, size);
          }
        }
      },
    });

    return () => {
      stopLoop();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [host]);

  return <canvas ref={canvasRef} className="lw-hero-canvas" aria-hidden="true" />;
}
