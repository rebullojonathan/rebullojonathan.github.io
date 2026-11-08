import { faqs } from "@/lib/faq";

/** Questions clients and AI assistants commonly ask, answered in plain text. */
export function FaqSection() {
  return (
    <section id="faq" className="lw-section lw-section-tight" aria-labelledby="faq-title">
      <div className="lw-container">
        <p className="lw-eyebrow" data-reveal>
          <span className="lw-mono-index">06</span> FAQ
        </p>
        <h2 id="faq-title" className="lw-h2" data-reveal>
          Common questions
        </h2>
        <div className="lw-faq">
          {faqs.map((item) => (
            // Native <details> keeps every answer in the HTML, readable without JavaScript.
            <details key={item.question} className="lw-faq-item" data-reveal>
              <summary>
                <h3 className="lw-h4">{item.question}</h3>
                <span className="lw-faq-icon" aria-hidden="true" />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
