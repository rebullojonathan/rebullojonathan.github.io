import n8n from "@/assets/tech-stack/n8n.svg";
import highlevel from "@/assets/tech-stack/gohighlevel.svg";
import zapier from "@/assets/tech-stack/zapier-icon.svg";
import make from "@/assets/tech-stack/make.svg";
import vapi from "@/assets/tech-stack/vapi.svg";
import openai from "@/assets/tech-stack/openai.svg";
import claude from "@/assets/tech-stack/claude.svg";
import gemini from "@/assets/tech-stack/google-gemini.svg";
import openrouter from "@/assets/tech-stack/openrouter.svg";
import supabase from "@/assets/tech-stack/supabase.svg";
import airtable from "@/assets/tech-stack/airtable.svg";
import sheets from "@/assets/tech-stack/google-sheets.svg";
import drive from "@/assets/tech-stack/google-drive.svg";
import calendar from "@/assets/tech-stack/google-calendar.svg";
import meet from "@/assets/tech-stack/google-meet.svg";
import calcom from "@/assets/tech-stack/cal-com.svg";
import github from "@/assets/tech-stack/github.svg";
import lovable from "@/assets/tech-stack/lovable.svg";
import asana from "@/assets/tech-stack/asana.svg";
import clickup from "@/assets/tech-stack/clickup.svg";
import xero from "@/assets/tech-stack/xero.svg";
import cloud from "@/assets/tech-stack/google-cloud.svg";

/**
 * Applications shown in the "Tools I work with" marquee, in display order.
 * `mono` marks single-colour black logos that are turned white in dark mode so they stay visible.
 * Logo sources: existing project assets, gilbarbara/logos and Simple Icons (CC0).
 */
export type Tool = { name: string; logo: string; mono?: boolean };

export const toolCategories: { name: string; tools: Tool[] }[] = [
  {
    name: "AI Automation & CRM",
    tools: [
      { name: "n8n", logo: n8n },
      { name: "GoHighLevel", logo: highlevel },
      { name: "Zapier", logo: zapier },
      { name: "Make", logo: make },
      { name: "Vapi", logo: vapi },
    ],
  },
  {
    name: "AI Applications",
    tools: [
      { name: "ChatGPT", logo: openai, mono: true },
      { name: "Claude AI", logo: claude },
      { name: "Google Gemini", logo: gemini },
      { name: "OpenRouter", logo: openrouter, mono: true },
    ],
  },
  {
    name: "Database & Productivity",
    tools: [
      { name: "Supabase", logo: supabase },
      { name: "Airtable", logo: airtable },
      { name: "Google Sheets", logo: sheets },
      { name: "Google Drive", logo: drive },
      { name: "Google Calendar", logo: calendar },
      { name: "Google Meet", logo: meet },
      { name: "Cal.com", logo: calcom, mono: true },
    ],
  },
  {
    name: "Web Development & Design",
    tools: [
      { name: "GitHub", logo: github, mono: true },
      { name: "Lovable", logo: lovable },
    ],
  },
  {
    name: "Other Business Applications",
    tools: [
      { name: "Asana", logo: asana },
      { name: "ClickUp", logo: clickup },
      { name: "Xero", logo: xero },
      { name: "Google Cloud Console", logo: cloud },
    ],
  },
];

export const allTools = toolCategories.flatMap((category) => category.tools);

/** Two marquee rows of 11: the first half of the list and the second half. */
export const toolRows: [Tool[], Tool[]] = [allTools.slice(0, 11), allTools.slice(11)];
