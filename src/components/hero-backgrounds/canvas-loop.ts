/**
 * Shared plumbing for the hero background canvases: sizing for sharp rendering,
 * pausing when the hero is off screen or the tab is hidden, and theme colors.
 */

export type Rgb = [number, number, number];

/** Accent colors matching --highlight in the dark and light themes. */
export function accentRgb(): Rgb {
  return document.documentElement.classList.contains("light") ? [163, 38, 42] : [242, 128, 114];
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isFinePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

type LoopOptions = {
  canvas: HTMLCanvasElement;
  /** Element that receives pointer events (the hero section). */
  host: HTMLElement;
  /** Called after every resize with CSS-pixel width and height. */
  onResize: (width: number, height: number) => void;
  /** Draw one frame. `dt` is in seconds (clamped), `time` in seconds. */
  draw: (ctx: CanvasRenderingContext2D, dt: number, time: number) => void;
  /** Animate continuously. When false, only redraw on resize / theme change. */
  animate: boolean;
};

/** Starts the render loop. Returns a cleanup function. */
export function startCanvasLoop({ canvas, host, onResize, draw, animate }: LoopOptions) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let frame = 0;
  let last = 0;
  let visible = true;
  let width = 0;
  let height = 0;

  const resize = () => {
    const rect = host.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    onResize(width, height);
    if (!animate) draw(ctx, 0, performance.now() / 1000);
  };

  const tick = (now: number) => {
    frame = 0;
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
    last = now;
    draw(ctx, dt, now / 1000);
    schedule();
  };
  const schedule = () => {
    if (animate && visible && !document.hidden && !frame) frame = requestAnimationFrame(tick);
  };
  const stop = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) schedule();
    else stop();
  });
  io.observe(host);
  const onVisibility = () => (document.hidden ? stop() : schedule());
  document.addEventListener("visibilitychange", onVisibility);
  // Redraw in the new accent color when the theme toggle flips.
  const themeObserver = new MutationObserver(() => {
    if (!animate) draw(ctx, 0, performance.now() / 1000);
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  resize();
  schedule();

  return () => {
    stop();
    resizeObserver.disconnect();
    io.disconnect();
    themeObserver.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
