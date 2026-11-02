import { site } from "@/lib/site";

const facts = [
  { value: "6 years", label: "Accredited Sales Manager, SMDC Services Corporation (2020–2026)" },
  { value: "GoHighLevel", label: "CRM pipelines, permissions and lead automation" },
  { value: "n8n · Voice AI", label: "AI agents, integrations and appointment booking" },
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
            I spent six years in real estate sales as an accredited Sales Manager with SMDC Services
            Corporation, from 2020 to 2026. I know what happens to a lead between the first inquiry
            and the signed reservation, because that was my job.
          </p>
          <p className="lw-lead lw-lead-tight" data-reveal>
            Now I build the systems that handle that journey: AI voice agents that book
            appointments, GoHighLevel pipelines that give every lead an owner, and n8n automations
            that keep follow-up moving.
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
