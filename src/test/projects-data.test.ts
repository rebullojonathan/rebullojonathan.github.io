import { describe, expect, it } from "vitest";
import { booking, calLinkFromUrl } from "@/lib/booking";
import { findWork, moreWork, selectedWork, work } from "@/lib/work";

const allText = JSON.stringify(work);

describe("Project accuracy", () => {
  it("shows the four selected projects on the homepage, voice agent first", () => {
    expect(selectedWork.map((p) => p.title)).toEqual([
      "AI Voice Appointment Setter",
      "Messenger AI Lead Agent → GoHighLevel",
      "GoHighLevel CRM Pipeline Management",
      "GoHighLevel CRM Lead Automation",
    ]);
  });

  it("keeps every other project available as a case study", () => {
    expect(moreWork.map((p) => p.title)).toEqual([
      "RAG Knowledge Assistant",
      "Facebook Messenger AI Chatbot",
      "HR Job Posting & Evaluation Assistant",
      "Zapier & Make.com Automations",
    ]);
    expect(findWork("zapier-make-automations")?.builds).toHaveLength(5);
  });

  it("lists only the voice agent features that have been tested", () => {
    const voice = findWork("ai-voice-appointment-setter")!;
    const text = JSON.stringify(voice.built);
    // Booking, rescheduling, cancellation and Airtable logging were tested with web calls.
    // Reminders and GoHighLevel sync are not built yet.
    expect(text).not.toMatch(/reminder|GoHighLevel|phone number/i);
    expect(voice.verification).toMatch(/web test calls/i);
    expect(voice.verification).toMatch(/fictional/i);
  });

  it("does not list lead assignment workflows for GHL lead automation yet", () => {
    const automation = findWork("ghl-lead-automation")!;
    expect(automation.built.join(" ")).not.toMatch(/assign/i);
  });

  it("states where the GoHighLevel projects were built, inside the case study", () => {
    for (const slug of ["ghl-pipeline-management", "ghl-lead-automation"]) {
      expect(findWork(slug)?.verification).toMatch(/demo environment/i);
    }
  });

  it("keeps verification honest for unfinished or course-based work", () => {
    expect(findWork("automated-video-creator")?.verification).toMatch(/pending/i);
    expect(findWork("hr-evaluation-assistant")?.verification).toMatch(/training/i);
    expect(findWork("messenger-ai-chatbot")?.verification).toMatch(/paused/i);
  });

  it("never claims production use, paying clients, results or 24/7 operation", () => {
    expect(allText).not.toMatch(/production|paying client|testimonial|24\/7|increased|% /i);
  });

  it("never uses pending-work or student-style labels", () => {
    expect(allText).not.toMatch(/coming soon|in development|on build|still learning|beginner/i);
  });
});

describe("Booking", () => {
  it("books through the three tested Cal.com meeting types", () => {
    expect(booking.meetings.map((m) => [m.title, m.minutes])).toEqual([
      ["Discovery Call", 30],
      ["Client Interview", 45],
      ["Project Consultation", 30],
    ]);
    for (const meeting of booking.meetings) {
      expect(meeting.url).toBe(`https://cal.com/neo-rebullo/${meeting.id}`);
      expect(calLinkFromUrl(meeting.url)).toBe(`neo-rebullo/${meeting.id}`);
    }
  });
});
