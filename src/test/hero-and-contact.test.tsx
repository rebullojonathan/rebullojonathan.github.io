import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ContactSection } from "@/components/contact-section";
import { HeroWorkflow } from "@/components/hero-workflow";
import { BookingProvider } from "@/components/booking-dialog";

afterEach(cleanup);

describe("Living Workflow hero", () => {
  it("leads with the specialization, booking and both original CTAs", () => {
    render(
      <BookingProvider>
        <HeroWorkflow />
      </BookingProvider>,
    );
    const heading = screen.getByRole("heading", { level: 1 }).textContent ?? "";
    expect(heading).toContain("AI Automation Specialist");
    expect(heading).not.toContain("CRM");
    expect(screen.getByRole("link", { name: "Book a Call" }).getAttribute("href")).toBe(
      "https://cal.com/neo-rebullo/discovery-call",
    );
    expect(screen.getByRole("link", { name: "View Projects" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Contact Me" })).toBeDefined();
    expect(screen.getByText(/Available for Projects/)).toBeDefined();
  });

  it("shows only the small intro photo in the hero, linking to About", () => {
    const { container } = render(<HeroWorkflow />);
    const images = container.querySelectorAll("img");
    expect(images).toHaveLength(1);
    expect(images[0].closest("a")?.getAttribute("href")).toBe("#about");
    expect(screen.getByText(/Hi, I.m Jonathan Rebullo/)).toBeDefined();
  });

  it("reveals example tools when a workflow node is selected", () => {
    render(<HeroWorkflow />);
    const node = screen.getByRole("button", { name: /Appointment/ });
    expect(node.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(node);
    expect(node.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Google Calendar")).toBeDefined();
  });
});

describe("Contact section", () => {
  it("offers email contact and the three booking options", () => {
    render(
      <BookingProvider>
        <ContactSection />
      </BookingProvider>,
    );
    expect(screen.getByRole("link", { name: "Contact Me" }).getAttribute("href")).toBe(
      "mailto:neo.rebullo@gmail.com",
    );
    expect(screen.getByTestId("booking-panel")).toBeDefined();
    // Each booking button is a real link to the Cal.com page, so it works without JavaScript.
    for (const id of ["discovery-call", "client-interview", "project-consultation"]) {
      expect(
        document.querySelector(`[data-booking-trigger="${id}"]`)?.getAttribute("href"),
      ).toBe(`https://cal.com/neo-rebullo/${id}`);
    }
  });
});
