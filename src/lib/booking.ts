/**
 * Booking configuration.
 *
 * Every booking button on the site reads from here. To switch providers later
 * (for example to a GoHighLevel calendar), change `provider` and the meeting URLs:
 *
 * - "calcom": embeds Cal.com's own scheduler (loads https://app.cal.com/embed/embed.js).
 * - "iframe": shows any booking page that can be framed, such as a GoHighLevel
 *   calendar widget URL, inside the same booking window.
 *
 * Set `enabled` to false to hide every booking button and fall back to email only.
 * Only list meeting links that have passed a real test booking.
 */

export type BookingProvider = "calcom" | "iframe";

export type Meeting = {
  /** Stable id, also used as the embed namespace. */
  id: string;
  title: string;
  minutes: number;
  /** One short line telling a visitor which meeting to pick. */
  audience: string;
  /** Public booking page. Used for the embed and for the "open in a new tab" fallback. */
  url: string;
};

const meetings: Meeting[] = [
  {
    id: "discovery-call",
    title: "Discovery Call",
    minutes: 30,
    audience: "For businesses exploring what to automate",
    url: "https://cal.com/neo-rebullo/discovery-call",
  },
  {
    id: "client-interview",
    title: "Client Interview",
    minutes: 45,
    audience: "For recruiters and companies hiring",
    url: "https://cal.com/neo-rebullo/client-interview",
  },
  {
    id: "project-consultation",
    title: "Project Consultation",
    minutes: 30,
    audience: "For a specific project you already have in mind",
    url: "https://cal.com/neo-rebullo/project-consultation",
  },
];

export const booking = {
  enabled: true,
  provider: "calcom" as BookingProvider,
  /** Cal.com embed script and app origin (only used by the "calcom" provider). */
  calcom: {
    origin: "https://app.cal.com",
    script: "https://app.cal.com/embed/embed.js",
    brandColor: "#e5484d",
  },
  /** Shown first when a visitor clicks a generic "Book a Call" button. */
  defaultMeetingId: "discovery-call",
  meetings,
};

export const bookingEnabled = booking.enabled && booking.meetings.length > 0;

export function findMeeting(id?: string): Meeting {
  return (
    booking.meetings.find((meeting) => meeting.id === id) ??
    booking.meetings.find((meeting) => meeting.id === booking.defaultMeetingId) ??
    booking.meetings[0]
  );
}

/** "https://cal.com/neo-rebullo/discovery-call" -> "neo-rebullo/discovery-call" */
export function calLinkFromUrl(url: string): string {
  try {
    return new URL(url).pathname.replace(/^\/+|\/+$/g, "");
  } catch {
    return url.replace(/^https?:\/\/[^/]+\//, "").replace(/\/+$/, "");
  }
}
