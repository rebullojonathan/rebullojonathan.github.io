import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { createPortal } from "react-dom";
import { ProjectScreenshot } from "@/components/project-screenshot";
import { findWork, moreWork, selectedWork, type WorkItem } from "@/lib/work";

/** Pointer-follow spotlight on cards: updates two CSS variables, no re-render. */
function trackSpotlight(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

function ToolList({ tools }: { tools: string[] }) {
  return (
    <ul className="lw-tags" aria-label="Tools">
      {tools.map((tool) => (
        <li key={tool}>{tool}</li>
      ))}
    </ul>
  );
}

export function WorkSection() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [featured, ...rest] = selectedWork;
  const open = openSlug ? findWork(openSlug) : undefined;

  return (
    <section id="work" className="lw-section" aria-labelledby="work-title">
      <div className="lw-container">
        <p className="lw-eyebrow" data-reveal>
          <span className="lw-mono-index">02</span> Selected work
        </p>
        <h2 id="work-title" className="lw-h2" data-reveal>
          Systems that turn inquiries into booked appointments
        </h2>

        {/* Featured project: screenshot beside the summary. */}
        <article
          id={featured.slug}
          className="lw-work-featured lw-spotlight"
          data-reveal
          onPointerMove={trackSpotlight}
        >
          <div className="lw-work-featured-media">
            <ProjectScreenshot
              title={featured.title}
              images={[featured.cover ?? featured.images[0]]}
              technologies={featured.tools}
              natural
              hint="Click to enlarge"
            />
          </div>
          <div className="lw-work-body">
            <p className="lw-work-category">{featured.category}</p>
            <h3 className="lw-h3">{featured.title}</h3>
            <p className="lw-work-summary">{featured.summary}</p>
            <ul className="lw-checklist">
              {featured.built.slice(0, 3).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <button type="button" className="lw-work-cta" onClick={() => setOpenSlug(featured.slug)}>
              View case study <span aria-hidden="true">→</span>
            </button>
          </div>
        </article>

        <div className="lw-work-grid">
          {rest.map((item, index) => (
            <article
              key={item.slug}
              id={item.slug}
              className="lw-work-card lw-spotlight"
              data-reveal
              style={{ "--i": index } as CSSProperties}
              onPointerMove={trackSpotlight}
            >
              {item.images.length > 0 ? (
                <div className="lw-work-card-media">
                  <ProjectScreenshot
                    title={item.title}
                    images={[item.cover ?? item.images[0]]}
                    technologies={item.tools}
                    natural
                    hint="Click to enlarge"
                  />
                </div>
              ) : null}
              <div className="lw-work-body">
                <p className="lw-work-category">{item.category}</p>
                <h3 className="lw-h3">{item.title}</h3>
                <p className="lw-work-summary">{item.summary}</p>
                <ul className="lw-checklist">
                  {item.built.slice(0, 3).map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <button type="button" className="lw-work-cta" onClick={() => setOpenSlug(item.slug)}>
                  View case study <span aria-hidden="true">→</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="lw-more-work" data-reveal>
          <p className="lw-label">More work</p>
          <ul>
            {moreWork.map((item) => (
              <li key={item.slug}>
                <button
                  type="button"
                  id={item.slug}
                  className="lw-more-work-item"
                  onClick={() => setOpenSlug(item.slug)}
                >
                  <span className="lw-more-work-title">{item.title}</span>
                  <span className="lw-more-work-category">{item.category}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {open ? <CaseStudyDialog item={open} onClose={() => setOpenSlug(null)} /> : null}
    </section>
  );
}

/** Full-screen case study. Verification details live here, not on the homepage. */
function CaseStudyDialog({ item, onClose }: { item: WorkItem; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Lock page scroll and return the visitor to the same place on close.
  useLayoutEffect(() => {
    const scrollY = window.scrollY;
    const html = document.documentElement;
    const body = document.body;
    const previousFocus = document.activeElement as HTMLElement | null;
    const gap = window.innerWidth - html.clientWidth;
    const saved = { html: html.style.overflow, body: body.style.overflow, pad: body.style.paddingRight };
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      html.style.overflow = saved.html;
      body.style.overflow = saved.body;
      body.style.paddingRight = saved.pad;
      window.scrollTo({ top: scrollY, behavior: "instant" as ScrollBehavior });
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [item.slug]);

  // Escape closes; Tab stays inside. While a screenshot is enlarged, the image viewer handles keys.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (document.documentElement.classList.contains("lw-viewer-open")) return;
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          "button:not(:disabled), a[href]",
        );
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
  }, [onClose]);

  return createPortal(
    <div
      ref={dialogRef}
      className="lw-viewer lw-booking-modal lw-case-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-title"
    >
      <div className="lw-viewer-bar">
        <div className="lw-viewer-title">
          <p className="lw-viewer-name">Case study</p>
          <p className="lw-viewer-caption">{item.category}</p>
        </div>
        <div className="lw-viewer-tools">
          <button
            ref={closeRef}
            type="button"
            className="lw-viewer-btn lw-viewer-close"
            onClick={onClose}
            aria-label="Close case study"
            title="Close (Esc)"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>
      </div>

      <div ref={bodyRef} className="lw-case-modal-body">
        <article className="lw-case-doc">
          <header>
            <p className="lw-work-category">{item.category}</p>
            <h2 id="case-title" className="lw-case-doc-title">
              {item.title}
            </h2>
            <p className="lw-case-doc-summary">{item.summary}</p>
            <ToolList tools={item.tools} />
          </header>

          {item.images.length > 0 && item.imageCaptions ? (
            // Captioned screenshots read as numbered steps, in the order the system runs.
            <ol className="lw-case-doc-gallery lw-case-steps">
              {item.images.map((src, index) => (
                <li key={src} className="lw-case-step">
                  <ProjectScreenshot
                    title={`${index + 1}. ${item.imageCaptions?.[index] ?? item.title}`}
                    images={[src]}
                    technologies={item.tools}
                    natural
                    hint="Click to enlarge"
                  />
                  <p className="lw-case-step-caption">
                    <span className="lw-case-step-num" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.imageCaptions?.[index]}
                  </p>
                </li>
              ))}
            </ol>
          ) : item.images.length > 0 ? (
            <div className="lw-case-doc-gallery">
              {item.images.map((src, index) => (
                <ProjectScreenshot
                  key={src}
                  title={`${item.title}${item.images.length > 1 ? ` (${index + 1})` : ""}`}
                  images={[src]}
                  technologies={item.tools}
                  natural
                  hint="Click to enlarge"
                />
              ))}
            </div>
          ) : null}

          {item.videos?.length ? (
            <section className="lw-case-videos" aria-labelledby="case-videos-title">
              <h3 id="case-videos-title" className="lw-label">
                Watch the demo
              </h3>
              <ul>
                {item.videos.map((video) => (
                  <li key={video.src}>
                    {/* Full recordings load only when played, so the case study stays fast. */}
                    <video
                      controls
                      preload="none"
                      playsInline
                      poster={video.poster}
                      aria-label={video.title}
                    >
                      <source src={video.src} type="video/mp4" />
                    </video>
                    <p className="lw-case-video-title">{video.title}</p>
                    <p className="lw-case-video-desc">{video.desc}</p>
                  </li>
                ))}
              </ul>
              <p className="lw-case-video-note">
                Recorded test calls in a demo setup with a fictional clinic. The caller&rsquo;s phone
                number and date of birth are blurred and muted for privacy.
              </p>
            </section>
          ) : null}

          <div className="lw-case-doc-grid">
            <section>
              <h3 className="lw-label">Business problem</h3>
              <p>{item.problem}</p>
            </section>
            <section>
              <h3 className="lw-label">What I built</h3>
              <ul className="lw-checklist">
                {item.built.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>
            {item.flow.length > 0 ? (
              <section>
                <h3 className="lw-label">How it works</h3>
                <ol className="lw-case-doc-flow">
                  {item.flow.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </section>
            ) : null}
            {item.design ? (
              <section>
                <h3 className="lw-label">Why it's designed this way</h3>
                <p>{item.design}</p>
              </section>
            ) : null}
            {item.applications ? (
              <section>
                <h3 className="lw-label">Where it fits</h3>
                <ul className="lw-bullets">
                  {item.applications.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          {item.builds ? (
            <div className="lw-case-doc-builds">
              {item.builds.map((build) => (
                <section key={build.title} className="lw-case-doc-build">
                  <div className="lw-case-doc-build-media">
                    <ProjectScreenshot
                      title={build.title}
                      images={build.images}
                      technologies={build.tools}
                      natural
                    />
                  </div>
                  <div>
                    <h3 className="lw-h4">{build.title}</h3>
                    <p>{build.desc}</p>
                    <ToolList tools={build.tools} />
                  </div>
                </section>
              ))}
            </div>
          ) : null}

          <p className="lw-case-doc-verify">
            <span className="lw-label">Verification</span>
            {item.verification}
          </p>
        </article>
      </div>
    </div>,
    document.body,
  );
}
