import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SiteHeader } from "@/components/site-header";

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.documentElement.className = "";
});

describe("Mobile navigation", () => {
  it("opens and closes the mobile menu", () => {
    render(<SiteHeader />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    const menu = document.getElementById("mobile-menu");
    expect(menu?.hidden).toBe(true);

    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(menu?.hidden).toBe(false);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(menu?.hidden).toBe(true);
  });

  it("closes the menu after choosing a section", () => {
    render(<SiteHeader />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const menu = document.getElementById("mobile-menu");
    const link = menu?.querySelector<HTMLAnchorElement>('a[href="#about"]');
    expect(link).toBeTruthy();
    fireEvent.click(link!);
    expect(menu?.hidden).toBe(true);
  });
});
