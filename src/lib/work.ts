import videoCreatorShot from "@/assets/portfolio/automated-video-creator.png";
import hrAssistantShot from "@/assets/portfolio/hr-evaluation-assistant.png";
import hrAssistantDetailShot from "@/assets/portfolio/hr-evaluation-assistant-detail.png";
import zapierContentRepurposing from "@/assets/portfolio/zapier-ai-content-repurposing.jpg";
import zapierAsanaCrm from "@/assets/portfolio/zapier-asana-crm-lead-engagement.png";
import zapierLeadEnrichment1 from "@/assets/portfolio/zapier-lead-enrichment-1.png";
import zapierLeadEnrichment2 from "@/assets/portfolio/zapier-lead-enrichment-2.png";
import makeAsanaXero from "@/assets/portfolio/make-asana-xero-integration.png";
import makeGmailAttachment from "@/assets/portfolio/make-gmail-attachment-automation.png";
import voiceVapiTools from "@/assets/portfolio/voice-vapi-tools.png";
import voiceN8nGetBook from "@/assets/portfolio/voice-n8n-get-book.png";
import voiceRescheduleTranscript from "@/assets/portfolio/voice-reschedule-transcript.png";
import voiceAirtableLog from "@/assets/portfolio/voice-airtable-log.png";
import voiceN8nUpdateCancel from "@/assets/portfolio/voice-n8n-update-cancel.png";
import voiceBookVideo from "@/assets/videos/getslot_to_book_slot.mp4";
import voiceBookPoster from "@/assets/videos/getslot_to_book_slot-poster.jpg";
import voiceUpdateVideo from "@/assets/videos/updateslots.mp4";
import voiceUpdatePoster from "@/assets/videos/updateslots-poster.jpg";
import voiceCancelVideo from "@/assets/videos/cancelslots.mp4";
import voiceCancelPoster from "@/assets/videos/cancelslots-poster.jpg";
import leadAgentDemoVideo from "@/assets/videos/messenger_lead_agent_demo.mp4";
import leadAgentDemoPoster from "@/assets/videos/messenger_lead_agent_demo-poster.jpg";
import leadAgentWalkthroughVideo from "@/assets/videos/messenger_lead_agent_walkthrough.mp4";
import leadAgentWalkthroughPoster from "@/assets/videos/messenger_lead_agent_walkthrough-poster.jpg";
import leadAgentWorkflow from "@/assets/portfolio/messenger-lead-agent-workflow.png";
import leadAgentSaveToGhl from "@/assets/portfolio/messenger-lead-agent-save-to-ghl.png";
import leadAgentGhlPipeline from "@/assets/portfolio/messenger-lead-agent-ghl-pipeline.png";
import ragAssistantShot from "@/assets/portfolio/rag-knowledge-assistant.png";
import ragAssistantTriggers from "@/assets/portfolio/rag-knowledge-assistant-triggers.png";
import messengerChatbotShot from "@/assets/portfolio/messenger-ai-chatbot.png";
import jobFinderShot from "@/assets/portfolio/automated-job-finder.png";
import ghlPipelineBoard from "@/assets/portfolio/ghl-pipeline-board.png";
import ghlOpportunityDetails from "@/assets/portfolio/ghl-opportunity-details.png";
import ghlContactsList from "@/assets/portfolio/ghl-contacts-list.png";
import ghlPermissionsSettings from "@/assets/portfolio/ghl-permissions-settings.png";
import ghlAgentRestrictedView from "@/assets/portfolio/ghl-agent-restricted-view.png";
import ghlFormPreview from "@/assets/portfolio/ghl-form-preview.png";
import ghlWorkflowAutomation from "@/assets/portfolio/ghl-workflow-automation.png";
import ghlContactCreated from "@/assets/portfolio/ghl-contact-created.png";
import ghlOpportunityCreated from "@/assets/portfolio/ghl-opportunity-created.png";

/**
 * Every project on the site, written for clients.
 *
 * Accuracy rules (checked by src/test/projects-data.test.ts):
 * - `built` lists only features that are implemented and working. Add an item
 *   only after it has been tested.
 * - `verification` says, in plain professional language, how and where it was
 *   tested. It is shown inside the case study, not as a label on the homepage.
 * - No client results, metrics, testimonials or production claims.
 * - `outcome` and `outcomes` use only numbers Jonathan measured in his own tests
 *   (or counts visible in the screenshots), and say so where it matters.
 */
export type WorkItem = {
  slug: string;
  title: string;
  /** Short category line, e.g. "Voice AI · Appointment booking". */
  category: string;
  /** One sentence on what the system does for the business. */
  summary: string;
  /** One line on the result, shown on the homepage card. Measured in testing only. */
  outcome?: string;
  /** Result bullets shown at the top of the case study. Measured in testing only. */
  outcomes?: string[];
  /** The business problem it solves. */
  problem: string;
  /** Implemented features only. */
  built: string[];
  /** How it works, step by step. */
  flow: string[];
  /** How it was tested and where it runs. Accurate, shown in the case study. */
  verification: string;
  /** Optional: how real estate sales experience shaped the design. */
  design?: string;
  /** Where this kind of system fits. */
  applications?: string[];
  tools: string[];
  /** Real screenshots only. The first one is the main image. */
  images: string[];
  /** Optional caption for each screenshot, in the same order as `images`.
   *  When present, the case study shows the screenshots as numbered steps. */
  imageCaptions?: string[];
  /** Optional homepage card thumbnail. Defaults to the first image. */
  cover?: string;
  /** Optional screen recordings of real test runs, shown in the case study. */
  videos?: { title: string; desc: string; src: string; poster: string }[];
  /** Privacy or context note shown under the videos. */
  videoNote?: string;
  /** Extra workflows shown inside one case study (used for the Zapier & Make builds). */
  builds?: { title: string; desc: string; tools: string[]; images: string[] }[];
};

export const work: WorkItem[] = [
  {
    slug: "ai-voice-appointment-setter",
    title: "AI Voice Appointment Setter",
    category: "Voice AI · Appointment booking",
    summary:
      "A voice assistant that checks live calendar availability and books, reschedules or cancels appointments during the conversation.",
    outcome:
      "Callers book, reschedule or cancel in one call. The calendar updates within 3–5 seconds of their confirmation, with no staff involved.",
    outcomes: [
      "Google Calendar updates within 3–5 seconds of the caller's confirmation",
      "Replaces 5 manual front-desk steps: checking the calendar, offering times, creating the event, logging it and confirming with the caller",
      "Every call logged to Airtable automatically, with zero manual data entry",
      "Rebuilt from scratch on a fresh n8n and Vapi setup and tested across about 10 calls; the final build handles booking, rescheduling and cancellation",
    ],
    problem:
      "Phone-based scheduling ties up staff time, and callers are lost to hold times, voicemail and missed calls, especially outside business hours.",
    built: [
      "Vapi voice assistant that works out whether the caller wants to book, reschedule or cancel",
      "Four function tools (Getslots, Bookslots, Updateslots, Cancelslots) called mid-conversation",
      "n8n workflows that check Google Calendar availability and create, update and delete events",
      "Every booking logged to Airtable with caller name, email, booking status and call ID",
    ],
    flow: [
      "The caller tells the assistant what they need",
      "The assistant calls the matching tool: Getslots, Bookslots, Updateslots or Cancelslots",
      "An n8n workflow checks or changes the event in Google Calendar",
      "The result is logged in Airtable and returned to the assistant",
      "The assistant confirms the outcome to the caller",
    ],
    verification:
      "Built and tested with Vapi web test calls in a demo setup (the clinic name is fictional). A booking call created the calendar event and an Airtable record marked confirmed, a rescheduling call moved the event to the requested day, and the cancellation workflow deleted the event and marked the record Canceled.",
    design:
      "Built the way a real front desk works: the assistant doesn't just talk, it acts on a live calendar. Each workflow also has an error branch that sends the assistant a clear message when details are missing, instead of failing silently.",
    applications: [
      "Real estate teams booking property viewings",
      "Clinics, salons and home-service businesses that take bookings by phone",
    ],
    tools: ["Vapi", "n8n", "Google Calendar", "Airtable", "Webhooks", "JavaScript"],
    images: [
      voiceVapiTools,
      voiceN8nGetBook,
      voiceRescheduleTranscript,
      voiceAirtableLog,
      voiceN8nUpdateCancel,
    ],
    imageCaptions: [
      "The Vapi assistant and its four calendar tools",
      "n8n: Getslots checks availability, Bookslots creates the event",
      "Live test call: the assistant reschedules an appointment through conversation",
      "Airtable log: caller, booking status and call ID",
      "n8n: Updateslots and Cancelslots, each with an error branch",
    ],
    videos: [
      {
        title: "1. Booking a new appointment",
        desc: "Getslots checks the calendar, then Bookslots creates the event. 2:50",
        src: voiceBookVideo,
        poster: voiceBookPoster,
      },
      {
        title: "2. Rescheduling an appointment",
        desc: "The assistant confirms the change and calls Updateslots. 3:16",
        src: voiceUpdateVideo,
        poster: voiceUpdatePoster,
      },
      {
        title: "3. Canceling an appointment",
        desc: "The assistant confirms the details and calls Cancelslots. 2:03",
        src: voiceCancelVideo,
        poster: voiceCancelPoster,
      },
    ],
    videoNote:
      "Recorded test calls in a demo setup with a fictional clinic. The caller's phone number and date of birth are blurred and muted for privacy.",
  },
  {
    slug: "messenger-ai-lead-agent",
    title: "Messenger AI Lead Agent → GoHighLevel",
    category: "AI agent · Lead capture · CRM",
    summary:
      "A Messenger AI agent that answers property questions, collects a buyer's details, confirms them, and saves the lead to GoHighLevel with a note and a follow-up task.",
    outcome:
      "One Messenger conversation becomes a confirmed CRM lead: contact, pipeline deal, note and follow-up task, with no manual data entry.",
    outcomes: [
      "Collects 8 lead details in a single conversation: name, contact, unit type, budget, timeline, and the preferred presentation date, time and number of guests",
      "Nothing is saved until the customer confirms the summary, so the CRM only gets checked details",
      "Creates or updates the contact, the pipeline opportunity and a lead note automatically, and adds a follow-up task for every new lead",
      "Tested end to end on a demo Facebook Page; the test leads appear in the GoHighLevel pipeline",
    ],
    problem:
      "Property inquiries on Messenger arrive at all hours. Agents reply late, details get lost in chat threads, and leads never make it into the CRM.",
    built: [
      "Messenger webhook in n8n, with Meta's verification handshake",
      "AI agent (Google Gemini) that answers from the project's information in Google Docs, with conversation memory",
      "Lead capture tool the agent calls only after the customer confirms their details",
      "Sub-workflow that validates the lead, then upserts the contact, creates or updates the opportunity and adds a note through the GoHighLevel API",
      "Follow-up task created automatically for new leads",
      "Clear success, not-confirmed and error responses back to the agent",
    ],
    flow: [
      "A buyer messages the Facebook Page",
      "n8n receives the message, reads the project information and passes it to the AI agent",
      "The agent answers questions, then collects the buyer's details and reads them back for confirmation",
      "After a yes, the Save Lead tool sends the details to the GoHighLevel sub-workflow",
      "GoHighLevel gets the contact, the opportunity, a note with the request and a follow-up task, and the agent confirms to the buyer",
    ],
    verification:
      "Built and tested end to end on a demo Facebook Page that is labelled as an unofficial demo for portfolio and testing. In the recorded test, the conversation produced a contact, an opportunity and a detailed note in GoHighLevel. The test phone number and email are blurred in the recording.",
    design:
      "Designed from the sales side: the agent never promises a schedule it can't confirm. Presentation requests are saved as pending, so a human agent confirms the time, and every note says the details were collected by AI.",
    applications: [
      "Real estate developers and brokers taking inquiries on Facebook",
      "Any business that sells through Messenger and tracks leads in a CRM",
    ],
    tools: ["n8n", "Google Gemini", "Google Docs", "Meta Graph API", "GoHighLevel API", "Webhooks"],
    images: [leadAgentWorkflow, leadAgentSaveToGhl, leadAgentGhlPipeline],
    imageCaptions: [
      "Main workflow: Messenger webhook, AI agent with memory and a Save Lead tool",
      "Save Lead sub-workflow: confirm, validate, then contact, opportunity, note and follow-up task in GoHighLevel",
      "The leads in the GoHighLevel pipeline, from New Inquiry to Presentation Requested",
    ],
    cover: leadAgentWorkflow,
    videos: [
      {
        title: "1. Live test: Messenger to GoHighLevel",
        desc: "A full conversation, the confirmation, and the new lead in GoHighLevel. 6:24",
        src: leadAgentDemoVideo,
        poster: leadAgentDemoPoster,
      },
      {
        title: "2. Workflow walkthrough",
        desc: "How the AI agent and the GoHighLevel sub-workflow fit together. 4:07",
        src: leadAgentWalkthroughVideo,
        poster: leadAgentWalkthroughPoster,
      },
    ],
    videoNote:
      "Recorded on a demo Facebook Page labelled as an unofficial demo. The test phone number and email are blurred.",
  },
  {
    slug: "ghl-pipeline-management",
    title: "GoHighLevel CRM Pipeline Management",
    category: "GoHighLevel CRM · Real estate sales",
    summary:
      "A real estate sales pipeline where every deal has an owner, and each agent sees only their own leads.",
    outcome:
      "Every deal has one owner and a clear stage across a 6-stage pipeline, and each agent sees only their own leads (2 of 6 in testing).",
    outcomes: [
      "6-stage pipeline from New Lead to Site Viewing, so no lead sits without a next step",
      "One owner per deal, so the team lead knows who is responsible for each lead",
      "A restricted agent saw only 2 of 6 contacts, so each agent's clients stay protected",
      "Built three times until the setup was repeatable from scratch",
    ],
    problem:
      "Real estate teams lose track of leads when contacts, deals and agent responsibilities live in different places, and agents can see each other's clients.",
    built: [
      "Real estate sales pipeline, from New Lead to Site Viewing",
      "Restricted data visibility: agents see only their assigned contacts and deals",
      "An owner on every deal",
      "Deal value and stage tracking for every opportunity",
      "Role-based user permissions (admin and restricted agent)",
      "Organized contacts with tags",
    ],
    flow: [
      "A new lead is saved as a contact",
      "An opportunity is added to the pipeline with its deal value",
      "The deal is given an owner from the sales team",
      "The deal moves stage by stage, from New Lead toward Site Viewing",
      "Each agent sees only the contacts and deals assigned to them",
    ],
    verification:
      "Built and tested in a GoHighLevel demo environment. Logged in as a restricted agent, the account showed only that agent's assigned contacts (2 of 6), not the full team's data.",
    design:
      "Shaped by six years in real estate sales: one owner per deal, stages that match how property deals actually progress, and access rules that protect each agent's clients.",
    applications: [
      "Brokerages distributing leads across agents",
      "Team leads who need one view of every deal in progress",
    ],
    tools: ["GoHighLevel"],
    images: [
      ghlPipelineBoard,
      ghlOpportunityDetails,
      ghlContactsList,
      ghlPermissionsSettings,
      ghlAgentRestrictedView,
    ],
    imageCaptions: [
      "The pipeline board: every deal moves stage by stage, with its value",
      "One deal opened: stage, status, value and owner",
      "Contacts organized with tags",
      "Agent permissions: data restricted to assigned records",
      "Logged in as a restricted agent: only assigned contacts are visible",
    ],
  },
  {
    slug: "ghl-lead-automation",
    title: "GoHighLevel CRM Lead Automation",
    category: "GoHighLevel CRM · Lead automation",
    summary:
      "Property inquiries from a GoHighLevel form become contacts and pipeline opportunities automatically, with no manual data entry.",
    outcome:
      "A new inquiry becomes a CRM contact and a pipeline deal within 3–5 seconds, with no manual data entry.",
    outcomes: [
      "Contact and opportunity created within 3–5 seconds of the form submission",
      "Zero manual data entry: name, details and lead source are recorded automatically",
      "Every inquiry lands in New Lead, ready for follow-up",
    ],
    problem:
      "Inquiries from ads and landing pages wait in inboxes and spreadsheets, and slow follow-up loses the lead.",
    built: [
      "Property inquiry form with a required property type field",
      "Contact created automatically from each submission",
      "Workflow that creates a sales opportunity in the pipeline",
      "Lead source recorded on the opportunity",
      "New leads land in the New Lead stage, ready for follow-up",
    ],
    flow: [
      "A lead submits the property inquiry form",
      "GoHighLevel creates the contact from the form data",
      "The Form Submitted trigger starts the Lead Automation workflow",
      "The workflow creates an opportunity in the New Lead stage",
    ],
    verification:
      "Built and tested in a GoHighLevel demo environment: a live test submission created both the contact and the opportunity, with the inquiry form recorded as the lead source.",
    design:
      "Built around the moment that matters most in real estate sales: the first minutes after an inquiry arrives, before the lead cools off.",
    applications: [
      "Property inquiries from Facebook ads and landing pages",
      "Open-house and event sign-up forms",
    ],
    tools: ["GoHighLevel"],
    images: [ghlFormPreview, ghlWorkflowAutomation, ghlContactCreated, ghlOpportunityCreated],
    imageCaptions: [
      "A lead fills in the property inquiry form",
      "The workflow: Form Submitted trigger, then Create opportunity",
      "The contact is created from the form submission",
      "The opportunity appears in the New Lead stage, with the form as its source",
    ],
    cover: ghlOpportunityCreated,
  },
  {
    slug: "rag-knowledge-assistant",
    title: "RAG Knowledge Assistant",
    category: "AI agent · Knowledge base",
    summary:
      "A chat assistant that answers from a team's own documents and stays in sync with Google Drive.",
    outcome:
      "Answers questions from the team's own documents in about 3 seconds, and stays current as files change in Google Drive.",
    outcomes: [
      "Answers in about 3 seconds in testing, grounded in the team's own documents",
      "New, edited and deleted files in Google Drive are picked up automatically on the next sync, with no manual re-upload",
      "Answers come from retrieved passages, not general AI guesses",
    ],
    problem:
      "Answers get buried in shared folders, and a general AI chatbot without access to those documents will guess.",
    built: [
      "Document ingestion from Google Drive",
      "Vector storage in Supabase",
      "AI-powered knowledge retrieval",
      "Automatic handling of updated documents",
      "Automatic handling of removed documents",
    ],
    flow: [
      "A Google Drive trigger detects new, updated or deleted files",
      "n8n turns each document into embeddings",
      "Embeddings are stored in a Supabase vector store",
      "The AI agent answers from the retrieved passages",
    ],
    verification: "Tested end to end across document ingestion, retrieval, updates and removal.",
    applications: [
      "An internal knowledge base for a sales or real estate team",
      "A support assistant grounded in company policies and FAQs",
    ],
    tools: ["n8n", "Google Drive", "Supabase", "Embeddings", "AI Agent"],
    images: [ragAssistantShot, ragAssistantTriggers],
  },
  {
    slug: "messenger-ai-chatbot",
    title: "Facebook Messenger AI Chatbot",
    category: "AI chatbot · Customer inquiries",
    summary:
      "A Messenger assistant that answers customer questions from the business's own information.",
    outcome:
      "Replies to customer messages in 1–2 seconds, compared with up to 10 minutes when we replied by hand on busy days.",
    outcomes: [
      "Replies in 1–2 seconds in end-to-end testing",
      "Removes the up to 10-minute wait customers faced on busy days, at any hour",
      "Answers come from the business's own information in Google Docs, so editing the doc updates the answers without touching the workflow",
      "Tested with test conversations before launch; currently paused",
    ],
    problem:
      "Small businesses miss sales when customer messages wait hours for a reply.",
    built: [
      "Messenger webhook connected to n8n",
      "Business information pulled from Google Docs",
      "AI agent with conversation memory (Google Gemini)",
      "Automatic replies through the Meta Graph API",
    ],
    flow: [
      "A customer sends a Messenger message",
      "n8n receives it through a webhook",
      "The AI agent reads the business information in Google Docs",
      "The reply is sent back through Messenger",
    ],
    verification:
      "Built and tested end to end for Mildred's Desserts & Treats, a food business I co-own. Currently paused.",
    tools: ["n8n", "Google Gemini", "Google Docs", "Meta Graph API", "Webhooks", "JavaScript"],
    images: [messengerChatbotShot],
  },
  {
    slug: "hr-evaluation-assistant",
    title: "HR Job Posting & Evaluation Assistant",
    category: "AI recruitment workflow",
    summary:
      "A hiring workflow that takes in applications, evaluates CVs with AI and schedules interviews.",
    outcome:
      "Evaluates each CV against the job requirements in about 3 seconds and routes the candidate automatically.",
    outcomes: [
      "About 3 seconds per CV evaluation, tested with 5 applicants",
      "Every applicant scored against the same job requirements, so screening stays consistent",
      "Qualified candidates move to questionnaires and interview scheduling without manual sorting",
    ],
    problem:
      "Screening applicants by hand is slow and inconsistent, and good candidates wait days for a reply.",
    built: [
      "Application and CV intake through an n8n form",
      "AI evaluation of each CV against the job requirements",
      "Conditional candidate routing",
      "AI-generated questionnaires and personalized emails",
      "Interview scheduling through Google Calendar",
    ],
    flow: [
      "An applicant submits the form with a CV",
      "The CV is stored in Google Drive and the applicant in Airtable",
      "An AI agent evaluates the CV against the requirements",
      "Qualified applicants get a questionnaire, an email and an interview slot",
    ],
    verification: "Built and tested end to end as part of structured n8n training.",
    applications: [
      "First-pass screening for a recruitment agency",
      "Hiring sales agents for a real estate brokerage",
    ],
    tools: ["n8n Forms", "OpenAI", "Airtable", "Google Drive", "Gmail", "Google Calendar"],
    images: [hrAssistantShot, hrAssistantDetailShot],
  },
  {
    slug: "automated-video-creator",
    title: "Automated Video Creator",
    category: "Content automation",
    summary:
      "A scheduled pipeline that turns an AI-generated prompt into a short video ready for YouTube and Facebook.",
    problem: "Producing short-form video every day takes hours of manual work.",
    built: [
      "Scheduled n8n pipeline",
      "Prompt generation with Gemini",
      "Video generation request to Google Cloud Vertex AI",
      "Job status polling and file preparation",
      "Publishing steps for YouTube and Facebook",
    ],
    flow: [
      "A schedule starts the pipeline",
      "Gemini writes the video prompt",
      "Vertex AI generates the video",
      "The file is prepared for YouTube and Facebook",
    ],
    verification:
      "Pipeline designed and built in n8n. A full end-to-end run is pending video-generation API access.",
    tools: ["n8n", "Gemini", "Vertex AI", "YouTube Data API", "Meta Graph API", "JavaScript"],
    images: [videoCreatorShot],
  },
  {
    slug: "automated-job-finder",
    title: "Automated Job Finder",
    category: "Personal productivity automation",
    summary: "An n8n job-search automation that replaces repetitive manual searching.",
    problem: "Searching job boards by hand every day is slow and repetitive.",
    built: ["Automated n8n job-search workflow", "AI processing with Gemini and OpenAI"],
    flow: [],
    verification: "Built and tested.",
    tools: ["n8n", "Slack", "Google Gemini", "OpenAI", "Google Docs", "Google Drive", "Gmail"],
    images: [jobFinderShot],
  },
  {
    slug: "zapier-make-automations",
    title: "Zapier & Make.com Automations",
    category: "No-code business automations",
    summary:
      "Five business automations covering lead engagement, lead enrichment, content, accounting sync and document handling.",
    outcome:
      "Five workflows that each take a recurring manual task off a team's plate, from lead follow-up to accounting sync.",
    outcomes: [
      "5 working automations across Zapier (3) and Make.com (2)",
      "Each replaces a recurring manual task: routing lead follow-ups, enriching leads, repurposing content, syncing Asana with Xero and filing email attachments",
    ],
    problem: "Many teams already run on Zapier or Make and need automations built on those platforms.",
    built: [
      "3 Zapier automations",
      "2 Make.com scenarios",
    ],
    flow: [],
    verification: "Built as part of a structured automation program.",
    tools: ["Zapier", "Make.com"],
    images: [],
    builds: [
      {
        title: "AI Content Repurposing",
        desc: "Watches a Drive folder for new files, transcribes them with AI, generates blog posts, and publishes across Facebook Pages and LinkedIn through conditional paths.",
        tools: ["Zapier", "Google Drive", "AI by Zapier", "Facebook Pages", "LinkedIn"],
        images: [zapierContentRepurposing],
      },
      {
        title: "Asana CRM Lead Engagement",
        desc: "Routes each lead by status (ready to start, no response, quoted, approved or paid) and sends the matching follow-up emails, welcome messages and documents.",
        tools: ["Zapier", "Asana", "Gmail", "Google Drive"],
        images: [zapierAsanaCrm],
      },
      {
        title: "Automated Lead Enrichment",
        desc: "Captures incoming leads, enriches them with Apollo data, splits them by priority, and notifies the sales team while AI drafts a personalized email.",
        tools: ["Zapier", "Apollo", "Google Sheets", "Slack", "Gmail"],
        images: [zapierLeadEnrichment1, zapierLeadEnrichment2],
      },
      {
        title: "Asana–Xero Integration",
        desc: "Watches completed Asana tasks, pulls the matching Xero transactions, and exports them to Google Sheets with attachments uploaded back to Asana.",
        tools: ["Make.com", "Asana", "Xero", "Google Sheets"],
        images: [makeAsanaXero],
      },
      {
        title: "Gmail Attachment Automation",
        desc: "Monitors incoming emails, saves attachments to Google Drive with AI-generated file names, logs every file in Sheets, and sends a confirmation email.",
        tools: ["Make.com", "Gmail", "Google Drive", "Google Sheets"],
        images: [makeGmailAttachment],
      },
    ],
  },
];

/** Shown on the homepage, in this order. The first is the featured project. */
export const selectedWorkSlugs = [
  "ai-voice-appointment-setter",
  "messenger-ai-lead-agent",
  "ghl-pipeline-management",
  "ghl-lead-automation",
] as const;

export function findWork(slug: string) {
  return work.find((item) => item.slug === slug);
}

/**
 * Kept in this file but not shown on the site: the Video Creator has not run end to end yet,
 * and the Job Finder is a personal tool rather than a client use case. Remove a slug to show it again.
 */
export const hiddenWorkSlugs = ["automated-video-creator", "automated-job-finder"] as const;

export const selectedWork = selectedWorkSlugs.map((slug) => findWork(slug)!);
export const moreWork = work.filter(
  (item) =>
    !(selectedWorkSlugs as readonly string[]).includes(item.slug) &&
    !(hiddenWorkSlugs as readonly string[]).includes(item.slug),
);
