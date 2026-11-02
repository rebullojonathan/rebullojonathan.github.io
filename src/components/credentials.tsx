import { ProjectScreenshot } from "@/components/project-screenshot";
import { certificates } from "@/lib/certificates";
import { techTools } from "@/lib/tech-stack";

/** Tools clients recognize, in the order they matter for this specialization. */
const toolNames = [
  "n8n",
  "GoHighLevel (GHL)",
  "Vapi",
  "OpenAI / ChatGPT",
  "Anthropic Claude",
  "Google Gemini",
  "Supabase",
  "Airtable",
  "Google Calendar",
  "Make",
  "Zapier",
];
const tools = toolNames
  .map((name) => techTools.find((tool) => tool.name === name))
  .filter((tool): tool is (typeof techTools)[number] => Boolean(tool));

export function Credentials() {
  return (
    <section id="credentials" className="lw-section lw-section-tight" aria-labelledby="credentials-title">
      <div className="lw-container">
        <p className="lw-eyebrow" data-reveal>
          <span className="lw-mono-index">05</span> Credentials
        </p>
        <h2 id="credentials-title" className="lw-h2" data-reveal>
          Certificates & tools
        </h2>

        <ul className="lw-cred-grid">
          {certificates.map((cert) => (
            <li key={cert.platform} className="lw-cred" data-reveal>
              <div className="lw-cred-thumb">
                <ProjectScreenshot
                  title={`${cert.title}: Certificate of Completion`}
                  images={[cert.img]}
                  technologies={[cert.issuer, cert.date]}
                  natural
                />
              </div>
              <div className="lw-cred-body">
                <h3 className="lw-h4">{cert.title}</h3>
                <p>
                  Certificate of Completion · {cert.issuer}
                  <br />
                  {cert.date}
                </p>
                <a href={cert.file} target="_blank" rel="noreferrer">
                  View certificate ↗<span className="sr-only"> ({cert.platform}, opens in new tab)</span>
                </a>
              </div>
            </li>
          ))}
        </ul>

        <p className="lw-label lw-tools-label">Tools I work with</p>
        <ul className="lw-tools-row" aria-label="Tools I work with">
          {tools.map((tool) => (
            <li key={tool.name}>
              <img src={tool.logo} alt="" width="22" height="22" loading="lazy" />
              {tool.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
