/**
 * Frequently asked questions. Shown on the page and published as FAQPage
 * structured data, so search engines and AI assistants read the same answers
 * a visitor sees.
 *
 * Keep every answer accurate: no client results, metrics or production claims.
 */
export type FaqItem = { question: string; answer: string };

export const faqs: FaqItem[] = [
  {
    question: "What kind of work do you automate?",
    answer:
      "Repetitive business tasks: capturing and following up on leads, booking appointments, updating CRM records, answering common customer questions and moving data between the apps a business already uses.",
  },
  {
    question: "Can you build an AI voice agent that books appointments?",
    answer:
      "Yes. My AI Voice Appointment Setter uses Vapi, n8n and Google Calendar to check availability and book, reschedule or cancel appointments during the call, and logs each booking to Airtable. Recorded test runs are in the Selected work section.",
  },
  {
    question: "Which tools do you work with?",
    answer:
      "n8n, GoHighLevel, Zapier, Make.com, Vapi, OpenAI, Gemini, Claude, OpenRouter, Supabase, Airtable and Google Workspace, connected through APIs and webhooks.",
  },
  {
    question: "What do you set up in GoHighLevel?",
    answer:
      "Sales pipelines and stages, forms that send leads into the CRM, opportunities, user roles and permissions, and lead assignment. My two GoHighLevel projects show a real estate pipeline from new lead to site viewing.",
  },
  {
    question: "Which businesses is this a good fit for?",
    answer:
      "Businesses that depend on leads and appointments, such as real estate teams, agencies and service businesses. My six years in sales shape how I design lead capture, follow-up and booking flows.",
  },
  {
    question: "Can you work with clients outside the Philippines?",
    answer:
      "Yes. I work remotely from the Philippines (UTC+8). You can book a call from this page, and the booking page shows open times in your own time zone.",
  },
  {
    question: "How does a project start?",
    answer:
      "With a short discovery call to map your current process and pick the bottleneck worth automating first. I then build and test the system in your tools, and hand it over with documentation.",
  },
];
