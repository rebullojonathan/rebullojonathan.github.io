import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ToolsMarquee } from "@/components/tools-marquee";
import { allTools, toolRows } from "@/lib/tools";

const required = [
  "n8n", "GoHighLevel", "Zapier", "Make", "Vapi",
  "ChatGPT", "Claude AI", "Google Gemini", "OpenRouter",
  "Supabase", "Airtable", "Google Sheets", "Google Drive", "Google Calendar", "Gmail",
  "Google Meet", "Cal.com", "Obsidian",
  "GitHub", "Lovable", "Visual Studio Code", "Canva",
  "OBS Studio", "YouTube", "Facebook", "Instagram",
  "Asana", "ClickUp", "Xero", "Google Cloud Console",
];

describe("Tools marquee", () => {
  it("lists all 30 required applications exactly once", () => {
    const names = allTools.map((tool) => tool.name);
    expect(names).toHaveLength(30);
    expect(new Set(names).size).toBe(30);
    expect([...names].sort()).toEqual([...required].sort());
    for (const tool of allTools) expect(tool.logo).toBeTruthy();
  });

  it("splits the tools into two rows of 15 that run in opposite directions", () => {
    expect(toolRows[0]).toHaveLength(15);
    expect(toolRows[1]).toHaveLength(15);
    const { container } = render(<ToolsMarquee />);
    const rows = container.querySelectorAll(".lw-marquee-row");
    expect(rows).toHaveLength(2);
    expect(rows[0].hasAttribute("data-reverse")).toBe(false);
    expect(rows[1].hasAttribute("data-reverse")).toBe(true);
  });

  it("exposes each tool once to screen readers and hides the loop copies", () => {
    const { container } = render(<ToolsMarquee />);
    const visible = container.querySelectorAll(".lw-marquee-set:not([aria-hidden]) li");
    expect(visible).toHaveLength(30);
  });
});
