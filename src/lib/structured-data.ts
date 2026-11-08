import { faqs } from "@/lib/faq";
import { site } from "@/lib/site";

/**
 * Schema.org JSON-LD for the home page. It describes who Jonathan is and what
 * he does in a format search engines and AI assistants can read directly.
 * Only facts that are also visible on the page belong here.
 */
export function homeStructuredData() {
  const personId = `${site.url}#person`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: site.name,
        alternateName: site.brand,
        jobTitle: "AI Automation Specialist",
        description:
          "AI Automation Specialist building AI agents, RAG chatbots, CRM integrations and n8n workflow automations that reduce repetitive work.",
        url: site.url,
        email: `mailto:${site.email}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Parañaque City",
          addressCountry: "PH",
        },
        sameAs: [site.linkedin, site.github],
        knowsAbout: [
          "Workflow automation",
          "n8n",
          "GoHighLevel",
          "AI agents",
          "Voice AI",
          "Vapi",
          "RAG chatbots",
          "CRM automation",
          "Lead management",
          "Appointment scheduling automation",
          "Zapier",
          "Make.com",
          "API integrations",
          "Webhooks",
        ],
      },
      {
        "@type": "ProfessionalService",
        "@id": `${site.url}#service`,
        name: `${site.brand} — AI Automation`,
        url: site.url,
        email: site.email,
        founder: { "@id": personId },
        areaServed: "Worldwide",
        serviceType: [
          "AI voice agents and appointment booking",
          "GoHighLevel CRM and lead automation",
          "n8n automation and AI agents",
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${site.url}#faq`,
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}
