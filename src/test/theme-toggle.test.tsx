import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ThemeToggle } from "@/components/theme-toggle";

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.documentElement.className = "";
});

describe("Portfolio theme preference", () => {
  it("switches between light and dark and saves the selected mode", () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button", { name: "Switch to light mode" }));
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(localStorage.getItem("portfolio-theme")).toBe("light");
    fireEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.classList.contains("light")).toBe(false);
    expect(localStorage.getItem("portfolio-theme")).toBe("dark");
  });

  it("restores a previously selected light mode", () => {
    localStorage.setItem("portfolio-theme", "light");
    render(<ThemeToggle />);
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(screen.getByRole("button", { name: "Switch to dark mode" })).toBeDefined();
  });
});
