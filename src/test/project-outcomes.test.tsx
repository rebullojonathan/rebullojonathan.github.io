import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { WorkSection } from "@/components/work-section";
import { hiddenWorkSlugs, work } from "@/lib/work";

const visible = work.filter((item) => !(hiddenWorkSlugs as readonly string[]).includes(item.slug));

describe("Project outcomes", () => {
  it("gives every visible project a card outcome and case-study outcome bullets", () => {
    for (const item of visible) {
      expect(item.outcome, item.slug).toBeTruthy();
      expect(item.outcomes?.length ?? 0, item.slug).toBeGreaterThan(0);
    }
  });

  it("does not claim client revenue or client results", () => {
    const text = visible.flatMap((item) => [item.outcome ?? "", ...(item.outcomes ?? [])]).join(" ");
    expect(text).not.toMatch(/\$\s?\d|revenue|clients? (?:saw|got|earned)/i);
  });

  it("shows the outcome line on the homepage project cards", () => {
    render(<WorkSection />);
    expect(screen.getAllByText("Outcome").length).toBeGreaterThanOrEqual(4);
    expect(screen.getByText(/within 3–5 seconds of their confirmation/)).toBeTruthy();
  });
});
