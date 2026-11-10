import { useState } from "react";
import { BookCallButton } from "@/components/booking-dialog";
import { ContactForm } from "@/components/contact-form";
import { booking, bookingEnabled } from "@/lib/booking";
import { site } from "@/lib/site";

export function ContactSection() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="contact" className="lw-section" aria-labelledby="contact-title">
      <div className="lw-container">
        <div className="lw-contact" data-reveal>
          <div className="lw-contact-top">
            <div className="lw-contact-intro">
              <p className="lw-eyebrow">
                <span className="lw-mono-index">07</span> Contact
              </p>
              <h2 id="contact-title" className="lw-h2">
                Let’s automate your business
              </h2>
              <p className="lw-lead">
                Missed calls, slow follow-up, or a CRM nobody updates? Tell me about the workflow and
                I’ll reply with how I’d approach it.
              </p>

              <div className="lw-contact-actions">
                <BookCallButton className="lw-btn lw-btn-primary lw-btn-lg" />
                <a
                  href={`mailto:${site.email}`}
                  className={`lw-btn ${bookingEnabled ? "lw-btn-ghost" : "lw-btn-primary"} lw-btn-lg`}
                >
                  Contact Me
                </a>
                <a href={site.linkedin} target="_blank" rel="noreferrer" className="lw-btn lw-btn-ghost lw-btn-lg">
                  LinkedIn
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </div>

              <div className="lw-contact-email">
                <a href={`mailto:${site.email}`}>{site.email}</a>
                <button type="button" className="lw-copy" onClick={copyEmail}>
                  {copied ? "Copied" : "Copy"}
                </button>
                <span className="sr-only" aria-live="polite">
                  {copied ? "Email address copied" : ""}
                </span>
              </div>
              <p className="lw-contact-meta">
                Based in {site.location} · {site.timezone}
              </p>
            </div>

            {bookingEnabled ? <CalendarCard /> : null}
          </div>

          {bookingEnabled ? (
            <div className="lw-booking" data-testid="booking-panel">
              <p className="lw-label">Pick a meeting</p>
              <ul className="lw-booking-list">
                {booking.meetings.map((meeting) => (
                  <li key={meeting.id}>
                    <BookCallButton meetingId={meeting.id} className="lw-booking-option">
                      <span className="lw-booking-option-title">{meeting.title}</span>
                      <span className="lw-booking-option-meta">
                        {meeting.minutes} min · {meeting.audience}
                      </span>
                      <span className="lw-booking-option-cta" aria-hidden="true">
                        Book →
                      </span>
                    </BookCallButton>
                  </li>
                ))}
              </ul>
              <p className="lw-contact-meta">
                Video calls on Google Meet. Times are shown in your own time zone.
              </p>
            </div>
          ) : null}

          <ContactForm />
        </div>
      </div>
    </section>
  );
}

/** Calendar call-to-action beside the contact intro, so visitors see they can book directly. */
function CalendarCard() {
  return (
    <aside className="lw-calendar-card" aria-labelledby="calendar-card-title">
      {/* Decorative calendar illustration; it does not show real availability. */}
      <div className="lw-calendar-art" aria-hidden="true">
        <div className="lw-calendar-art-head">
          <span />
          <span />
        </div>
        <div className="lw-calendar-art-grid">
          {Array.from({ length: 21 }, (_, i) => (
            <span key={i} className={i === 9 ? "is-picked" : undefined} />
          ))}
        </div>
      </div>
      <h3 id="calendar-card-title" className="lw-calendar-card-title">
        Book a call on my calendar
      </h3>
      <p className="lw-calendar-card-text">
        Pick a time that works for you. No back-and-forth emails.
      </p>
      <ul className="lw-calendar-card-facts">
        <li>Free 30-minute discovery call</li>
        <li>Video call on Google Meet</li>
        <li>Times shown in your own time zone</li>
      </ul>
      <BookCallButton meetingId="discovery-call" className="lw-btn lw-btn-primary lw-btn-lg lw-calendar-card-btn">
        Open my calendar <span aria-hidden="true">→</span>
      </BookCallButton>
      <p className="lw-calendar-card-note">Recruiter or specific project? More meeting types below.</p>
    </aside>
  );
}
