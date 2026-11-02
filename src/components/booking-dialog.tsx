import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { MouseEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import { booking, bookingEnabled, calLinkFromUrl, findMeeting, type Meeting } from "@/lib/booking";
import { loadCal, onCalScript } from "@/lib/cal-embed";

type BookingContextValue = { enabled: boolean; open: (meetingId?: string) => void };

const BookingContext = createContext<BookingContextValue>({ enabled: false, open: () => {} });

export function useBooking() {
  return useContext(BookingContext);
}

/** Wraps the page so any "Book a Call" button can open the same booking window. */
export function BookingProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const open = useCallback((meetingId?: string) => {
    if (bookingEnabled) setActiveId(findMeeting(meetingId).id);
  }, []);
  const value = useMemo(() => ({ enabled: bookingEnabled, open }), [open]);

  return (
    <BookingContext.Provider value={value}>
      {children}
      {activeId ? (
        <BookingDialog initialId={activeId} onClose={() => setActiveId(null)} />
      ) : null}
    </BookingContext.Provider>
  );
}

/**
 * A real link to the booking page that opens the in-page booking window instead.
 * Without JavaScript (or if the window can't open) it still works as a normal link.
 */
export function BookCallButton({
  meetingId,
  className = "lw-btn lw-btn-primary",
  children = "Book a Call",
  onBeforeOpen,
}: {
  meetingId?: string;
  className?: string;
  children?: ReactNode;
  onBeforeOpen?: () => void;
}) {
  const { enabled, open } = useBooking();
  if (!enabled) return null;
  const meeting = findMeeting(meetingId);

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
    onBeforeOpen?.();
    // On phones the embedded booking form can be cut off (especially in in-app browsers
    // such as Messenger or LinkedIn), so the link opens the full Cal.com page instead.
    if (window.matchMedia("(max-width: 767px)").matches) return;
    event.preventDefault();
    open(meeting.id);
  };

  return (
    <a
      href={meeting.url}
      target="_blank"
      rel="noreferrer"
      className={className}
      aria-haspopup="dialog"
      onClick={onClick}
      data-booking-trigger={meeting.id}
    >
      {children}
    </a>
  );
}

type EmbedStatus = "loading" | "ready" | "failed";

function currentTheme(): "dark" | "light" {
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

function BookingDialog({ initialId, onClose }: { initialId: string; onClose: () => void }) {
  const [activeId, setActiveId] = useState(initialId);
  const [mounted, setMounted] = useState<string[]>([initialId]);
  const [status, setStatus] = useState<Record<string, EmbedStatus>>({});
  const [booked, setBooked] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const meeting = findMeeting(activeId);

  const select = (id: string) => {
    setActiveId(id);
    setMounted((list) => (list.includes(id) ? list : [...list, id]));
  };

  // Lock page scroll, remember where the visitor was, return focus on close.
  useLayoutEffect(() => {
    const scrollY = window.scrollY;
    const html = document.documentElement;
    const body = document.body;
    const previousFocus = document.activeElement as HTMLElement | null;
    const gap = window.innerWidth - html.clientWidth;
    const saved = {
      html: html.style.overflow,
      body: body.style.overflow,
      padding: body.style.paddingRight,
    };
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      html.style.overflow = saved.html;
      body.style.overflow = saved.body;
      body.style.paddingRight = saved.padding;
      window.scrollTo({ top: scrollY, behavior: "instant" as ScrollBehavior });
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  // Escape closes; Tab stays inside the window (the calendar itself is an iframe).
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          "button:not(:disabled), a[href], iframe",
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

  const setOne = useCallback((id: string, next: EmbedStatus) => {
    setStatus((all) => (all[id] === next ? all : { ...all, [id]: next }));
  }, []);

  const activeStatus = status[activeId] ?? "loading";

  return createPortal(
    <div
      ref={dialogRef}
      className="lw-viewer lw-booking-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
    >
      <div className="lw-viewer-bar">
        <div className="lw-viewer-title">
          <p id="booking-title" className="lw-viewer-name">
            Book a call with Jonathan
          </p>
          <p className="lw-viewer-caption">Times are shown in your own time zone.</p>
        </div>
        <div className="lw-viewer-tools">
          <button
            ref={closeRef}
            type="button"
            className="lw-viewer-btn lw-viewer-close"
            onClick={onClose}
            aria-label="Close booking window"
            title="Close (Esc)"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>
      </div>

      <div className="lw-booking-body">
        <div className="lw-booking-types" role="tablist" aria-label="Meeting type">
          {booking.meetings.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`booking-tab-${item.id}`}
              aria-selected={item.id === activeId}
              aria-controls={`booking-panel-${item.id}`}
              className="lw-booking-type"
              onClick={() => select(item.id)}
            >
              <span className="lw-booking-type-title">{item.title}</span>
              <span className="lw-booking-type-meta" data-short={`${item.minutes} min`}>
                {item.minutes} min · {item.audience}
              </span>
            </button>
          ))}
        </div>

        {booked ? (
          <p className="lw-booking-success" role="status">
            You&rsquo;re booked. A confirmation email with the Google Meet link is on its way.
          </p>
        ) : null}

        <div className="lw-booking-stage">
          {mounted.map((id) => (
            <BookingEmbed
              key={id}
              meeting={findMeeting(id)}
              active={id === activeId}
              onStatus={setOne}
              onBooked={setBooked}
            />
          ))}
          {activeStatus !== "ready" ? (
            <div className="lw-booking-status" aria-live="polite">
              {activeStatus === "failed" ? (
                <>
                  <p>The calendar couldn&rsquo;t load here.</p>
                  <a className="lw-btn lw-btn-primary" href={meeting.url} target="_blank" rel="noreferrer">
                    Open the booking page
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </>
              ) : (
                <p>Loading available times…</p>
              )}
            </div>
          ) : null}
        </div>

        <p className="lw-booking-foot">
          Having trouble?{" "}
          <a href={meeting.url} target="_blank" rel="noreferrer">
            Open the {meeting.title} page on Cal.com ↗
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      </div>
    </div>,
    document.body,
  );
}

/** One embedded scheduler. Each meeting keeps its own embed so switching tabs is instant. */
function BookingEmbed({
  meeting,
  active,
  onStatus,
  onBooked,
}: {
  meeting: Meeting;
  active: boolean;
  onStatus: (id: string, status: EmbedStatus) => void;
  onBooked: (id: string) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    onStatus(meeting.id, "loading");

    // Any provider that can be shown in a frame, such as a GoHighLevel calendar widget.
    if (booking.provider === "iframe") {
      const frame = document.createElement("iframe");
      frame.src = meeting.url;
      frame.title = `${meeting.title} booking calendar`;
      frame.className = "lw-booking-frame";
      frame.addEventListener("load", () => onStatus(meeting.id, "ready"));
      host.appendChild(frame);
      return () => frame.remove();
    }

    const cal = loadCal(booking.calcom.script);
    const ns = meeting.id;
    const theme = currentTheme();
    cal("init", ns, { origin: booking.calcom.origin });
    const api = cal.ns[ns];
    api("inline", {
      elementOrSelector: host,
      calLink: calLinkFromUrl(meeting.url),
      config: { layout: "month_view", theme },
    });
    api("ui", {
      theme,
      hideEventTypeDetails: true,
      styles: { branding: { brandColor: booking.calcom.brandColor } },
    });
    const ready = () => onStatus(meeting.id, "ready");
    const booked = () => onBooked(meeting.id);
    for (const action of ["linkReady", "bookerReady"]) api("on", { action, callback: ready });
    for (const action of ["bookingSuccessfulV2", "bookingSuccessful"]) {
      api("on", { action, callback: booked });
    }

    // Also treat the calendar as ready once its iframe has loaded, in case the
    // embed's ready events change names in a future version.
    const observer = new MutationObserver(() => {
      const frame = host.querySelector("iframe");
      if (frame && !frame.dataset.watched) {
        frame.dataset.watched = "true";
        frame.addEventListener("load", ready);
      }
    });
    observer.observe(host, { childList: true, subtree: true });

    // If the script is blocked, or the calendar never appears, offer the direct link.
    const stopWatching = onCalScript((state) => {
      if (state === "failed") onStatus(meeting.id, "failed");
    });
    const timer = window.setTimeout(() => {
      if (!host.querySelector("iframe")) onStatus(meeting.id, "failed");
    }, 15000);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      stopWatching();
      host.replaceChildren();
    };
  }, [meeting, onStatus, onBooked]);

  return (
    <div
      ref={hostRef}
      id={`booking-panel-${meeting.id}`}
      role="tabpanel"
      aria-labelledby={`booking-tab-${meeting.id}`}
      className="lw-booking-embed"
      hidden={!active}
    />
  );
}
