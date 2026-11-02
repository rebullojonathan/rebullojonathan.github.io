import type { CSSProperties } from "react";

/** Three services, led by the outcome a client is buying. */
const services = [
  {
    outcome: "Never miss a booking call",
    title: "AI voice agents & appointment booking",
    desc: "A voice agent answers, checks your calendar and books the appointment while your team works.",
    items: ["Voice agent setup with Vapi", "Live calendar availability and booking", "n8n logic behind every step"],
    related: { label: "AI Voice Appointment Setter", href: "#ai-voice-appointment-setter" },
  },
  {
    outcome: "Every lead in the pipeline, with an owner",
    title: "GoHighLevel CRM & lead automation",
    desc: "Pipelines, forms and permissions set up the way real estate and sales teams actually work.",
    items: ["Pipeline and stage design", "Form-to-CRM lead capture", "User roles and agent assignment"],
    related: { label: "GoHighLevel CRM projects", href: "#ghl-pipeline-management" },
  },
  {
    outcome: "Your tools, working together",
    title: "n8n automation & AI agents",
    desc: "Workflows and AI assistants that connect your apps and take repetitive work off your team.",
    items: ["n8n workflows and API integrations", "AI agents that answer from your documents", "Documentation and handover"],
    related: { label: "RAG Knowledge Assistant", href: "#rag-knowledge-assistant" },
  },
];

export function Services() {
  return (
    <section id="services" className="lw-section" aria-labelledby="services-title">
      <div className="lw-container">
        <p className="lw-eyebrow" data-reveal>
          <span className="lw-mono-index">03</span> Services
        </p>
        <h2 id="services-title" className="lw-h2" data-reveal>
          What I build for your business
        </h2>
        <div className="lw-services3">
          {services.map((service, index) => (
            <article
              key={service.title}
              className="lw-service"
              data-reveal
              style={{ "--i": index } as CSSProperties}
            >
              <h3 className="lw-h3">{service.outcome}</h3>
              <p className="lw-service-name">{service.title}</p>
              <p>{service.desc}</p>
              <ul className="lw-bullets">
                {service.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a href={service.related.href} className="lw-related">
                See related work: {service.related.label} →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
