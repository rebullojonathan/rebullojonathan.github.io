import { useEffect } from "react";

/**
 * One-time fade/rise reveal for every element marked `data-reveal`.
 * Set `style={{ "--i": n }}` on siblings to stagger them.
 * Skipped entirely when the visitor prefers reduced motion.
 */
export function useReveal() {
  useEffect(() => {
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    for (const element of elements) {
      element.classList.add("scroll-reveal");
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
      for (const element of elements) element.classList.remove("scroll-reveal", "is-visible");
    };
  }, []);
}

/** True when the visitor asked the OS for reduced motion. Safe during SSR. */
export function prefersReducedMotion() {
  return typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;
}
