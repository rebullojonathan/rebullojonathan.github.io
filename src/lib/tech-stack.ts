import n8n from "@/assets/tech-stack/n8n.svg";
import make from "@/assets/tech-stack/make.svg";
import zapier from "@/assets/tech-stack/zapier.svg";
import highlevel from "@/assets/tech-stack/gohighlevel.svg";
import openai from "@/assets/tech-stack/openai.svg";
import claude from "@/assets/tech-stack/claude.svg";
import gemini from "@/assets/tech-stack/google-gemini.svg";
import openrouter from "@/assets/tech-stack/openrouter.svg";
import supabase from "@/assets/tech-stack/supabase.svg";
import vapi from "@/assets/tech-stack/vapi.svg";
import drive from "@/assets/tech-stack/google-drive.svg";
import lovable from "@/assets/tech-stack/lovable.svg";
import github from "@/assets/tech-stack/github.svg";
import render from "@/assets/tech-stack/render.svg";
import airtable from "@/assets/tech-stack/airtable.svg";
import sheets from "@/assets/tech-stack/google-sheets.svg";
import calendar from "@/assets/tech-stack/google-calendar.svg";
import cloud from "@/assets/tech-stack/google-cloud.svg";
import ffmpeg from "@/assets/tech-stack/ffmpeg.svg";

export const techGroups = [
  {
    name: "AI Automation",
    tools: [
      { name: "n8n", logo: n8n, href: "https://n8n.io" },
      { name: "Make", logo: make, href: "https://www.make.com" },
      { name: "Zapier", logo: zapier, href: "https://zapier.com" },
    ],
  },
  {
    name: "CRM & Sales Funnels",
    tools: [
      { name: "GoHighLevel (GHL)", logo: highlevel, href: "https://www.gohighlevel.com" },
    ],
  },
  {
    name: "AI Models & Platforms",
    tools: [
      { name: "OpenAI / ChatGPT", logo: openai, href: "https://openai.com" },
      { name: "Anthropic Claude", logo: claude, href: "https://claude.ai" },
      { name: "Google Gemini", logo: gemini, href: "https://gemini.google.com" },
      { name: "OpenRouter", logo: openrouter, href: "https://openrouter.ai" },
    ],
  },
  {
    name: "AI Agents, Voice & RAG",
    tools: [
      { name: "Supabase", logo: supabase, href: "https://supabase.com" },
      { name: "Vapi", logo: vapi, href: "https://vapi.ai" },
      { name: "Google Drive", logo: drive, href: "https://drive.google.com" },
    ],
  },
  {
    name: "Development & Deployment",
    tools: [
      { name: "Lovable", logo: lovable, href: "https://lovable.dev" },
      { name: "GitHub", logo: github, href: "https://github.com" },
      { name: "Render", logo: render, href: "https://render.com" },
    ],
  },
  {
    name: "Business Integrations",
    tools: [
      { name: "Airtable", logo: airtable, href: "https://airtable.com" },
      { name: "Google Sheets", logo: sheets, href: "https://sheets.google.com" },
      { name: "Google Calendar", logo: calendar, href: "https://calendar.google.com" },
      { name: "Google Cloud", logo: cloud, href: "https://cloud.google.com" },
    ],
  },
  {
    name: "Video & Creative Tools",
    tools: [{ name: "FFmpeg", logo: ffmpeg, href: "https://ffmpeg.org" }],
  },
];

export const techTools = techGroups.flatMap((group) => group.tools);
