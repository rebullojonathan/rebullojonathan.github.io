/**
 * Smooth-scroll to a section and correct the landing spot once the page has
 * settled: images above the target can finish loading mid-scroll and push it down.
 */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return false;
  const reduced =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  window.setTimeout(() => {
    const offset = target.getBoundingClientRect().top;
    if (offset > 120 || offset < 40) target.scrollIntoView({ behavior: "auto", block: "start" });
  }, 1100);
  try {
    history.replaceState(null, "", `#${id}`);
  } catch {
    // Some embedded previews block history changes; scrolling still works.
  }
  return true;
}

/** Route every same-page "#section" link through scrollToSection. Returns a cleanup function. */
export function enhanceAnchorLinks() {
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
    const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
    const id = link?.getAttribute("href")?.slice(1);
    if (!id) return;
    if (scrollToSection(id)) event.preventDefault();
  };
  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}
