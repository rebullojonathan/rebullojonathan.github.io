import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { FooterRider } from "@/components/footer-rider";

describe("Footer rider animation", () => {
  it("is decorative: hidden from screen readers and not focusable", () => {
    const { container } = render(<FooterRider />);
    const rider = container.querySelector(".lw-rider");
    expect(rider?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelectorAll("a, button, [tabindex]")).toHaveLength(0);
  });

  it("draws the stick figure and both square wheels", () => {
    const { container } = render(<FooterRider />);
    expect(container.querySelectorAll(".lw-rider-wheel")).toHaveLength(2);
    expect(container.querySelector("circle[r='11']")).not.toBeNull();
    expect(container.querySelectorAll(".lw-rider-piece")).toHaveLength(10);
  });

  it("does not ride until the footer is on screen", () => {
    const { container } = render(<FooterRider />);
    expect(container.querySelector(".lw-rider")?.getAttribute("data-riding")).toBe("false");
  });
});
