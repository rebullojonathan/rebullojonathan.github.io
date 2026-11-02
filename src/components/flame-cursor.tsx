import { useEffect, useRef, useState } from "react";

/** Elements where the system cursor stays (typing needs the text caret). */
const NATIVE_CURSOR = "input, textarea, select, [contenteditable='true'], iframe";
/** Elements that get the slightly larger "hover" flame. */
const INTERACTIVE = "a, button, summary, label, [role='button'], [role='tab']";

/**
 * Custom flame pointer for mouse users only.
 *
 * - The element is pointer-events: none, so it never blocks clicks, scrolling,
 *   text selection or the lightbox.
 * - The arrow's tip sits exactly at (0, 0) of the element, which is moved to the
 *   pointer's clientX/clientY, so the visible tip is the real click point.
 * - Touch devices and coarse pointers keep the system cursor: the component
 *   renders nothing and the CSS that hides the system cursor never applies.
 */
export function FlameCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    const root = document.documentElement;
    root.classList.add("lw-cursor-on");

    const show = (visible: boolean) => el.toggleAttribute("data-visible", visible);

    const onMove = (event: PointerEvent) => {
      // A touch on a hybrid laptop: get out of the way.
      if (event.pointerType === "touch") return show(false);
      el.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      const target = event.target instanceof Element ? event.target : null;
      show(!target?.closest(NATIVE_CURSOR));
      el.toggleAttribute("data-hover", Boolean(target?.closest(INTERACTIVE)));
    };
    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch") el.toggleAttribute("data-down", true);
    };
    const onUp = () => el.toggleAttribute("data-down", false);
    const onLeave = () => show(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("blur", onLeave);
    root.addEventListener("mouseleave", onLeave);

    return () => {
      root.classList.remove("lw-cursor-on");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("blur", onLeave);
      root.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={ref} className="lw-cursor" aria-hidden="true">
      <svg className="lw-cursor-svg" width="40" height="40" viewBox="0 0 40 40" focusable="false">
        <defs>
          <linearGradient id="lw-cursor-arrow" x1="2" y1="2" x2="20" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#8b5cf6" />
            <stop offset="0.55" stopColor="#d9467a" />
            <stop offset="1" stopColor="#ff5a4f" />
          </linearGradient>
          <linearGradient id="lw-cursor-flame-outer" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#ff5a4f" />
            <stop offset="1" stopColor="#a855f7" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="lw-cursor-flame-inner" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#ffb08a" />
            <stop offset="1" stopColor="#ff6f61" />
          </linearGradient>
        </defs>

        {/* Flame: sits behind the arrow's tail and flickers upward. */}
        <g transform="translate(15.5 18.5) scale(0.82) translate(-21 -25)">
          <g className="lw-cursor-flame">
            <path
              className="lw-cursor-flame-outer"
              fill="url(#lw-cursor-flame-outer)"
              d="M21 25c-4.4 0-7.5-3-7.5-7.1 0-3.4 2.3-5.4 3.4-8.4 1.3 1.7 1.8 3 1.8 4.4.9-2.8 2.7-5.6 5.4-8.6-.4 3.2.9 5.4 2.7 7.6 1.3 1.6 2 3.2 2 5 0 4.1-3.4 7.1-7.8 7.1z"
            />
            <path
              className="lw-cursor-flame-inner"
              fill="url(#lw-cursor-flame-inner)"
              d="M21.4 24c-2.4 0-4.1-1.6-4.1-3.8 0-1.8 1.2-2.9 1.9-4.5.7.9 1 1.6 1 2.4.6-1.6 1.6-3.1 3-4.7-.2 1.8.5 3 1.5 4.2.7.9 1.1 1.7 1.1 2.7 0 2.2-1.9 3.7-4.4 3.7z"
            />
          </g>
        </g>

        {/* Arrow: tip at (2, 2), which the CSS lines up with the real pointer position. */}
        <path
          className="lw-cursor-arrow"
          fill="url(#lw-cursor-arrow)"
          stroke="#ffffff"
          strokeWidth="1.4"
          strokeLinejoin="round"
          d="M2 2 L21 10.2 L12.6 12.6 L10.2 21 Z"
        />
      </svg>
    </div>
  );
}
