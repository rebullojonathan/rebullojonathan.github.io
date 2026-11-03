import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ROW_SECONDS, ToolsMarquee } from "@/components/tools-marquee";
import { allTools, toolRows } from "@/lib/tools";

const required = [
  "n8n", "GoHighLevel", "Zapier", "Make", "Vapi",
  "ChatGPT", "Claude AI", "Google Gemini", "OpenRouter",
  "Supabase", "Airtable", "Google Sheets", "Google Drive", "Google Calendar",
  "Google Meet", "Cal.com",
  "GitHub", "Lovable",
  "Asana", "ClickUp", "Xero", "Google Cloud Console",
];
const excluded = [
  "Visual Studio Code", "YouTube", "Facebook", "Instagram", "Canva", "OBS Studio", "Obsidian", "Gmail",
];

describe("Tools marquee", () => {
  it("lists the 22 approved applications exactly once", () => {
    const names = allTools.map((tool) => tool.name);
    expect(names).toHaveLength(22);
    expect(new Set(names).size).toBe(22);
    for (const name of excluded) expect(names).not.toContain(name);
    expect([...names].sort()).toEqual([...required].sort());
    for (const tool of allTools) expect(tool.logo).toBeTruthy();
  });

  it("splits the tools into two rows of 11 that run in opposite directions at 22 s and 26 s", () => {
    expect(toolRows[0]).toHaveLength(11);
    expect(toolRows[1]).toHaveLength(11);
    expect(new Set([...toolRows[0], ...toolRows[1]].map((tool) => tool.name)).size).toBe(22);
    expect(ROW_SECONDS).toEqual([22, 26]);
    const { container } = render(<ToolsMarquee />);
    const rows = container.querySelectorAll(".lw-marquee-row");
    expect(rows).toHaveLength(2);
    expect(rows[0].hasAttribute("data-reverse")).toBe(false);
    expect(rows[1].hasAttribute("data-reverse")).toBe(true);
    const durations = [...rows].map((row) =>
      (row.querySelector(".lw-marquee-track") as HTMLElement).style.getPropertyValue("--marquee-duration"),
    );
    expect(durations).toEqual(["22s", "26s"]);
  });

  it("exposes each tool once to screen readers and hides the loop copies", () => {
    const { container } = render(<ToolsMarquee />);
    const visible = container.querySelectorAll(".lw-marquee-set:not([aria-hidden]) li");
    expect(visible).toHaveLength(22);
  });
});
