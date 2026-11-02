import { useEffect, useRef, useState, type MouseEvent } from "react";
import { BookCallButton } from "@/components/booking-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { scrollToSection } from "@/lib/scroll";
import { navItems, site } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const progressRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Scroll progress bar (transform only, one rAF per frame at most).
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      progressRef.current?.style.setProperty("--progress", String(ratio));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Highlight the nav item of the section in view.
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Mobile menu: Escape closes it and returns focus to the toggle.
  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Close the menu first, then scroll, so the collapsing panel doesn't shift the target.
  const goTo = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    setOpen(false);
    requestAnimationFrame(() => scrollToSection(id));
  };

  return (
    <header className="lw-header" data-open={open || undefined}>
      <div className="lw-header-inner">
        <a href="#top" className="lw-wordmark" aria-label={`${site.brand}, back to top`}>
          NEO<span className="lw-wordmark-dot">.</span>REBULLO
        </a>

        <nav className="lw-nav" aria-label="Primary">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="lw-nav-link"
              aria-current={active === item.id ? "true" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="lw-header-actions">
          <span className="lw-availability lw-desktop-only lw-wide-only">
            <span className="lw-live-dot" aria-hidden="true" />
            Available for Projects
          </span>
          <a href="#contact" className="lw-btn lw-btn-ghost lw-btn-sm lw-desktop-only">
            Contact Me
          </a>
          <BookCallButton className="lw-btn lw-btn-primary lw-btn-sm lw-desktop-only" />
          <ThemeToggle />
          <button
            ref={toggleRef}
            type="button"
            className="lw-menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="lw-menu-bars" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={menuRef}
        className="lw-mobile-menu"
        hidden={!open}
        aria-label="Mobile navigation"
        role="navigation"
      >
        {navItems.map((item, index) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="lw-mobile-link"
            onClick={(event) => goTo(event, item.id)}
          >
            <span className="lw-mono-index" aria-hidden="true">
              0{index + 1}
            </span>
            {item.label}
          </a>
        ))}
        <BookCallButton
          className="lw-btn lw-btn-primary lw-mobile-cta"
          onBeforeOpen={() => setOpen(false)}
        />
        <a
          href="#contact"
          className="lw-btn lw-btn-ghost lw-mobile-cta"
          onClick={(event) => goTo(event, "contact")}
        >
          Contact Me
        </a>
        <p className="lw-mobile-meta">
          <span className="lw-live-dot" aria-hidden="true" /> Available for Projects · {site.timezone}
        </p>
      </div>

      <div className="lw-progress" aria-hidden="true">
        <div ref={progressRef} className="lw-progress-bar" />
      </div>
    </header>
  );
}
