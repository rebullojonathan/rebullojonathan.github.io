import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { BookCallButton } from "@/components/booking-dialog";
import { bookingEnabled } from "@/lib/booking";
import { site } from "@/lib/site";

type SwapState = "static" | "armed" | "played";

/**
 * Plays the headline swap once, when the footer is actually visible.
 * The footer is fixed behind the page, so an IntersectionObserver would report it as visible
 * from the start. Instead, measure how much of the footer the page has scrolled past.
 */
function useFooterReveal(contentRef: RefObject<HTMLDivElement | null>) {
  // "static" until JS runs: the final text is readable without JavaScript.
  const [state, setState] = useState<SwapState>("static");

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState("played");
      return;
    }
    setState("armed");

    let frame = 0;
    const check = () => {
      frame = 0;
      const doc = document.documentElement;
      const distanceToEnd = doc.scrollHeight - (window.scrollY + window.innerHeight);
      const footerHeight = content.offsetHeight;
      // Play when at least 45% of the footer is exposed (works for fixed and static footers).
      if (distanceToEnd <= footerHeight * 0.55) {
        setState("played");
        stop();
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    const stop = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return stop;
  }, [contentRef]);

  return state;
}

export function CurtainFooter() {
  const contentRef = useRef<HTMLDivElement>(null);
  const swapState = useFooterReveal(contentRef);

  // The footer sits behind the page ("curtain"), so the page needs to know how tall it is.
  // Measure the real content instead of guessing a fixed height, and fall back to a normal
  // (non-fixed) footer when the content is taller than the screen.
  useEffect(() => {
    const content = contentRef.current;
    const shell = content?.closest<HTMLElement>(".portfolio-shell");
    if (!content || !shell) return;
    const update = () => {
      const height = Math.ceil(content.offsetHeight);
      shell.style.setProperty("--footer-height", `${height}px`);
      shell.toggleAttribute("data-footer-static", height > window.innerHeight * 0.9);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(content);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <footer className="curtain-footer" aria-labelledby="footer-title">
      <div ref={contentRef} className="curtain-footer-content lw-footer">
        <div className="lw-footer-cta">
          <h2 id="footer-title" className="lw-footer-headline lw-swap" data-swap={swapState}>
            <span className="lw-swap-lead">Your business deserves better than</span>
            <span className="lw-swap-old">
              <span className="lw-swap-strike">Manual work.</span>
            </span>
            <span className="lw-swap-new">Smart automation.</span>
          </h2>
          <p className="lw-footer-message">
            Have a workflow in mind? Let&rsquo;s explore how automation can simplify your business
            operations.
          </p>
          {bookingEnabled ? (
            <BookCallButton meetingId="project-consultation" className="lw-footer-button">
              Let&rsquo;s Talk About Your Project
              <span aria-hidden="true">→</span>
            </BookCallButton>
          ) : (
            <a href="#contact" className="lw-footer-button">
              Let&rsquo;s Talk About Your Project
              <span aria-hidden="true">→</span>
            </a>
          )}
        </div>

        <div className="lw-footer-row">
          <p className="lw-footer-title">
            {site.name}
            <span>{site.title}</span>
          </p>
          <nav className="lw-footer-links" aria-label="Footer">
            <a href={`mailto:${site.email}`}>{site.email} ↗</a>
            <a href={site.linkedin} target="_blank" rel="noreferrer">
              LinkedIn ↗<span className="sr-only"> (opens in new tab)</span>
            </a>
            <a href="#top">Back to top ↑</a>
          </nav>
        </div>
        <p className="lw-footer-copy">© 2026 {site.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
