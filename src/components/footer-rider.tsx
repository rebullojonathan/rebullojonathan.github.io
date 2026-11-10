import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

/**
 * Decorative footer animation: scattered sticks fly in and assemble a stick figure
 * and a bicycle with square wheels, then the figure rides (square wheels make it bounce).
 *
 * - Assembles the first time the footer comes into view, then rides only while the
 *   footer is on screen (paused otherwise, to save battery and CPU).
 * - Reduced motion: shows the finished drawing, still.
 * - Pure SVG + CSS, no libraries. Hidden from assistive technology.
 */
type Phase = "static" | "scattered" | "assembled";

/** Assembly timing (seconds): slow enough for visitors to watch the figure come together. */
const PIECE_STAGGER = 0.35;
const PIECE_FLIGHT = 1.8;
const PIECE_COUNT = 10;
/** Riding starts once the last piece has landed. */
const ASSEMBLY_MS = ((PIECE_COUNT - 1) * PIECE_STAGGER + PIECE_FLIGHT) * 1000 + 200;

/** Where each piece starts before it flies into place (offset in SVG units, rotation in degrees). */
const scatter: Record<string, [number, number, number]> = {
  wheelRear: [-70, -60, -140],
  wheelFront: [80, -70, 160],
  frame: [-30, 70, 60],
  seat: [-90, 10, -90],
  bars: [90, 30, 120],
  head: [40, -90, 0],
  torso: [-60, -80, -70],
  arm: [100, -40, 80],
  legA: [-80, 50, -120],
  legB: [70, 80, 100],
};

function piece(name: string, order: number): CSSProperties {
  const [x, y, r] = scatter[name];
  return {
    "--sx": `${x}px`,
    "--sy": `${y}px`,
    "--sr": `${r}deg`,
    "--delay": `${order * PIECE_STAGGER}s`,
  } as CSSProperties;
}

/**
 * The footer is fixed behind the page, so IntersectionObserver would always report it as
 * visible. Measure how far the page has scrolled toward the footer instead.
 */
function useFooterOnScreen(ref: React.RefObject<HTMLElement | null>) {
  const [onScreen, setOnScreen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const footer = el?.closest<HTMLElement>(".curtain-footer-content");
    if (!el || !footer) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      const doc = document.documentElement;
      const distanceToEnd = doc.scrollHeight - (window.scrollY + window.innerHeight);
      // "On screen" once about a third of the footer is exposed.
      setOnScreen(distanceToEnd <= footer.offsetHeight * 0.65);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);
  return onScreen;
}

export function FooterRider() {
  const ref = useRef<HTMLDivElement>(null);
  // "static" until JavaScript runs, so the finished drawing shows without JS.
  const [phase, setPhase] = useState<Phase>("static");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [built, setBuilt] = useState(false);
  const onScreen = useFooterOnScreen(ref);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(reduce);
    if (!reduce) setPhase("scattered");
  }, []);

  useEffect(() => {
    if (phase === "scattered" && onScreen) {
      // Next frame, so the scattered positions are painted before the transition starts.
      const id = requestAnimationFrame(() => setPhase("assembled"));
      return () => cancelAnimationFrame(id);
    }
  }, [phase, onScreen]);

  // Wait for every piece to land before the bike starts rolling.
  useEffect(() => {
    if (phase !== "assembled") return;
    const id = window.setTimeout(() => setBuilt(true), ASSEMBLY_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  const riding = built && onScreen && !reducedMotion;

  return (
    <div
      ref={ref}
      className="lw-rider"
      data-phase={phase}
      data-riding={riding ? "true" : "false"}
      style={{ "--flight": `${PIECE_FLIGHT}s` } as CSSProperties}
      aria-hidden="true"
    >
      <svg viewBox="0 0 260 150" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        {/* Road: dashes slide left while riding, so the rider looks like he is moving forward. */}
        <line className="lw-rider-road" x1="6" y1="141" x2="254" y2="141" strokeWidth="3" />

        <g className="lw-rider-bounce">
          {/* Square wheels: each one rotates around its own centre. */}
          <g className="lw-rider-piece" style={piece("wheelRear", 0)}>
            <rect className="lw-rider-wheel" x="52" y="95" width="40" height="40" rx="3" />
          </g>
          <g className="lw-rider-piece" style={piece("wheelFront", 1)}>
            <rect className="lw-rider-wheel" x="168" y="95" width="40" height="40" rx="3" />
          </g>

          {/* Bicycle frame, seat and handlebar. */}
          <g className="lw-rider-piece" style={piece("frame", 2)}>
            <polyline points="72,115 125,115 108,82 72,115" />
            <polyline points="125,115 168,82 108,82" />
            <line x1="168" y1="82" x2="188" y2="115" />
            {/* Pedal crank. */}
            <circle cx="125" cy="115" r="5" strokeWidth="3.5" />
          </g>
          <g className="lw-rider-piece" style={piece("seat", 3)}>
            <line x1="96" y1="76" x2="118" y2="76" />
            <line x1="108" y1="76" x2="108" y2="82" />
          </g>
          <g className="lw-rider-piece" style={piece("bars", 4)}>
            <polyline points="168,82 172,64 184,62" />
          </g>

          {/* Stick figure. */}
          <g className="lw-rider-piece" style={piece("head", 5)}>
            <circle cx="140" cy="22" r="11" />
          </g>
          <g className="lw-rider-piece" style={piece("torso", 6)}>
            <line x1="108" y1="74" x2="133" y2="36" />
          </g>
          <g className="lw-rider-piece" style={piece("arm", 7)}>
            <polyline points="131,40 158,52 181,63" />
          </g>
          <g className="lw-rider-piece" style={piece("legA", 8)}>
            <g className="lw-rider-leg">
              <polyline points="108,74 146,88 130,117" />
            </g>
          </g>
          <g className="lw-rider-piece" style={piece("legB", 9)}>
            <g className="lw-rider-leg lw-rider-leg-back">
              <polyline points="108,74 136,98 120,113" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
