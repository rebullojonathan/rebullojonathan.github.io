import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  WheelEvent as ReactWheelEvent,
} from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, ExternalLink, X, ZoomIn, ZoomOut } from "lucide-react";

const MIN_SCALE = 1;
const MAX_SCALE = 8;
const STEP = 1.5;
/** Small screenshots are enlarged to fill the screen, but never beyond 3x (too blurry). */
const MAX_UPSCALE = 3;

type View = { scale: number; x: number; y: number };
const FIT: View = { scale: 1, x: 0, y: 0 };

/**
 * Full-screen image viewer.
 *
 * Default view: the whole image fits inside the screen (CSS max-width / max-height
 * on the image, no scrollbars anywhere). Zooming is a CSS transform on the image,
 * and panning is a drag, so the page itself never scrolls while the viewer is open.
 */
export function ImageViewer({
  title,
  caption,
  images,
  startIndex = 0,
  onClose,
}: {
  title: string;
  caption?: string;
  images: string[];
  startIndex?: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const [view, setView] = useState<View>(FIT);
  const [dragging, setDragging] = useState(false);
  const [base, setBase] = useState<{ w: number; h: number } | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ moved: boolean; pinchDist: number }>({ moved: false, pinchDist: 0 });

  const count = images.length;
  const src = images[index];

  /** Keep the zoomed image from being dragged out of view. */
  const clamp = useCallback((next: View): View => {
    const stage = stageRef.current;
    const img = imgRef.current;
    const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next.scale));
    if (!stage || !img || scale === 1) return { scale, x: 0, y: 0 };
    const maxX = Math.max(0, (img.offsetWidth * scale - stage.clientWidth) / 2);
    const maxY = Math.max(0, (img.offsetHeight * scale - stage.clientHeight) / 2);
    return {
      scale,
      x: Math.min(maxX, Math.max(-maxX, next.x)),
      y: Math.min(maxY, Math.max(-maxY, next.y)),
    };
  }, []);

  /** Zoom around a point given in screen coordinates (defaults to the stage centre). */
  const zoomTo = useCallback(
    (target: number, clientX?: number, clientY?: number) => {
      setView((current) => {
        const stage = stageRef.current;
        if (!stage) return current;
        const rect = stage.getBoundingClientRect();
        const px = clientX === undefined ? 0 : clientX - (rect.left + rect.width / 2);
        const py = clientY === undefined ? 0 : clientY - (rect.top + rect.height / 2);
        const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, target));
        const ratio = scale / current.scale;
        return clamp({ scale, x: px - (px - current.x) * ratio, y: py - (py - current.y) * ratio });
      });
    },
    [clamp],
  );

  /** Size the image so the whole of it fits the screen (95vw x 90dvh at most). */
  const measure = useCallback(() => {
    const stage = stageRef.current;
    const img = imgRef.current;
    if (!stage || !img || !img.naturalWidth) return;
    const style = getComputedStyle(stage);
    const availW = Math.min(
      window.innerWidth * 0.95,
      stage.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
    );
    const availH = Math.min(
      window.innerHeight * 0.9,
      stage.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom),
    );
    const fit = Math.min(availW / img.naturalWidth, availH / img.naturalHeight, MAX_UPSCALE);
    const w = Math.floor(img.naturalWidth * fit);
    setBase({ w, h: Math.min(Math.floor(availH), Math.round((w * img.naturalHeight) / img.naturalWidth)) });
  }, []);

  useLayoutEffect(() => {
    setBase(null);
    if (imgRef.current?.complete) measure();
  }, [src, measure]);

  const zoomIn = () => zoomTo(view.scale * STEP);
  const zoomOut = () => zoomTo(view.scale / STEP);
  const reset = () => setView(FIT);
  const go = useCallback(
    (delta: number) => {
      if (count < 2) return;
      setIndex((i) => (i + delta + count) % count);
      setView(FIT);
    },
    [count],
  );

  // Lock page scroll, remember the position, and give focus back on close.
  useLayoutEffect(() => {
    const scrollY = window.scrollY;
    const html = document.documentElement;
    const body = document.body;
    const previousFocus = document.activeElement as HTMLElement | null;
    const gap = window.innerWidth - html.clientWidth;
    const saved = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPadding: body.style.paddingRight,
    };
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    html.classList.add("lw-viewer-open");
    closeRef.current?.focus({ preventScroll: true });

    return () => {
      html.style.overflow = saved.htmlOverflow;
      body.style.overflow = saved.bodyOverflow;
      body.style.paddingRight = saved.bodyPadding;
      html.classList.remove("lw-viewer-open");
      window.scrollTo({ top: scrollY, behavior: "instant" as ScrollBehavior });
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  // Keyboard: Escape closes, arrows switch images, + / - / 0 zoom, Tab stays inside.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowRight") go(1);
      else if (event.key === "ArrowLeft") go(-1);
      else if (event.key === "+" || event.key === "=") zoomTo(view.scale * STEP);
      else if (event.key === "-") zoomTo(view.scale / STEP);
      else if (event.key === "0") setView(FIT);
      else if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button:not(:disabled), a[href]");
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, onClose, view.scale, zoomTo]);

  // Re-clamp when the window is resized (e.g. phone rotation).
  useEffect(() => {
    const onResize = () => {
      measure();
      setView((current) => clamp(current));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clamp, measure]);

  const onWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    const factor = Math.exp(-event.deltaY * 0.002);
    zoomTo(view.scale * factor, event.clientX, event.clientY);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    // Let the previous / next buttons receive their own clicks.
    if (event.target instanceof Element && event.target.closest("button")) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current.moved = false;
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current.pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
    }
    if (view.scale > 1) setDragging(true);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const previous = pointers.current.get(event.pointerId);
    if (!previous) return;
    const point = { x: event.clientX, y: event.clientY };
    pointers.current.set(event.pointerId, point);

    if (pointers.current.size === 2) {
      // Pinch to zoom around the midpoint of the two fingers.
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (gesture.current.pinchDist > 0) {
        zoomTo(view.scale * (dist / gesture.current.pinchDist), (a.x + b.x) / 2, (a.y + b.y) / 2);
      }
      gesture.current.pinchDist = dist;
      gesture.current.moved = true;
      return;
    }

    const dx = point.x - previous.x;
    const dy = point.y - previous.y;
    if (Math.abs(dx) + Math.abs(dy) > 2) gesture.current.moved = true;
    if (view.scale > 1) setView((current) => clamp({ ...current, x: current.x + dx, y: current.y + dy }));
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) gesture.current.pinchDist = 0;
    if (pointers.current.size === 0) setDragging(false);
  };

  // A plain click on the dark area (not the image) closes the viewer.
  const onStageClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (gesture.current.moved) return;
    if (event.target === event.currentTarget) onClose();
  };

  const onImageDoubleClick = (event: ReactMouseEvent<HTMLImageElement>) => {
    if (view.scale > 1) reset();
    else zoomTo(2.5, event.clientX, event.clientY);
  };

  const percent = Math.round(view.scale * 100);

  return createPortal(
    <div
      ref={dialogRef}
      className="lw-viewer"
      role="dialog"
      aria-modal="true"
      aria-label={`${title}, enlarged`}
    >
      <div className="lw-viewer-bar">
        <div className="lw-viewer-title">
          <p className="lw-viewer-name">{title}</p>
          {caption ? <p className="lw-viewer-caption">{caption}</p> : null}
        </div>
        <div className="lw-viewer-tools">
          {count > 1 ? (
            <span className="lw-viewer-count" aria-live="polite">
              {index + 1} / {count}
            </span>
          ) : null}
          <button
            type="button"
            className="lw-viewer-btn"
            onClick={zoomOut}
            disabled={view.scale <= MIN_SCALE}
            aria-label="Zoom out"
            title="Zoom out (−)"
          >
            <ZoomOut aria-hidden="true" />
          </button>
          <button
            type="button"
            className="lw-viewer-btn lw-viewer-percent"
            onClick={reset}
            disabled={view.scale === 1}
            aria-label="Fit to screen"
            title="Fit to screen (0)"
          >
            {view.scale === 1 ? "Fit" : `${percent}%`}
          </button>
          <button
            type="button"
            className="lw-viewer-btn"
            onClick={zoomIn}
            disabled={view.scale >= MAX_SCALE}
            aria-label="Zoom in"
            title="Zoom in (+)"
          >
            <ZoomIn aria-hidden="true" />
          </button>
          <a
            className="lw-viewer-btn lw-viewer-hide-sm"
            href={src}
            target="_blank"
            rel="noreferrer"
            aria-label="Open original image in a new tab"
            title="Open original"
          >
            <ExternalLink aria-hidden="true" />
          </a>
          <button
            ref={closeRef}
            type="button"
            className="lw-viewer-btn lw-viewer-close"
            onClick={onClose}
            aria-label="Close viewer"
            title="Close (Esc)"
          >
            <X aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={stageRef}
        className="lw-viewer-stage"
        data-zoomed={view.scale > 1 || undefined}
        data-dragging={dragging || undefined}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={onStageClick}
      >
        <img
          ref={imgRef}
          key={src}
          src={src}
          alt={`${title}, image ${index + 1} of ${count}`}
          className="lw-viewer-img"
          draggable={false}
          onLoad={measure}
          onDoubleClick={onImageDoubleClick}
          style={{
            width: base ? `${base.w}px` : undefined,
            height: base ? `${base.h}px` : undefined,
            visibility: base ? "visible" : "hidden",
            transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`,
          }}
        />

        {count > 1 ? (
          <>
            <button
              type="button"
              className="lw-viewer-btn lw-viewer-nav lw-viewer-prev"
              onClick={() => go(-1)}
              aria-label="Previous image"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              className="lw-viewer-btn lw-viewer-nav lw-viewer-next"
              onClick={() => go(1)}
              aria-label="Next image"
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>

      <p className="lw-viewer-help">
        {view.scale > 1
          ? "Drag to move around · Double-click or tap Fit to reset"
          : "Use + / −, the mouse wheel or pinch to zoom"}
      </p>
    </div>,
    document.body,
  );
}
