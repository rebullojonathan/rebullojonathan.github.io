import { site } from "@/lib/site";

const facts = [
  { value: "6 years", label: "Sales operations experience, 2020–2026" },
  { value: "n8n · APIs · Webhooks", label: "Trigger-based workflows that connect business apps" },
  { value: "AI Agents · RAG", label: "Voice agents, chatbots and knowledge assistants" },
];

/** Compact professional introduction, shown right after the hero. */
export function AboutSection() {
  return (
    <section id="about" className="lw-section lw-about-intro" aria-labelledby="about-title">
      <div className="lw-container lw-about-intro-grid">
        <figure className="lw-about-photo" data-reveal>
          <img
            src={site.photoUrl}
            alt={`${site.name}, ${site.title}`}
            width="800"
            height="800"
            decoding="async"
          />
        </figure>

        <div className="lw-about-intro-copy">
          <p className="lw-eyebrow" data-reveal>
            <span className="lw-mono-index">01</span> About
          </p>
          <h2 id="about-title" className="lw-h2 lw-about-name" data-reveal>
            {site.name}
          </h2>
          <p className="lw-lead" data-reveal>
            Six years in sales gave me a front-row view of how businesses actually run: where
            handoffs fail, where leads stall, and where hours disappear into repetitive tasks.
          </p>
          <p className="lw-lead lw-lead-tight" data-reveal>
            Today, I&rsquo;m an AI Automation Specialist. I design and build systems that replace
            manual steps with automated workflows.
          </p>
          <p className="lw-lead lw-lead-tight" data-reveal>
            I build AI agents, RAG chatbots, CRM integrations and multi-step automations using n8n,
            GoHighLevel, LLMs, APIs and webhooks, connecting the tools a business already uses so
            information moves on its own.
          </p>
          <p className="lw-lead lw-lead-tight" data-reveal>
            My approach: understand the problem, map the process, build the solution, test it, and
            document how it works.
          </p>
          <p className="lw-lead lw-lead-tight lw-about-goal" data-reveal>
            <strong>
              My goal is simple: automate repetitive work so people can focus on what matters most.
            </strong>
          </p>

          <dl className="lw-about-facts" data-reveal>
            {facts.map((fact) => (
              <div key={fact.value}>
                <dt>{fact.value}</dt>
                <dd>{fact.label}</dd>
              </div>
            ))}
          </dl>

          <div className="lw-about-links" data-reveal>
            <a href={site.resumeUrl} download="Jonathan-Rebullo-Resume.pdf" className="lw-btn lw-btn-ghost lw-btn-sm">
              Download Résumé
            </a>
            <a href={site.linkedin} target="_blank" rel="noreferrer" className="lw-btn lw-btn-ghost lw-btn-sm">
              LinkedIn
              <span className="sr-only"> (opens in new tab)</span>
            </a>
            <span className="lw-about-location">
              <span className="lw-live-dot" aria-hidden="true" /> {site.location} · {site.timezone}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
